"use client";
import { useState, useMemo } from "react";
import { Home, DollarSign, Percent } from "lucide-react";

export default function MortgageCalculator() {
  const [price, setPrice] = useState("300000");
  const [down, setDown] = useState("20");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState(30);

  const result = useMemo(() => {
    const p = parseFloat(price) || 0;
    const dp = parseFloat(down) || 0;
    const r = parseFloat(rate) || 0;
    const loan = dp >= 100 ? p - dp : p * (1 - dp / 100);
    const monthlyRate = r / 100 / 12;
    const n = years * 12;
    if (monthlyRate === 0) return { loan, monthly: loan / n, total: loan, interest: 0 };
    const monthly = (loan * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    const total = monthly * n;
    return {
      loan: Math.round(loan),
      monthly: Math.round(monthly),
      total: Math.round(total),
      interest: Math.round(total - loan),
    };
  }, [price, down, rate, years]);

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-1">Mortgage Calculator</h1>
      <p className="text-muted mb-6">Estimate your monthly payment including principal and interest.</p>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">Home Price</label>
          <div className="relative">
            <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft" />
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-card-bg border border-card-border rounded-xl pl-10 pr-4 py-3 text-lg focus:outline-none focus:border-accent" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">Down Payment</label>
            <div className="relative">
              <input type="number" value={down} onChange={(e) => setDown(e.target.value)} className="w-full bg-card-bg border border-card-border rounded-xl px-3 pr-8 py-3 text-lg focus:outline-none focus:border-accent" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-soft text-sm">{down.includes("%") || down.length > 2 ? "%" : ""}</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">Interest Rate</label>
            <div className="relative">
              <input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full bg-card-bg border border-card-border rounded-xl px-3 pr-8 py-3 text-lg focus:outline-none focus:border-accent" />
              <Percent size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-soft" />
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">Loan Term</label>
          <div className="flex gap-2">
            {[15, 20, 30].map((y) => (
              <button key={y} onClick={() => setYears(y)} className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${years === y ? "bg-accent text-white border-accent" : "bg-card-bg border-card-border text-muted hover:text-foreground"}`}>
                {y} Years
              </button>
            ))}
          </div>
        </div>

        {result.loan > 0 && (
          <div className="bg-surface border border-card-border rounded-xl p-5 space-y-3">
            <div className="flex justify-between"><span className="text-muted">Loan Amount</span><span className="font-mono font-bold">${result.loan.toLocaleString()}</span></div>
            <div className="flex justify-between border-t border-card-border pt-3"><span className="text-muted">Monthly Payment</span><span className="font-mono font-bold text-xl text-accent">${result.monthly.toLocaleString()}<span className="text-sm text-muted-soft">/mo</span></span></div>
            <div className="flex justify-between"><span className="text-muted">Total Interest</span><span className="font-mono text-muted">${result.interest.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted">Total Cost</span><span className="font-mono text-muted">${result.total.toLocaleString()}</span></div>
          </div>
        )}
      </div>
    </div>
  );
}
