import { useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { AnalyzerPage } from './pages/AnalyzerPage'
import { ComparePage } from './pages/ComparePage'
import { HistoryPage } from './pages/HistoryPage'
import { HowItWorksPage } from './pages/HowItWorksPage'
import { LandingPage } from './pages/LandingPage'
import { LimitationsPage } from './pages/LimitationsPage'
import { ResultsPage } from './pages/ResultsPage'
import { analyzeText } from './services/api'
import { createHistoryItem, loadHistory, persistHistory } from './services/history'

function RoutedApp() {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState(loadHistory)

  function saveHistory(nextHistory) {
    setHistory(nextHistory)
    persistHistory(nextHistory)
  }

  async function analyze() {
    if (!text.trim()) {
      setError('Enter text before running analysis.')
      setResult(null)
      return
    }

    setLoading(true)
    setError('')
    try {
      const data = await analyzeText(text)
      setResult(data)
      saveHistory([createHistoryItem(text, data), ...history].slice(0, 20))
      navigate('/results')
    } catch (requestError) {
      setError(`Could not analyze text. ${requestError.message}`)
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  function openHistoryItem(item) {
    setText(item.text)
    setResult(item.result)
    navigate('/results')
  }

  function clearHistory() {
    saveHistory([])
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<LandingPage />} />
        <Route
          path="analyzer"
          element={
            <AnalyzerPage
              text={text}
              setText={setText}
              analyze={analyze}
              loading={loading}
              error={error}
              result={result}
            />
          }
        />
        <Route path="results" element={<ResultsPage result={result} text={text} />} />
        <Route
          path="history"
          element={
            <HistoryPage
              history={history}
              openHistoryItem={openHistoryItem}
              clearHistory={clearHistory}
            />
          }
        />
        <Route path="how-it-works" element={<HowItWorksPage />} />
        <Route path="limitations" element={<LimitationsPage />} />
        <Route path="compare" element={<ComparePage />} />
      </Route>
    </Routes>
  )
}

export default RoutedApp
