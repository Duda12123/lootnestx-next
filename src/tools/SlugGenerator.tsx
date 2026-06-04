"use client";
import { useState } from "react"
import { Copy } from "lucide-react"

function slugify(text: string, separator: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, separator)
    .replace(new RegExp(`${escapeRegExp(separator)}+`, "g"), separator)
    .replace(new RegExp(`^${escapeRegExp(separator)}|${escapeRegExp(separator)}$`, "g"), "")
}

function escapeRegExp(s: string) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") }

export default function SlugGenerator() {
  const [text, setText] = useState("")
  const [sep, setSep] = useState("-")
  const [slug, setSlug] = useState("")
  const [copied, setCopied] = useState(false)

  const generate = (input: string) => {
    setText(input)
    setSlug(input ? slugify(input, sep) : "")
  }

  const copy = async () => {
    await navigator.clipboard.writeText(slug)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="mx-auto max-w-lg px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">URL Slug Generator</h1>
      <p className="text-muted mb-6">Convert titles into URL-friendly slugs for blogs and CMS.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-5">
        <div>
          <label className="text-[10px] font-semibold text-muted-soft uppercase">Title</label>
          <input value={text} onChange={(e) => generate(e.target.value)}
            className="mt-1 w-full rounded-xl border border-card-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-soft focus:border-accent/40 focus:outline-none"
            placeholder="Enter a title or headline..." />
        </div>

        <div>
          <label className="text-[10px] font-semibold text-muted-soft uppercase">Separator</label>
          <div className="mt-1 flex gap-2">
            {["-", "_", "."].map((s) => (
              <button key={s} onClick={() => { setSep(s); generate(text); }}
                className={`w-12 rounded-lg py-2 text-lg font-mono font-bold transition-all ${sep === s ? "bg-accent text-white" : "border border-card-border text-muted hover:text-foreground"}`}>{s}</button>
            ))}
          </div>
        </div>

        {slug && (
          <div className="flex items-center gap-2 rounded-xl border border-accent/20 bg-accent-soft p-4">
            <code className="flex-1 text-lg font-mono text-accent break-all">{slug}</code>
            <button onClick={copy} className="shrink-0 rounded-lg border border-accent/20 p-2 text-accent hover:bg-accent/10 transition-colors">
              <Copy size={16} />
            </button>
          </div>
        )}

        {text && (
          <div className="text-xs text-muted space-y-1">
            <div className="flex justify-between"><span>Characters:</span><span className="font-mono">{text.length} → {slug.length}</span></div>
            <div className="flex justify-between"><span>Words:</span><span className="font-mono">{text.split(/\s+/).filter(Boolean).length} → {slug.split(sep).length}</span></div>
          </div>
        )}
      </div>
    </div>
  )
}
