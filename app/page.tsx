'use client'

import { useState, ChangeEvent } from 'react'

interface AnalysisResult {
  match_score: number;
  strong_points: string[];
  gaps: string[];
  suggestions: string[];
}

export default function Home() {
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)

    if (file.type === 'text/plain') {
      const text = await file.text()
      setResumeText(text)
    } else if (file.type === 'application/pdf') {
      const formData = new FormData()
      formData.append('pdf', file)
      const res = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        setError('PDF parsing failed (server error). Try pasting your resume as text.')
        return
      }

      const data = await res.json()
      if (data.text) setResumeText(data.text)
      else setError('Could not parse PDF. Try pasting your resume as text.')
    }
  }

  const handleAnalyze = async () => {
    if (!resumeText || !jobDescription) {
      setError('Please provide both your resume and a job description.')
      return
    }
    setError('')
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription }),
      })
      const data = await res.json()
      if (data.error) setError(data.error)
      else setResult(data)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 75) return '#22c55e'
    if (score >= 50) return '#f59e0b'
    return '#ef4444'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 75) return 'Strong Match'
    if (score >= 50) return 'Moderate Match'
    return 'Weak Match'
  }

  return (
    <main style={{ minHeight: '100vh', padding: '40px 20px', background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🤖</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(90deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Resume AI Analyzer
          </h1>
          <p style={{ color: '#94a3b8', marginTop: '8px', fontSize: '1.05rem' }}>
            Powered by Google Gemini · Instant match score + actionable tips
          </p>
        </div>

        {/* Input Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>

          {/* Resume Upload */}
          <div style={{ background: '#1e1e2e', borderRadius: '16px', padding: '24px', border: '1px solid #2d2d44' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px', color: '#c084fc' }}>📄 Your Resume</h2>
            <label style={{
              display: 'block', border: '2px dashed #3d3d5c', borderRadius: '12px',
              padding: '20px', textAlign: 'center', cursor: 'pointer', marginBottom: '14px',
              background: '#16162a', color: '#94a3b8', fontSize: '0.875rem'
            }}>
              {fileName ? `✅ ${fileName}` : '⬆️ Upload PDF or .txt file'}
              <input type="file" accept=".pdf,.txt" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
            <p style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '10px', textAlign: 'center' }}>— or paste below —</p>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here..."
              rows={8}
              style={{
                width: '100%', background: '#16162a', border: '1px solid #2d2d44',
                borderRadius: '10px', padding: '12px', color: '#e2e8f0',
                fontSize: '0.85rem', resize: 'vertical', outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Job Description */}
          <div style={{ background: '#1e1e2e', borderRadius: '16px', padding: '24px', border: '1px solid #2d2d44' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px', color: '#818cf8' }}>💼 Job Description</h2>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={16}
              style={{
                width: '100%', height: 'calc(100% - 40px)', background: '#16162a',
                border: '1px solid #2d2d44', borderRadius: '10px', padding: '12px',
                color: '#e2e8f0', fontSize: '0.85rem', resize: 'vertical',
                outline: 'none', fontFamily: 'inherit'
              }}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#2d1515', border: '1px solid #ef4444', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px', color: '#fca5a5', fontSize: '0.9rem' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={loading}
          style={{
            width: '100%', padding: '16px', borderRadius: '12px', border: 'none',
            background: loading ? '#3d3d5c' : 'linear-gradient(135deg, #818cf8, #c084fc)',
            color: 'white', fontSize: '1.1rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '40px', transition: 'opacity 0.2s'
          }}
        >
          {loading ? '🔍 Analyzing with Gemini AI...' : '🚀 Analyze My Resume'}
        </button>

        {/* Results */}
        {result && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>

            {/* Score */}
            <div style={{
              background: '#1e1e2e', borderRadius: '20px', padding: '36px',
              textAlign: 'center', marginBottom: '24px', border: `2px solid ${getScoreColor(result.match_score)}`
            }}>
              <div style={{ fontSize: '5rem', fontWeight: '900', color: getScoreColor(result.match_score), lineHeight: 1 }}>
                {result.match_score}
              </div>
              <div style={{ fontSize: '1rem', color: '#94a3b8', marginTop: '4px' }}>out of 100</div>
              <div style={{
                display: 'inline-block', marginTop: '16px', padding: '6px 20px',
                borderRadius: '999px', background: getScoreColor(result.match_score) + '22',
                color: getScoreColor(result.match_score), fontWeight: '700', fontSize: '1rem'
              }}>
                {getScoreLabel(result.match_score)}
              </div>
            </div>

            {/* Cards Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>

              {/* Strong Points */}
              <ResultCard
                icon="✅" title="Strong Points" color="#22c55e"
                items={result.strong_points}
              />

              {/* Gaps */}
              <ResultCard
                icon="⚠️" title="Gaps Found" color="#f59e0b"
                items={result.gaps}
              />

              {/* Suggestions */}
              <ResultCard
                icon="💡" title="Rewrite Tips" color="#818cf8"
                items={result.suggestions}
              />
            </div>

            {/* Reset */}
            <button
              onClick={() => { setResult(null); setError('') }}
              style={{
                width: '100%', padding: '12px', borderRadius: '10px',
                border: '1px solid #3d3d5c', background: 'transparent',
                color: '#94a3b8', cursor: 'pointer', fontSize: '0.95rem'
              }}
            >
              🔄 Analyze Another Resume
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </main>
  )
}

interface ResultCardProps {
  icon: string;
  title: string;
  color: string;
  items: string[];
}

function ResultCard({ icon, title, color, items }: ResultCardProps) {
  return (
    <div style={{ background: '#1e1e2e', borderRadius: '16px', padding: '20px', border: `1px solid ${color}44` }}>
      <h3 style={{ color, fontWeight: '700', marginBottom: '14px', fontSize: '0.95rem' }}>{icon} {title}</h3>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items?.map((item, i) => (
          <li key={i} style={{
            background: color + '11', borderRadius: '8px', padding: '10px 12px',
            fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5',
            borderLeft: `3px solid ${color}`
          }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}