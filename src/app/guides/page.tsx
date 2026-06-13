import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Guides — LootNestX",
  description: "In-depth guides and tutorials to help you get the most out of LootNestX's free online tools. Learn how to compress images, format JSON, encode data, and more.",
}

const guides = [
  {
    slug: "compress-images-guide",
    title: "How to Compress Images for the Web — The Complete Guide",
    description: "Learn how to reduce image file sizes without losing quality. Covers JPEG, PNG, WebP, and AVIF compression techniques for faster websites.",
    date: "June 2026",
    readTime: "5 min read",
  },
  {
    slug: "json-formatter-guide",
    title: "How to Format and Validate JSON — A Developer's Guide",
    description: "Master JSON formatting, validation, and debugging. Learn how to read nested JSON, spot common errors, and format data for APIs and configs.",
    date: "June 2026",
    readTime: "6 min read",
  },
  {
    slug: "base64-encoding-guide",
    title: "Base64 Encoding Explained — When and How to Use It",
    description: "Understand what Base64 encoding is, why it exists, and when you should (and shouldn't) use it. Covers images, data URIs, and API authentication.",
    date: "June 2026",
    readTime: "5 min read",
  },
]

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Free Tool Guides & Tutorials — Learn to Use Online Tools Like a Pro</h1>
      <p className="text-muted mb-12">In-depth tutorials to help you get more from your tools.</p>

      <div className="space-y-6">
        {guides.map(guide => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="block rounded-xl border border-card-border bg-card-bg p-6 hover:border-accent/20 transition-colors"
          >
            <h2 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
              {guide.title}
            </h2>
            <p className="mt-2 text-muted text-sm leading-relaxed">{guide.description}</p>
            <div className="mt-3 flex items-center gap-3 text-xs text-muted-soft">
              <span>{guide.date}</span>
              <span>·</span>
              <span>{guide.readTime}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
