import { Card } from '../components/Card'
import './HowItWorksPage.css'

const steps = [
  ['Input text', 'The user submits English prose through the analyzer workspace.'],
  ['Preprocessing', 'URLs, mentions, hashtags, punctuation, and non-letter characters are normalized.'],
  ['Tokenization', 'NLTK splits text into tokens for downstream feature handling.'],
  ['Feature extraction', 'The TF-IDF vectorizer turns cleaned text into numeric features.'],
  ['Logistic Regression prediction', 'The classifier estimates AI-like and human-like probabilities.'],
  ['Keyword weighting', 'Feature coefficients are shown as keyword-level pattern indicators.'],
  ['WordNet synonym suggestion', 'Some AI-like terms may receive shorter synonym candidates.'],
]

export function HowItWorksPage() {
  return (
    <div className="page-stack">
      <Card>
        <h2>Model pipeline</h2>
        <p className="muted">
          SentenSafe uses an interpretable NLP pipeline. The output is a probability-based
          prediction, not a definitive authorship decision.
        </p>
      </Card>
      <div className="pipeline">
        {steps.map(([title, text], index) => (
          <Card className="pipeline-step" key={title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
