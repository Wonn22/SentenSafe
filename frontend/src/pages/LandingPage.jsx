import { useNavigate } from 'react-router-dom'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ProgressBar } from '../components/ProgressBar'
import { formatPercent, resultLabel, resultTone } from '../utils/analysis'
import './LandingPage.css'

const previewResult = {
  prediction: 1,
  confidence_percent: 63.8,
  probabilities: { ai: 0.638, human: 0.362 },
  keywords: [
    { text: 'comprehensive', kind: 'ai', weight: 0.54 },
    { text: 'review', kind: 'neutral', weight: 0.02 },
    { text: 'draft', kind: 'human', weight: -0.41 },
  ],
}

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="page-stack">
      <section className="hero-grid">
        <div className="hero-copy">
          <Badge tone="neutral">Probability-based prediction</Badge>
          <h2>SentenSafe</h2>
          <p>
            AI Writing Pattern Analysis using Logistic Regression and NLP-based keyword
            weighting.
          </p>
          <div className="hero-actions">
            <Button onClick={() => navigate('/analyzer')}>Analyze Text</Button>
            <Button variant="secondary" onClick={() => navigate('/how-it-works')}>
              How It Works
            </Button>
          </div>
        </div>
        <Card className="preview-card">
          <div className="preview-head">
            <span>Example analysis result</span>
            <Badge tone={resultTone(previewResult)}>{resultLabel(previewResult)}</Badge>
          </div>
          <div className="preview-score">{formatPercent(previewResult.confidence_percent)}</div>
          <ProgressBar
            value={previewResult.probabilities.ai * 100}
            tone="ai"
            label="Example AI probability"
          />
          <div className="mini-highlight">
            {previewResult.keywords.map((word, index) => (
              <span className={`highlight-token token-${word.kind}`} key={`${word.text}-${index}`}>
                {word.text}
              </span>
            ))}
          </div>
        </Card>
      </section>

      <section className="feature-grid">
        {[
          ['AI probability scoring', 'Logistic Regression returns a probability split for AI-like and human-like patterns.'],
          ['Keyword-level pattern analysis', 'Model weights are surfaced as red, green, or neutral text evidence.'],
          ['WordNet-based rewriting suggestion', 'Synonym mapping can suggest lighter wording when the backend returns replacements.'],
          ['Transparent model limitations', 'The interface keeps uncertainty visible and avoids definitive authorship claims.'],
        ].map(([title, text]) => (
          <Card className="feature-card" key={title}>
            <h3>{title}</h3>
            <p>{text}</p>
          </Card>
        ))}
      </section>
    </div>
  )
}
