"use client";
import { useState, useMemo, useCallback } from "react"
import { Copy, Check, Search } from "lucide-react"

const COLORS = [
  { name: "Red", hex: "#EF4444" }, { name: "Crimson", hex: "#DC143C" }, { name: "Coral", hex: "#FF6B6B" },
  { name: "Orange", hex: "#F97316" }, { name: "Goldenrod", hex: "#DAA520" }, { name: "Amber", hex: "#F59E0B" },
  { name: "Yellow", hex: "#EAB308" }, { name: "Lime", hex: "#A3E635" }, { name: "Green", hex: "#22C55E" },
  { name: "Emerald", hex: "#10B981" }, { name: "Teal", hex: "#14B8A6" }, { name: "Cyan", hex: "#06B6D4" },
  { name: "Sky Blue", hex: "#0EA5E9" }, { name: "Blue", hex: "#3B82F6" }, { name: "Indigo", hex: "#6366F1" },
  { name: "Violet", hex: "#8B5CF6" }, { name: "Purple", hex: "#A855F7" }, { name: "Fuchsia", hex: "#D946EF" },
  { name: "Pink", hex: "#EC4899" }, { name: "Rose", hex: "#F43F5E" },
  { name: "Brown", hex: "#8B4513" }, { name: "Chocolate", hex: "#D2691E" }, { name: "Tan", hex: "#D2B48C" },
  { name: "Navy", hex: "#1E3A5F" }, { name: "Slate", hex: "#64748B" }, { name: "Gray", hex: "#9CA3AF" },
  { name: "Silver", hex: "#C0C0C0" }, { name: "White", hex: "#FFFFFF" }, { name: "Black", hex: "#000000" },
]

function hexToRgb(hex: string) { const r = parseInt(hex.slice(1, 3), 16); const g = parseInt(hex.slice(3, 5), 16); const b = parseInt(hex.slice(5, 7), 16); return { r, g, b } }
function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255; const max = Math.max(r, g, b), min = Math.min(r, g, b); let h = 0, s: number, l = (max + min) / 2
  if (max === min) { h = s = 0 } else { const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min); h = max === r ? ((g - b) / d + (g < b ? 6 : 0)) / 6 : max === g ? ((b - r) / d + 2) / 6 : ((r - g) / d + 4) / 6 }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}
function rgbToCmyk(r: number, g: number, b: number) {
  const rf = r / 255, gf = g / 255, bf = b / 255; const k = 1 - Math.max(rf, gf, bf)
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 }
  return { c: Math.round((1 - rf - k) / (1 - k) * 100), m: Math.round((1 - gf - k) / (1 - k) * 100), y: Math.round((1 - bf - k) / (1 - k) * 100), k: Math.round(k * 100) }
}

export default function ColorPicker() {
  const [hex, setHex] = useState("#3B82F6")
  const [copied, setCopied] = useState<string | null>(null)

  const rgb = useMemo(() => hexToRgb(hex), [hex])
  const hsl = useMemo(() => rgbToHsl(rgb.r, rgb.g, rgb.b), [rgb])
  const cmyk = useMemo(() => rgbToCmyk(rgb.r, rgb.g, rgb.b), [rgb])

  const copy = async (v: string) => { await navigator.clipboard.writeText(v); setCopied(v); setTimeout(() => setCopied(null), 1500) }

  const formats = [
    { label: "HEX", value: hex },
    { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: "HSL", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: "CMYK", value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
  ]

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Color Picker</h1>
      <p className="text-muted mb-6">Pick a color and get its HEX, RGB, HSL, and CMYK values.</p>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="relative">
            <input type="color" value={hex} onChange={(e) => setHex(e.target.value)} className="w-full h-48 rounded-xl cursor-pointer border-2 border-card-border" />
          </div>
          <input type="text" value={hex} onChange={(e) => setHex(e.target.value.startsWith("#") ? e.target.value : "#" + e.target.value)} className="w-full mt-3 bg-card-bg border border-card-border rounded-xl px-4 py-3 text-lg font-mono focus:outline-none focus:border-accent" />
        </div>
        <div className="flex-1 space-y-2">
          {formats.map(f => (
            <button key={f.label} onClick={() => copy(f.value)} className="w-full flex items-center justify-between bg-surface border border-card-border rounded-xl px-4 py-3 hover:border-accent/30 transition-colors">
              <span className="text-sm text-muted-soft">{f.label}</span>
              <span className="font-mono text-sm">{f.value}</span>
              {copied === f.value ? <Check size={14} className="text-green-400 ml-2" /> : <Copy size={14} className="text-muted-soft ml-2" />}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-xs text-muted-soft uppercase tracking-wider mb-3">Color Palette</h3>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {COLORS.map(c => (
            <button key={c.hex} onClick={() => setHex(c.hex)} className={`group relative rounded-xl h-14 border-2 transition-all ${hex === c.hex ? "border-white scale-110" : "border-transparent hover:scale-105"}`} style={{ backgroundColor: c.hex }} title={c.name}>
              {hex === c.hex && <div className="absolute inset-x-0 -bottom-6 text-center text-xs text-muted">{c.name}</div>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
