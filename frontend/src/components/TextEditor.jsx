import './TextEditor.css'

export function TextEditor({ value, onChange, placeholder = 'Paste English text here...' }) {
  return (
    <textarea
      className="text-editor"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      spellCheck="true"
    />
  )
}
