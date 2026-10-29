import type { Priority } from '@/app/lib/analysis-schema'
import styles from './TipsList.module.css'

interface Tip {
  priority: Priority
  title: string
  detail: string
  resumeLine: string | null
}

interface TipsListProps {
  tips: Tip[]
}

const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
}

const PRIORITY_LABEL: Record<Priority, string> = {
  high: 'High priority',
  medium: 'Medium priority',
  low: 'Low priority',
}

const BADGE_STYLE: Record<Priority, string> = {
  high: styles.badgeHigh,
  medium: styles.badgeMedium,
  low: styles.badgeLow,
}

export default function TipsList({ tips }: TipsListProps) {
  const sorted = [...tips].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  )

  return (
    <div className={styles.card} aria-label="Improvement tips">
      <h2 className={styles.heading}>Improvement Tips</h2>

      {sorted.length === 0 ? (
        <p className={styles.empty}>No tips available for this resume.</p>
      ) : (
        <div className={styles.list}>
          {sorted.map((tip, index) => (
            <article key={index} className={styles.tipCard}>
              <div className={styles.tipHeader}>
                <span className={`${styles.badge} ${BADGE_STYLE[tip.priority]}`}>
                  <span className={styles.badgeDot} aria-hidden="true" />
                  <span>{PRIORITY_LABEL[tip.priority]}</span>
                </span>
                <h3 className={styles.title}>{tip.title}</h3>
              </div>
              <p className={styles.detail}>{tip.detail}</p>
              {tip.resumeLine !== null && tip.resumeLine.trim().length > 0 && (
                <div className={styles.resumeLineBlock}>
                  <span className={styles.resumeLineLabel}>Referenced from resume:</span>
                  <blockquote className={styles.resumeLine}>
                    &ldquo;{tip.resumeLine}&rdquo;
                  </blockquote>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
