import './States.css'

export function EmptyState({ title, text, action }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  )
}

export function ErrorState({ message }) {
  if (!message) return null
  return <div className="error-state">{message}</div>
}

export function LoadingState({ text = 'Analyzing writing patterns...' }) {
  return (
    <div className="loading-state">
      <span className="loading-mark" />
      {text}
    </div>
  )
}
