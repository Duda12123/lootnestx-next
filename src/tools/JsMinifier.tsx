"use client";
import { useState } from "react"
import { Copy, Check, Minus } from "lucide-react"

export default function JsMinifier() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [copied, setCopied] = useState(false)

  const minify = () => {
    setOutput(input.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "").replace(/\s+/g, " ").replace(/\s*([{}();,:])\s*/g, "$1").trim())
  }

  const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">JavaScript Minifier</h1>
      <p className="text-muted mb-6">Minify JavaScript by removing comments and whitespace.</p>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste JavaScript code here..." className="w-full h-40 bg-card-bg border border-card-border rounded-xl p-4 text-sm font-mono resize-y focus:outline-none focus:border-accent mb-3" />
      <button onClick={minify} className="tool-btn-primary mb-4"><Minus size={14} className="mr-1" /> Minify</button>
      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-soft">{output.length.toLocaleString()} chars (saved {input.length - output.length > 0 ? `${Math.round((1 - output.length / input.length) * 100)}%` : "0%"})</span>
            <button onClick={copy} className="tool-btn">{copied ? <Check size={14} className="mr-1 text-green-400" /> : <Copy size={14} className="mr-1" />}{copied ? "Copied" : "Copy"}</button>
          </div>
          <pre className="bg-surface border border-card-border rounded-xl p-4 text-xs font-mono text-muted overflow-auto max-h-64 whitespace-pre-wrap break-all">{output}</pre>
        </div>
      )}
    </div>
  )
}
