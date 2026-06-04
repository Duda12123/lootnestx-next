"use client";
import { useState } from "react"
import { Copy, ArrowRightLeft } from "lucide-react"

const MORSE: Record<string, string> = {
  A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....", I: "..", J: ".---",
  K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-",
  U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.", "!": "-.-.--", "/": "-..-.", "(": "-.--.", ")": "-.--.-",
  "&": ".-...", ":": "---...", ";": "-.-.-.", "=": "-...-", "+": ".-.-.", "-": "-....-", "_": "..--.-", '"': ".-..-.",
  "$": "...-..-", "@": ".--.-.", " ": "/",
}
const REVERSE: Record<string, string> = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]))

function textToMorse(text: string) {
  return text.toUpperCase().split("").map((c) => MORSE[c] || c).join(" ")
}

function morseToText(morse: string) {
  return morse.trim().split(/\s+/).map((c) => REVERSE[c] || c).join("")
}

export default function MorseCode() {
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [input, setInput] = useState("SOS")
  const [output, setOutput] = useState("... --- ...")

  const convert = (text: string) => {
    if (mode === "encode") { setInput(text); setOutput(textToMorse(text)) }
    else { setInput(text); setOutput(morseToText(text)) }
  }

  const swap = () => {
    setMode(mode === "encode" ? "decode" : "encode")
    setInput(output)
    setOutput(input)
  }

  return (
    <div className="mx-auto max-w-lg px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Morse Code Converter</h1>
      <p className="text-muted mb-6">Encode text to Morse code and decode Morse back to text.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-5">
        <div className="flex items-center gap-2">
          <button onClick={() => setMode("encode")} className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${mode === "encode" ? "bg-accent text-white" : "border border-card-border text-muted hover:text-foreground"}`}>Text → Morse</button>
          <button onClick={() => setMode("decode")} className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${mode === "decode" ? "bg-accent text-white" : "border border-card-border text-muted hover:text-foreground"}`}>Morse → Text</button>
        </div>

        <textarea value={input} onChange={(e) => convert(e.target.value)} rows={4}
          className="w-full rounded-xl border border-card-border bg-surface p-4 text-sm font-mono text-foreground focus:border-accent/40 focus:outline-none resize-y"
          placeholder={mode === "encode" ? "Enter text..." : "Enter Morse code (use . - / separated by spaces)..."} />

        <div className="flex justify-center">
          <button onClick={swap} className="rounded-xl border border-card-border p-2.5 text-muted hover:text-foreground transition-colors">
            <ArrowRightLeft size={18} />
          </button>
        </div>

        <div className="rounded-xl border border-accent/10 bg-accent-soft p-5 min-h-[80px]">
          <div className="flex items-start justify-between">
            <span className="text-sm font-mono text-foreground leading-relaxed whitespace-pre-wrap break-all flex-1">{output || "—"}</span>
            <button onClick={() => navigator.clipboard.writeText(output)} className="shrink-0 ml-2 text-muted-soft hover:text-accent transition-colors"><Copy size={14} /></button>
          </div>
        </div>

        {mode === "encode" && output && (
          <div className="flex items-center gap-3 text-xs text-muted pt-1">
            <span className="inline-flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-success animate-pulse" /></span>
            {/* Audio play hint */}
            <span>{output.replace(/\s+/g, "").length} characters</span>
          </div>
        )}
      </div>
    </div>
  )
}
