import type { MetadataRoute } from "next"
import { tools, categories } from "@/data/tools"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lootnestx.com"

  const baseDate = new Date("2026-06-08")
  // Stagger tool-groups so every category has a distinct lastmod
  // This signals Google that different sections update on different cadences
  const categoryDates: Record<string, Date> = {}
  categories.filter(c => c.id !== "all").forEach((c, i) => {
    categoryDates[c.id] = new Date(Date.UTC(2026, 5, 8 - i * 1))
  })

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date("2026-06-01"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/guides`, lastModified: new Date("2026-06-05"), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/guides/compress-images-guide`, lastModified: new Date("2026-06-05"), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/guides/json-formatter-guide`, lastModified: new Date("2026-06-05"), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/guides/base64-encoding-guide`, lastModified: new Date("2026-06-05"), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date("2026-06-01"), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date("2026-06-01"), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/contact`, lastModified: new Date("2026-06-01"), changeFrequency: "monthly", priority: 0.3 },
  ]

  // Category pages — just created (today)
  const categoryPages: MetadataRoute.Sitemap = categories
    .filter(c => c.id !== "all")
    .map(c => ({
      url: `${baseUrl}/category/${c.id}`,
      lastModified: baseDate,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }))

  // Popular tools: crawled more often, newer lastmod
  const highFrequencySlugs = new Set([
    "calculator", "json-formatter", "base64", "qrcode", "image-compressor",
    "password", "url-encoder", "timestamp", "markdown", "uuid-generator",
    "bmi-calculator", "tip-calculator", "currency-converter", "mortgage-calc",
  ])

  const toolPages: MetadataRoute.Sitemap = tools
    .filter(t => !t.comingSoon)
    .map(t => {
      const isHighFreq = highFrequencySlugs.has(t.slug)
      const isFeatured = t.featured
      const lastmod = categoryDates[t.category] || baseDate

      return {
        url: `${baseUrl}/tool/${t.slug}`,
        lastModified: isFeatured ? baseDate : lastmod,
        changeFrequency: isHighFreq ? "weekly" as const : "monthly" as const,
        priority: isFeatured ? 0.9 : (isHighFreq ? 0.85 : 0.8),
      }
    })

  return [...staticPages, ...categoryPages, ...toolPages]
}
