import { z } from 'zod'

const keywordCategoryEnum = z.enum([
  'Programming & frameworks',
  'Tools & platforms',
  'Methods & concepts',
  'Education & certifications',
])

const importanceEnum = z.enum(['high', 'medium', 'low'])

const breakdownCategoryEnum = z.enum([
  'Skills',
  'Experience',
  'Keywords',
  'Clarity',
])

const priorityEnum = z.enum(['high', 'medium', 'low'])

export const analysisSchema = z.object({
  overallScore: z.number().min(0).max(100),
  summary: z.string().min(1),
  breakdown: z
    .array(
      z.object({
        category: breakdownCategoryEnum,
        score: z.number().min(0).max(100),
        explanation: z.string().min(1),
      })
    )
    .length(4),
  keywords: z.object({
    matched: z
      .array(
        z.object({
          term: z.string().min(1).max(60),
          category: keywordCategoryEnum,
        })
      )
      .max(15),
    missing: z
      .array(
        z.object({
          term: z.string().min(1).max(60),
          category: keywordCategoryEnum,
          importance: importanceEnum,
          reason: z.string().min(1),
        })
      )
      .max(12),
  }),
  tips: z
    .array(
      z.object({
        priority: priorityEnum,
        title: z.string().min(1),
        detail: z.string().min(1),
        resumeLine: z.string().nullable(),
      })
    )
    .max(6),
})

export type AnalysisResult = z.infer<typeof analysisSchema>
export type KeywordCategory = z.infer<typeof keywordCategoryEnum>
export type Importance = z.infer<typeof importanceEnum>
export type Priority = z.infer<typeof priorityEnum>
export type BreakdownCategory = z.infer<typeof breakdownCategoryEnum>
