const API_URL = 'http://127.0.0.1:8000/analyze'

export async function analyzeText(text) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: text.trim() }),
  })

  if (!response.ok) {
    throw new Error(`Backend returned ${response.status}`)
  }

  const data = await response.json()
  if (!data.ok) {
    throw new Error(data.message || 'The backend could not analyze this text.')
  }

  return data
}
