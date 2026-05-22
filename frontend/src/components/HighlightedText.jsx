import { Tooltip } from './Tooltip'
import './HighlightedText.css'

export function HighlightedText({ keywords = [] }) {
  if (!keywords.length) {
    return <p className="muted">No keyword weights returned yet.</p>
  }

  return (
    <div className="highlighted-text">
      {keywords.map((keyword, index) => (
        <Tooltip
          key={`${keyword.text}-${index}`}
          label={`Weight ${keyword.weight.toFixed(3)} - ${keyword.kind} pattern`}
        >
          <span className={`highlight-token token-${keyword.kind}`}>{keyword.text}</span>
        </Tooltip>
      ))}
    </div>
  )
}
