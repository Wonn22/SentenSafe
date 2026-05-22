import { countWords, resultLabel } from '../utils/analysis'

const HISTORY_KEY = 'sentensafe.history.v2'

export function loadHistory() {
  const stored = window.localStorage.getItem(HISTORY_KEY)
  return stored ? JSON.parse(stored) : []
}

export function persistHistory(history) {
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
}

export function createHistoryItem(text, result) {
  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    text,
    result,
    preview: text.replace(/\s+/g, ' ').slice(0, 88),
    prediction: result.prediction,
    label: resultLabel(result),
    confidence: result.confidence_percent,
    words: countWords(text),
  }
}
