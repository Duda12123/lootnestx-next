"use client";
import { useState } from "react"

export default function Base64Tool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [error, setError] = useState("")

  const convert = () => {
    setError("")
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))))
      } else {
        setOutput(decodeURIComponent(escape(atob(input))))
      }
    } catch {
      setError(mode === "decode" ? "Invalid Base64 string" : "Encoding failed")
    }
  }

  const swap = () => {
    setMode(mode === "encode" ? "decode" : "encode")
    setInput(output)
    setOutput("")
  }

  const copy = () => {
    navigator.clipboard.writeText(output)
  }

  return (
    <div className="mx-auto max-w-2xl px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Base64 Encoder / Decoder</h1>
      <p className="text-muted mb-6">Encode text to Base64 or decode Base64 back to text.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-5">
        {/* Mode */}
        <div className="flex gap-2">
          <button onClick={() => setMode("encode")} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${mode === "encode" ? "bg-accent text-white" : "border border-card-border text-muted hover:text-foreground"}`}>Encode</button>
          <button onClick={() => setMode("decode")} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${mode === "decode" ? "bg-accent text-white" : "border border-card-border text-muted hover:text-foreground"}`}>Decode</button>
          <button onClick={swap} className="ml-auto rounded-lg border border-card-border px-4 py-2 text-sm text-muted hover:text-foreground transition-colors">Swap ↔</button>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted uppercase tracking-wider">{mode === "encode" ? "Text Input" : "Base64 Input"}</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6}
            className="mt-2 w-full rounded-xl border border-card-border bg-surface p-4 text-sm text-foreground font-mono placeholder:text-muted-soft focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/10 resize-y"
            placeholder={mode === "encode" ? "Enter text to encode..." : "Paste Base64 string..."} />
        </div>

        <button onClick={convert} className="w-full rounded-xl bg-accent py-3 text-sm font-bold text-white hover:bg-accent-dark transition-colors active:scale-[0.99]">
          {mode === "encode" ? "Encode to Base64" : "Decode from Base64"}
        </button>

        {error && <div className="rounded-xl bg-danger/10 border border-danger/20 p-3 text-sm text-danger">{error}</div>}

        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-muted uppercase tracking-wider">{mode === "encode" ? "Base64 Output" : "Text Output"}</label>
              <button onClick={copy} className="text-xs text-accent hover:text-accent-light font-medium">Copy</button>
            </div>
            <pre className="rounded-xl border border-accent/10 bg-accent-soft p-4 text-sm font-mono text-foreground whitespace-pre-wrap break-all max-h-60 overflow-y-auto">{output}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
