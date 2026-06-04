"use client";
import { useState } from "react"
import { Copy } from "lucide-react"

function hexToRgb(h: string) {
  h = h.replace("#", "")
  if (h.length === 3) h = h.split("").map((c) => c + c).join("")
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return { r, g, b }
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToRgb(h: number, s: number, l: number) {
  h /= 360; s /= 100; l /= 100
  if (s === 0) return { r: Math.round(l * 255), g: Math.round(l * 255), b: Math.round(l * 255) }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  return { r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255), g: Math.round(hue2rgb(p, q, h) * 255), b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255) }
}

function rgbToCmyk(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255
  const k = 1 - Math.max(r, g, b)
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 }
  return {
    c: Math.round(((1 - r - k) / (1 - k)) * 100),
    m: Math.round(((1 - g - k) / (1 - k)) * 100),
    y: Math.round(((1 - b - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  }
}

function clamp(v: number) { return Math.max(0, Math.min(255, v)) }

export default function ColorConverter() {
  const [hex, setHex] = useState("#3b82f6")
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 })
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 })
  const [cmyk, setCmyk] = useState({ c: 76, m: 47, y: 0, k: 3 })

  const updateFromHex = (h: string) => {
    setHex(h)
    if (!/^#?[0-9a-fA-F]{3,6}$/.test(h)) return
    const { r, g, b } = hexToRgb(h)
    setRgb({ r, g, b })
    setHsl(rgbToHsl(r, g, b))
    setCmyk(rgbToCmyk(r, g, b))
  }

  const updateFromRgb = (r: number, g: number, b: number) => {
    if (isNaN(r) || isNaN(g) || isNaN(b)) return
    setRgb({ r, g, b })
    setHex(rgbToHex(r, g, b))
    setHsl(rgbToHsl(r, g, b))
    setCmyk(rgbToCmyk(r, g, b))
  }

  const updateFromHsl = (h: number, s: number, l: number) => {
    if (isNaN(h) || isNaN(s) || isNaN(l)) return
    setHsl({ h, s, l })
    const rgb = hslToRgb(h, s, l)
    setRgb(rgb)
    setHex(rgbToHex(rgb.r, rgb.g, rgb.b))
    setCmyk(rgbToCmyk(rgb.r, rgb.g, rgb.b))
  }

  const ColorRow = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div className="flex items-center gap-3">
      <span className="w-10 text-[10px] font-semibold text-muted-soft uppercase shrink-0">{label}</span>
      <div className="flex-1 flex items-center gap-2">{children}</div>
    </div>
  )

  return (
    <div className="mx-auto max-w-lg px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Color Converter</h1>
      <p className="text-muted mb-6">Convert colors between HEX, RGB, HSL, and CMYK formats.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-5">
        {/* Color preview */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl border border-card-border shadow-lg" style={{ backgroundColor: hex }} />
          <div>
            <div className="text-lg font-mono font-bold text-foreground">{hex}</div>
            <div className="text-sm text-muted mt-0.5">Current color</div>
          </div>
        </div>

        {/* HEX */}
        <ColorRow label="HEX">
          <span className="text-muted-soft text-sm">#</span>
          <input value={hex.replace("#", "")} onChange={(e) => updateFromHex("#" + e.target.value)}
            className="flex-1 rounded-lg border border-card-border bg-surface px-3 py-2 text-sm font-mono text-foreground focus:border-accent/40 focus:outline-none" />
        </ColorRow>

        {/* RGB */}
        <ColorRow label="RGB">
          {(["r", "g", "b"] as const).map((ch) => (
            <div key={ch} className="flex items-center gap-1 flex-1">
              <span className="text-[10px] text-muted-soft uppercase w-3">{ch}</span>
              <input type="number" min={0} max={255} value={rgb[ch]}
                onChange={(e) => updateFromRgb(ch === "r" ? +e.target.value : rgb.r, ch === "g" ? +e.target.value : rgb.g, ch === "b" ? +e.target.value : rgb.b)}
                className="w-full rounded-lg border border-card-border bg-surface px-2 py-2 text-sm font-mono text-center text-foreground focus:border-accent/40 focus:outline-none" />
            </div>
          ))}
        </ColorRow>

        {/* HSL */}
        <ColorRow label="HSL">
          {([{ k: "h", min: 0, max: 360, unit: "°" }, { k: "s", min: 0, max: 100, unit: "%" }, { k: "l", min: 0, max: 100, unit: "%" }] as const).map(({ k, min, max, unit }) => (
            <div key={k} className="flex items-center gap-1 flex-1">
              <span className="text-[10px] text-muted-soft uppercase w-3">{k}</span>
              <input type="number" min={min} max={max} value={hsl[k]}
                onChange={(e) => updateFromHsl(k === "h" ? +e.target.value : hsl.h, k === "s" ? +e.target.value : hsl.s, k === "l" ? +e.target.value : hsl.l)}
                className="w-full rounded-lg border border-card-border bg-surface px-2 py-2 text-sm font-mono text-center text-foreground focus:border-accent/40 focus:outline-none" />
              <span className="text-[10px] text-muted-soft">{unit}</span>
            </div>
          ))}
        </ColorRow>

        {/* CMYK */}
        <ColorRow label="CMYK">
          <div className="text-sm font-mono text-muted bg-surface rounded-lg border border-card-border px-3 py-2 flex-1 text-center">
            c{cmyk.c} m{cmyk.m} y{cmyk.y} k{cmyk.k}
          </div>
          <button onClick={() => navigator.clipboard.writeText(`cmyk(${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k})`)}
            className="text-muted-soft hover:text-accent transition-colors p-1"><Copy size={14} /></button>
        </ColorRow>
      </div>
    </div>
  )
}
