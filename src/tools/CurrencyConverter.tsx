"use client"

import { useState, useCallback } from "react"

const RATES: Record<string, number> = {
  USD: 1, CNY: 7.25, EUR: 0.92, GBP: 0.79, JPY: 155.3, KRW: 1350, INR: 83.5, AUD: 1.53, CAD: 1.37, CHF: 0.90, HKD: 7.82, SGD: 1.35,
}

const FLAGS: Record<string, string> = { USD: "🇺🇸", CNY: "🇨🇳", EUR: "🇪🇺", GBP: "🇬🇧", JPY: "🇯🇵", KRW: "🇰🇷", INR: "🇮🇳", AUD: "🇦🇺", CAD: "🇨🇦", CHF: "🇨🇭", HKD: "🇭🇰", SGD: "🇸🇬" }

const CURRENCIES = Object.keys(RATES)

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("100")
  const [from, setFrom] = useState("USD")
  const [to, setTo] = useState("CNY")

  const result = useCallback(() => {
    const num = parseFloat(amount)
    if (isNaN(num)) return "—"
    const usdVal = num / RATES[from]
    const converted = usdVal * RATES[to]
    return converted.toFixed(2)
  }, [amount, from, to])

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <label className="block text-sm text-muted-soft">Amount</label>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
          className="w-full rounded-lg border border-card-border bg-card-bg px-4 py-3 text-lg font-mono focus:border-accent focus:outline-none transition-colors" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm text-muted-soft">From</label>
          <select value={from} onChange={e => setFrom(e.target.value)}
            className="w-full rounded-lg border border-card-border bg-card-bg px-3 py-2.5 text-sm focus:border-accent focus:outline-none transition-colors">
            {CURRENCIES.map(c => <option key={c} value={c}>{FLAGS[c]} {c}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm text-muted-soft">To</label>
          <select value={to} onChange={e => setTo(e.target.value)}
            className="w-full rounded-lg border border-card-border bg-card-bg px-3 py-2.5 text-sm focus:border-accent focus:outline-none transition-colors">
            {CURRENCIES.map(c => <option key={c} value={c}>{FLAGS[c]} {c}</option>)}
          </select>
        </div>
      </div>
      <div className="rounded-xl border border-accent/20 bg-accent/5 p-5 text-center">
        <p className="text-sm text-muted-soft mb-1">{parseFloat(amount) || 0} {FLAGS[from]} {from} =</p>
        <p className="text-3xl font-bold">{FLAGS[to]} {to} {result()}</p>
      </div>
      <p className="text-xs text-muted-soft text-center">Rates are approximate and updated periodically</p>
    </div>
  )
}
