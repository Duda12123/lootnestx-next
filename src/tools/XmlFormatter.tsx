"use client";
import { useState } from "react"
import { Copy } from "lucide-react"

function formatXml(xml: string, indent = 2): string {
  const spaces = " ".repeat(indent)
  let formatted = ""
  let depth = 0
  const reg = /(>)(<)(\/*)/g
  const padded = xml.replace(reg, "$1\n$2$3")
  const lines = padded.split("\n")
  for (let line of lines) {
    line = line.trim()
    if (!line) continue
    if (line.match(/^<\/\w/)) depth--
    formatted += spaces.repeat(Math.max(0, depth)) + line + "\n"
    if (line.match(/^<\w[^>]*[^/]>.*$/)) depth++
    if (line.match(/^<\w[^>]*\/>$/)) { /* self-closing */ }
  }
  return formatted.trim()
}

export default function XmlFormatter() {
  const [input, setInput] = useState(`<root><user id="1"><name>John</name><email>john@example.com</email></user><user id="2"><name>Jane</name><email>jane@example.com</email></user></root>`)
  const [output, setOutput] = useState("")
  const [copied, setCopied] = useState(false)

  const format = () => {
    if (!input.trim()) return
    try {
      setOutput(formatXml(input))
    } catch (e) {
      setOutput("/* Error: " + (e as Error).message + " */")
    }
  }

  const minify = () => {
    setOutput(input.replace(/>\s+</g, "><").trim())
  }

  return (
    <div className="mx-auto max-w-3xl px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">XML Formatter</h1>
      <p className="text-muted mb-6">Format and minify XML documents.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-4">
        <div className="flex gap-2">
          <button onClick={format} className="rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-dark transition-colors">Format</button>
          <button onClick={minify} className="rounded-xl border border-card-border px-5 py-2.5 text-sm font-semibold text-muted hover:text-foreground transition-colors">Minify</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-semibold text-muted-soft uppercase">Input</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14}
              className="mt-1 w-full rounded-xl border border-card-border bg-surface p-4 text-sm font-mono text-foreground focus:border-accent/40 focus:outline-none resize-y"
              placeholder="Paste XML..." />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-semibold text-muted-soft uppercase">Output</label>
              {output && (
                <button onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                  className="flex items-center gap-1 text-xs text-accent hover:text-accent-light font-medium">
                  <Copy size={12} /> {copied ? "Copied!" : "Copy"}
                </button>
              )}
            </div>
            <textarea value={output} readOnly rows={14}
              className="mt-0 w-full rounded-xl border border-card-border bg-surface p-4 text-sm font-mono text-foreground resize-y"
              placeholder="Formatted XML..." />
          </div>
        </div>
      </div>
    </div>
  )
}
