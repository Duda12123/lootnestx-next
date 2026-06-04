"use client"

import { useState, useMemo, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"
import { tools, categories } from "@/data/tools"
import { ToolCard } from "@/components/ToolCard"

function HomePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeCategory = searchParams.get("cat") || "all"
  const [query, setQuery] = useState("")


  const setCategory = useCallback((cat: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (cat === "all") params.delete("cat")
    else params.set("cat", cat)
    router.push(`/?${params.toString()}`, { scroll: false })
  }, [searchParams, router])

  const filtered = useMemo(() => {
    let result = tools
    if (activeCategory !== "all") result = result.filter(t => t.category === activeCategory)
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q))
    }
    return result
  }, [activeCategory, query])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-card-border">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-accent/3 blur-[120px]" />

        <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-20 sm:pb-20 sm:pt-28 lg:pt-32">
          <div className="text-center animate-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent-soft px-4 py-1.5 text-sm font-medium text-accent">
              <Sparkles size={16} />
              {tools.length} free tools — no sign-up required
            </span>

            <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Every tool you need,{" "}
              <span className="text-accent">right in your browser</span>
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-base text-muted sm:text-lg">
              Free online tools that run locally. No uploads, no accounts, no limits. Just tools that get things done — fast.
            </p>

            {/* Search */}
            <div className="mx-auto mt-8 max-w-md">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-soft" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search tools..."
                  className="w-full rounded-xl border border-card-border bg-card-bg py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-soft focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all"
                />
              </div>
            </div>

            {/* Quick links */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-soft">
              <span>Try:</span>
              {["calculator", "json-formatter", "qrcode", "image-compressor"].map(slug => (
                <Link key={slug} href={`/tool/${slug}`} className="text-accent hover:text-accent-light underline underline-offset-2 transition-colors">
                  {tools.find(t => t.slug === slug)?.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category pills */}
      <section className="border-b border-card-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-4 sm:justify-center scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`shrink-0 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                  activeCategory === cat.id
                    ? "bg-accent text-white shadow-sm shadow-accent/25"
                    : "border border-card-border bg-card-bg text-muted hover:border-accent/20 hover:text-foreground"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tool grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {filtered.length > 0 ? (
          <>
            <div className="mb-8 flex items-center gap-3">
              <h2 className="text-lg font-semibold">
                {categories.find(c => c.id === activeCategory)?.name}
              </h2>
              <span className="rounded-md bg-card-bg px-2 py-0.5 text-xs text-muted-soft border border-card-border">
                {filtered.length} tools
              </span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((tool, idx) => (
                <ToolCard key={tool.id} tool={tool} index={idx} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-card-border py-24 text-center">
            <span className="text-4xl">🤷</span>
            <p className="mt-4 text-lg font-medium text-muted">No tools found</p>
            <button onClick={() => { setQuery(""); setCategory("all"); }} className="mt-3 text-sm font-medium text-accent hover:text-accent-light transition-colors">
              Clear filters <ArrowRight size={14} className="inline ml-1" />
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

export function HomeContent() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh] text-white/60">Loading...</div>}>
      <HomePage />
    </Suspense>
  )
}
