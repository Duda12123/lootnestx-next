"use client";
import { useState } from "react"

export default function PercentageCalculator() {
  const [mode, setMode] = useState<"percent" | "change" | "of">("percent")
  const [val1, setVal1] = useState("50")
  const [val2, setVal2] = useState("200")
  const [result, setResult] = useState<string | null>(null)

  const calculate = () => {
    const a = Number(val1), b = Number(val2)
    if (isNaN(a) || isNaN(b)) { setResult("Please enter valid numbers"); return }
    switch (mode) {
      case "percent": setResult(`${a} is ${((a / b) * 100).toFixed(2)}% of ${b}`); break
      case "change": setResult(`${((b - a) / a * 100).toFixed(2)}% ${b >= a ? "increase" : "decrease"} from ${a} to ${b}`); break
      case "of": setResult(`${a}% of ${b} = ${((a / 100) * b).toFixed(4)}`); break
    }
  }

  const labels = {
    percent: { v1: "Part", v2: "Whole", info: "What percent of A is B?" },
    change: { v1: "From", v2: "To", info: "Percent change from A to B" },
    of: { v1: "Percent", v2: "Of", info: "What is X% of Y?" },
  }

  return (
    <div className="mx-auto max-w-md px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Percentage Calculator</h1>
      <p className="text-muted mb-6">Calculate percentages, percent change, and percentage of a number.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-5">
        <div className="flex gap-1 rounded-xl bg-surface p-1">
          {(["percent", "change", "of"] as const).map((m) => (
            <button key={m} onClick={() => { setMode(m); setResult(null); }}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold capitalize transition-all ${mode === m ? "bg-accent text-white shadow-sm" : "text-muted hover:text-foreground"}`}>
              {m === "percent" ? "What %?" : m === "change" ? "% Change" : "% Of"}
            </button>
          ))}
        </div>

        <p className="text-xs text-muted italic">{labels[mode].info}</p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-semibold text-muted-soft uppercase">{labels[mode].v1}</label>
            <input type="number" value={val1} onChange={(e) => setVal1(e.target.value)}
              className="mt-1 w-full rounded-lg border border-card-border bg-surface px-3 py-2.5 text-sm font-mono text-foreground focus:border-accent/40 focus:outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-muted-soft uppercase">{labels[mode].v2}</label>
            <input type="number" value={val2} onChange={(e) => setVal2(e.target.value)}
              className="mt-1 w-full rounded-lg border border-card-border bg-surface px-3 py-2.5 text-sm font-mono text-foreground focus:border-accent/40 focus:outline-none" />
          </div>
        </div>

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
