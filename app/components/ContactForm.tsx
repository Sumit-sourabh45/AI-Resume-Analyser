'use client';

import { useState, type FormEvent } from 'react';
import styles from './ContactForm.module.css';

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name || !email || !message) return;
    setLoading(true);
    // Simulate network submission delay
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 400);
  }

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Get in Touch</h2>
        <p className={styles.subheading}>
          Have feedback, questions, or issues with an analysis? Send a message or reach us directly at{' '}
          <a href="mailto:support@resumeai.example" className={styles.emailLink}>
            support@resumeai.example
          </a>
        </p>

        <div className={styles.card}>
          {submitted ? (
            <div className={styles.successWrapper}>
              <div className={styles.successIcon} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className={styles.successTitle}>Message sent</h3>
              <p className={styles.successText}>
                Thanks for reaching out! We&apos;ve received your message and will review it shortly.
              </p>
              <button
                type="button"
                className={styles.resetButton}
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setMessage('');
                }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="contact-name" className={styles.label}>
                  Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.input}
                  required
                  aria-required="true"
                  autoComplete="name"
                  placeholder="Sumit"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="contact-email" className={styles.label}>
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  required
                  aria-required="true"
                  autoComplete="email"
                  placeholder="sumit@gmail.com"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="contact-message" className={styles.label}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={styles.textarea}
                  required
                  aria-required="true"
                  rows={5}
                  placeholder="Tell us what you think or report an issue..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={styles.submit}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
