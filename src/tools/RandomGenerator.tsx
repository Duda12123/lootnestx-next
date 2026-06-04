"use client";
import { useState } from "react"
import { Copy, Dice1, Dice6 } from "lucide-react"

export default function RandomGenerator() {
  const [numType, setNumType] = useState<"integer" | "decimal">("integer")
  const [min, setMin] = useState(1)
  const [max, setMax] = useState(100)
  const [decimals, setDecimals] = useState(2)
  const [count, setCount] = useState(5)
  const [results, setResults] = useState<number[]>([])
  const [copied, setCopied] = useState(false)

  const generate = () => {
    const arr: number[] = []
    for (let i = 0; i < count; i++) {
      const r = Math.random() * (max - min) + min
      arr.push(numType === "integer" ? Math.floor(r) : Number(r.toFixed(decimals)))
    }
    setResults(arr)
  }

  const copyAll = async () => {
    await navigator.clipboard.writeText(results.join("\n"))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="mx-auto max-w-lg px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Random Number Generator</h1>
      <p className="text-muted mb-6">Generate random numbers within a range. Great for contests, raffles, and testing.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-5">
        <div className="flex gap-3">
          <button onClick={() => setNumType("integer")} className={`flex-1 rounded-xl py-3 text-sm font-semibold transition-all ${numType === "integer" ? "bg-accent text-white" : "border border-card-border text-muted hover:text-foreground"}`}>
            <Dice1 size={16} className="inline mr-1" /> Integer
          </button>
          <button onClick={() => setNumType("decimal")} className={`flex-1 rounded-xl py-3 text-sm font-semibold transition-all ${numType === "decimal" ? "bg-accent text-white" : "border border-card-border text-muted hover:text-foreground"}`}>
            <Dice6 size={16} className="inline mr-1" /> Decimal
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-semibold text-muted-soft uppercase">Min</label>
            <input type="number" value={min} onChange={(e) => setMin(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-card-border bg-surface px-3 py-2 text-sm font-mono text-center text-foreground" />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-muted-soft uppercase">Max</label>
            <input type="number" value={max} onChange={(e) => setMax(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-card-border bg-surface px-3 py-2 text-sm font-mono text-center text-foreground" />
          </div>
        </div>

        {numType === "decimal" && (
          <div>
            <label className="text-[10px] font-semibold text-muted-soft uppercase">Decimal Places</label>
            <input type="number" min={1} max={10} value={decimals} onChange={(e) => setDecimals(Number(e.target.value))}
              className="mt-1 w-20 rounded-lg border border-card-border bg-surface px-3 py-2 text-sm font-mono text-center text-foreground" />
          </div>
        )}

        <div>
          <label className="text-[10px] font-semibold text-muted-soft uppercase">Count</label>
          <select value={count} onChange={(e) => setCount(Number(e.target.value))}
            className="mt-1 rounded-lg border border-card-border bg-surface px-3 py-2 text-sm text-foreground">
            {[1, 5, 10, 25, 50, 100].map((n) => (<option key={n} value={n}>{n}</option>))}
          </select>
        </div>

        <button onClick={generate} className="w-full rounded-xl bg-accent py-3 text-sm font-bold text-white hover:bg-accent-dark transition-colors">
          Generate
        </button>

        {results.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">{results.length} numbers</span>
              <button onClick={copyAll} className="flex items-center gap-1 text-xs text-accent hover:text-accent-light font-medium transition-colors">
                <Copy size={12} /> {copied ? "Copied!" : "Copy All"}
              </button>
            </div>
            <div className="rounded-xl border border-card-border bg-surface p-4 flex flex-wrap gap-2">
              {results.map((n, i) => (
                <span key={i} className="inline-flex items-center rounded-lg bg-card-bg px-3 py-1.5 font-mono text-sm font-bold text-foreground">{n}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
