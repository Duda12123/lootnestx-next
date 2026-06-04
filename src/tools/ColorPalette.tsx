"use client";
import { useState, useMemo } from "react"

type HSL = [number, number, number]
type Color = { hex: string; hsl: HSL }

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * c).toString(16).padStart(2, "0")
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function hexToHsl(hex: string): HSL {
  let r = 0, g = 0, b = 0
  hex = hex.replace("#", "")
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16)
    g = parseInt(hex[1] + hex[1], 16)
    b = parseInt(hex[2] + hex[2], 16)
  } else {
    r = parseInt(hex.substring(0, 2), 16)
    g = parseInt(hex.substring(2, 4), 16)
    b = parseInt(hex.substring(4, 6), 16)
  }
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60
    else if (max === g) h = ((b - r) / d + 2) * 60
    else h = ((r - g) / d + 4) * 60
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)]
}

function generatePalette(hsl: HSL): Color[] {
  const [h, s, l] = hsl
  const colors: Color[] = []
  // Complementary
  colors.push({ hex: hslToHex(h, s, l), hsl })
  colors.push({ hex: hslToHex((h + 180) % 360, s, l), hsl: [(h + 180) % 360, s, l] })
  // Analogous
  colors.push({ hex: hslToHex((h + 30) % 360, s, l), hsl: [(h + 30) % 360, s, l] })
  colors.push({ hex: hslToHex((h - 30 + 360) % 360, s, l), hsl: [(h - 30 + 360) % 360, s, l] })
  // Lighter & darker
  colors.push({ hex: hslToHex(h, Math.min(100, s + 20), Math.min(100, l + 15)), hsl: [h, Math.min(100, s + 20), Math.min(100, l + 15)] })
  colors.push({ hex: hslToHex(h, Math.min(100, s + 10), Math.max(0, l - 20)), hsl: [h, Math.min(100, s + 10), Math.max(0, l - 20)] })
  return colors
}

export default function ColorPalette() {
  const [hex, setHex] = useState("#3b82f6")
  const [hsl, setHsl] = useState<HSL>([217, 91, 60])

  const palette = useMemo(() => generatePalette(hsl), [hsl])

  const handleHex = (v: string) => {
    setHex(v)
    if (/^#[0-9a-fA-F]{6}$/.test(v)) {
      setHsl(hexToHsl(v))
    }
  }

  const handleHsl = (i: number, v: number) => {
    const next: HSL = [...hsl]
    next[i] = v
    setHsl(next)
    setHex(hslToHex(next[0], next[1], next[2]))
  }

  return (
    <div className="mx-auto max-w-xl px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Color Palette Generator</h1>
      <p className="text-muted mb-6">Pick a color and get a harmonious palette.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-5">
        {/* Color input */}
        <div className="flex gap-3">
          <div className="relative">
            <input type="color" value={hex} onChange={(e) => handleHex(e.target.value)}
              className="h-12 w-12 cursor-pointer rounded-xl border-0 bg-transparent" />
          </div>
          <input value={hex} onChange={(e) => handleHex(e.target.value)} placeholder="#000000"
            className="flex-1 rounded-xl border border-card-border bg-surface px-4 py-2.5 text-sm font-mono text-foreground focus:border-accent/40 focus:outline-none" />
        </div>

        {/* HSL sliders */}
        {(["H", "S", "L"] as const).map((label, i) => (
          <div key={label} className="flex items-center gap-3">
            <span className="w-8 text-xs font-semibold text-muted">{label}</span>
            <input type="range" min={0} max={i === 0 ? 360 : 100} value={hsl[i]} onChange={(e) => handleHsl(i, Number(e.target.value))}
              className={`flex-1 accent-accent`} />
            <span className="w-10 text-right text-xs font-mono text-muted">{hsl[i]}{i === 0 ? "°" : "%"}</span>
          </div>
        ))}

        {/* Palette */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {palette.map((c, i) => (
            <button key={i} onClick={() => handleHex(c.hex)} title={c.hex}
              className="group rounded-xl border border-card-border overflow-hidden hover:border-accent/30 transition-all"
            >
              <div className="h-16" style={{ background: c.hex }} />
              <div className="bg-surface px-2 py-1.5">
                <div className="text-xs font-mono font-medium">{c.hex}</div>
                <div className="text-[10px] text-muted-soft">H:{c.hsl[0]}° S:{c.hsl[1]}% L:{c.hsl[2]}%</div>
              </div>
            </button>
          ))}
        </div>

        {/* Copy */}
        <button onClick={() => navigator.clipboard.writeText(palette.map(c => c.hex).join(", "))}
          className="w-full rounded-xl bg-accent py-2.5 text-sm font-bold text-white hover:bg-accent-dark transition-colors">
          Copy Palette
        </button>
      </div>
    </div>
  )
}
