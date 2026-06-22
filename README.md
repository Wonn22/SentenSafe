# SentenSafe

  SentenSafe is a full-stack AI writing pattern analysis app. It uses an NLP pipeline with TF-IDF feature extraction and
  a Logistic Regression classifier to estimate whether English text looks more AI-written or human-written. The app
  presents results as probabilities, keyword-level evidence, sentence-level signals, and optional WordNet-based rewrite
  suggestions.

  ## Features

  - Analyze pasted English text for AI-like or human-like writing patterns
  - Display AI and human probability scores
  - Highlight keywords based on model coefficient weights
  - Show sentence-level AI-like, human-like, or neutral indicators
  - Provide text statistics such as word count, sentence count, reading time, average sentence length, and vocabulary
  diversity
  - Save up to 20 previous analyses in browser local storage
  - Compare original and rewritten text to see AI-probability changes
  - Explain the model pipeline and its limitations inside the UI

  ## Tech Stack

  ### Backend

  - Python
  - FastAPI
  - scikit-learn
  - NLTK
  - NumPy
  - joblib

  ### Frontend

  - React
  - Vite
  - React Router
  - CSS modules/stylesheets

  ## Project Structure

  ```text
  AOLNLP/
  ├── ai_brain.py                  # NLP preprocessing, model loading, prediction logic
  ├── ai_detector_model.pkl        # Saved Logistic Regression model
  ├── tfidf_vectorizer.pkl         # Saved TF-IDF vectorizer
  ├── requirements.txt             # Python dependencies
  ├── backend/
  │   └── main.py                  # FastAPI backend and API routes
  └── frontend/
      ├── package.json             # Frontend dependencies and scripts
      ├── vite.config.js           # Vite configuration
      ├── index.html
      └── src/
          ├── App.jsx              # Main routing and app state
          ├── services/            # API and history helpers
          ├── utils/               # Analysis formatting and statistics helpers
          ├── pages/               # Main app pages
          ├── components/          # Reusable UI components
          ├── layout/              # Sidebar/navbar layout
          ├── data/                # Sample text
          └── assets/              # Logo and images

  ## Backend API

  The FastAPI backend exposes:

  - GET / - basic backend information
  - GET /health - health check
  - POST /analyze - analyze text and return prediction data

  Example request:

  {
    "text": "Paste English text here..."
  }

  The response includes the predicted label, confidence score, AI/human probabilities, cleaned text, keyword weights,
  and optional rewrite suggestions.

  ## Model Pipeline

  1. The user submits English text.
  2. The backend normalizes the text by removing URLs, mentions, hashtags, punctuation, and non-letter characters.
  3. NLTK tokenizes and lemmatizes the text.
  4. The TF-IDF vectorizer converts the cleaned text into numeric features.
  5. The Logistic Regression model predicts whether the text is more AI-like or human-like.
  6. Feature weights are used to highlight AI-like, human-like, or neutral words.
  7. If AI-like writing is detected, WordNet may suggest simpler replacement words.

  ## Running the Project

  ### Backend

  pip install -r requirements.txt
  uvicorn backend.main:app --reload

  The backend runs at:

  http://localhost:8000

  ### Frontend

  cd frontend
  npm install
  npm run dev

  Create frontend/.env with:

  VITE_API_URL=http://localhost:8000

  ## Example Result

  Using the bundled sample text, the backend returned:

  - Prediction: AI (Assistant)
  - Confidence: 79.82%
  - AI probability: 79.82%
  - Human probability: 20.18%

  ## Important Limitations

  SentenSafe is a probability-based writing pattern detector, not definitive proof of authorship. Short text can produce
  unstable results, formal human writing may look AI-like, and edited AI text may avoid detection. Results should
  support human review, not replace it.

  ## Website Link
  https://sentensafe.vercel.app/

  ## Youtube Link
  https://youtu.be/cDcQW4YotEc?si=eV-W_EB9Bvp5DEzq

  ## Render Subcription Duration : 22 July 2026 (1 Month), if website cannot be run, you can see the demo by copy paste link youtube

  
