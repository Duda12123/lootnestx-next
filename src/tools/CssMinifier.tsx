"use client";
import { useState } from "react"
import { Copy, Check, Minus } from "lucide-react"

export default function CssMinifier() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"minify" | "beautify">("minify")
  const [copied, setCopied] = useState(false)

  const process = () => {
    if (!input.trim()) return
    if (mode === "minify") {
      setOutput(input.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{};:,>+~])\s*/g, "$1").replace(/;}/g, "}").trim())
    } else {
      setOutput(input.replace(/([{;}])/g, "$1\n  ").replace(/}\s*/g, "}\n").replace(/^\s+/gm, (m) => "  ".repeat(m.length)).trim())
    }
  }

  const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">CSS Minifier</h1>
      <p className="text-muted mb-6">Minify or beautify your CSS code.</p>
      <div className="flex gap-2 mb-3">
        <button onClick={() => setMode("minify")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === "minify" ? "bg-accent text-white" : "bg-card-bg border border-card-border text-muted hover:text-foreground"}`}>Minify</button>
        <button onClick={() => setMode("beautify")} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === "beautify" ? "bg-accent text-white" : "bg-card-bg border border-card-border text-muted hover:text-foreground"}`}>Beautify</button>
      </div>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste your CSS here..." className="w-full h-40 bg-card-bg border border-card-border rounded-xl p-4 text-sm font-mono resize-y focus:outline-none focus:border-accent mb-3" />
      <button onClick={process} className="tool-btn-primary mb-4"><Minus size={14} className="mr-1" /> {mode === "minify" ? "Minify" : "Beautify"}</button>
      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between"><span className="text-xs text-muted-soft">{output.length.toLocaleString()} chars</span><button onClick={copy} className="tool-btn">{copied ? <Check size={14} className="mr-1 text-green-400" /> : <Copy size={14} className="mr-1" />}{copied ? "Copied" : "Copy"}</button></div>
          <pre className="bg-surface border border-card-border rounded-xl p-4 text-xs font-mono text-muted overflow-auto max-h-64 whitespace-pre-wrap break-all">{output}</pre>
        </div>
      )}
    </div>
  )
}
