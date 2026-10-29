import { NextResponse } from 'next/server'
import { extractText } from 'unpdf'

export async function POST(req) {
  try {
    const formData = await req.formData()
    const file = formData.get('pdf')
    const arrayBuffer = await file.arrayBuffer()

    // Extract per-page to preserve page breaks
    const { text } = await extractText(new Uint8Array(arrayBuffer), {
      mergePages: false,
    })

    // Join pages with double newlines, normalize whitespace
    const pages = Array.isArray(text) ? text : [text]
    const combined = pages
      .map((page) => {
        // Normalize runs of spaces (but preserve newlines)
        return page
          .split('\n')
          .map((line) => line.replace(/[ \t]+/g, ' ').trimEnd())
          .join('\n')
      })
      .filter((page) => page.trim().length > 0)
      .join('\n\n')

    if (!combined.trim()) {
      return NextResponse.json(
        {
          error:
            'No text could be extracted from this PDF. It may be a scanned image. Please paste your resume text directly.',
        },
        { status: 422 }
      )
    }

    return NextResponse.json({ text: combined })
  } catch (err) {
    console.error('PDF parse error:', err)
    return NextResponse.json(
      { error: 'PDF parsing failed. Try pasting your resume text instead.' },
      { status: 500 }
    )
  }
}
