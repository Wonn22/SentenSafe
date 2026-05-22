import { Badge } from '../components/Badge'
import { Card } from '../components/Card'
import './LimitationsPage.css'

const limits = [
  'Cannot guarantee authorship.',
  'Short text reduces prediction stability.',
  'Edited AI text may evade detection.',
  'Human academic or formal writing may appear AI-like.',
  'Results should assist review, not serve as final proof.',
]

export function LimitationsPage() {
  return (
    <div className="page-stack">
      <Card className="limits-hero">
        <Badge tone="warn">Important model limitations</Badge>
        <h2>Use SentenSafe as a review aid.</h2>
        <p>
          The backend estimates writing patterns with Logistic Regression and TF-IDF
          features. It does not know who wrote the text.
        </p>
      </Card>
      <div className="limits-grid">
        {limits.map((limit) => (
          <Card className="limit-card" key={limit}>
            <h3>{limit}</h3>
            <p>
              Keep this constraint visible when interpreting a probability score or
              highlighted keyword pattern.
            </p>
          </Card>
        ))}
      </div>
    </div>
  )
}
