"use client";
import { useState } from "react"
import { DollarSign, Users, Percent } from "lucide-react"

export default function TipCalculator() {
  const [bill, setBill] = useState("")
  const [tipPercent, setTipPercent] = useState(15)
  const [people, setPeople] = useState(1)

  const amount = parseFloat(bill) || 0
  const tip = (amount * tipPercent) / 100
  const total = amount + tip
  const perPerson = people > 0 ? total / people : total

  const presets = [10, 15, 18, 20, 25]

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-1">Tip Calculator</h1>
      <p className="text-muted mb-6">Calculate tips and split the bill easily.</p>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">Bill Amount</label>
          <div className="relative"><DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft" /><input type="number" value={bill} onChange={(e) => setBill(e.target.value)} placeholder="0.00" className="w-full bg-card-bg border border-card-border rounded-xl pl-10 pr-4 py-3 text-lg focus:outline-none focus:border-accent" /></div>
        </div>
        <div>
          <label className="text-xs text-muted-soft block mb-2 uppercase tracking-wider">Tip Percentage</label>
          <div className="flex gap-2 flex-wrap">
            {presets.map(p => <button key={p} onClick={() => setTipPercent(p)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tipPercent === p ? "bg-accent text-white" : "bg-card-bg border border-card-border text-muted hover:text-foreground"}`}>{p}%</button>)}
            <div className="relative w-20"><input type="number" value={tipPercent} onChange={(e) => setTipPercent(+e.target.value || 0)} className="w-full bg-card-bg border border-card-border rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:border-accent" /><Percent size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-soft" /></div>
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">Number of People</label>
          <div className="flex items-center gap-2">
            <button onClick={() => setPeople(Math.max(1, people - 1))} className="w-10 h-10 rounded-lg bg-card-bg border border-card-border flex items-center justify-center hover:border-accent/30 transition-colors text-muted">-</button>
            <span className="text-2xl font-bold min-w-[40px] text-center">{people}</span>
            <button onClick={() => setPeople(people + 1)} className="w-10 h-10 rounded-lg bg-card-bg border border-card-border flex items-center justify-center hover:border-accent/30 transition-colors text-muted">+</button>
          </div>
        </div>
        {amount > 0 && (
          <div className="bg-surface border border-card-border rounded-xl p-5 space-y-3">
            <div className="flex justify-between"><span className="text-muted">Tip</span><span className="font-mono font-bold text-accent">${tip.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Total</span><span className="font-mono font-bold text-lg">${total.toFixed(2)}</span></div>
            {people > 1 && <div className="flex justify-between border-t border-card-border pt-3"><span className="text-muted">Per Person</span><span className="font-mono font-bold text-accent">${perPerson.toFixed(2)}</span></div>}
          </div>
        )}
      </div>
    </div>
  )
}
