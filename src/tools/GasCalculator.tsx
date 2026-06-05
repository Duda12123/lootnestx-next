"use client";
import { useState, useMemo } from "react";
import { Fuel, MapPin, DollarSign } from "lucide-react";

const stateAvgGas: Record<string, number> = {
  "National Avg": 3.50, "California": 4.80, "Texas": 2.95, "Florida": 3.30,
  "New York": 3.55, "Illinois": 3.60, "Pennsylvania": 3.45, "Ohio": 3.20,
  "Georgia": 3.10, "Michigan": 3.35, "Washington": 4.15, "Colorado": 3.25,
  "Arizona": 3.55, "Massachusetts": 3.40, "Virginia": 3.20, "Custom": 0,
};

export default function GasCalculator() {
  const [distance, setDistance] = useState("300");
  const [mpg, setMpg] = useState("25");
  const [state, setState] = useState("National Avg");
  const [customPrice, setCustomPrice] = useState("4.00");

  const gasPrice = state === "Custom" ? (parseFloat(customPrice) || 0) : (stateAvgGas[state] || 3.50);

  const result = useMemo(() => {
    const d = parseFloat(distance) || 0;
    const m = parseFloat(mpg) || 1;
    const gallons = d / m;
    const cost = gallons * gasPrice;
    return { gallons: gallons.toFixed(1), cost: cost.toFixed(2), perMile: (cost / d).toFixed(2) };
  }, [distance, mpg, gasPrice]);

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-1">Gas Calculator</h1>
      <p className="text-muted mb-6">Calculate fuel costs for road trips and daily commutes.</p>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">Trip Distance (miles)</label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft" />
            <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} className="w-full bg-card-bg border border-card-border rounded-xl pl-10 pr-4 py-3 text-lg focus:outline-none focus:border-accent" />
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">Vehicle MPG</label>
          <div className="relative">
            <Fuel size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft" />
            <input type="number" value={mpg} onChange={(e) => setMpg(e.target.value)} className="w-full bg-card-bg border border-card-border rounded-xl pl-10 pr-4 py-3 text-lg focus:outline-none focus:border-accent" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">State (avg price)</label>
            <select value={state} onChange={(e) => setState(e.target.value)} className="w-full bg-card-bg border border-card-border rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-accent">
              {Object.keys(stateAvgGas).map((s) => <option key={s} value={s}>{s} {stateAvgGas[s] > 0 ? `$${stateAvgGas[s].toFixed(2)}` : ""}</option>)}
            </select>
          </div>
          {state === "Custom" && (
            <div>
              <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">Price per Gallon</label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft" />
                <input type="number" step="0.01" value={customPrice} onChange={(e) => setCustomPrice(e.target.value)} className="w-full bg-card-bg border border-card-border rounded-xl pl-10 pr-4 py-3 text-lg focus:outline-none focus:border-accent" />
              </div>
            </div>
          )}
        </div>

        {result.gallons && (
          <div className="bg-surface border border-card-border rounded-xl p-5 space-y-3">
            <div className="flex justify-between"><span className="text-muted">Gallons Needed</span><span className="font-mono font-bold">{result.gallons} gal</span></div>
            <div className="flex justify-between border-t border-card-border pt-3"><span className="text-muted">Total Gas Cost</span><span className="font-mono font-bold text-xl text-accent">${result.cost}</span></div>
            <div className="flex justify-between"><span className="text-muted">Cost per Mile</span><span className="font-mono text-muted">${result.perMile}/mi</span></div>
            <p className="text-xs text-muted-soft">Based on {mpg} MPG at ${gasPrice.toFixed(2)}/gal</p>
          </div>
        )}
      </div>
    </div>
  );
}
