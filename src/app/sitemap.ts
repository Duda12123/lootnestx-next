import type { MetadataRoute } from "next"
import { tools } from "@/data/tools"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://lootnestx.com"

  const toolPages: MetadataRoute.Sitemap = tools
    .filter(t => !t.comingSoon)
    .map(t => ({
      url: `${baseUrl}/tool/${t.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: t.featured ? 0.9 : 0.8,
    }))

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    ...toolPages,
  ]
}
