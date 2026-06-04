"use client";
import { useState } from "react"
import { Copy, Trash2, ArrowUpDown, Shuffle } from "lucide-react"

type Action = "sort" | "reverse" | "shuffle" | "dedupe" | "alphabetical" | "number-sort"

export default function ListTools() {
  const [input, setInput] = useState("apple\nbanana\ncherry\nbanana\ngrape\napple\nkiwi\nmango")
  const [output, setOutput] = useState("")
  const [copied, setCopied] = useState(false)

  const actions: { key: Action; label: string; icon: React.ReactNode }[] = [
    { key: "sort", label: "Sort A→Z", icon: <ArrowUpDown size={14} /> },
    { key: "reverse", label: "Reverse", icon: <ArrowUpDown size={14} className="rotate-180" /> },
    { key: "shuffle", label: "Shuffle", icon: <Shuffle size={14} /> },
    { key: "dedupe", label: "Remove Duplicates", icon: <Trash2 size={14} /> },
    { key: "alphabetical", label: "Sort by Length", icon: <ArrowUpDown size={14} /> },
    { key: "number-sort", label: "Sort Numeric", icon: <ArrowUpDown size={14} /> },
  ]

  const run = (action: Action) => {
    let lines = input.split("\n").filter((l) => l.trim() !== "" || l === "")
    // keep empty for mapping but not for display
    lines = lines.length > 0 ? lines : input.split("\n")
    switch (action) {
      case "sort": lines.sort(); break
      case "reverse": lines.reverse(); break
      case "shuffle": lines = lines.sort(() => Math.random() - 0.5); break
      case "dedupe": lines = [...new Set(lines)]; break
      case "alphabetical": lines.sort((a, b) => a.length - b.length || a.localeCompare(b)); break
      case "number-sort": lines.sort((a, b) => Number(a) - Number(b)); break
    }
    setOutput(lines.join("\n"))
  }

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="mx-auto max-w-2xl px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">List Tools</h1>
      <p className="text-muted mb-6">Sort, shuffle, deduplicate, and manipulate text lists.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          {actions.map((a) => (
            <button key={a.key} onClick={() => run(a.key)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-card-border px-3 py-2 text-xs font-semibold text-muted hover:text-foreground hover:bg-surface transition-all">
              {a.icon} {a.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-semibold text-muted-soft uppercase">Input</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={12}
              className="mt-1 w-full rounded-xl border border-card-border bg-surface p-4 text-sm font-mono text-foreground focus:border-accent/40 focus:outline-none resize-y"
              placeholder="One item per line..." />
            <div className="mt-1 text-xs text-muted">{input.split("\n").filter(Boolean).length} items</div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-semibold text-muted-soft uppercase">Output</label>
              {output && (
                <button onClick={copy} className="flex items-center gap-1 text-xs text-accent hover:text-accent-light font-medium transition-colors">
                  <Copy size={12} /> {copied ? "Copied!" : "Copy"}
                </button>
              )}
            </div>
            <textarea value={output} readOnly rows={12}
              className="mt-0 w-full rounded-xl border border-card-border bg-surface p-4 text-sm font-mono text-foreground resize-y"
              placeholder="Result appears here..." />
            <div className="mt-1 text-xs text-muted">{output ? output.split("\n").filter(Boolean).length + " items" : ""}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
