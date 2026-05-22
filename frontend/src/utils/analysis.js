export function formatPercent(value, digits = 1) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '0.0%'
  return `${value.toFixed(digits)}%`
}

export function countWords(text) {
  return (text.trim().match(/\b[\w'-]+\b/g) || []).length
}

export function splitSentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
}

export function getTextStats(text, result) {
  const words = text.trim().match(/\b[\w'-]+\b/g) || []
  const sentences = splitSentences(text)
  const uniqueWords = new Set(words.map((word) => word.toLowerCase()))
  const wordCount = words.length
  const sentenceCount = sentences.length

  return {
    words: wordCount,
    characters: text.length,
    sentences: sentenceCount,
    readingTime: Math.max(1, Math.ceil(wordCount / 220)),
    averageSentenceLength: sentenceCount ? wordCount / sentenceCount : 0,
    highlightedKeywords: result?.keywords?.filter((item) => item.kind !== 'neutral').length || 0,
    vocabularyDiversity: wordCount ? (uniqueWords.size / wordCount) * 100 : 0,
  }
}

export function resultTone(result) {
  if (!result) return 'neutral'
  return result.prediction === 1 ? 'ai' : 'human'
}

export function resultLabel(result) {
  if (!result) return 'No analysis'
  return result.prediction === 1 ? 'Likely AI-written' : 'Likely human-written'
}

export function riskLevel(result) {
  if (!result) return { label: 'Unscored', tone: 'neutral' }
  const ai = result.probabilities.ai * 100
  if (ai >= 70) return { label: 'High AI-like pattern', tone: 'ai' }
  if (ai >= 45) return { label: 'Mixed pattern', tone: 'warn' }
  return { label: 'Low AI-like pattern', tone: 'human' }
}

export function sentenceAnalysis(text, keywords = []) {
  return splitSentences(text).map((sentence) => {
    const sentenceWords = sentence.toLowerCase().match(/\b[\w'-]+\b/g) || []
    const weights = keywords
      .filter((keyword) => sentenceWords.includes(keyword.cleaned))
      .map((keyword) => keyword.weight)
    const average = weights.length
      ? weights.reduce((total, weight) => total + weight, 0) / weights.length
      : 0
    const label = average > 0.2 ? 'AI-like' : average < -0.2 ? 'Human-like' : 'Neutral'
    const tone = average > 0.2 ? 'ai' : average < -0.2 ? 'human' : 'neutral'

    return { sentence, average, label, tone }
  })
}

export function readableReplacements(replacements = []) {
  return replacements.filter((item) => item.from && item.to && item.to.length > 2)
}
