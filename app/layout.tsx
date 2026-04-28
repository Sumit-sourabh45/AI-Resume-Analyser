import './globals.css'

export const metadata = {
  title: 'Resume AI Analyzer',
  description: 'Analyze your resume against any job description using Gemini AI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}