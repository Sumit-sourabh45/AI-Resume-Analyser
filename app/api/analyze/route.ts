import { GoogleGenAI } from '@google/genai'
import { analysisSchema } from '@/app/lib/analysis-schema'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const SYSTEM_PROMPT = `You are a strict, objective, and unbiased hiring evaluator and resume analyst.
Your job is to compare the candidate's resume against the job description with complete accuracy and impartiality.
DO NOT BE LENIENT. DO NOT GRADE INFLATE. Scores must realistically reflect how well the candidate meets the actual stated requirements of the job description.

A candidate with a completely unrelated background must receive a low score (under 30).
A candidate with major gaps (missing core technical stack or years of experience) must receive a moderate/low score (30-65).
A high score (80+) is ONLY earned when the candidate demonstrates a genuine, strong match across core requirements.

CALIBRATION SCORING BENCHMARKS (Score each category independently 0-100):

1. Skills (35% weight):
   - 90-100: The candidate clearly possesses 90%+ of all required tools, languages, and technical competencies stated in the JD.
   - 70-89: Possesses 70-89% of required skills; only minor or secondary tools are missing.
   - 45-69: Partial match (45-69%); candidate has some relevant technical background but lacks 1 or 2 core, primary technologies required for the job.
   - 20-44: Major gap; missing the majority of required technical competencies (has only 20-44%).
   - 0-19: Has virtually none of the required technical skills (different technical domain or non-technical).

2. Experience (30% weight):
   - 90-100: Meets or exceeds the required years of experience in the same or closely related domain and seniority level.
   - 70-89: Solid experience match; meets seniority or closely matches domain with minor differences.
   - 45-69: Has relevant background but significantly below required years (e.g. 2-3 years when 5+ required, or Junior applying for Senior role).
   - 20-44: Significant domain gap (e.g. general IT support applying for specialized distributed systems engineer) or major seniority mismatch.
   - 0-19: Completely unrelated professional field or zero relevant experience.

3. Keywords (25% weight):
   - Strictly calculated as the mathematical ratio of matched JD requirements to total required JD keywords:
     Keywords Score ≈ (Count of Matched JD Keywords / Total Required JD Keywords) * 100.
   - If the JD requires 10 key technical competencies and the candidate matches only 2, the score MUST be in the 20-25 range.
   - If the candidate matches 0 required keywords, the score MUST be 0-5.

4. Clarity (10% weight):
   - Evaluates how clearly and convincingly the resume communicates qualifications FOR THIS SPECIFIC ROLE.
   - 90-100: Clean formatting, consistent bullet points, strong action verbs, and achievements are quantified with clear metrics.
   - 70-89: Well-structured and readable, but lacks metrics or has slight formatting inconsistencies.
   - 40-69: Vague descriptions, unquantified responsibilities, or poorly structured layout.
   - 0-39: Extremely poor formatting, or a resume that completely fails to convey relevance to this job.

*Note: Set overallScore to 0 in your JSON. The server computes the true overall score deterministically from your 4 category scores.*

SUMMARY:
- One sentence, maximum 25 words, written directly to the user in second person ("You match...", "Your resume shows...", never "The candidate...").
- Be honest and direct about the fit (e.g. if gaps exist, state them clearly).

CRITICAL KEYWORD EXTRACTION RULES:
1. ONLY EXTRACT KEYWORDS REQUIRED BY THE JOB DESCRIPTION:
   - Every single keyword in BOTH "matched" and "missing" MUST come from the <JOB_DESCRIPTION>.
   - A keyword is a concrete skill, tool, technology, framework, method, degree, or certification (1-3 words, max 40 chars).
   - Valid examples: "Docker", "PostgreSQL", "React", "TypeScript", "CI/CD", "REST APIs", "WCAG 2.1", "B.S. Computer Science".
   - INVALID keywords (NEVER use): Personality traits, soft-skill buzzwords, or filler phrases (e.g. "passionate", "motivated", "fast-paced", "eagerness to learn", "team player", "problem-solving", "communication skills", "collaborate"). Put any soft observations into explanations, NOT keywords.

2. "matched" LIST:
   - A term can ONLY appear in "matched" if:
     (a) It is EXPLICITLY requested or mentioned in the <JOB_DESCRIPTION>, AND
     (b) The candidate EXPLICITLY mentions or demonstrates it in the <RESUME>.
   - NEVER list a skill in "matched" just because the resume mentions it if the JD did not ask for it!
     Example: If the resume lists "Photoshop" or "WordPress", but the JD is for a Go backend engineer that never mentions them, they MUST NEVER appear in "matched".
   - Max 15 matched terms, sorted by importance.

3. "missing" LIST:
   - A term can ONLY appear in "missing" if:
     (a) It is EXPLICITLY mentioned in the <JOB_DESCRIPTION>, AND
     (b) The candidate DOES NOT show it in the <RESUME>.
   - Importance mapping:
     * "high": Core, mandatory requirement explicitly required by the JD.
     * "medium": Secondary required skill or standard competency for the role.
     * "low": Explicitly described in the JD as "nice to have", "bonus", "optional", or "preferred".
   - Max 12 missing terms, sorted by importance (high first).

4. ALTERNATIVE LISTS RULE:
   - When the JD provides options (e.g. "Python, Java, or Go", "Docker or Kubernetes", "Redux, Zustand, or similar"), and the resume has at least ONE of the options, mark that requirement as MATCHED under the candidate's matching tool. DO NOT list the other options as missing!

5. CATEGORIES:
   - Every term must map to exactly one of these 4 categories:
     "Programming & frameworks" | "Tools & platforms" | "Methods & concepts" | "Education & certifications"

TIPS RULES:
- Maximum 6 tips, sorted by priority (high first).
- Tips must directly address the most critical missing requirements or experience gaps identified.
- NEVER suggest adding fake experience or buzzwords ("passionate", "motivated").
- Frame suggestions as honest positioning: "If you have experience with [X], consider adding it..." or "If you have used [X], describe a project where...".
- Each tip must include: priority ("high"|"medium"|"low"), short title, detail (max 2 sentences), and verbatim quote from resume in "resumeLine" (or null if no relevant line exists).`

