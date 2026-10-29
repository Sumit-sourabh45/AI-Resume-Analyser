'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './ScoreCard.module.css';

interface ScoreCardProps {
  score: number;
  summary: string;
}

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function getScoreColor(score: number): string {
  if (score >= 80) return 'var(--color-green)';
  if (score >= 60) return 'var(--color-amber)';
  return 'var(--color-red)';
}

function getFitLabel(score: number): string {
  if (score >= 80) return 'Strong fit';
  if (score >= 60) return 'Good fit with gaps';
  return 'Needs work';
}

export default function ScoreCard({ score, summary }: ScoreCardProps) {
  const [animated, setAnimated] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);

  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));
  const dashOffset = CIRCUMFERENCE - (clampedScore / 100) * CIRCUMFERENCE;
  const ringColor = getScoreColor(clampedScore);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setAnimated(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={styles.card}
      style={{ '--ring-color': ringColor } as React.CSSProperties}
    >
      <div className={styles.ringWrapper}>
        <svg
          className={styles.ringSvg}
          width="130"
          height="130"
          viewBox="0 0 130 130"
          role="img"
          aria-label={`Match score: ${clampedScore} out of 100`}
        >
          <circle
            className={styles.ringTrack}
            cx="65"
            cy="65"
            r={RADIUS}
          />
          <circle
            ref={ringRef}
            className={`${styles.ringFill} ${animated ? styles.ringAnimated : ''}`}
            cx="65"
            cy="65"
            r={RADIUS}
            style={
              {
                '--circumference': CIRCUMFERENCE,
                '--dash-offset': dashOffset,
              } as React.CSSProperties
            }
          />
        </svg>
        <span className={styles.scoreValue} aria-hidden="true">
          {clampedScore}
        </span>
      </div>

      <span className={styles.fitLabel}>{getFitLabel(clampedScore)}</span>
      <p className={styles.summary}>{summary}</p>

      <div className={styles.calculationNote}>
        <span className={styles.calcTitle}>How this score is calculated:</span>
        <span className={styles.calcWeights}>
          Skills (35%) · Experience (30%) · Keywords (25%) · Clarity (10%)
        </span>
      </div>
    </div>
  );
}
