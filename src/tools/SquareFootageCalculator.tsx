"use client";
import { useState } from "react";
import { Ruler, Square } from "lucide-react";

export default function SquareFootageCalculator() {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [unit, setUnit] = useState<"ft" | "in" | "yd" | "m">("ft");

  const toFeet = (v: number, u: string) => {
    if (u === "ft") return v;
    if (u === "in") return v / 12;
    if (u === "yd") return v * 3;
    if (u === "m") return v * 3.28084;
    return v;
  };

  const l = parseFloat(length) || 0;
  const w = parseFloat(width) || 0;
  const sqft = Math.round(toFeet(l, unit) * toFeet(w, unit) * 100) / 100;
  const sqyd = sqft / 9;
  const sqm = sqft / 10.764;

  const presets = [
    { label: "Small Bedroom", l: "10", w: "10", u: "ft" as const },
    { label: "Master Bedroom", l: "14", w: "16", u: "ft" as const },
    { label: "Living Room", l: "16", w: "20", u: "ft" as const },
    { label: "2-Car Garage", l: "20", w: "20", u: "ft" as const },
    { label: "Bathroom", l: "5", w: "8", u: "ft" as const },
  ];

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-1">Square Footage Calculator</h1>
      <p className="text-muted mb-6">Calculate square footage for rooms, flooring, and home projects.</p>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">Length</label>
            <div className="relative">
              <Ruler size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft" />
              <input type="number" value={length} onChange={(e) => setLength(e.target.value)} placeholder="12" className="w-full bg-card-bg border border-card-border rounded-xl pl-10 pr-4 py-3 text-lg focus:outline-none focus:border-accent" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">Width</label>
            <div className="relative">
              <Ruler size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft" />
              <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} placeholder="10" className="w-full bg-card-bg border border-card-border rounded-xl pl-10 pr-4 py-3 text-lg focus:outline-none focus:border-accent" />
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">Unit</label>
          <div className="flex gap-2">
            {(["ft", "in", "yd", "m"] as const).map((u) => (
              <button key={u} onClick={() => setUnit(u)} className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${unit === u ? "bg-accent text-white border-accent" : "bg-card-bg border-card-border text-muted hover:text-foreground"}`}>
                {u === "ft" ? "Feet" : u === "in" ? "Inches" : u === "yd" ? "Yards" : "Meters"}
              </button>
            ))}
          </div>
        </div>

        {sqft > 0 && (
          <div className="bg-surface border border-card-border rounded-xl p-5 space-y-3">
            <div className="flex justify-between border-b border-card-border pb-3">
              <span className="text-muted">Area</span>
              <span className="font-mono font-bold text-2xl text-accent">{sqft.toLocaleString()} <span className="text-base">sq ft</span></span>
            </div>
            <div className="flex justify-between"><span className="text-muted">Square Yards</span><span className="font-mono">{sqyd.toFixed(1)} sq yd</span></div>
            <div className="flex justify-between"><span className="text-muted">Square Meters</span><span className="font-mono">{sqm.toFixed(1)} m²</span></div>
          </div>
        )}

        <div className="bg-card-bg border border-card-border rounded-xl p-4">
          <p className="text-xs text-muted-soft mb-2 uppercase tracking-wider">Room Size Presets</p>
          <div className="space-y-1">
            {presets.map((p) => (
              <button key={p.label} onClick={() => { setLength(p.l); setWidth(p.w); setUnit(p.u); }} className="w-full text-left flex justify-between items-center px-3 py-2 rounded-lg hover:bg-surface transition-colors text-sm">
                <span className="text-muted">{p.label}</span>
                <span className="text-muted-soft">{p.l}×{p.w} ft</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