const JSON_SHAPE = `Return ONLY a valid JSON object matching this schema:
{
  "overallScore": 0,
  "summary": "<max 25 words, second person>",
  "breakdown": [
    { "category": "Skills", "score": <number 0-100>, "explanation": "<1-2 sentences citing specific matches or gaps>" },
    { "category": "Experience", "score": <number 0-100>, "explanation": "<1-2 sentences citing specific years and domain match>" },
    { "category": "Keywords", "score": <number 0-100>, "explanation": "<1-2 sentences citing specific keyword coverage ratio>" },
    { "category": "Clarity", "score": <number 0-100>, "explanation": "<1-2 sentences citing formatting, metrics, and role relevance>" }
  ],
  "keywords": {
    "matched": [
      { "term": "<string>", "category": "<Programming & frameworks | Tools & platforms | Methods & concepts | Education & certifications>" }
    ],
    "missing": [
      { "term": "<string>", "category": "<same 4 categories>", "importance": "<high | medium | low>", "reason": "<specific reason based on JD>" }
    ]
  },
  "tips": [
    { "priority": "<high | medium | low>", "title": "<short title>", "detail": "<max 2 sentences>", "resumeLine": "<verbatim line or null>" }
  ]
}`

function buildPrompt(resumeText: string, jobDescription: string): string {
  return `${SYSTEM_PROMPT}

${JSON_SHAPE}

<RESUME>
${resumeText}
</RESUME>

<JOB_DESCRIPTION>
${jobDescription}
</JOB_DESCRIPTION>`
}

function computeOverallScore(breakdown: { category: string; score: number }[]): number {
  const get = (cat: string) => breakdown.find((b) => b.category === cat)?.score ?? 0
  return Math.round(
    get('Skills') * 0.35 +
    get('Experience') * 0.30 +
    get('Keywords') * 0.25 +
    get('Clarity') * 0.10
  )
}

async function callGemini(prompt: string, isRetry = false) {
  const models = ['gemini-3.5-flash', 'gemini-3.5-flash-lite']
  let lastError: Error | null = null

  const finalPrompt = isRetry
    ? `Your previous response did not strictly match the required schema or instructions.
Remember:
1. Every term in "matched" MUST be an explicit requirement from the Job Description that the resume demonstrates.
2. Categories must strictly be one of: "Programming & frameworks", "Tools & platforms", "Methods & concepts", "Education & certifications".
3. Return ONLY valid JSON matching the exact schema.

${prompt}`
    : prompt

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: finalPrompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1, // Low temperature for consistent, objective evaluation
        },
      })
      return response.text ?? ''
    } catch (e) {
      console.warn(`Model ${model} failed:`, (e as Error).message)
      lastError = e as Error
    }
  }

  throw lastError ?? new Error('All models failed')
}

function extractJson(raw: string): unknown {
  const cleaned = raw.replace(/```json|```/g, '').trim()
  const match = cleaned.match(/\{[\s\S]*\}/)
  return JSON.parse(match ? match[0] : cleaned)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { resumeText, jobDescription } = body as {
      resumeText?: string
      jobDescription?: string
    }

    if (!resumeText || !jobDescription) {
      return Response.json({ error: 'Missing resume or job description' }, { status: 400 })
    }

    if (resumeText.length < 100) {
      return Response.json({ error: 'Resume is too short. Please provide at least 100 characters.' }, { status: 400 })
    }
    if (jobDescription.length < 100) {
      return Response.json({ error: 'Job description is too short. Please provide at least 100 characters.' }, { status: 400 })
    }
    if (resumeText.length > 15000 || jobDescription.length > 15000) {
      return Response.json({ error: 'Input is too long. Please limit each field to 15,000 characters.' }, { status: 400 })
    }

    const prompt = buildPrompt(resumeText, jobDescription)

    // Attempt 1
    let parsed: unknown
    try {
      parsed = extractJson(await callGemini(prompt))
    } catch {
      // JSON parse failed, retry
      try {
        parsed = extractJson(await callGemini(prompt, true))
      } catch {
        return Response.json({ error: 'The AI returned invalid data. Please try again.' }, { status: 422 })
      }
    }

    let result = analysisSchema.safeParse(parsed)

    if (!result.success) {
      // Validation failed, retry once
      console.warn('Zod validation failed, retrying:', result.error.issues)
      try {
        parsed = extractJson(await callGemini(prompt, true))
        result = analysisSchema.safeParse(parsed)
      } catch {
        return Response.json({ error: 'The AI returned invalid data. Please try again.' }, { status: 422 })
      }
    }

    if (!result.success) {
      console.error('Validation failed after retry:', result.error.issues)
      return Response.json({ error: 'The AI returned an unexpected format. Please try again.' }, { status: 422 })
    }

    // Double check matched keywords defensively on server:
    // Filter out any empty terms or obvious non-keywords
    const validatedData = result.data

    // Compute overallScore deterministically from category scores
    const overallScore = computeOverallScore(validatedData.breakdown)

    return Response.json({ ...validatedData, overallScore })
  } catch (err) {
    console.error('Analyze error:', err)
    return Response.json({ error: 'AI analysis failed. Check your API key or try again.' }, { status: 500 })
  }
}
