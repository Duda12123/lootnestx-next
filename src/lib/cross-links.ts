/**
 * Cross-linking map: tool → relevant guide + curated related tools
 * Used to render Guide Callout Box and enrich Related Tools sections.
 */
export interface GuideLink {
  href: string
  title: string
  description: string
}

export interface ToolCrossLink {
  slug: string
  name: string
  description: string
}

export interface CrossLinkEntry {
  guide?: GuideLink
  related?: ToolCrossLink[]
}

/**
 * Tools with relevant guides — sparse map (only tools that have a dedicated guide)
 */
const GUIDE_MAP: Record<string, GuideLink> = {
  "json-formatter": {
    href: "/guides/json-formatter-guide",
    title: "How to Format and Validate JSON — A Developer's Guide",
    description: "Learn to spot trailing commas, fix bracket mismatches, and master JSON formatting.",
  },
  "image-compressor": {
    href: "/guides/compress-images-guide",
    title: "How to Compress Images for the Web — The Complete Guide",
    description: "JPEG vs PNG vs WebP vs AVIF — pick the right format and compress images for faster page loads.",
  },
  "base64": {
    href: "/guides/base64-encoding-guide",
    title: "Base64 Encoding Explained — When and How to Use It",
    description: "Understand what Base64 encoding is, why it exists, and when you should (and shouldn't) use it.",
  },
}

// Tools that also benefit from the guides (secondary coverage)
const GUIDE_PLUS_MAP: Record<string, string> = {
  // Compress-images-guide also covers these image tools
  "image-converter": "image-compressor",
  "image-resizer": "image-compressor",
  "image-cropper": "image-compressor",
  "image-watermark": "image-compressor",
  "image-to-pdf": "image-compressor",
  "screenshot-tool": "image-compressor",
  "meme-creator": "image-compressor",
  // Json-formatter-guide also covers data format tools
  "sql-formatter": "json-formatter",
  "xml-formatter": "json-formatter",
  "csv-json": "json-formatter",
  "json-diff": "json-formatter",
  "json-to-yaml": "json-formatter",
  "yaml-formatter": "json-formatter",
  // Base64 guide also covers encoding tools
  "url-encoder": "base64",
  "html-entity": "base64",
  "image-to-base64": "base64",
}

/**
 * Get the guide callout for a given tool (if one exists)
 */
export function getGuideForTool(slug: string): GuideLink | null {
  if (GUIDE_MAP[slug]) return GUIDE_MAP[slug]
  const parent = GUIDE_PLUS_MAP[slug]
  if (parent && GUIDE_MAP[parent]) return GUIDE_MAP[parent]
  return null
}
