"use client";
import { useState } from "react"
import { Percent } from "lucide-react"

export default function DiscountCalculator() {
  const [price, setPrice] = useState("")
  const [discount, setDiscount] = useState("")
  const [mode, setMode] = useState<"% off" | "final price">("% off")

  const p = parseFloat(price) || 0
  const d = parseFloat(discount) || 0
  const saved = mode === "% off" ? p * d / 100 : p - d
  const final = mode === "% off" ? p - saved : d

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-1">Discount Calculator</h1>
      <p className="text-muted mb-6">Calculate sale prices, discounts, and savings.</p>
      <div className="space-y-4">
        <div className="flex gap-2 mb-3">
          <button onClick={() => setMode("% off")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "% off" ? "bg-accent text-white" : "bg-card-bg border border-card-border text-muted hover:text-foreground"}`}>% Off</button>
          <button onClick={() => setMode("final price")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${mode === "final price" ? "bg-accent text-white" : "bg-card-bg border border-card-border text-muted hover:text-foreground"}`}>Final Price</button>
        </div>
        <div>
          <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">Original Price</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className="w-full bg-card-bg border border-card-border rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-accent" />
        </div>
        <div>
          <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">{mode === "% off" ? "Discount (%)" : "Final Price"}</label>
          <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder={mode === "% off" ? "20" : "80.00"} className="w-full bg-card-bg border border-card-border rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-accent" />
        </div>
        {p > 0 && (
          <div className="bg-surface border border-card-border rounded-xl p-5 space-y-3">
            <div className="flex justify-between"><span className="text-muted">You Save</span><span className="font-mono font-bold text-green-400">${saved.toFixed(2)}</span></div>
            <div className="flex justify-between border-t border-card-border pt-3"><span className="text-muted">Final Price</span><span className="font-mono font-bold text-xl text-accent">${final.toFixed(2)}</span></div>
            <div className="bg-accent/10 rounded-lg px-3 py-2 text-center text-sm text-accent">
              {mode === "% off" ? `${d}% off — save ${Math.round(saved / p * 100)}%` : `That's ${Math.round((p - d) / p * 100)}% off the original price`}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
