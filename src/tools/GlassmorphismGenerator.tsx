"use client"

import { useState, useCallback } from "react"

export default function GlassmorphismGenerator() {
  const [bg, setBg] = useState("#3b82f6")
  const [opacity, setOpacity] = useState(15)
  const [blur, setBlur] = useState(12)
  const [radius, setRadius] = useState(16)
  const [copied, setCopied] = useState(false)

  const css = `background: rgba(${hexToRgb(bg).join(", ")}, ${opacity / 100});
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border-radius: ${radius}px;
border: 1px solid rgba(255, 255, 255, 0.18);`

  const copy = useCallback(() => {
    navigator.clipboard.writeText(css)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [css])

  return (
    <div className="space-y-5">
      <div className="relative rounded-2xl p-16 flex items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${bg} 0%, ${bg}88 50%, ${adjustColor(bg, 60)} 100%)` }}>
        <div className="w-40 h-40 rounded-2xl flex items-center justify-center text-white/60 text-6xl"
          style={{
            background: `rgba(${hexToRgb(bg).join(", ")}, ${opacity / 100})`,
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
            borderRadius: `${radius}px`,
            border: "1px solid rgba(255,255,255,0.18)",
          }}>
          ✨
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs text-muted-soft">Color</label>
          <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="w-full h-9 rounded cursor-pointer border border-card-border" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-muted-soft">Border Radius ({radius}px)</label>
          <input type="range" min={0} max={48} value={radius} onChange={e => setRadius(+e.target.value)} className="w-full accent-accent" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-muted-soft">Opacity ({opacity}%)</label>
          <input type="range" min={5} max={50} value={opacity} onChange={e => setOpacity(+e.target.value)} className="w-full accent-accent" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-muted-soft">Blur ({blur}px)</label>
          <input type="range" min={0} max={40} value={blur} onChange={e => setBlur(+e.target.value)} className="w-full accent-accent" />
        </div>
      </div>

      <div className="rounded-xl border border-card-border bg-card-bg/50 p-4">
        <pre className="text-xs font-mono text-muted overflow-x-auto whitespace-pre-wrap select-all">{css}</pre>
        <button onClick={copy} className="mt-3 rounded-lg bg-accent/10 px-3 py-1.5 text-xs text-accent hover:bg-accent/20 transition-colors">
          {copied ? "Copied!" : "Copy CSS"}
        </button>
      </div>
    </div>
  )
}

function hexToRgb(hex: string): number[] {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

function adjustColor(hex: string, amt: number): string {
  const [r, g, b] = hexToRgb(hex)
  const nr = Math.min(255, r + amt)
  const ng = Math.min(255, g + amt)
  const nb = Math.min(255, b + amt)
  return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`
}
