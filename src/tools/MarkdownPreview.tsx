"use client";
import { useState, useMemo } from "react"
import { marked } from "marked"

export default function MarkdownPreview() {
  const [md, setMd] = useState(`# Hello, Markdown!

Start typing **Markdown** here and see a live preview.

## Features
- **Bold** and *italic* text
- [Links](https://example.com)
- \`inline code\`

### Code Block
\`\`\`javascript
console.log("Hello, world!")
\`\`\`

### Table
| Feature | Status |
|---------|--------|
| Live Preview | ✅ |
| Syntax Highlight | ✅ |

> Blockquote: *"The best tool is the one you have."*
`)
  const [viewMode, setViewMode] = useState<"split" | "preview" | "edit">("split")

  const html = useMemo(() => {
    return marked.parse(md, { breaks: true, gfm: true }) as string
  }, [md])

  return (
    <div className="mx-auto max-w-6xl px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Markdown Preview</h1>
      <p className="text-muted mb-6">Write Markdown and see a live HTML preview.</p>

      {/* View mode */}
      <div className="flex gap-2 mb-4">
        {(["split", "preview", "edit"] as const).map((m) => (
          <button key={m} onClick={() => setViewMode(m)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition-all ${viewMode === m ? "bg-accent text-white" : "border border-card-border text-muted hover:text-foreground"}`}>
            {m}
          </button>
        ))}
      </div>

      <div className={`grid gap-4 ${viewMode === "split" ? "grid-cols-2" : "grid-cols-1"}`}>
        {(viewMode === "split" || viewMode === "edit") && (
          <div className="rounded-2xl border border-card-border bg-card-bg p-5">
            <textarea value={md} onChange={(e) => setMd(e.target.value)} rows={20}
              className="w-full rounded-xl border border-card-border bg-surface p-4 text-sm font-mono text-foreground focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/10 resize-y"
              placeholder="Type Markdown here..." />
          </div>
        )}

        {(viewMode === "split" || viewMode === "preview") && (
          <div className="rounded-2xl border border-card-border bg-card-bg p-6">
            <div className="prose prose-invert prose-sm max-w-none
              prose-headings:font-heading prose-headings:tracking-tight
              prose-a:text-accent prose-code:bg-surface prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm
              prose-pre:bg-surface prose-pre:border prose-pre:border-card-border
              prose-blockquote:border-accent prose-blockquote:text-muted
              prose-img:rounded-xl
              [&_table]:w-full [&_th]:text-left [&_th]:p-2 [&_td]:p-2 [&_th]:border-b [&_td]:border-b [&_th]:border-card-border [&_td]:border-card-border"
              dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        )}
      </div>
    </div>
  )
}
