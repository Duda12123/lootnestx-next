"use client";
import { useState, useMemo } from "react"
import { Copy } from "lucide-react"
import { diffWords, diffLines } from "diff"

export default function TextDiff() {
  const [left, setLeft] = useState(`The quick brown fox jumps over the lazy dog.
This is the original text.
It has several lines of content.
We will compare it with the modified version.`)
  const [right, setRight] = useState(`The quick brown fox jumped over the lazy cat.
This is the modified text.
It has several lines of updated content.
We will compare it with the original version.`)
  const [mode, setMode] = useState<"lines" | "words">("lines")

  const diffResult = useMemo(() => {
    return mode === "words" ? diffWords(left, right) : diffLines(left, right)
  }, [left, right, mode])

  const renderDiff = () => {
    return diffResult.map((part, i) => {
      let className = "text-muted-soft"
      let bg = ""
      if (part.added) { className = "text-success"; bg = "bg-success/10" }
      if (part.removed) { className = "text-danger"; bg = "bg-danger/10" }
      return <span key={i} className={`${className} ${bg}`}>{part.value}</span>
    })
  }

  return (
    <div className="mx-auto max-w-5xl px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Text Diff Checker</h1>
      <p className="text-muted mb-6">Compare two texts and see the differences highlighted.</p>

      <div className="flex gap-3 mb-4">
        <button onClick={() => setMode("lines")} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${mode === "lines" ? "bg-accent text-white" : "border border-card-border text-muted hover:text-foreground"}`}>Line Diff</button>
        <button onClick={() => setMode("words")} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${mode === "words" ? "bg-accent text-white" : "border border-card-border text-muted hover:text-foreground"}`}>Word Diff</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-semibold text-muted-soft uppercase">Original</label>
          <textarea value={left} onChange={(e) => setLeft(e.target.value)} rows={14}
            className="mt-1 w-full rounded-xl border border-card-border bg-surface p-4 text-sm font-mono text-foreground focus:border-accent/40 focus:outline-none resize-y" />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-muted-soft uppercase">Modified</label>
          <textarea value={right} onChange={(e) => setRight(e.target.value)} rows={14}
            className="mt-1 w-full rounded-xl border border-card-border bg-surface p-4 text-sm font-mono text-foreground focus:border-accent/40 focus:outline-none resize-y" />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-card-border bg-card-bg p-6">
        <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Differences</h3>
        <div className="rounded-xl border border-card-border bg-surface p-5 text-sm font-mono leading-relaxed whitespace-pre-wrap">
          {renderDiff()}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 flex gap-6 text-xs text-muted">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-danger/20 border border-danger/30" /> Removed: {diffResult.filter((p) => p.removed).length} chunks</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-success/20 border border-success/30" /> Added: {diffResult.filter((p) => p.added).length} chunks</span>
      </div>
    </div>
  )
}
