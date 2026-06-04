"use client";
import { useState, useMemo } from "react"
import { Copy } from "lucide-react"

const FLAGS = [
  { key: "g", label: "g", desc: "Global" },
  { key: "i", label: "i", desc: "Case insensitive" },
  { key: "m", label: "m", desc: "Multiline" },
  { key: "s", label: "s", desc: "Dot all" },
]

const SAMPLES: Record<string, string> = {
  email: `contact@example.com
support@lootnestx.com
invalid-email
hello@test.co.uk`,
  url: `https://example.com
http://localhost:3000/path?q=1
ftp://old.server.com
www.naked-domain.com`,
  phone: `+1 (555) 123-4567
555.123.4567
555-123-4567
(555) 123-4567`,
}

export default function RegexTester() {
  const [pattern, setPattern] = useState("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}")
  const [flags, setFlags] = useState<string[]>(["g", "i"])
  const [text, setText] = useState(SAMPLES.email)
  const [sample, setSample] = useState("email")
  const [error, setError] = useState("")

  const matches = useMemo(() => {
    setError("")
    if (!pattern.trim()) return []
    try {
      const re = new RegExp(pattern, flags.join(""))
      const results: { index: number; text: string; groups?: Record<string, string> }[] = []
      let m: RegExpExecArray | null
      while ((m = re.exec(text)) !== null) {
        results.push({ index: m.index, text: m[0], groups: m.groups ? { ...m.groups } : undefined })
        if (!flags.includes("g")) break
        if (m[0].length === 0) re.lastIndex++ // prevent infinite loop
      }
      return results
    } catch (e) {
      setError((e as Error).message)
      return []
    }
  }, [pattern, text, flags])

  const toggleFlag = (f: string) => {
    setFlags((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f])
  }

  const highlightText = () => {
    if (matches.length === 0 || error) return text
    let result = ""
    let last = 0
    for (const m of matches) {
      result += escapeHtml(text.slice(last, m.index))
      result += `<mark class="bg-accent/30 text-accent rounded px-0.5">${escapeHtml(m.text)}</mark>`
      last = m.index + m.text.length
    }
    result += escapeHtml(text.slice(last))
    return result
  }

  const loadSample = (key: string) => {
    setSample(key)
    setText(SAMPLES[key] || "")
  }

  return (
    <div className="mx-auto max-w-3xl px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Regex Tester</h1>
      <p className="text-muted mb-6">Test regular expressions in real-time. JavaScript flavor.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-5">
        {/* Pattern */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-[10px] font-semibold text-muted-soft uppercase">Pattern</label>
            <div className="mt-1 flex rounded-xl border border-card-border bg-surface overflow-hidden focus-within:border-accent/40">
              <span className="px-3 py-2.5 text-sm font-mono text-accent bg-surface shrink-0">/</span>
              <input value={pattern} onChange={(e) => setPattern(e.target.value)}
                className="flex-1 bg-transparent px-0 py-2.5 text-sm font-mono text-foreground focus:outline-none"
                placeholder="regex pattern..." />
              <span className="px-3 py-2.5 text-sm font-mono text-accent bg-surface shrink-0">/</span>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-muted-soft uppercase">Flags</label>
            <div className="mt-1 flex gap-1">
              {FLAGS.map((f) => (
                <button key={f.key} onClick={() => toggleFlag(f.key)}
                  className={`h-10 w-10 rounded-lg text-sm font-mono font-bold transition-all ${flags.includes(f.key) ? "bg-accent text-white" : "border border-card-border text-muted hover:text-foreground"}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Samples */}
        <div className="flex gap-2 flex-wrap">
          {Object.keys(SAMPLES).map((k) => (
            <button key={k} onClick={() => loadSample(k)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all ${sample === k ? "bg-accent text-white" : "border border-card-border text-muted hover:text-foreground"}`}>
              {k}
            </button>
          ))}
        </div>

        {/* Text area */}
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8}
          className="w-full rounded-xl border border-card-border bg-surface p-4 text-sm font-mono text-foreground focus:border-accent/40 focus:outline-none resize-y"
          placeholder="Enter test text here..." />

        {/* Error */}
        {error && <div className="rounded-xl bg-danger/10 border border-danger/20 p-3 text-sm text-danger font-mono">{error}</div>}

        {/* Matches */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">
              {error ? "0 matches" : `${matches.length} match${matches.length !== 1 ? "es" : ""}`}
            </h3>
          </div>

          {/* Highlighted text */}
          <div className="rounded-xl border border-card-border bg-surface p-4 text-sm font-mono leading-relaxed whitespace-pre-wrap break-all"
            dangerouslySetInnerHTML={{ __html: highlightText() }} />

          {/* Match details */}
          {matches.length > 0 && (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {matches.map((m, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg bg-surface px-4 py-2 text-xs">
                  <span className="text-muted-soft font-mono w-8 shrink-0">#{i + 1}</span>
                  <code className="flex-1 font-mono text-accent truncate">{m.text}</code>
                  <span className="text-muted-soft font-mono shrink-0">idx:{m.index}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}
