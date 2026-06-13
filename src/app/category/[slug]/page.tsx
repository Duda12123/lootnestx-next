import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { tools, categories } from "@/data/tools"
import { ToolCard } from "@/components/ToolCard"
import { JsonLd } from "@/components/JsonLd"
import {
  generateCollectionPageSchema,
  generateBreadcrumbSchema,
} from "@/lib/schema/tool-schema"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return categories.filter(c => c.id !== "all").map(c => ({ slug: c.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = categories.find(c => c.id === slug && c.id !== "all")
  if (!category) return { title: "Category Not Found" }
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lootnestx-next.vercel.app"

  return {
    title: `Free Online ${category.name} — No Sign-Up Required`,
    description: category.description,
    alternates: { canonical: `${baseUrl}/category/${slug}` },
    openGraph: {
      title: `Free Online ${category.name} — LootNestX`,
      description: category.description,
      url: `${baseUrl}/category/${slug}`,
    },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const category = categories.find(c => c.id === slug && c.id !== "all")
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lootnestx-next.vercel.app"

  if (!category) notFound()

  const categoryTools = tools
    .filter(t => t.category === category.id && !t.comingSoon)
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-soft">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <span className="text-foreground">{category.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Free Online {category.name} — No Sign-Up Required
        </h1>
        <p className="mt-3 max-w-3xl text-muted leading-relaxed">
          {category.description}
        </p>
        <p className="mt-1 text-sm text-muted-soft">
          {categoryTools.length} free tools &mdash; all processed locally in your browser
        </p>
      </div>

      {/* Tool Grid */}
      {categoryTools.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {categoryTools.map((tool, idx) => (
            <ToolCard key={tool.id} tool={tool} index={idx} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <span className="text-5xl">🔧</span>
          <h2 className="mt-4 text-xl font-semibold">No tools in this category yet</h2>
          <p className="mt-2 text-muted">We&apos;re working on adding more tools. Check back soon!</p>
        </div>
      )}

      {/* Long description for SEO */}
      {category.longDescription && (
        <section className="mt-16 border-t border-card-border pt-12">
          <div className="max-w-3xl">
            <h2 className="text-xl font-semibold tracking-tight mb-3">
              About Our {category.name}
            </h2>
            <p className="text-muted leading-relaxed">
              {category.longDescription}
            </p>
          </div>
        </section>
      )}

      {/* Browse other categories */}
      <section className="mt-12 border-t border-card-border pt-10">
        <h2 className="text-lg font-semibold mb-4">Browse Other Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories
            .filter(c => c.id !== "all" && c.id !== category.id)
            .map(c => (
              <Link
                key={c.id}
                href={`/category/${c.id}`}
                className="rounded-lg border border-card-border bg-card-bg px-4 py-2 text-sm font-medium text-muted hover:border-accent/20 hover:text-foreground transition-all"
              >
                {c.name}
              </Link>
            ))}
        </div>
      </section>

      {/* JSON-LD: CollectionPage + BreadcrumbList */}
      <JsonLd data={[
        generateCollectionPageSchema({
          name: `Free Online ${category.name} — LootNestX`,
          description: category.longDescription || category.description,
          url: `${baseUrl}/category/${category.id}`,
          itemCount: categoryTools.length,
          itemList: categoryTools.map(t => ({
            name: t.name,
            url: `${baseUrl}/tool/${t.slug}`,
          })),
        }),
        generateBreadcrumbSchema([
          { name: "Home", url: baseUrl },
          { name: category.name, url: `${baseUrl}/category/${category.id}` },
        ]),
      ]} />
    </div>
  )
}
