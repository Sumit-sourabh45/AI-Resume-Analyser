import styles from './HowItWorks.module.css';

const steps = [
  {
    number: 1,
    title: 'Upload Your Resume',
    desc: 'Upload a PDF or plain text file, or paste your resume content directly into the editor.',
  },
  {
    number: 2,
    title: 'Add the Job Description',
    desc: 'Paste the target job posting to compare against your qualifications and experience.',
  },
  {
    number: 3,
    title: 'Get Your Analysis',
    desc: 'Receive your match score, category breakdown, keywords, and ranked improvement tips.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>How It Works</h2>
        <div className={styles.steps}>
          {steps.map((step, i) => (
            <div key={step.number} className={styles.step}>
              <div className={styles.numberCircle} aria-hidden="true">
                {step.number}
              </div>
              {i < steps.length - 1 && (
                <div className={styles.connector} aria-hidden="true" />
              )}
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
