import type { Metadata } from "next"
import { tools } from "@/data/tools"
import { ToolRenderer } from "@/components/ToolRegistry"
import { ToolReactions } from "@/components/ToolReactions"
import { PwaInstallButton } from "@/components/PwaInstallButton"

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

  return {
    title: tool.name,
    description: tool.description,
    openGraph: {
      title: `${tool.name} — ToolNest`,
      description: tool.description,
      url: `https://lootnestx.com/tool/${slug}`,
    },
    alternates: { canonical: `https://lootnestx.com/tool/${slug}` },
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
        <a href="/" className="hover:text-foreground transition-colors">Home</a>
        <span>/</span>
        <a href={`/?cat=${tool.category}`} className="hover:text-foreground transition-colors capitalize">{tool.category}</a>
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
      <ToolReactions toolId={slug} />
    </div>
  )
}
