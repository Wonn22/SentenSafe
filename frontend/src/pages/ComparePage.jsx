import { useState } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ProgressBar } from '../components/ProgressBar'
import { ErrorState, LoadingState } from '../components/States'
import { TextEditor } from '../components/TextEditor'
import { sampleText } from '../data/sampleText'
import { analyzeText } from '../services/api'
import { formatPercent } from '../utils/analysis'
import './ComparePage.css'

export function ComparePage() {
  const [original, setOriginal] = useState('')
  const [rewritten, setRewritten] = useState('')
  const [left, setLeft] = useState(null)
  const [right, setRight] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function runCompare() {
    if (!original.trim() || !rewritten.trim()) {
      setError('Add both original and rewritten text before comparing.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const [leftResult, rightResult] = await Promise.all([
        analyzeText(original),
        analyzeText(rewritten),
      ])
      setLeft(leftResult)
      setRight(rightResult)
    } catch (compareError) {
      setError(compareError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-stack">
      <div className="compare-grid">
        <Card>
          <h2>Original text</h2>
          <TextEditor value={original} onChange={setOriginal} />
        </Card>
        <Card>
          <h2>Rewritten text</h2>
          <TextEditor value={rewritten} onChange={setRewritten} />
        </Card>
      </div>
      <div className="button-row">
        <Button variant="secondary" onClick={() => setOriginal(sampleText)}>
          Use sample original
        </Button>
        <Button onClick={runCompare} disabled={loading}>
          {loading ? 'Comparing' : 'Compare pattern shift'}
        </Button>
      </div>
      <ErrorState message={error} />
      {loading ? <LoadingState text="Comparing both texts..." /> : null}
      {left && right ? (
        <Card>
          <div className="compare-results">
            <div>
              <h3>Before</h3>
              <strong>{formatPercent(left.probabilities.ai * 100)}</strong>
              <span>AI probability</span>
              <ProgressBar value={left.probabilities.ai * 100} tone="ai" />
            </div>
            <div>
              <h3>After</h3>
              <strong>{formatPercent(right.probabilities.ai * 100)}</strong>
              <span>AI probability</span>
              <ProgressBar value={right.probabilities.ai * 100} tone="ai" />
            </div>
          </div>
          <h3>Changed-word view</h3>
          <p className="muted">
            Changed
            words are shown by position and should be reviewed manually.
          </p>
          <ChangedWords original={original} rewritten={rewritten} />
        </Card>
      ) : null}
    </div>
  )
}

function ChangedWords({ original, rewritten }) {
  const originalWords = original.split(/\s+/).filter(Boolean)
  const rewrittenWords = rewritten.split(/\s+/).filter(Boolean)
  return (
    <div className="changed-words">
      {rewrittenWords.map((word, index) => (
        <span
          className={word === originalWords[index] ? 'same-word' : 'changed-word'}
          key={`${word}-${index}`}
        >
          {word}
        </span>
      ))}
    </div>
  )
}
