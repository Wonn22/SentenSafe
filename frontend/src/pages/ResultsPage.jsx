import { useNavigate } from 'react-router-dom'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { HighlightedText } from '../components/HighlightedText'
import { ProgressBar } from '../components/ProgressBar'
import { EmptyState } from '../components/States'
import {
  formatPercent,
  getTextStats,
  readableReplacements,
  resultLabel,
  resultTone,
  riskLevel,
  sentenceAnalysis,
} from '../utils/analysis'
import './ResultsPage.css'

export function ResultsPage({ result, text }) {
  const navigate = useNavigate()

  if (!result) {
    return (
      <EmptyState
        title="No result yet"
        text="Analyze text first, then the probability dashboard will appear here."
        action={<Button onClick={() => navigate('/analyzer')}>Open analyzer</Button>}
      />
    )
  }

  const stats = getTextStats(text, result)
  const risk = riskLevel(result)
  const sentences = sentenceAnalysis(text, result.keywords)
  const replacements = readableReplacements(result.suggestion?.replacements)
  const cleanSuggestion = replacements.length ? result.suggestion.text : ''

  return (
    <div className="page-stack">
      <section className="dashboard-grid">
        <Card className="prediction-card">
          <div className="section-head">
            <div>
              <span className="eyebrow">Main prediction</span>
              <h2>{resultLabel(result)}</h2>
            </div>
            <Badge tone={risk.tone}>{risk.label}</Badge>
          </div>
          <p>
            This is a probability-based prediction from the current Logistic Regression
            model. Treat it as writing pattern analysis, not final proof.
          </p>
          <div className="big-score">{formatPercent(result.confidence_percent)}</div>
          <ProgressBar value={result.confidence_percent} tone={resultTone(result)} />
        </Card>

        <Card className="probability-card">
          <h3>Probability visualization</h3>
          <div className="radial-wrap">
            <div className="radial" style={{ '--ai-score': `${result.probabilities.ai * 100}%` }}>
              <span>{formatPercent(result.probabilities.ai * 100)}</span>
              <small>AI probability</small>
            </div>
          </div>
          <div className="probability-bars">
            <span>AI probability</span>
            <ProgressBar value={result.probabilities.ai * 100} tone="ai" />
            <span>Human probability</span>
            <ProgressBar value={result.probabilities.human * 100} tone="human" />
          </div>
        </Card>
      </section>

      <section className="metrics-grid">
        {[
          ['Word count', stats.words],
          ['Sentence count', stats.sentences],
          ['Avg sentence length', stats.averageSentenceLength.toFixed(1)],
          ['Highlighted keywords', stats.highlightedKeywords],
          ['Vocabulary diversity', `${stats.vocabularyDiversity.toFixed(1)}%`],
        ].map(([label, value]) => (
          <Card className="metric-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </Card>
        ))}
      </section>

      <Card>
        <div className="section-head">
          <div>
            <h2>Keyword analysis</h2>
            <p>Red marks AI-like indicators. Green marks human-like indicators.</p>
          </div>
          <div className="legend">
            <span><i className="legend-ai" /> AI-like</span>
            <span><i className="legend-human" /> Human-like</span>
          </div>
        </div>
        <HighlightedText keywords={result.keywords} />
      </Card>

      <Card>
        <h2>Sentence-level analysis</h2>
        <div className="sentence-list">
          {sentences.map((item, index) => (
            <div className="sentence-row" key={`${item.sentence}-${index}`}>
              <Badge tone={item.tone}>{item.label}</Badge>
              <p>{item.sentence}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="transformation-card">
        <div className="section-head">
          <div>
            <h2>Transformation suggestion</h2>
            <p>WordNet-based synonym suggestions are candidates for review, not automatic fixes.</p>
          </div>
          <Badge tone="neutral">{replacements.length} replacements</Badge>
        </div>
        {cleanSuggestion ? (
          <div className="transform-grid">
            <div>
              <h3>Original text</h3>
              <p>{text}</p>
            </div>
            <div>
              <h3>Suggested rewritten text</h3>
              <p>{cleanSuggestion}</p>
              <div className="replacement-list">
                {replacements.map((item) => (
                  <span className="replacement" key={`${item.from}-${item.to}`}>
                    {item.from} to {item.to}
                  </span>
                ))}
              </div>
              <p className="muted">Generated with WordNet synonym mapping from backend output.</p>
            </div>
          </div>
        ) : (
          <p className="muted">
            No readable synonym replacement was returned. Keep the original text and revise
            manually if needed.
          </p>
        )}
      </Card>
    </div>
  )
}
