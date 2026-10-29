'use client';

import { useState } from 'react';
import styles from './FAQ.module.css';

const faqs = [
  {
    q: 'Is my resume data stored?',
    a: 'No. Your resume and job description are processed in memory and sent directly to Google Gemini for analysis. We do not store your data in any database, nor do we save or retain your resume on our servers.',
  },
  {
    q: 'How is the match score calculated?',
    a: 'The overall score is calculated as a weighted average: Skills match (35%), Relevant experience (30%), Keywords coverage (25%), and Resume clarity (10%). Category scores are evaluated by AI, and the overall score is computed deterministically from those weights.',
  },
  {
    q: 'Which AI model is used?',
    a: 'The app uses Google Gemini. It sends requests to gemini-3.5-flash and automatically falls back to gemini-3.5-flash-lite if the primary model is unavailable.',
  },
  {
    q: 'Is it free to use?',
    a: 'Yes, the analyzer is completely free to use with no account or sign-up required.',
  },
  {
    q: 'What file formats are supported?',
    a: 'You can upload a PDF or plain text (.txt) file, or paste your resume text directly into the input area. The extracted text is displayed so you can review or edit it before analyzing.',
  },
  {
    q: 'How should I interpret the results?',
    a: 'The score and feedback are AI-generated estimates meant to serve as a guide. Focus on the missing keywords and specific improvement tips to identify gaps between your resume and the job requirements.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <section id="faq" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Frequently Asked Questions</h2>
        <div className={styles.accordion} role="region" aria-label="Frequently Asked Questions">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            const answerId = `faq-answer-${i}`;
            return (
              <div key={i} className={styles.item}>
                <button
                  className={styles.trigger}
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                >
                  <span className={styles.questionText}>{faq.q}</span>
                  <svg
                    className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </button>
                {isOpen && (
                  <div id={answerId} className={styles.answerWrapper}>
                    <p className={styles.answer}>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
