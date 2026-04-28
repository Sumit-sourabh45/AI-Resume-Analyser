import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const formData = await req.formData()
    const file = formData.get('pdf')
    const arrayBuffer = await file.arrayBuffer()

    // pdf-parse v2 uses a class-based API
    const { PDFParse } = await import('pdf-parse')
    const parser = new PDFParse({ data: new Uint8Array(arrayBuffer) })
    const result = await parser.getText()

    return NextResponse.json({ text: result.text })
  } catch (err) {
    console.error('PDF parse error:', err)
    return NextResponse.json({ error: 'PDF parsing failed' }, { status: 500 })
  }
}