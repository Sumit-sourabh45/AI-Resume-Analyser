'use client';

import { useEffect, useState } from 'react';
import styles from './BreakdownList.module.css';

interface BreakdownItem {
  category: string;
  score: number;
  explanation: string;
}

interface BreakdownListProps {
  breakdown: BreakdownItem[];
}

function getBarColor(score: number): string {
  if (score >= 75) return 'var(--color-green)';
  if (score >= 50) return 'var(--color-amber)';
  return 'var(--color-red)';
}

export default function BreakdownList({ breakdown }: BreakdownListProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setAnimated(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className={styles.card} aria-label="Score breakdown by category">
      <h3 className={styles.title}>Score Breakdown</h3>
      <div className={styles.list}>
        {breakdown.map((item) => {
          const clampedScore = Math.max(0, Math.min(100, Math.round(item.score)));
          const barColor = getBarColor(clampedScore);

          return (
            <div key={item.category} className={styles.row}>
              <div className={styles.header}>
                <span className={styles.category}>{item.category}</span>
                <span className={styles.score} style={{ color: barColor }}>
                  {clampedScore}<span className={styles.scoreMax}>/100</span>
                </span>
              </div>
              <div className={styles.barContainer}>
                <div
                  className={styles.barTrack}
                  role="progressbar"
                  aria-valuenow={clampedScore}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${item.category} score: ${clampedScore} out of 100`}
                >
                  <div
                    className={`${styles.barFill} ${animated ? styles.barAnimated : ''}`}
                    style={
                      {
                        '--bar-color': barColor,
                        '--bar-width': `${clampedScore}%`,
                      } as React.CSSProperties
                    }
                  />
                </div>
              </div>
              <p className={styles.explanation}>{item.explanation}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
