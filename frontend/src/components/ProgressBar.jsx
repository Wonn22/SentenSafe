import './ProgressBar.css'

export function ProgressBar({ value, tone = 'accent', label }) {
  const width = Math.max(0, Math.min(100, value || 0))
  return (
    <div className="progress-wrap" aria-label={label}>
      <div className="progress-track">
        <div className={`progress-fill progress-${tone}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}
