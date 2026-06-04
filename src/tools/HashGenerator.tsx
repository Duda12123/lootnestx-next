"use client";
import { useState } from "react"
import CryptoJS from "crypto-js"
import { Copy } from "lucide-react"

const ALGOS = ["MD5", "SHA-1", "SHA-256", "SHA-512"] as const

export default function HashGenerator() {
  const [text, setText] = useState("")
  const [algo, setAlgo] = useState<string>("SHA-256")
  const [results, setResults] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState("")

  const hash = (input: string) => {
    if (!input.trim()) { setResults({}); return }
    const r: Record<string, string> = {}
    for (const a of ALGOS) {
      switch (a) {
        case "MD5": r[a] = CryptoJS.MD5(input).toString(); break
        case "SHA-1": r[a] = CryptoJS.SHA1(input).toString(); break
        case "SHA-256": r[a] = CryptoJS.SHA256(input).toString(); break
        case "SHA-512": r[a] = CryptoJS.SHA512(input).toString(); break
      }
    }
    setResults(r)
  }

  const copyHash = async (h: string) => {
    await navigator.clipboard.writeText(h)
    setCopied(h)
    setTimeout(() => setCopied(""), 1500)
  }

  const currentResult = results[algo] || ""

  return (
    <div className="mx-auto max-w-2xl px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Hash Generator</h1>
      <p className="text-muted mb-6">Generate MD5, SHA-1, SHA-256, and SHA-512 hashes.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-5">
        <div>
          <label className="text-xs font-semibold text-muted uppercase tracking-wider">Input Text</label>
          <textarea value={text} onChange={(e) => { setText(e.target.value); hash(e.target.value); }} rows={4}
            className="mt-2 w-full rounded-xl border border-card-border bg-surface p-4 text-sm font-mono text-foreground placeholder:text-muted-soft focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/10 resize-y"
            placeholder="Enter text to hash..." />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ALGOS.map((a) => (
            <button key={a} onClick={() => setAlgo(a)}
              className={`rounded-lg px-3 py-2.5 text-xs font-semibold transition-all ${algo === a ? "bg-accent text-white" : "border border-card-border text-muted hover:text-foreground"}`}>
              {a}
            </button>
          ))}
        </div>

        {currentResult && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-muted uppercase tracking-wider">{algo} Hash</label>
              <button onClick={() => copyHash(currentResult)} className="flex items-center gap-1 text-xs text-accent hover:text-accent-light font-medium transition-colors">
                <Copy size={12} /> {copied === currentResult ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="rounded-xl border border-accent/10 bg-accent-soft p-4 text-sm font-mono text-foreground break-all">
              {currentResult}
            </div>
          </div>
        )}

        {/* All results at a glance */}
        {results.MD5 && (
          <div className="space-y-2 pt-3 border-t border-card-border">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">All Hashes</h3>
            {ALGOS.map((a) => (
              <div key={a} className="flex items-center gap-2 text-xs">
                <span className="w-14 font-semibold text-muted-soft shrink-0">{a}</span>
                <code className="flex-1 font-mono text-muted truncate">{results[a]}</code>
                <button onClick={() => copyHash(results[a])} className="shrink-0 text-muted-soft hover:text-foreground transition-colors">
                  <Copy size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
