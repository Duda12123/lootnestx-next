"use client";
import { useState } from "react"

type UnitCategory = {
  name: string
  units: { name: string; toBase: (v: number) => number; fromBase: (v: number) => number }[]
}

const categories: UnitCategory[] = [
  {
    name: "Length",
    units: [
      { name: "Meter", toBase: (v) => v, fromBase: (v) => v },
      { name: "Kilometer", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { name: "Centimeter", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      { name: "Millimeter", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { name: "Mile", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
      { name: "Yard", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      { name: "Foot", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      { name: "Inch", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    ],
  },
  {
    name: "Weight",
    units: [
      { name: "Kilogram", toBase: (v) => v, fromBase: (v) => v },
      { name: "Gram", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { name: "Milligram", toBase: (v) => v / 1_000_000, fromBase: (v) => v * 1_000_000 },
      { name: "Pound", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
      { name: "Ounce", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
      { name: "Ton (metric)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    ],
  },
  {
    name: "Temperature",
    units: [
      { name: "Celsius", toBase: (v) => v, fromBase: (v) => v },
      { name: "Fahrenheit", toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
      { name: "Kelvin", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
  {
    name: "Volume",
    units: [
      { name: "Liter", toBase: (v) => v, fromBase: (v) => v },
      { name: "Milliliter", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { name: "Gallon (US)", toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
      { name: "Quart (US)", toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
      { name: "Cup (US)", toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
      { name: "Tablespoon", toBase: (v) => v * 0.0147868, fromBase: (v) => v / 0.0147868 },
    ],
  },
  {
    name: "Area",
    units: [
      { name: "Square Meter", toBase: (v) => v, fromBase: (v) => v },
      { name: "Square Kilometer", toBase: (v) => v * 1_000_000, fromBase: (v) => v / 1_000_000 },
      { name: "Square Foot", toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
      { name: "Acre", toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
      { name: "Hectare", toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
    ],
  },
]

export default function UnitConverter() {
  const [catIndex, setCatIndex] = useState(0)
  const [fromUnit, setFromUnit] = useState(0)
  const [toUnit, setToUnit] = useState(1)
  const [value, setValue] = useState("1")

  const cat = categories[catIndex]
  const from = cat.units[fromUnit]
  const to = cat.units[toUnit]

  const result = (() => {
    const n = Number(value)
    if (isNaN(n) || value === "") return ""
    const base = from.toBase(n)
    return to.fromBase(base).toPrecision(8).replace(/\.?0+$/, "")
  })()

  const swap = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
  }

  return (
    <div className="mx-auto max-w-lg px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Unit Converter</h1>
      <p className="text-muted mb-6">Convert between units of length, weight, temperature, volume, and area.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-5">
        {/* Category */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((c, i) => (
            <button key={c.name} onClick={() => { setCatIndex(i); setFromUnit(0); setToUnit(1); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${i === catIndex ? "bg-accent text-white" : "border border-card-border text-muted hover:text-foreground"}`}>
              {c.name}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-[10px] font-semibold text-muted-soft uppercase">From</label>
              <input type="number" value={value} onChange={(e) => setValue(e.target.value)}
                className="mt-1 w-full rounded-xl border border-card-border bg-surface px-4 py-3 text-lg font-mono font-bold text-foreground focus:border-accent/40 focus:outline-none" />
            </div>
            <select value={fromUnit} onChange={(e) => setFromUnit(Number(e.target.value))}
              className="rounded-xl border border-card-border bg-surface px-3 py-3 text-sm font-medium text-foreground focus:border-accent/40 focus:outline-none w-40">
              {cat.units.map((u, i) => (<option key={u.name} value={i}>{u.name}</option>))}
            </select>
          </div>

          <div className="flex justify-center">
            <button onClick={swap} className="rounded-lg border border-card-border p-2 text-muted hover:text-foreground transition-colors">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
            </button>
          </div>

          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-[10px] font-semibold text-muted-soft uppercase">To</label>
              <div className="mt-1 rounded-xl border border-accent/20 bg-accent-soft px-4 py-3 text-lg font-mono font-bold text-accent">
                {result || "—"}
              </div>
            </div>
            <select value={toUnit} onChange={(e) => setToUnit(Number(e.target.value))}
              className="rounded-xl border border-card-border bg-surface px-3 py-3 text-sm font-medium text-foreground focus:border-accent/40 focus:outline-none w-40">
              {cat.units.map((u, i) => (<option key={u.name} value={i}>{u.name}</option>))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
