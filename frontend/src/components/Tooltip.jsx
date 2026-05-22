import './Tooltip.css'

export function Tooltip({ label, children }) {
  return (
    <span className="tooltip">
      {children}
      <span className="tooltip-panel">{label}</span>
    </span>
  )
}
