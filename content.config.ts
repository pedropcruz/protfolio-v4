import { defineContentConfig, defineCollection, z } from '@nuxt/content'

const localizedString = z.object({
  en: z.string(),
  pt: z.string()
})

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        id: z.string(),
        title: localizedString,
        date: z.string(),
        category: z.string(),
        analytics: z.object({
          views: z.number(),
          reads: z.number(),
          avgTime: z.string(),
          shares: z.number()
        }).optional()
      })
    }),
    projects: defineCollection({
      type: 'page',
      source: 'projects/*.md',
      schema: z.object({
        displayId: z.string(),
        title: z.string(),
        tags: z.array(z.string()),
        description: localizedString,
        details: z.object({
          challenge: localizedString.optional(),
          solution: localizedString.optional(),
          stack: z.array(z.object({
            name: z.string(),
            reason: localizedString
          })),
          images: z.array(z.string())
        })
      })
    })
  }
})
