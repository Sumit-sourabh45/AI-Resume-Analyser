import { NextResponse } from 'next/server'
import { extractText } from 'unpdf'

export async function POST(req) {
  try {
    const formData = await req.formData()
    const file = formData.get('pdf')
    const arrayBuffer = await file.arrayBuffer()

    const { text } = await extractText(new Uint8Array(arrayBuffer), { mergePages: true })

    return NextResponse.json({ text })
  } catch (err) {
    console.error('PDF parse error:', err)
    return NextResponse.json({ error: 'PDF parsing failed' }, { status: 500 })
  }
}