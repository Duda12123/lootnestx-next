"use client";
import { useState } from "react"

export default function DateCalculator() {
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10))
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10))
  const [days, setDays] = useState("30")
  const [mode, setMode] = useState<"diff" | "add" | "subtract">("diff")
  const [result, setResult] = useState<string | null>(null)

  const calculate = () => {
    switch (mode) {
      case "diff": {
        const d1 = new Date(startDate)
        const d2 = new Date(endDate)
        if (isNaN(d1.getTime()) || isNaN(d2.getTime())) { setResult("Invalid date"); return }
        const diff = Math.abs(d2.getTime() - d1.getTime())
        const d = Math.floor(diff / 86400000)
        const weeks = Math.floor(d / 7)
        const months = (d2.getFullYear() - d1.getFullYear()) * 12 + d2.getMonth() - d1.getMonth()
        setResult(`${d} days (${weeks} weeks, ~${Math.abs(months)} months)`)
        break
      }
      case "add":
      case "subtract": {
        const d = new Date(startDate)
        if (isNaN(d.getTime())) { setResult("Invalid date"); return }
        const n = Number(days)
        if (isNaN(n)) { setResult("Invalid number of days"); return }
        d.setDate(d.getDate() + (mode === "add" ? n : -n))
        setResult(d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }))
        break
      }
    }
  }

  return (
    <div className="mx-auto max-w-md px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Date Calculator</h1>
      <p className="text-muted mb-6">Calculate days between dates, add or subtract days.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-5">
        <div className="flex gap-1 rounded-xl bg-surface p-1">
          {(["diff", "add", "subtract"] as const).map((m) => (
            <button key={m} onClick={() => { setMode(m); setResult(null); }}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold capitalize transition-all ${mode === m ? "bg-accent text-white shadow-sm" : "text-muted hover:text-foreground"}`}>
              {m}
            </button>
          ))}
        </div>

        {mode === "diff" ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-muted-soft uppercase">Start Date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-card-border bg-surface px-3 py-2.5 text-sm text-foreground" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-muted-soft uppercase">End Date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-card-border bg-surface px-3 py-2.5 text-sm text-foreground" />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-semibold text-muted-soft uppercase">Date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-card-border bg-surface px-3 py-2.5 text-sm text-foreground" />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-muted-soft uppercase">{mode === "add" ? "Add" : "Subtract"} Days</label>
              <input type="number" value={days} onChange={(e) => setDays(e.target.value)} min={1}
                className="mt-1 w-full rounded-lg border border-card-border bg-surface px-3 py-2.5 text-sm font-mono text-foreground" />
            </div>
          </div>
        )}

        <button onClick={calculate} className="w-full rounded-xl bg-accent py-3 text-sm font-bold text-white hover:bg-accent-dark transition-colors">Calculate</button>

        {result && (
          <div className="rounded-xl border border-accent/20 bg-accent-soft p-4">
            <div className="text-lg font-bold text-foreground">{result}</div>
          </div>
        )}
      </div>
    </div>
  )
}
