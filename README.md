# Resume AI Analyzer

An AI-powered resume analysis tool built with Next.js and Google Gemini. Upload your resume and a job description to get an instant match score, strengths, gaps, and actionable rewrite tips.

## Features

- **AI-Powered Analysis** — Uses Google Gemini to compare your resume against any job description
- **Match Score** — Get a 0–100 compatibility score with visual indicators
- **Strengths & Gaps** — See what aligns and what's missing
- **Rewrite Suggestions** — Actionable tips to improve your resume
- **PDF & Text Support** — Upload a PDF or paste resume text directly
- **Model Fallback** — Automatically retries with an alternate model if the primary is unavailable

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **AI:** Google Gemini API (`@google/genai`)
- **PDF Parsing:** pdf-parse v2
- **Styling:** Inline styles with a dark theme
- **Language:** TypeScript + JavaScript API routes

## Getting Started

### Prerequisites

- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/apikey)

### Installation

```bash
git clone https://github.com/Sumit-sourabh45/AI-Resume-Analyser.git
cd AI-Resume-Analyser
npm install
```

### Environment Setup

Copy the example env file and add your API key:

```bash
cp .env.local
```
```
GEMINI_API_KEY=your_actual_api_key_here
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
resume-ai/
├── app/
│   ├── api/
│   │   ├── analyze/route.js      # Gemini AI analysis endpoint
│   │   └── parse-pdf/route.js    # PDF text extraction endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout with metadata
│   └── page.tsx                  # Main UI (upload, analyze, results)
├── public/                       # Static assets
├── next.config.ts                # Next.js configuration
├── package.json
└── tsconfig.json
```

## Deployment

Deploy to [Vercel](https://vercel.com) with one click:

1. Push your code to GitHub
2. Import the repo in Vercel
3. Add `GEMINI_API_KEY` as an environment variable
4. Deploy

