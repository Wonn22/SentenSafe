from functools import lru_cache
import re
from pathlib import Path

import joblib
import nltk
import numpy as np
from nltk.corpus import wordnet
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "ai_detector_model.pkl"
VECTORIZER_PATH = BASE_DIR / "tfidf_vectorizer.pkl"

NLTK_PACKAGES = {
    "punkt": ["tokenizers/punkt"],
    "punkt_tab": ["tokenizers/punkt_tab"],
    "stopwords": ["corpora/stopwords"],
    "wordnet": ["corpora/wordnet", "corpora/wordnet.zip"],
    "omw-1.4": ["corpora/omw-1.4", "corpora/omw-1.4.zip"],
    "averaged_perceptron_tagger_eng": ["taggers/averaged_perceptron_tagger_eng"],
}

lemmatizer = WordNetLemmatizer()


def ensure_nltk_data():
    for package, resource_paths in NLTK_PACKAGES.items():
        is_installed = False
        for resource_path in resource_paths:
            try:
                nltk.data.find(resource_path)
                is_installed = True
                break
            except LookupError:
                continue

        if not is_installed:
            nltk.download(package, quiet=True)


@lru_cache(maxsize=1)
def load_assets():
    ensure_nltk_data()
    model = joblib.load(MODEL_PATH)
    tfidf = joblib.load(VECTORIZER_PATH)
    return model, tfidf


def advanced_clean(text):
    text = str(text).lower()
    text = re.sub(r"http\S+|www\S+|https\S+|@\S+|#\S+", "", text)
    text = re.sub(r"[^a-z\s]", "", text)
    tokens = word_tokenize(text)
    cleaned = [lemmatizer.lemmatize(word) for word in tokens if len(word) > 2]
    return " ".join(cleaned)


def get_human_synonym(word):
    manual_dict = {
        "furthermore": "also",
        "moreover": "plus",
        "consequently": "so",
        "subsequently": "later",
        "additionally": "also",
    }

    if word.lower() in manual_dict:
        return manual_dict[word.lower()]

    synonyms = []
    for syn in wordnet.synsets(word):
        for lemma in syn.lemmas():
            candidate = lemma.name().replace("_", " ")
            if len(candidate) < len(word) and candidate.lower() != word.lower():
                synonyms.append(candidate)

    if synonyms:
        return min(synonyms, key=len)
    return None


def analyze_text(input_text):
    if not input_text or not input_text.strip():
        return {
            "ok": False,
            "message": "Please enter text first.",
        }

    cleaned = advanced_clean(input_text)
    if not cleaned:
        return {
            "ok": False,
            "message": "Text does not contain enough meaningful words for analysis.",
        }

    model, tfidf = load_assets()
    vectorized = tfidf.transform([cleaned])
    prediction = int(model.predict(vectorized)[0])
    probabilities = model.predict_proba(vectorized)[0]
    confidence = float(probabilities[prediction])

    label = "AI (Assistant)" if prediction == 1 else "Human (User)"
    feature_names = np.array(tfidf.get_feature_names_out())
    word_weights = {
        feature_names[index]: float(model.coef_[0][index])
        for index in vectorized.indices
    }

    highlighted_words = []
    ai_words_found = []
    for word in input_text.split():
        clean_word = advanced_clean(word)
        weight = word_weights.get(clean_word, 0.0)

        if weight > 0.3:
            kind = "ai"
            ai_words_found.append(clean_word)
        elif weight < -0.3:
            kind = "human"
        else:
            kind = "neutral"

        highlighted_words.append(
            {
                "text": word,
                "cleaned": clean_word,
                "weight": float(weight),
                "kind": kind,
            }
        )

    suggestion = None
    if prediction == 1:
        suggested_text = input_text
        replacements = []

        for word in sorted(set(ai_words_found)):
            human_alt = get_human_synonym(word)
            if not human_alt:
                continue

            pattern = re.compile(r"\b" + re.escape(word) + r"\b", re.IGNORECASE)
            if pattern.search(suggested_text):
                suggested_text = pattern.sub(human_alt, suggested_text)
                replacements.append({"from": word, "to": human_alt})

        suggestion = {
            "text": suggested_text,
            "replacements": replacements,
            "message": (
                "The following words were simplified to reduce the AI score."
                if replacements
                else "The model detected an AI pattern, but no simple synonyms were found."
            ),
        }

    return {
        "ok": True,
        "input_text": input_text,
        "cleaned_text": cleaned,
        "prediction": prediction,
        "label": label,
        "confidence": confidence,
        "confidence_percent": confidence * 100,
        "probabilities": {
            "human": float(probabilities[0]),
            "ai": float(probabilities[1]),
        },
        "keywords": highlighted_words,
        "suggestion": suggestion,
    }
