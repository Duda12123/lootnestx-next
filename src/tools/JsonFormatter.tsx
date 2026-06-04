"use client";
import { useState, useMemo } from "react"

export default function JsonFormatter() {
  const [input, setInput] = useState("")
  const [indent, setIndent] = useState(2)
  const [sortKeys, setSortKeys] = useState(false)

  const result = useMemo(() => {
    if (!input.trim()) return null
    try {
      let parsed = JSON.parse(input)
      if (sortKeys) parsed = sortObject(parsed)
      return {
        formatted: JSON.stringify(parsed, null, indent),
        valid: true,
        size: JSON.stringify(parsed).length,
        formattedSize: JSON.stringify(parsed, null, indent).length,
      }
    } catch {
      return { valid: false, error: "Invalid JSON — check your syntax" }
    }
  }, [input, indent, sortKeys])

  const copy = (text: string) => navigator.clipboard.writeText(text)

  return (
    <div className="mx-auto max-w-4xl px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">JSON Formatter</h1>
      <p className="text-muted mb-6">Format, validate, and beautify your JSON data.</p>

      <div className="space-y-4">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-card-border bg-card-bg px-5 py-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-soft">Indent:</label>
            <select value={indent} onChange={(e) => setIndent(Number(e.target.value))}
              className="rounded-lg border border-card-border bg-surface px-3 py-1.5 text-sm text-foreground">
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
            <input type="checkbox" checked={sortKeys} onChange={(e) => setSortKeys(e.target.checked)}
              className="rounded accent-accent" />
            Sort keys
          </label>
        </div>

        {/* Input */}
        <div className="rounded-2xl border border-card-border bg-card-bg p-5">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14}
            className="w-full rounded-xl border border-card-border bg-surface p-4 text-sm font-mono text-foreground placeholder:text-muted-soft focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/10 resize-y"
            placeholder='Paste your JSON here... {"key": "value"}' />
        </div>

        {result && (
          <div className="rounded-2xl border border-card-border bg-card-bg p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-semibold">Output</h3>
                {result.valid ? (
                  <span className="rounded-md bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">Valid ✓</span>
                ) : (
                  <span className="rounded-md bg-danger/10 px-2 py-0.5 text-[10px] font-semibold text-danger">
                    {result.error}
                  </span>
                )}
                {result.valid && "size" in result && (
                  <span className="text-[10px] text-muted-soft">
                    {result.formattedSize} bytes
                  </span>
                )}
              </div>
              {"formatted" in result && (
                <div className="flex gap-2">
                  <button onClick={() => copy(result.formatted!)} className="rounded-lg border border-card-border px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground hover:bg-surface transition-colors">
                    Copy
                  </button>
                  <button onClick={() => setInput(result.formatted!)} className="rounded-lg border border-card-border px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground hover:bg-surface transition-colors">
                    Edit
                  </button>
                </div>
              )}
            </div>
            {"formatted" in result && (
              <pre className="rounded-xl border border-accent/10 bg-accent-soft p-4 text-sm font-mono text-foreground whitespace-pre overflow-auto max-h-[500px]">
                {result.formatted}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function sortObject(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(sortObject)
  if (obj && typeof obj === "object") {
    return Object.keys(obj as Record<string, unknown>)
      .sort()
      .reduce((acc, k) => {
        ;(acc as Record<string, unknown>)[k] = sortObject((obj as Record<string, unknown>)[k])
        return acc
      }, {} as Record<string, unknown>)
  }
  return obj
}
