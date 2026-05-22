import { useNavigate } from 'react-router-dom'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { EmptyState } from '../components/States'
import { formatPercent } from '../utils/analysis'
import './HistoryPage.css'

export function HistoryPage({ history, openHistoryItem, clearHistory }) {
  const navigate = useNavigate()

  if (!history.length) {
    return (
      <EmptyState
        title="No analysis history"
        text="Completed analyses are saved locally in this browser."
        action={<Button onClick={() => navigate('/analyzer')}>Analyze text</Button>}
      />
    )
  }

  return (
    <Card>
      <div className="section-head">
        <div>
          <h2>Previous analysis</h2>
          <p>Stored locally for this frontend session.</p>
        </div>
        <Button variant="secondary" onClick={clearHistory}>
          Clear history
        </Button>
      </div>
      <div className="history-table">
        <div className="history-row table-head">
          <span>Date</span>
          <span>Text preview</span>
          <span>Prediction</span>
          <span>Confidence</span>
          <span>Words</span>
          <span></span>
        </div>
        {history.map((item) => (
          <div className="history-row" key={item.id}>
            <span>{new Date(item.date).toLocaleString()}</span>
            <span>{item.preview}</span>
            <span>
              <Badge tone={item.prediction === 1 ? 'ai' : 'human'}>{item.label}</Badge>
            </span>
            <span>{formatPercent(item.confidence)}</span>
            <span>{item.words}</span>
            <span>
              <Button variant="ghost" onClick={() => openHistoryItem(item)}>
                Detail
              </Button>
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
