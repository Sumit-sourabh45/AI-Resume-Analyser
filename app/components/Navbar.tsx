'use client'

import { useState, useCallback } from 'react'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Analyzer', href: '#analyzer' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggle = useCallback(() => setMenuOpen((v) => !v), [])
  const close = useCallback(() => setMenuOpen(false), [])

  return (
    <nav className={styles.nav} aria-label="Main navigation">
      <div className={styles.inner}>
        <a href="#" className={styles.brand} onClick={close}>
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            aria-hidden="true"
          >
            <rect width="28" height="28" rx="7" fill="var(--color-accent)" />
            <path
              d="M8 9h12M8 14h8M8 19h10"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span>Resume AI Analyzer</span>
        </a>

        <div className={styles.desktopLinks}>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className={styles.link}>
              {link.label}
            </a>
          ))}
          <a href="#analyzer" className={styles.ctaButton}>
            Analyze my resume
          </a>
        </div>

        <button
          className={styles.menuButton}
          onClick={toggle}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {menuOpen ? (
              <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={styles.mobileLink}
              onClick={close}
            >
              {link.label}
            </a>
          ))}
          <a href="#analyzer" className={styles.ctaButton} onClick={close}>
            Analyze my resume
          </a>
        </div>
      )}
    </nav>
  )
}

