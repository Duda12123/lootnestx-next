"use client";
import { useState } from "react"

export default function UrlEncoder() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")

  const convert = () => {
    try {
      if (mode === "encode") {
        setOutput(encodeURIComponent(input))
      } else {
        setOutput(decodeURIComponent(input))
      }
    } catch {
      setOutput("Error: Invalid encoded input")
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">URL Encoder / Decoder</h1>
      <p className="text-muted mb-6">Encode or decode URL-safe strings.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-5">
        <div className="flex gap-2">
          <button onClick={() => setMode("encode")} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${mode === "encode" ? "bg-accent text-white" : "border border-card-border text-muted hover:text-foreground"}`}>Encode</button>
          <button onClick={() => setMode("decode")} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${mode === "decode" ? "bg-accent text-white" : "border border-card-border text-muted hover:text-foreground"}`}>Decode</button>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted uppercase tracking-wider">Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={5}
            className="mt-2 w-full rounded-xl border border-card-border bg-surface p-4 text-sm font-mono text-foreground placeholder:text-muted-soft focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/10 resize-y"
            placeholder={mode === "encode" ? "Enter URL or text to encode..." : "Paste encoded URL string..."} />
        </div>

        <button onClick={convert} className="w-full rounded-xl bg-accent py-3 text-sm font-bold text-white hover:bg-accent-dark transition-colors">
          {mode === "encode" ? "Encode URL" : "Decode URL"}
        </button>

        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-muted uppercase tracking-wider">Output</label>
              <button onClick={() => navigator.clipboard.writeText(output)} className="text-xs text-accent hover:text-accent-light font-medium">Copy</button>
            </div>
            <pre className="rounded-xl border border-accent/10 bg-accent-soft p-4 text-sm font-mono text-foreground whitespace-pre-wrap break-all max-h-60 overflow-y-auto">{output}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
