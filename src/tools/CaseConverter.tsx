"use client";
import { useState } from "react"
import { Copy, Shuffle, Trash2 } from "lucide-react"

type CaseStyle = "upper" | "lower" | "title" | "sentence" | "camel" | "pascal" | "snake" | "kebab" | "constant"

const styles: { key: CaseStyle; label: string; example: string }[] = [
  { key: "upper", label: "UPPERCASE", example: "HELLO WORLD" },
  { key: "lower", label: "lowercase", example: "hello world" },
  { key: "title", label: "Title Case", example: "Hello World" },
  { key: "sentence", label: "Sentence case", example: "Hello world" },
  { key: "camel", label: "camelCase", example: "helloWorld" },
  { key: "pascal", label: "PascalCase", example: "HelloWorld" },
  { key: "snake", label: "snake_case", example: "hello_world" },
  { key: "kebab", label: "kebab-case", example: "hello-world" },
  { key: "constant", label: "CONSTANT_CASE", example: "HELLO_WORLD" },
]

function convert(text: string, style: CaseStyle): string {
  if (!text.trim()) return ""
  switch (style) {
    case "upper": return text.toUpperCase()
    case "lower": return text.toLowerCase()
    case "title": return text.replace(/\S+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    case "sentence": return text.replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase()).toLowerCase().replace(/^\w/, (c) => c.toUpperCase())
    case "camel": return toCamel(text)
    case "pascal": return toPascal(text)
    case "snake": return text.replace(/[\s-]+/g, "_").replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase()
    case "kebab": return text.replace(/[\s_]+/g, "-").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
    case "constant": return text.replace(/[\s-]+/g, "_").replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase()
  }
}

function toCamel(s: string) {
  return s.replace(/[_\-\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : "").replace(/^./, (c) => c.toLowerCase())
}
function toPascal(s: string) {
  return s.replace(/[_\-\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : "").replace(/^./, (c) => c.toUpperCase())
}

export default function CaseConverter() {
  const [text, setText] = useState("Hello world\nthis is a test")
  const [copied, setCopied] = useState("")

  return (
    <div className="mx-auto max-w-2xl px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Case Converter</h1>
      <p className="text-muted mb-6">Convert text between uppercase, lowercase, camelCase, snake_case and more.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-4">
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4}
          className="w-full rounded-xl border border-card-border bg-surface p-4 text-sm text-foreground placeholder:text-muted-soft focus:border-accent/40 focus:outline-none resize-y font-mono"
          placeholder="Type or paste text here..." />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {styles.map((s) => {
            const result = convert(text, s.key)
            return (
              <div key={s.key} className="rounded-xl border border-card-border bg-surface p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-muted-soft uppercase tracking-wider">{s.label}</span>
                  <button onClick={() => { navigator.clipboard.writeText(result); setCopied(s.key); setTimeout(() => setCopied(""), 1500); }}
                    className="text-muted-soft hover:text-accent transition-colors">
                    <Copy size={12} />
                  </button>
                </div>
                <div className="text-sm font-mono text-foreground break-all whitespace-pre-wrap">
                  {copied === s.key ? <span className="text-success text-xs">Copied!</span> : result || <span className="text-muted-soft italic">{s.example}</span>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
