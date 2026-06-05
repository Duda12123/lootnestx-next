import type { Metadata } from "next"
import Link from "next/link"
import { tools } from "@/data/tools"
import { ToolRenderer } from "@/components/ToolRegistry"
import { ToolReactions } from "@/components/ToolReactions"
import { PwaInstallButton } from "@/components/PwaInstallButton"
import { JsonLd } from "@/components/JsonLd"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return tools.filter(t => !t.comingSoon).map(t => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = tools.find(t => t.slug === slug)
  if (!tool) return { title: "Tool Not Found" }
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lootnestx-next.vercel.app"

  return {
    title: tool.name,
    description: tool.description,
    openGraph: {
      title: `${tool.name} — ToolNestX`,
      description: tool.description,
      url: `${baseUrl}/tool/${slug}`,
    },
    alternates: { canonical: `${baseUrl}/tool/${slug}` },
    manifest: `/api/manifest/${slug}`,
    other: {
      "application-name": tool.name,
      "apple-mobile-web-app-title": tool.name,
    },
  }
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params
  const tool = tools.find(t => t.slug === slug)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lootnestx-next.vercel.app"

  if (!tool) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <span className="text-5xl">🔧</span>
        <h1 className="mt-4 text-2xl font-bold">Tool Not Found</h1>
        <p className="mt-2 text-muted">The tool you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-soft">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/?cat=${tool.category}`} className="hover:text-foreground transition-colors capitalize">{tool.category}</Link>
        <span>/</span>
        <span className="text-foreground">{tool.name}</span>
      </nav>

      {/* Tool header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="text-3xl">{tool.icon}</span>
          <h1 className="text-2xl sm:text-3xl font-bold">{tool.name}</h1>
          <PwaInstallButton />
        </div>
        <p className="text-muted max-w-2xl">{tool.description}</p>
      </div>

      {/* Tool content */}
      <div className="rounded-xl border border-card-border bg-card-bg p-6 sm:p-8">
        <ToolRenderer slug={slug} name={tool.name} />
      </div>

      {/* Reactions */}
      <ToolReactions toolId={slug} toolName={tool.name} />

      {/* SEO content sections */}
      <div className="mt-8 sm:mt-12 max-w-3xl space-y-10">
        {/* About */}
        {tool.longDescription && (
          <section>
            <h2 className="text-lg font-semibold mb-3">About {tool.name}</h2>
            <p className="text-muted leading-relaxed text-sm sm:text-base">
              {tool.longDescription}
            </p>
          </section>
        )}

        {/* How To Use */}
        {tool.howTo && tool.howTo.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">How to Use {tool.name}</h2>
            <ol className="space-y-3">
              {tool.howTo.map((step, i) => (
                <li key={i} className="flex gap-3 text-muted text-sm sm:text-base leading-relaxed">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Use Cases */}
        {tool.useCases && tool.useCases.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">When to Use {tool.name}</h2>
            <ul className="space-y-2">
              {tool.useCases.map((uc, i) => (
                <li key={i} className="flex items-start gap-3 text-muted text-sm sm:text-base leading-relaxed">
                  <span className="text-accent mt-0.5">▸</span>
                  <span>{uc}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Tips */}
        {tool.tips && tool.tips.length > 0 && (
          <section className="rounded-xl border border-accent/10 bg-accent/3 p-5 sm:p-6">
            <h2 className="text-lg font-semibold mb-3">Pro Tips</h2>
            <ul className="space-y-2">
              {tool.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-muted text-sm sm:text-base leading-relaxed">
                  <span className="text-accent text-lg mt-0.5">💡</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* FAQ */}
        {tool.faq && tool.faq.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
            <dl className="space-y-4">
              {tool.faq.map((item, i) => (
                <div key={i} className="rounded-lg border border-card-border bg-card-bg/50 p-4">
                  <dt className="text-sm sm:text-base font-medium text-foreground mb-1.5">{item.q}</dt>
                  <dd className="text-sm text-muted leading-relaxed">{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>

      {/* JSON-LD */}
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": tool.name,
        "url": `${baseUrl}/tool/${tool.slug}`,
        "description": tool.description,
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "All",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      }} />
    </div>
  )
}
