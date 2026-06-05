import type { MetadataRoute } from "next"
import { tools } from "@/data/tools"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lootnestx-next.vercel.app"

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/guides`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/guides/compress-images-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/guides/json-formatter-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/guides/base64-encoding-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ]

  // Popular tools: crawled more often
  const highFrequencySlugs = new Set([
    "calculator", "json-formatter", "base64", "qrcode", "image-compressor",
    "password", "url-encoder", "timestamp", "markdown", "uuid-generator",
    "bmi-calculator", "tip-calculator", "currency-converter", "mortgage-calc",
  ])

  const toolPages: MetadataRoute.Sitemap = tools
    .filter(t => !t.comingSoon)
    .map(t => ({
      url: `${baseUrl}/tool/${t.slug}`,
      lastModified: new Date(),
      changeFrequency: (highFrequencySlugs.has(t.slug) ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: t.featured ? 0.9 : (highFrequencySlugs.has(t.slug) ? 0.85 : 0.8),
    }))

  return [...staticPages, ...toolPages]
}
