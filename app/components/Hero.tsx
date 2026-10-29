import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.textCol}>
          {/* <span className={styles.eyebrow}>Powered by Google Gemini</span> */}
          <h1 className={styles.heading}>
            Know your resume&apos;s match score before you apply.
          </h1>
          <p className={styles.description}>
            Upload your resume and paste a job description. Get an instant match
            score, see which keywords are missing, and receive ranked tips to
            improve your chances.
          </p>
          <div className={styles.buttons}>
            <a href="#analyzer" className={styles.primaryBtn}>
              Analyze my resume
            </a>
            <a href="#features" className={styles.secondaryBtn}>
              See what you get
            </a>
          </div>
        </div>

        <div className={styles.previewCol} aria-hidden="true">
          <div className={styles.previewCard}>
            <span className={styles.previewLabel}>Example report</span>

            {/* Mini score ring */}
            <div className={styles.previewScore}>
              <svg width="72" height="72" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="30" fill="none" stroke="var(--color-border)" strokeWidth="6" />
                <circle
                  cx="36" cy="36" r="30"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 30}
                  strokeDashoffset={2 * Math.PI * 30 * (1 - 78 / 100)}
                  transform="rotate(-90 36 36)"
                />
                <text
                  x="36" y="36"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="var(--color-text)"
                  fontSize="20"
                  fontWeight="800"
                  fontFamily="var(--font-heading)"
                >
                  78
                </text>
              </svg>
              <span className={styles.previewFit}>Good fit with gaps</span>
            </div>

            {/* Mini breakdown bars */}
            <div className={styles.previewBars}>
              {[
                { label: 'Skills', pct: 82, color: 'var(--color-green)' },
                { label: 'Experience', pct: 90, color: 'var(--color-green)' },
                { label: 'Keywords', pct: 58, color: 'var(--color-amber)' },
              ].map((b) => (
                <div key={b.label} className={styles.previewBar}>
                  <span className={styles.previewBarLabel}>{b.label}</span>
                  <div className={styles.previewBarTrack}>
                    <div
                      className={styles.previewBarFill}
                      style={{ width: `${b.pct}%`, background: b.color }}
                    />
                  </div>
                  <span className={styles.previewBarScore}>{b.pct}</span>
                </div>
              ))}
            </div>

            {/* Mini chips */}
            <div className={styles.previewChips}>
              <span className={styles.chipGreen}>React</span>
              <span className={styles.chipGreen}>TypeScript</span>
              <span className={styles.chipRed}>GraphQL</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
