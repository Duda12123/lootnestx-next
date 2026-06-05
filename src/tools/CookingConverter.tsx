"use client";
import { useState, useMemo } from "react";
import { CookingPot, ArrowRightLeft } from "lucide-react";

const conversions: Record<string, Record<string, number>> = {
  cup: { cup: 1, tbsp: 16, tsp: 48, "fl oz": 8, ml: 237, pint: 0.5, quart: 0.25, gallon: 0.0625 },
  tbsp: { tbsp: 1, tsp: 3, cup: 0.0625, "fl oz": 0.5, ml: 15 },
  tsp: { tsp: 1, tbsp: 0.333, cup: 0.0208, "fl oz": 0.167, ml: 5 },
  "fl oz": { "fl oz": 1, cup: 0.125, tbsp: 2, tsp: 6, ml: 30 },
  ml: { ml: 1, cup: 0.00423, tbsp: 0.0676, tsp: 0.203, "fl oz": 0.0338 },
  pint: { pint: 1, cup: 2, "fl oz": 16, ml: 473, quart: 0.5, gallon: 0.125 },
  quart: { quart: 1, cup: 4, pint: 2, gallon: 0.25, "fl oz": 32, ml: 946 },
  gallon: { gallon: 1, quart: 4, pint: 8, cup: 16, "fl oz": 128, ml: 3785 },
  oz: { oz: 1, lb: 0.0625, g: 28.35, kg: 0.0283 },
  lb: { lb: 1, oz: 16, g: 454, kg: 0.454 },
  g: { g: 1, oz: 0.0353, lb: 0.0022, kg: 0.001 },
  kg: { kg: 1, g: 1000, oz: 35.27, lb: 2.205 },
};

const units = ["cup", "tbsp", "tsp", "fl oz", "ml", "pint", "quart", "gallon", "oz", "lb", "g", "kg"];

export default function CookingConverter() {
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState("cup");
  const [to, setTo] = useState("tbsp");

  const result = useMemo(() => {
    const v = parseFloat(value) || 0;
    const rate = conversions[from]?.[to];
    if (rate == null) return null;
    return (v * rate).toFixed(v < 1 ? 4 : 2);
  }, [value, from, to]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-1">Cooking Converter</h1>
      <p className="text-muted mb-6">Convert cooking measurements — cups to tablespoons, ounces to grams, and more.</p>

      <div className="space-y-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">Amount</label>
            <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="w-full bg-card-bg border border-card-border rounded-xl px-3 py-3 text-lg focus:outline-none focus:border-accent" />
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">From</label>
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full bg-card-bg border border-card-border rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-accent">
              {units.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <button onClick={swap} className="p-3 rounded-xl bg-card-bg border border-card-border hover:border-accent/30 transition-colors mb-[2px]" title="Swap"><ArrowRightLeft size={18} className="text-muted" /></button>
          <div className="flex-1">
            <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">To</label>
            <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full bg-card-bg border border-card-border rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-accent">
              {units.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        {result !== null && (
          <div className="bg-surface border border-card-border rounded-xl p-5 text-center">
            <p className="text-muted-soft text-sm mb-1">{parseFloat(value) || 0} {from} =</p>
            <p className="font-mono font-bold text-3xl text-accent">{result} <span className="text-xl">{to}</span></p>
          </div>
        )}

        <div className="bg-card-bg border border-card-border rounded-xl p-4">
          <p className="text-xs text-muted-soft mb-2 uppercase tracking-wider">Quick Reference</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <p className="text-muted">1 cup = 16 tbsp</p>
            <p className="text-muted">1 tbsp = 3 tsp</p>
            <p className="text-muted">1 cup = 8 fl oz</p>
            <p className="text-muted">1 fl oz ≈ 30 ml</p>
            <p className="text-muted">1 stick butter = ½ cup</p>
            <p className="text-muted">1 lb = 16 oz</p>
          </div>
        </div>
      </div>
    </div>
  );
}
