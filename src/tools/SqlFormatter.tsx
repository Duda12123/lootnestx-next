"use client";
import { useState, useEffect } from "react"
import { Copy, Trash2 } from "lucide-react"

export default function SqlFormatter() {
  const [input, setInput] = useState("SELECT u.id, u.name, COUNT(o.id) as order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.status = 'active' AND u.created_at > '2024-01-01' GROUP BY u.id, u.name HAVING COUNT(o.id) > 0 ORDER BY order_count DESC LIMIT 10")
  const [output, setOutput] = useState("")
  const [indent, setIndent] = useState(2)
  const [uppercase, setUppercase] = useState(true)
  const [Formatter, setFormatter] = useState<any>(null)

  useEffect(() => {
    import("sql-formatter").then((m) => setFormatter(m))
  }, [])

  const format = () => {
    if (!Formatter || !input.trim()) return
    try {
      const result = Formatter.format(input, {
        language: "sql",
        tabWidth: indent,
        keywordCase: uppercase ? "upper" : "lower",
        linesBetweenQueries: 1,
      })
      setOutput(result)
    } catch (e) {
      setOutput("/* Formatting error: " + (e as Error).message + " */")
    }
  }

  const minify = () => {
    setOutput(input.replace(/\s+/g, " ").trim())
  }

  return (
    <div className="mx-auto max-w-3xl px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">SQL Formatter</h1>
      <p className="text-muted mb-6">Format SQL queries with proper indentation and keyword casing.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-[10px] font-semibold text-muted-soft uppercase">Indent</label>
            <select value={indent} onChange={(e) => setIndent(Number(e.target.value))}
              className="mt-1 rounded-lg border border-card-border bg-surface px-3 py-2 text-sm text-foreground">
              {[2, 4].map((n) => (<option key={n} value={n}>{n} spaces</option>))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-xs text-muted cursor-pointer select-none pb-2">
            <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="rounded accent-accent" /> Uppercase keywords
          </label>
          <button onClick={format} className="rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-dark transition-colors">Format</button>
          <button onClick={minify} className="rounded-xl border border-card-border px-5 py-2.5 text-sm font-semibold text-muted hover:text-foreground transition-colors">Minify</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-semibold text-muted-soft uppercase">Input</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14}
              className="mt-1 w-full rounded-xl border border-card-border bg-surface p-4 text-sm font-mono text-foreground focus:border-accent/40 focus:outline-none resize-y"
              placeholder="Paste SQL..." />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-semibold text-muted-soft uppercase">Output</label>
              {output && (
                <button onClick={() => navigator.clipboard.writeText(output)}
                  className="flex items-center gap-1 text-xs text-accent hover:text-accent-light font-medium">
                  <Copy size={12} /> Copy
                </button>
              )}
            </div>
            <textarea value={output} readOnly rows={14}
              className="mt-0 w-full rounded-xl border border-card-border bg-surface p-4 text-sm font-mono text-foreground resize-y"
              placeholder="Formatted SQL..." />
          </div>
        </div>
      </div>
    </div>
  )
}
