"use client";
import { useState } from "react"

export default function BmiCalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric")
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [heightFt, setHeightFt] = useState("")
  const [heightIn, setHeightIn] = useState("")
  const [weightLb, setWeightLb] = useState("")

  let bmi = 0
  if (unit === "metric") {
    const h = parseFloat(height) / 100, w = parseFloat(weight)
    if (h > 0 && w > 0) bmi = w / (h * h)
  } else {
    const h = (parseFloat(heightFt) || 0) * 12 + (parseFloat(heightIn) || 0)
    const w = parseFloat(weightLb) || 0
    if (h > 0 && w > 0) bmi = (w / (h * h)) * 703
  }

  const getCategory = (b: number) => {
    if (b < 18.5) return { label: "Underweight", color: "text-blue-400", bg: "bg-blue-400/10" }
    if (b < 25) return { label: "Healthy", color: "text-green-400", bg: "bg-green-400/10" }
    if (b < 30) return { label: "Overweight", color: "text-yellow-400", bg: "bg-yellow-400/10" }
    return { label: "Obese", color: "text-red-400", bg: "bg-red-400/10" }
  }

  const cat = getCategory(bmi)

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-1">BMI Calculator</h1>
      <p className="text-muted mb-6">Calculate your Body Mass Index (BMI).</p>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setUnit("metric")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${unit === "metric" ? "bg-accent text-white" : "bg-card-bg border border-card-border text-muted hover:text-foreground"}`}>Metric</button>
        <button onClick={() => setUnit("imperial")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${unit === "imperial" ? "bg-accent text-white" : "bg-card-bg border border-card-border text-muted hover:text-foreground"}`}>Imperial</button>
      </div>
      <div className="space-y-4">
        {unit === "metric" ? (
          <>
            <div><label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">Height (cm)</label><input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="170" className="w-full bg-card-bg border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent" /></div>
            <div><label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">Weight (kg)</label><input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="65" className="w-full bg-card-bg border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent" /></div>
          </>
        ) : (
          <>
            <div>
              <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">Height</label>
              <div className="flex gap-2">
                <div className="flex-1"><input type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} placeholder="5" className="w-full bg-card-bg border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent" /><span className="text-xs text-muted-soft mt-1 block">ft</span></div>
                <div className="flex-1"><input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} placeholder="9" className="w-full bg-card-bg border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent" /><span className="text-xs text-muted-soft mt-1 block">in</span></div>
              </div>
            </div>
            <div><label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">Weight (lbs)</label><input type="number" value={weightLb} onChange={(e) => setWeightLb(e.target.value)} placeholder="150" className="w-full bg-card-bg border border-card-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent" /></div>
          </>
        )}
        {bmi > 0 && (
          <div className={`${cat.bg} border border-card-border rounded-xl p-6 text-center`}>
            <div className="text-4xl font-bold font-mono mb-2">{bmi.toFixed(1)}</div>
            <div className={`text-sm font-medium ${cat.color}`}>{cat.label}</div>
            <div className="mt-3 h-2 bg-card-bg rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-400" />
              <div className="relative"><div className="absolute -top-1 w-3 h-4 bg-white rounded-sm" style={{ left: `${Math.min(Math.max((bmi - 15) / 25 * 100, 0), 100)}%`, transform: "translateX(-50%)" }} /></div>
            </div>
            <div className="flex justify-between text-xs text-muted-soft mt-1"><span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span></div>
          </div>
        )}
      </div>
    </div>
  )
}
