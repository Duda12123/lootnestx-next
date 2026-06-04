"use client";
import { useState } from "react"
import { Copy, ArrowRightLeft } from "lucide-react"

function textToBinary(text: string) {
  return text.split("").map((c) => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ")
}

function binaryToText(binary: string) {
  try {
    return binary.trim().split(/\s+/).map((b) => String.fromCharCode(parseInt(b, 2))).join("")
  } catch { return "Invalid binary input" }
}

function textToHex(text: string) {
  return text.split("").map((c) => c.charCodeAt(0).toString(16).padStart(2, "0")).join(" ")
}

function hexToText(hex: string) {
  try {
    return hex.trim().split(/\s+/).map((h) => String.fromCharCode(parseInt(h, 16))).join("")
  } catch { return "Invalid hex input" }
}

type Mode = "text-to-binary" | "binary-to-text" | "text-to-hex" | "hex-to-text"

const LABELS: Record<Mode, { input: string; output: string }> = {
  "text-to-binary": { input: "Text", output: "Binary" },
  "binary-to-text": { input: "Binary (space-separated 8-bit)", output: "Text" },
  "text-to-hex": { input: "Text", output: "Hex" },
  "hex-to-text": { input: "Hex (space-separated)", output: "Text" },
}

export default function BinaryTextConverter() {
  const [mode, setMode] = useState<Mode>("text-to-binary")
  const [input, setInput] = useState("Hello, World!")
  const [output, setOutput] = useState("")

  const convert = (text: string) => {
    setInput(text)
    switch (mode) {
      case "text-to-binary": setOutput(textToBinary(text)); break
      case "binary-to-text": setOutput(binaryToText(text)); break
      case "text-to-hex": setOutput(textToHex(text)); break
      case "hex-to-text": setOutput(hexToText(text)); break
    }
  }

  const swap = () => {
    const newMode = mode === "text-to-binary" ? "binary-to-text" : mode === "binary-to-text" ? "text-to-binary" : mode === "text-to-hex" ? "hex-to-text" : "text-to-hex"
    setMode(newMode)
    setInput(output)
    setOutput(input)
  }

  return (
    <div className="mx-auto max-w-lg px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Binary / Text Converter</h1>
      <p className="text-muted mb-6">Convert between text, binary, and hexadecimal formats.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-5">
        <div className="grid grid-cols-2 gap-2">
          {(["text-to-binary", "binary-to-text", "text-to-hex", "hex-to-text"] as Mode[]).map((m) => (
            <button key={m} onClick={() => { setMode(m); setInput(""); setOutput(""); }}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all ${mode === m ? "bg-accent text-white" : "border border-card-border text-muted hover:text-foreground"}`}>
              {m.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" → ")}
            </button>
          ))}
        </div>

        <textarea value={input} onChange={(e) => convert(e.target.value)} rows={4}
          className="w-full rounded-xl border border-card-border bg-surface p-4 text-sm font-mono text-foreground focus:border-accent/40 focus:outline-none resize-y"
          placeholder={LABELS[mode].input} />

        <div className="flex justify-center">
          <button onClick={swap} className="rounded-xl border border-card-border p-2.5 text-muted hover:text-foreground transition-colors">
            <ArrowRightLeft size={18} />
          </button>
        </div>

        <div className="rounded-xl border border-accent/10 bg-accent-soft p-5 flex items-start justify-between">
          <span className="text-sm font-mono text-foreground leading-relaxed break-all flex-1">{output || "—"}</span>
          <button onClick={() => navigator.clipboard.writeText(output)} className="shrink-0 ml-2 text-muted-soft hover:text-accent transition-colors"><Copy size={14} /></button>
        </div>
      </div>
    </div>
  )
}
