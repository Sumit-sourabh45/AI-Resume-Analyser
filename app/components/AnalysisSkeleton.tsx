'use client';

import styles from './AnalysisSkeleton.module.css';

export default function AnalysisSkeleton() {
  return (
    <div className={styles.skeletonGrid} aria-busy="true" aria-label="Loading analysis results">
      {/* Left column */}
      <div className={styles.leftCol}>
        {/* Score card skeleton */}
        <div className={styles.scoreCard}>
          <div className={styles.circle} />
          <div className={styles.lineShort} />
          <div className={styles.lineLong} />
        </div>

        {/* Breakdown skeleton */}
        <div className={styles.breakdownCard}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div className={styles.breakdownRow} key={i}>
              <div className={styles.labelBar} />
              <div className={styles.progressBar} />
            </div>
          ))}
        </div>
      </div>

      {/* Right column */}
      <div className={styles.rightCol}>
        {/* Keyword panel skeleton */}
        <div className={styles.keywordCard}>
          <div className={styles.keywordSection}>
            <div className={styles.keywordSectionLabel} />
            <div className={styles.pills}>
              <div className={styles.pillMd} />
              <div className={styles.pillLg} />
              <div className={styles.pillSm} />
              <div className={styles.pillMd} />
            </div>
          </div>
          <div className={styles.keywordSection}>
            <div className={styles.keywordSectionLabel} />
            <div className={styles.pills}>
              <div className={styles.pillLg} />
              <div className={styles.pillSm} />
              <div className={styles.pillMd} />
            </div>
          </div>
        </div>

        {/* Tips skeleton */}
        <div className={styles.tipsCard}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div className={styles.tipItem} key={i}>
              <div className={styles.tipLineA} />
              <div className={styles.tipLineB} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
