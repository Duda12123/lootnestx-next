"use client";
import { useState } from "react"
import { Copy, Check, Minus } from "lucide-react"

export default function HtmlFormatter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"format" | "minify">("format")
  const [copied, setCopied] = useState(false)
  const [indent, setIndent] = useState(2)

  const process = () => {
    if (!input.trim()) return
    if (mode === "minify") {
      setOutput(input.replace(/<!--[\s\S]*?-->/g, "").replace(/>\s+</g, "><").replace(/\s{2,}/g, " ").trim())
    } else {
      let formatted = ""
      let depth = 0
      const sp = " ".repeat(indent)
      const tokens = input.replace(/></g, ">\n<").split("\n")
      for (const line of tokens) {
        const trimmed = line.trim()
        if (!trimmed) continue
        if (trimmed.startsWith("</")) depth = Math.max(0, depth - 1)
        formatted += sp.repeat(depth) + trimmed + "\n"
        if (trimmed.startsWith("<") && !trimmed.startsWith("</") && !trimmed.endsWith("/>") && !["<br>","<hr>","<img","<input","<meta","<link"].some(t => trimmed.startsWith(t))) depth++
      }
      setOutput(formatted.trim())
    }
  }

  const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">HTML Formatter</h1>
      <p className="text-muted mb-6">Format or minify HTML code.</p>
      <div className="flex gap-2 mb-3 flex-wrap">
        <button onClick={() => setMode("format")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === "format" ? "bg-accent text-white" : "bg-card-bg border border-card-border text-muted hover:text-foreground"}`}>Format</button>
        <button onClick={() => setMode("minify")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === "minify" ? "bg-accent text-white" : "bg-card-bg border border-card-border text-muted hover:text-foreground"}`}>Minify</button>
        {mode === "format" && (
          <div className="flex items-center gap-1 ml-2">
            <span className="text-xs text-muted-soft">Indent:</span>
            {[2, 4].map(n => <button key={n} onClick={() => setIndent(n)} className={`px-2 py-0.5 rounded text-xs ${indent === n ? "bg-accent/20 text-accent" : "text-muted hover:text-foreground"}`}>{n}</button>)}
          </div>
        )}
      </div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste HTML here..." className="w-full h-40 bg-card-bg border border-card-border rounded-xl p-4 text-sm font-mono resize-y focus:outline-none focus:border-accent mb-3" />
      <button onClick={process} className="tool-btn-primary mb-4"><Minus size={14} className="mr-1" /> {mode === "format" ? "Format" : "Minify"}</button>
      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between"><span className="text-xs text-muted-soft">{output.length.toLocaleString()} chars</span><button onClick={copy} className="tool-btn">{copied ? <Check size={14} className="mr-1 text-green-400" /> : <Copy size={14} className="mr-1" />}{copied ? "Copied" : "Copy"}</button></div>
          <pre className="bg-surface border border-card-border rounded-xl p-4 text-xs font-mono text-muted overflow-auto max-h-64 whitespace-pre-wrap">{output}</pre>
        </div>
      )}
    </div>
  )
}
