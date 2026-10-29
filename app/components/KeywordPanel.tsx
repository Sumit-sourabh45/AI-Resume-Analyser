'use client'

import { useState, useCallback } from 'react'
import type { KeywordCategory, Importance } from '@/app/lib/analysis-schema'
import styles from './KeywordPanel.module.css'

interface MatchedKeyword {
  term: string
  category: KeywordCategory
}

interface MissingKeyword {
  term: string
  category: KeywordCategory
  importance: Importance
  reason: string
}

interface KeywordPanelProps {
  keywords: {
    matched: MatchedKeyword[]
    missing: MissingKeyword[]
  }
}

const CATEGORY_ORDER: KeywordCategory[] = [
  'Programming & frameworks',
  'Tools & platforms',
  'Methods & concepts',
  'Education & certifications',
]

const IMPORTANCE_TEXT: Record<Importance, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

const IMPORTANCE_CLASS: Record<Importance, string> = {
  high: styles.importanceHigh,
  medium: styles.importanceMedium,
  low: styles.importanceLow,
}

function groupByCategory<T extends { category: KeywordCategory }>(
  items: T[]
): Map<KeywordCategory, T[]> {
  const map = new Map<KeywordCategory, T[]>()
  for (const item of items) {
    const group = map.get(item.category)
    if (group) {
      group.push(item)
    } else {
      map.set(item.category, [item])
    }
  }
  return map
}

function MissingChip({ keyword }: { keyword: MissingKeyword }) {
  const [expanded, setExpanded] = useState(false)

  const toggle = useCallback(() => {
    setExpanded((prev) => !prev)
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        toggle()
      }
    },
    [toggle]
  )

  return (
    <div className={styles.missingChipWrapper}>
      <span
        className={`${styles.chipMissing} ${IMPORTANCE_CLASS[keyword.importance]}`}
        title={`${keyword.term} (${IMPORTANCE_TEXT[keyword.importance]} importance): ${keyword.reason}`}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        aria-label={`${keyword.term}, ${IMPORTANCE_TEXT[keyword.importance]} importance. Click to ${expanded ? 'hide' : 'show'} explanation.`}
        onClick={toggle}
        onKeyDown={handleKeyDown}
      >
        <span className={styles.termText}>{keyword.term}</span>
        <span className={styles.importanceSuffix}>
          <span className={styles.importanceDot} aria-hidden="true" />
          <span>{IMPORTANCE_TEXT[keyword.importance]}</span>
        </span>
      </span>
      {expanded && (
        <div className={styles.reasonDropdown} role="note">
          <p className={styles.reasonText}>{keyword.reason}</p>
        </div>
      )}
    </div>
  )
}

export default function KeywordPanel({ keywords }: KeywordPanelProps) {
  const matchedGroups = groupByCategory(keywords.matched)
  const missingGroups = groupByCategory(keywords.missing)

  return (
    <div className={styles.card} aria-label="Keyword analysis">
      <h2 className={styles.heading}>Keyword Analysis</h2>

      {/* Matched Keywords */}
      <div className={styles.section}>
        <h3 className={styles.sectionHeading}>
          Matched <span className={styles.countBadge}>({keywords.matched.length})</span>
        </h3>
        {keywords.matched.length === 0 ? (
          <p className={styles.empty}>No matched keywords found</p>
        ) : (
          CATEGORY_ORDER.filter((cat) => matchedGroups.has(cat)).map((cat) => (
            <div key={cat} className={styles.categoryBlock}>
              <h4 className={styles.categoryHeading}>{cat}</h4>
              <div className={styles.chipGroup}>
                {matchedGroups.get(cat)!.map((kw) => (
                  <span key={kw.term} className={styles.chipMatched}>
                    <svg
                      className={styles.checkIcon}
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M3.5 8.5L6.5 11.5L12.5 4.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{kw.term}</span>
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Missing Keywords */}
      <div className={styles.section}>
        <h3 className={styles.sectionHeading}>
          Missing <span className={styles.countBadge}>({keywords.missing.length})</span>
        </h3>
        {keywords.missing.length === 0 ? (
          <p className={styles.empty}>No missing keywords identified</p>
        ) : (
          CATEGORY_ORDER.filter((cat) => missingGroups.has(cat)).map((cat) => (
            <div key={cat} className={styles.categoryBlock}>
              <h4 className={styles.categoryHeading}>{cat}</h4>
              <div className={styles.chipGroup}>
                {missingGroups.get(cat)!.map((kw) => (
                  <MissingChip key={kw.term} keyword={kw} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
