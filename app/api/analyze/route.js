import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(req) {
  try {
    const { resumeText, jobDescription } = await req.json()

    if (!resumeText || !jobDescription) {
      return Response.json({ error: 'Missing resume or job description' }, { status: 400 })
    }

    const prompt = `
Analyze this resume against the job description and return ONLY valid JSON (no markdown, no explanation).

Return this exact structure:
{
  "match_score": (number 0-100),
  "strong_points": ["point 1", "point 2", "point 3"],
  "gaps": ["gap 1", "gap 2", "gap 3"],
  "suggestions": ["tip 1", "tip 2", "tip 3"]
}

Resume:
${resumeText}

Job Description:
${jobDescription}
    `

    let result;
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' })
      result = await model.generateContent(prompt)
    } catch (e) {
      console.warn('Fallback: primary model failed, trying gemma-3-27b-it', e.message);
      const fallbackModel = genAI.getGenerativeModel({ model: 'gemma-3-27b-it' })
      result = await fallbackModel.generateContent(prompt)
    }

    const text = result.response.text()

    // Clean up any accidental markdown code fences
    const cleaned = text.replace(/```json|```/g, '').trim()
    
    // Attempt to extract JSON if there's any conversational text around it
    let jsonString = cleaned;
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    }
    
    const parsed = JSON.parse(jsonString)

    return Response.json(parsed)
  } catch (err) {
    console.error('Analyze error:', err)
    return Response.json({ error: 'AI analysis failed. Check your API key or try again.' }, { status: 500 })
  }
}