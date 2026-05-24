const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'https://sentensafe.onrender.com'
).replace(/\/$/, '')
const API_URL = `${API_BASE_URL}/analyze`

const MAX_RETRIES = 3
const BASE_DELAY_MS = 3000

async function fetchWithRetry(url, options, retries = MAX_RETRIES) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options)
      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`)
      }
      return response
    } catch (err) {
      const isLastAttempt = attempt === retries
      if (isLastAttempt) throw err

      const delay = BASE_DELAY_MS * Math.pow(2, attempt)
      console.warn(
        `[SentenSafe] Request failed (attempt ${attempt + 1}/${retries + 1}), retrying in ${delay / 1000}s...`,
        err.message
      )
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}

export async function analyzeText(text) {
  const response = await fetchWithRetry(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: text.trim() }),
  })

  const data = await response.json()
  if (!data.ok) {
    throw new Error(data.message || 'The backend could not analyze this text.')
  }

  return data
}
