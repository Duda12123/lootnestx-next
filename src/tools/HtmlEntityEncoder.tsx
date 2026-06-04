"use client";
import { useState } from "react"
import { Copy, ArrowRightLeft } from "lucide-react"

const ENTITIES: Record<string, string> = {
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  "€": "&euro;", "£": "&pound;", "¥": "&yen;", "©": "&copy;", "®": "&reg;", "™": "&trade;",
  "°": "&deg;", "±": "&plusmn;", "×": "&times;", "÷": "&divide;",
  "←": "&larr;", "→": "&rarr;", "↑": "&uarr;", "↓": "&darr;",
}

function encode(input: string) {
  return input.replace(/[&<>"'\u00A0-\u9999]/g, (c) => ENTITIES[c] || `&#${c.charCodeAt(0)};`)
}

function decode(input: string) {
  return input.replace(/&[#\w]+;/g, (e) => {
    if (e.startsWith("&#x")) return String.fromCharCode(parseInt(e.slice(3, -1), 16))
    if (e.startsWith("&#")) return String.fromCharCode(parseInt(e.slice(2, -1)))
    const rev = Object.entries(ENTITIES).find(([, v]) => v === e)
    return rev ? rev[0] : e
  })
}

export default function HtmlEntityEncoder() {
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [input, setInput] = useState('<div class="greeting">Hello & Welcome © 2026</div>')
  const [output, setOutput] = useState(encode('<div class="greeting">Hello & Welcome © 2026</div>'))
  const [copied, setCopied] = useState(false)

  const convert = (text: string) => {
    setInput(text)
    setOutput(mode === "encode" ? encode(text) : decode(text))
  }

  const swap = () => {
    const newMode = mode === "encode" ? "decode" : "encode"
    setMode(newMode)
    setInput(output)
    setOutput(input)
  }

  return (
    <div className="mx-auto max-w-2xl px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">HTML Entity Encoder</h1>
      <p className="text-muted mb-6">Encode special characters to HTML entities and decode them back.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-5">
        <div className="flex items-center gap-2">
          <button onClick={() => { setMode("encode"); convert(input); }}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${mode === "encode" ? "bg-accent text-white" : "border border-card-border text-muted hover:text-foreground"}`}>Encode</button>
          <button onClick={() => { setMode("decode"); convert(input); }}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${mode === "decode" ? "bg-accent text-white" : "border border-card-border text-muted hover:text-foreground"}`}>Decode</button>
        </div>

        <textarea value={input} onChange={(e) => convert(e.target.value)} rows={6}
          className="w-full rounded-xl border border-card-border bg-surface p-4 text-sm font-mono text-foreground focus:border-accent/40 focus:outline-none resize-y"
          placeholder={mode === "encode" ? "Enter HTML or text to encode..." : "Enter HTML entities to decode..."} />

        <div className="flex justify-center">
          <button onClick={swap} className="rounded-xl border border-card-border p-2.5 text-muted hover:text-foreground transition-colors"><ArrowRightLeft size={18} /></button>
        </div>

        <div className="relative rounded-xl border border-accent/10 bg-accent-soft p-5">
          <div className="text-sm font-mono text-foreground leading-relaxed break-all">{output || "—"}</div>
          {output && (
            <button onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
              className="absolute top-3 right-3 rounded-lg border border-card-border p-1.5 text-muted-soft hover:text-accent transition-colors bg-surface"><Copy size={14} /></button>
          )}
        </div>
      </div>
    </div>
  )
}
