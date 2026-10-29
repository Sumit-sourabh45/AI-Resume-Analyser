'use client'

import { useState, useRef, ChangeEvent } from 'react'
import type { AnalysisResult } from '@/app/lib/analysis-schema'
import Navbar from '@/app/components/Navbar'
import ScoreCard from '@/app/components/ScoreCard'
import BreakdownList from '@/app/components/BreakdownList'
import KeywordPanel from '@/app/components/KeywordPanel'
import TipsList from '@/app/components/TipsList'
import AnalysisSkeleton from '@/app/components/AnalysisSkeleton'
import ErrorState from '@/app/components/ErrorState'
import Hero from '@/app/components/Hero'
import Features from '@/app/components/Features'
import HowItWorks from '@/app/components/HowItWorks'
import FAQ from '@/app/components/FAQ'
import ContactForm from '@/app/components/ContactForm'
import Footer from '@/app/components/Footer'
import styles from './page.module.css'

export default function Home() {
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')
  const [copied, setCopied] = useState(false)

  const resultsRef = useRef<HTMLDivElement>(null)

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setError('')

    if (file.type === 'text/plain') {
      const text = await file.text()
      if (!text.trim()) {
        setError('The uploaded text file is empty. Please paste your resume text.')
        return
      }
      setResumeText(text)
    } else if (file.type === 'application/pdf') {
      const formData = new FormData()
      formData.append('pdf', file)
      try {
        const res = await fetch('/api/parse-pdf', {
          method: 'POST',
          body: formData,
        })

        const data = await res.json()
        if (!res.ok || data.error) {
          setError(
            data.error ||
              'Could not extract text from this PDF. It may be a scanned image. Please paste your resume text directly.'
          )
          return
        }

        if (data.text && data.text.trim().length > 0) {
          setResumeText(data.text)
        } else {
          setError(
            'No readable text found in this PDF. It may be a scanned document. Please paste your resume text directly.'
          )
        }
      } catch {
        setError('PDF parsing failed. Please paste your resume as text.')
      }
    } else {
      setError('Unsupported file type. Please upload a PDF or .txt file, or paste your resume.')
    }
  }

  const handleAnalyze = async () => {
    const trimmedResume = resumeText.trim()
    const trimmedJD = jobDescription.trim()

    // Edge case checks
    if (!trimmedResume || !trimmedJD) {
      setError('Please provide both your resume and the job description.')
      return
    }

    if (trimmedResume.length < 100) {
      setError('Your resume text is too short (minimum 100 characters). Please provide a fuller resume.')
      return
    }

    if (trimmedJD.length < 100) {
      setError('The job description is too short (minimum 100 characters). Please paste the full job posting.')
      return
    }

    if (trimmedResume.length > 15000) {
      setError('Your resume text is over 15,000 characters. Please trim it to the most relevant experience.')
      return
    }

    if (trimmedJD.length > 15000) {
      setError('The job description exceeds 15,000 characters. Please paste only the relevant job requirements.')
      return
    }

    setError('')
    setLoading(true)
    setResult(null)

    // Smooth scroll down to results container
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: trimmedResume, jobDescription: trimmedJD }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error || 'AI analysis failed. Please check your inputs or try again.')
      } else {
        setResult(data as AnalysisResult)
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 150)
      }
    } catch {
      setError('Something went wrong contacting the analysis service. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopySummary = () => {
    if (!result) return

    const missingList = result.keywords.missing
      .map((k) => `• [${k.importance.toUpperCase()}] ${k.term}: ${k.reason}`)
      .join('\n')

    const tipsList = result.tips
      .map(
        (t) =>
          `• [${t.priority.toUpperCase()}] ${t.title}\n  ${t.detail}${
            t.resumeLine ? `\n  (Reference: "${t.resumeLine}")` : ''
          }`
      )
      .join('\n\n')

    const summaryText = `RESUME AI ANALYSIS REPORT
==========================
Overall Match Score: ${result.overallScore}/100
Verdict: ${result.summary}

CATEGORY BREAKDOWN:
${result.breakdown.map((b) => `• ${b.category}: ${b.score}/100 — ${b.explanation}`).join('\n')}

MISSING KEYWORDS (${result.keywords.missing.length}):
${missingList || 'None'}

IMPROVEMENT TIPS (${result.tips.length}):
${tipsList || 'None'}

---
Generated by Resume AI Analyzer (Google Gemini)`

    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <Features />

        <HowItWorks />

        {/* Analyzer Section */}
        <section id="analyzer" className={styles.analyzerSection}>
          <div className={styles.analyzerContainer}>
            <div className={styles.headerBlock}>
              <h2 className={styles.analyzerHeading}>Analyze Your Resume</h2>
              <p className={styles.analyzerSubheading}>
                Paste your resume or upload a PDF, add the target job description, and get instant structured feedback.
              </p>
            </div>

            {/* Input Section */}
            <div className={styles.inputGrid}>
              {/* Resume Upload */}
              <div className={styles.inputCard}>
                <div className={styles.inputCardHeader}>
                  <h3 className={styles.inputLabel}>Your Resume</h3>
                  <span className={styles.charCount}>{resumeText.length} chars</span>
                </div>

                <label className={styles.uploadArea} tabIndex={0}>
                  {fileName ? (
                    <span className={styles.uploadFileName}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      {fileName}
                    </span>
                  ) : (
                    <span className={styles.uploadPlaceholder}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                      </svg>
                      Upload PDF or .txt file
                    </span>
                  )}
                  <input
                    type="file"
                    accept=".pdf,.txt"
                    onChange={handleFileUpload}
                    className="sr-only"
                    aria-label="Upload resume file (PDF or TXT)"
                  />
                </label>

                <p className={styles.uploadDividerText}>— or edit / paste text below —</p>

                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste or review your resume text here (minimum 100 characters)..."
                  rows={10}
                  className={styles.resumeTextarea}
                  aria-label="Resume text"
                />
              </div>

              {/* Job Description */}
              <div className={styles.inputCard}>
                <div className={styles.inputCardHeader}>
                  <h3 className={styles.inputLabel}>Job Description</h3>
                  <span className={styles.charCount}>{jobDescription.length} chars</span>
                </div>

                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target job description here, including responsibilities, requirements, and qualifications (minimum 100 characters)..."
                  rows={14}
                  className={styles.jobTextarea}
                  aria-label="Job description text"
                />
              </div>
            </div>

            {/* Error Message if any before action */}
            {error && !loading && !result && (
              <div className={styles.errorBox} role="alert">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className={`${styles.analyzeButton} ${loading ? styles.analyzeButtonLoading : ''}`}
              aria-label={loading ? 'Analyzing resume' : 'Analyze my resume'}
            >
              {loading ? (
                <span className={styles.buttonContent}>
                  <span className={styles.spinner} aria-hidden="true" />
                  Analyzing...
                </span>
              ) : (
                'Analyze My Resume'
              )}
            </button>

            {/* Results Container with Ref for smooth scrolling */}
            <div ref={resultsRef} className={styles.resultsAnchor}>
              {/* Error State with Retry Button */}
              {error && !loading && (
                <div className="fadeIn">
                  <ErrorState message={error} onRetry={handleAnalyze} />
                </div>
              )}

              {/* Loading Skeleton */}
              {loading && <AnalysisSkeleton />}

              {/* Real Results */}
              {result && !loading && (
                <div className={`fadeIn ${styles.resultsContainer}`}>
                  <div className={styles.resultsGrid}>
                    {/* Left Column: ScoreCard + Breakdown */}
                    <div className={styles.leftColumn}>
                      <ScoreCard score={result.overallScore} summary={result.summary} />
                      <BreakdownList breakdown={result.breakdown} />
                    </div>

                    {/* Right Column: Keywords + Tips */}
                    <div className={styles.rightColumn}>
                      <KeywordPanel keywords={result.keywords} />
                      <TipsList tips={result.tips} />
                    </div>
                  </div>

                  {/* Actions & Note */}
                  <div className={styles.resultsActions}>
                    <p className={styles.disclaimerNote}>
                      The score is an AI estimate. Use it as a guide.
                    </p>

                    <div className={styles.actionButtons}>
                      <button
                        onClick={handleCopySummary}
                        className={styles.copyButton}
                        aria-label="Copy analysis summary to clipboard"
                      >
                        {copied ? (
                          <>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Copied to clipboard!
                          </>
                        ) : (
                          <>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                            Copy summary
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setResult(null)
                          setError('')
                          setFileName('')
                          setResumeText('')
                          setJobDescription('')
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                        className={styles.resetButton}
                        aria-label="Analyze another resume"
                      >
                        Analyze another resume
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <FAQ />

        <ContactForm />
      </main>

      <Footer />
    </>
  )
}
