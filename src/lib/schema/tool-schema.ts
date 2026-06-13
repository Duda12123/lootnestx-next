/**
 * SEO Schema generators for LootNestX tool pages.
 * Produces JSON-LD structured data for rich SERP features.
 */

/** Generates SoftwareApplication schema with rating/offer signals */
export interface SoftwareAppParams {
  name: string
  description: string
  url: string
  category: string
  features: string[]
}

export function generateSoftwareApplicationSchema({
  name,
  description,
  url,
  category,
  features,
}: SoftwareAppParams) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    applicationCategory: "UtilityApplication",
    applicationSubCategory: category,
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: features.join(", "),
    browserRequirements: "Requires JavaScript",
    permissions: "no special permissions required",
  }
}

/** Generates FAQPage schema for Google FAQ rich results */
export interface FAQ {
  question: string
  answer: string
}

export function generateFAQPageSchema(faqs: FAQ[] | undefined) {
  if (!faqs || faqs.length === 0) return null
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer.substring(0, 300), // Google prefers concise answers
      },
    })),
  }
}

/** Generates HowTo schema for step-by-step rich results */
export interface HowToStep {
  position: number
  name: string
  text: string
}

export function generateHowToSchema(
  name: string,
  description: string,
  steps: HowToStep[] | undefined,
  totalTime: string = "PT2M"
) {
  if (!steps || steps.length === 0) return null
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    totalTime,
    step: steps.map((step) => ({
      "@type": "HowToStep",
      position: step.position,
      name: step.name,
      text: step.text.substring(0, 300),
    })),
  }
}

/** Generates BreadcrumbList schema */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/** Generates CollectionPage schema for category landing pages */
export function generateCollectionPageSchema(params: {
  name: string
  description: string
  url: string
  itemCount: number
  itemList: { name: string; url: string }[]
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: params.name,
    description: params.description,
    url: params.url,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: params.itemCount,
      itemListElement: params.itemList.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "SoftwareApplication",
          name: item.name,
          url: item.url,
          applicationCategory: "UtilityApplication",
          operatingSystem: "All",
        },
      })),
    },
  }
}

/** Generates Article schema for guide/blog pages */
export function generateArticleSchema(params: {
  headline: string
  description: string
  url: string
  datePublished?: string
  dateModified?: string
  authorName?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.headline,
    description: params.description,
    url: params.url,
    datePublished: params.datePublished || "2026-06-01",
    dateModified: params.dateModified || params.datePublished || "2026-06-01",
    author: {
      "@type": "Organization",
      name: params.authorName || "LootNestX",
    },
    publisher: {
      "@type": "Organization",
      name: "LootNestX",
      url: params.url ? new URL(params.url).origin : "https://lootnestx.com",
    },
  }
}
