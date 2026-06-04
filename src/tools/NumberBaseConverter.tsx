"use client";
import { useState } from "react"
import { Copy, ArrowRightLeft } from "lucide-react"

const BASES = [
  { name: "Binary", value: 2, digits: /^[01\s]+$/ },
  { name: "Octal", value: 8, digits: /^[0-7\s]+$/ },
  { name: "Decimal", value: 10, digits: /^[0-9\s]+$/ },
  { name: "Hexadecimal", value: 16, digits: /^[0-9a-fA-F\s]+$/ },
]

export default function NumberBaseConverter() {
  const [input, setInput] = useState("255")
  const [fromBase, setFromBase] = useState(3) // Decimal index

  const { decimal, parseError } = (() => {
    if (!input.trim()) return { decimal: null as number | null, parseError: "" }
    const clean = input.replace(/\s+/g, "")
    if (!BASES[fromBase].digits.test(clean)) {
      return { decimal: null, parseError: `Invalid ${BASES[fromBase].name} number` }
    }
    try {
      const val = parseInt(clean, BASES[fromBase].value)
      return { decimal: isNaN(val) ? null : val, parseError: "" }
    } catch {
      return { decimal: null, parseError: "Invalid number" }
    }
  })()

  const results = BASES.map((b) => ({
    name: b.name,
    base: b.value,
    value: decimal !== null && !isNaN(decimal) ? decimal.toString(b.value) : "—",
  }))

  const hexResult = results[3].value

  return (
    <div className="mx-auto max-w-lg px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Number Base Converter</h1>
      <p className="text-muted mb-6">Convert numbers between binary, octal, decimal, and hexadecimal.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-5">
        <div>
          <label className="text-[10px] font-semibold text-muted-soft uppercase">Input</label>
          <div className="mt-1 flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value.toUpperCase())}
              className="flex-1 rounded-xl border border-card-border bg-surface px-4 py-3 text-lg font-mono font-bold text-foreground focus:border-accent/40 focus:outline-none"
              placeholder={`Enter ${BASES[fromBase].name} number...`} />
            <select value={fromBase} onChange={(e) => setFromBase(Number(e.target.value))}
              className="rounded-xl border border-card-border bg-surface px-3 py-3 text-sm font-medium text-foreground">
              {BASES.map((b, i) => (<option key={b.name} value={i}>{b.name}</option>))}
            </select>
          </div>
          {parseError && <div className="text-xs text-danger mt-1.5">{parseError}</div>}
          {hexResult !== "—" && !parseError && (
            <div className="mt-3 flex items-center gap-2">
              <div className="h-6 w-6 rounded-md border border-card-border shrink-0" style={{ backgroundColor: "#" + hexResult.padStart(6, "0").slice(0, 6) }} />
              <span className="text-xs text-muted">#{hexResult.padStart(6, "0").slice(0, 6)}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {results.map((r) => (
            <div key={r.name} className="flex items-center rounded-xl border border-card-border bg-surface overflow-hidden">
              <span className="w-24 shrink-0 bg-card-bg px-3 py-3 text-xs font-semibold text-muted border-r border-card-border">{r.name}</span>
              <code className="flex-1 px-4 py-3 text-sm font-mono text-foreground truncate">{r.value}</code>
              <button onClick={() => navigator.clipboard.writeText(r.value)} className="shrink-0 px-3 py-3 text-muted-soft hover:text-accent transition-colors">
                <Copy size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
