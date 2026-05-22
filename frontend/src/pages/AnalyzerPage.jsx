import { useNavigate } from 'react-router-dom'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ErrorState, LoadingState } from '../components/States'
import { TextEditor } from '../components/TextEditor'
import { sampleText } from '../data/sampleText'
import { formatPercent, getTextStats, resultLabel, resultTone } from '../utils/analysis'
import './AnalyzerPage.css'

export function AnalyzerPage({ text, setText, analyze, loading, error, result }) {
  const navigate = useNavigate()
  const stats = getTextStats(text, result)

  return (
    <div className="analyzer-layout">
      <Card className="editor-card">
        <div className="section-head">
          <div>
            <h2>Analyzer workspace</h2>
            <p>Paste English text and run writing pattern analysis.</p>
          </div>
          <Badge tone="neutral">English text only</Badge>
        </div>
        <TextEditor value={text} onChange={setText} />
        <div className="stat-strip">
          <span>{stats.words} words</span>
          <span>{stats.characters} characters</span>
          <span>{stats.sentences} sentences</span>
          <span>{stats.readingTime} min read</span>
        </div>
        <div className="button-row">
          <Button variant="secondary" onClick={() => setText('')}>
            Clear text
          </Button>
          <Button variant="secondary" onClick={() => setText(sampleText)}>
            Sample text
          </Button>
          <Button onClick={analyze} disabled={loading}>
            {loading ? 'Analyzing' : 'Analyze'}
          </Button>
        </div>
        <ErrorState message={error} />
      </Card>

      <aside className="right-rail">
        <Card>
          <h3>Analysis tips</h3>
          <ul className="plain-list">
            <li>Use at least a paragraph for a more stable signal.</li>
            <li>Short text can produce noisy probability estimates.</li>
            <li>Review highlighted keywords as evidence, not a verdict.</li>
          </ul>
        </Card>
        <Card>
          <h3>Recent analysis preview</h3>
          {loading ? <LoadingState /> : null}
          {!loading && result ? (
            <div className="rail-result">
              <Badge tone={resultTone(result)}>{resultLabel(result)}</Badge>
              <strong>{formatPercent(result.confidence_percent)}</strong>
              <Button variant="secondary" onClick={() => navigate('/results')}>
                Open dashboard
              </Button>
            </div>
          ) : null}
          {!loading && !result ? (
            <p className="muted">Run an analysis to populate the result dashboard.</p>
          ) : null}
        </Card>
        <Card className="disclaimer-card">
          <h3>Accuracy disclaimer</h3>
          <p>
            SentenSafe estimates writing patterns. It cannot guarantee authorship or
            replace human review.
          </p>
        </Card>
      </aside>
    </div>
  )
}
