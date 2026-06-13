'use client'

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Search, ArrowRight, X } from "lucide-react"
import { tools, categories } from "@/data/tools"

interface Props {
  open: boolean
  onClose: () => void
}

export function SearchModal({ open, onClose }: Props) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState("")
  const [selectedIdx, setSelectedIdx] = useState(0)

  const results = tools.filter(t => {
    if (!query.trim()) return t.featured
    const q = query.toLowerCase()
    return t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
  }).slice(0, query.trim() ? 12 : 8)

  useEffect(() => {
    if (open) {
      setQuery("")
      setSelectedIdx(0)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  const navigate = useCallback((slug: string) => {
    onClose()
    router.push(`/tool/${slug}`)
  }, [router, onClose])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, results.length - 1)) }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)) }
    else if (e.key === "Enter" && results[selectedIdx]) { navigate(results[selectedIdx].slug) }
    else if (e.key === "Escape") onClose()
  }

  useEffect(() => {
    const el = listRef.current?.children[selectedIdx] as HTMLElement | undefined
    el?.scrollIntoView({ block: "nearest" })
  }, [selectedIdx])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[999] flex items-start justify-center pt-[15vh]" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-4 w-full max-w-lg rounded-2xl border border-card-border bg-surface shadow-2xl shadow-black/50">
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-card-border px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-soft" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIdx(0) }}
            onKeyDown={handleKeyDown}
            placeholder="Search tools..."
            className="flex-1 bg-transparent py-4 text-sm text-foreground placeholder:text-muted-soft focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-card-border bg-card-bg px-1.5 py-0.5 text-[10px] font-medium text-muted-soft">
            <span className="text-xs">&#8984;</span>K
          </kbd>
          <button onClick={onClose} className="shrink-0 rounded-md p-1 text-muted-soft hover:text-foreground hover:bg-card-bg transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[360px] overflow-y-auto p-2">
          {results.length > 0 ? (
            <div className="space-y-0.5">
              {results.map((tool, i) => {
                const cat = categories.find(c => c.id === tool.category)
                return (
                  <button
                    key={tool.id}
                    onClick={() => navigate(tool.slug)}
                    className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                      i === selectedIdx ? "bg-accent text-white" : "hover:bg-card-bg"
                    }`}
                  >
                    <span className="shrink-0 text-xl">{tool.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className={`text-sm font-medium truncate ${i === selectedIdx ? "text-white" : "text-foreground"}`}>
                        {tool.name}
                      </div>
                      <div className={`text-xs truncate ${i === selectedIdx ? "text-white/70" : "text-muted-soft"}`}>
                        {tool.description}
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                      {tool.featured && (
                        <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                          i === selectedIdx ? "bg-white/20 text-white" : "bg-accent/10 text-accent"
                        }`}>Top</span>
                      )}
                      {cat && (
                        <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${
                          i === selectedIdx ? "bg-white/20 text-white" : "bg-card-bg text-muted-soft border border-card-border"
                        }`}>{cat.name}</span>
                      )}
                    </div>
                    <ArrowRight size={14} className={`shrink-0 ${i === selectedIdx ? "text-white" : "text-muted-soft opacity-0 group-hover:opacity-100"}`} />
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="text-3xl">&#128269;</span>
              <p className="mt-3 text-sm font-medium text-muted">No tools found</p>
              <p className="mt-1 text-xs text-muted-soft">Try a different search term</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-card-border px-4 py-2.5">
          <div className="flex items-center justify-between text-[10px] text-muted-soft">
            <span className="flex items-center gap-2">
              <span><kbd className="rounded bg-card-bg px-1 py-0.5 font-medium">&#8593;&#8595;</kbd> Navigate</span>
              <span><kbd className="rounded bg-card-bg px-1 py-0.5 font-medium">&#8629;</kbd> Open</span>
            </span>
            <span>{results.length} {results.length === 1 ? "result" : "results"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
