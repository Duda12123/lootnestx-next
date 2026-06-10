"use client"

import { useState, useMemo, useCallback, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, ArrowRight } from "lucide-react"
import Link from "next/link"
import { tools, categories } from "@/data/tools"
import { ToolCard } from "@/components/ToolCard"

const BATCH_SIZE = 15

// Per-category color palette
const CAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  encode:    { bg: '#3b82f618', text: '#60a5fa', border: '#3b82f635' },
  formatters:{ bg: '#a855f718', text: '#c084fc', border: '#a855f735' },
  generators:{ bg: '#22c55e18', text: '#4ade80', border: '#22c55e35' },
  css:       { bg: '#ec489918', text: '#f472b6', border: '#ec489935' },
  image:     { bg: '#f9731618', text: '#fb923c', border: '#f9731635' },
  text:      { bg: '#14b8a618', text: '#2dd4bf', border: '#14b8a635' },
  dev:       { bg: '#6366f118', text: '#818cf8', border: '#6366f135' },
  utilities: { bg: '#f59e0b18', text: '#fbbf24', border: '#f59e0b35' },
  audio:     { bg: '#ef444418', text: '#f87171', border: '#ef444435' },
  fun:       { bg: '#10b98118', text: '#34d399', border: '#10b98135' },
}

export function HomeContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeCategory = searchParams.get("cat") || "all"
  const [query, setQuery] = useState("")
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const setCategory = useCallback((cat: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (cat === "all") params.delete("cat")
    else params.set("cat", cat)
    router.push(`/?${params.toString()}`, { scroll: false })
  }, [searchParams, router])

  const filtered = useMemo(() => {
    let result = tools
    if (activeCategory !== "all") result = result.filter((t) => t.category === activeCategory)
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      )
    }
    return result
  }, [activeCategory, query])

  // Reset visible count when filtered list changes
  const filteredLen = filtered.length
  useEffect(() => {
    setVisibleCount(Math.min(BATCH_SIZE, filteredLen))
  }, [filteredLen])

  // IntersectionObserver — lazy-load tool cards in chunks below the fold
  useEffect(() => {
    if (visibleCount >= filteredLen) {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
      return
    }

    const sentinel = sentinelRef.current
    if (!sentinel) return

    if (observerRef.current) observerRef.current.disconnect()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filteredLen))
        }
      },
      { rootMargin: "300px" }
    )

    observerRef.current.observe(sentinel)

    return () => {
      observerRef.current?.disconnect()
      observerRef.current = null
    }
  }, [visibleCount, filteredLen])

  const visibleTools = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount])

  return (
    <>
      {/* Search — shown below hero when client renders */}
      <section className="mx-auto max-w-4xl px-4 pb-10 sm:pb-14">
        <div className="mx-auto max-w-md">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-soft" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 80+ tools..."
              className="w-full rounded-xl border border-card-border bg-card-bg py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-soft focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center rounded bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted-soft border border-card-border">
              &#8984;K
            </kbd>
          </div>
        </div>

        {/* Quick links */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-soft">
          <span>Try:</span>
          {["calculator", "json-formatter", "qrcode", "image-compressor"].map((slug) => (
            <Link
              key={slug}
              href={`/tool/${slug}`}
              className="text-accent hover:text-accent-light underline underline-offset-2 transition-colors"
            >
              {tools.find((t) => t.slug === slug)?.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Category pills — interactive */}
      <section className="border-b border-card-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3 sm:justify-center scrollbar-hide">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id
              const cc = CAT_COLORS[cat.id] || CAT_COLORS.encode
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: isActive ? cc.text : cc.bg,
                    color: isActive ? '#09090b' : cc.text,
                    border: `1px solid ${cc.border}`,
                    boxShadow: isActive ? `0 1px 8px ${cc.text}30` : 'none',
                  }}
                >
                  {cat.name}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Tool grid — chunked rendering */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        {filtered.length > 0 ? (
          <>
            <div className="mb-8 flex items-center gap-3">
              <h2 className="text-lg font-semibold">
                {categories.find((c) => c.id === activeCategory)?.name}
              </h2>
              <span className="rounded-md bg-card-bg px-2 py-0.5 text-xs text-muted-soft border border-card-border">
                {filtered.length} tools
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
              {visibleTools.map((tool, idx) => (
                <ToolCard key={tool.id} tool={tool} index={idx} />
              ))}
            </div>
            {/* Sentinel — triggers next batch when scrolled into view */}
            {visibleCount < filtered.length && (
              <div ref={sentinelRef} className="col-span-full h-1" aria-hidden="true" />
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-card-border py-24 text-center">
            <span className="text-4xl">&#129335;</span>
            <p className="mt-4 text-lg font-medium text-muted">No tools found</p>
            <button
              onClick={() => {
                setQuery("")
                setCategory("all")
              }}
              className="mt-3 text-sm font-medium text-accent hover:text-accent-light transition-colors"
            >
              Clear filters <ArrowRight size={14} className="inline ml-1" />
            </button>
          </div>
        )}
      </section>
    </>
  )
}
