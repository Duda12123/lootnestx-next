"use client";
import { useState, useMemo } from "react";
import { Receipt, DollarSign, MapPin } from "lucide-react";

const stateRates: Record<string, number> = {
  "Alabama": 4.00, "Alaska": 0.00, "Arizona": 5.60, "Arkansas": 6.50,
  "California": 7.25, "Colorado": 2.90, "Connecticut": 6.35, "Delaware": 0.00,
  "Florida": 6.00, "Georgia": 4.00, "Hawaii": 4.00, "Idaho": 6.00,
  "Illinois": 6.25, "Indiana": 7.00, "Iowa": 6.00, "Kansas": 6.50,
  "Kentucky": 6.00, "Louisiana": 4.45, "Maine": 5.50, "Maryland": 6.00,
  "Massachusetts": 6.25, "Michigan": 6.00, "Minnesota": 6.875, "Mississippi": 7.00,
  "Missouri": 4.225, "Montana": 0.00, "Nebraska": 5.50, "Nevada": 6.85,
  "New Hampshire": 0.00, "New Jersey": 6.625, "New Mexico": 4.875, "New York": 4.00,
  "North Carolina": 4.75, "North Dakota": 5.00, "Ohio": 5.75, "Oklahoma": 4.50,
  "Oregon": 0.00, "Pennsylvania": 6.00, "Rhode Island": 7.00, "South Carolina": 6.00,
  "South Dakota": 4.50, "Tennessee": 7.00, "Texas": 6.25, "Utah": 6.10,
  "Vermont": 6.00, "Virginia": 5.30, "Washington": 6.50, "West Virginia": 6.00,
  "Wisconsin": 5.00, "Wyoming": 4.00,
};

export default function SalesTaxCalculator() {
  const [amount, setAmount] = useState("100");
  const [state, setState] = useState("California");
  const [extraTax, setExtraTax] = useState("2");

  const result = useMemo(() => {
    const base = parseFloat(amount) || 0;
    const rate = (stateRates[state] || 0) + (parseFloat(extraTax) || 0);
    const tax = (base * rate) / 100;
    return { rate: rate.toFixed(2), tax: tax.toFixed(2), total: (base + tax).toFixed(2) };
  }, [amount, state, extraTax]);

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-1">Sales Tax Calculator</h1>
      <p className="text-muted mb-6">Calculate sales tax by state. Includes state base rates — add local taxes for your area.</p>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">Amount (before tax)</label>
          <div className="relative">
            <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft" />
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-card-bg border border-card-border rounded-xl pl-10 pr-4 py-3 text-lg focus:outline-none focus:border-accent" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">State</label>
            <select value={state} onChange={(e) => setState(e.target.value)} className="w-full bg-card-bg border border-card-border rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-accent">
              {Object.keys(stateRates).sort().map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">Local Tax %</label>
            <input type="number" step="0.1" value={extraTax} onChange={(e) => setExtraTax(e.target.value)} className="w-full bg-card-bg border border-card-border rounded-xl px-3 py-3 text-lg text-center focus:outline-none focus:border-accent" />
          </div>
        </div>

        <p className="text-xs text-muted-soft text-center">
          {state}: {(stateRates[state] || 0).toFixed(2)}% state + {parseFloat(extraTax || "0").toFixed(1)}% local = <span className="text-foreground font-medium">{result.rate}% total</span>
        </p>

        {parseFloat(amount) > 0 && (
          <div className="bg-surface border border-card-border rounded-xl p-5 space-y-3">
            <div className="flex justify-between"><span className="text-muted">Tax</span><span className="font-mono font-bold text-accent">${result.tax}</span></div>
            <div className="flex justify-between border-t border-card-border pt-3"><span className="text-muted">Total with Tax</span><span className="font-mono font-bold text-xl">${result.total}</span></div>
          </div>
        )}
      </div>
    </div>
  );
}
