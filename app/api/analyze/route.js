import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

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

    // Try primary model, then fallback to lite model if unavailable
    const models = ['gemini-3.5-flash', 'gemini-3.1-flash-lite']
    let response
    let lastError

    for (const model of models) {
      try {
        response = await ai.models.generateContent({
          model,
          contents: prompt,
        })
        break // success, stop trying
      } catch (e) {
        console.warn(`Model ${model} failed:`, e.message)
        lastError = e
      }
    }

    if (!response) {
      throw lastError || new Error('All models failed')
    }

    const text = response.text

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