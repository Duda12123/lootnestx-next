"use client";
import { useState } from "react"
import { Copy } from "lucide-react"

export default function CssShadowGenerator() {
  const [h, setH] = useState(4)
  const [v, setV] = useState(4)
  const [blur, setBlur] = useState(12)
  const [spread, setSpread] = useState(0)
  const [color, setColor] = useState("#000000")
  const [opacity, setOpacity] = useState(20)
  const [inset, setInset] = useState(false)
  const [multiple, setMultiple] = useState(false)
  const [h2, setH2] = useState(0)
  const [v2, setV2] = useState(8)
  const [blur2, setBlur2] = useState(24)
  const [spread2, setSpread2] = useState(0)
  const [color2, setColor2] = useState("#000000")
  const [opacity2, setOpacity2] = useState(15)
  const [sampleBg, setSampleBg] = useState("#131317")
  const [copied, setCopied] = useState(false)

  const rgba = (hex: string, o: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${o / 100})`
  }

  const css = (() => {
    const s1 = `${inset ? "inset " : ""}${h}px ${v}px ${blur}px ${spread}px ${rgba(color, opacity)}`
    const s2 = multiple ? `, 0px ${v2}px ${blur2}px ${spread2}px ${rgba(color2, opacity2)}` : ""
    return `box-shadow: ${s1}${s2};`
  })()

  const slider = (label: string, value: number, setter: (v: number) => void, min = -50, max = 50, unit = "px") => (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-semibold text-muted-soft uppercase w-12 shrink-0">{label}</span>
      <input type="range" min={min} max={max} value={value} onChange={(e) => setter(Number(e.target.value))}
        className="flex-1 accent-accent" />
      <span className="text-xs font-mono text-muted w-10 text-right">{value}{unit}</span>
    </div>
  )

  return (
    <div className="mx-auto max-w-lg px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">CSS Box Shadow Generator</h1>
      <p className="text-muted mb-6">Generate CSS box-shadow with visual preview.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-5">
        {/* Preview */}
        <div className="flex items-center justify-center py-8" style={{ backgroundColor: sampleBg }}>
          <div className="h-32 w-32 rounded-2xl bg-accent transition-all" style={{ boxShadow: inset ? `${h}px ${v}px ${blur}px ${spread}px ${rgba(color, opacity)} inset` : `${h}px ${v}px ${blur}px ${spread}px ${rgba(color, opacity)}${multiple ? `, ${h2}px ${v2}px ${blur2}px ${spread2}px ${rgba(color2, opacity2)}` : ""}` }} />
        </div>

        <div>
          <label className="text-[10px] font-semibold text-muted-soft uppercase">Preview BG</label>
          <input type="color" value={sampleBg} onChange={(e) => setSampleBg(e.target.value)} className="h-6 w-8 rounded border-0 cursor-pointer mt-1" />
        </div>

        {/* Shadow 1 */}
        <div className="space-y-2 p-3 rounded-xl bg-surface">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-muted">Shadow 1</h3>
            <div className="flex items-center gap-3">
              <label className="text-[10px] text-muted-soft">Color:</label>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-6 w-8 rounded border-0 cursor-pointer" />
              <input type="number" min={0} max={100} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-12 rounded border border-card-border bg-surface px-1 py-0.5 text-xs font-mono text-center text-foreground" />
              <span className="text-xs text-muted-soft">%</span>
            </div>
          </div>
          {slider("H-offset", h, setH)}
          {slider("V-offset", v, setV)}
          {slider("Blur", blur, setBlur, 0, 100)}
          {slider("Spread", spread, setSpread)}
          <label className="flex items-center gap-2 text-xs text-muted cursor-pointer select-none">
            <input type="checkbox" checked={inset} onChange={(e) => setInset(e.target.checked)} className="rounded accent-accent" /> Inset
          </label>
        </div>

        {/* Multiple toggle */}
        <label className="flex items-center gap-2 text-xs text-muted cursor-pointer select-none">
          <input type="checkbox" checked={multiple} onChange={(e) => setMultiple(e.target.checked)} className="rounded accent-accent" /> Add second shadow
        </label>

        {/* Shadow 2 */}
        {multiple && (
          <div className="space-y-2 p-3 rounded-xl bg-surface">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-muted">Shadow 2</h3>
              <div className="flex items-center gap-3">
                <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="h-6 w-8 rounded border-0 cursor-pointer" />
                <input type="number" min={0} max={100} value={opacity2} onChange={(e) => setOpacity2(Number(e.target.value))} className="w-12 rounded border border-card-border bg-surface px-1 py-0.5 text-xs font-mono text-center text-foreground" />
                <span className="text-xs text-muted-soft">%</span>
              </div>
            </div>
            {slider("V-offset", v2, setV2, 0, 100)}
            {slider("Blur", blur2, setBlur2, 0, 100)}
            {slider("Spread", spread2, setSpread2)}
          </div>
        )}

        {/* CSS Output */}
        <div className="flex items-center gap-2 rounded-xl border border-accent/20 bg-accent-soft p-4">
          <code className="flex-1 text-sm font-mono text-foreground break-all">{css}</code>
          <button onClick={async () => { await navigator.clipboard.writeText(css); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
            className="shrink-0 rounded-lg border border-card-border p-2 text-muted-soft hover:text-accent transition-colors bg-surface"><Copy size={16} /></button>
        </div>
      </div>
    </div>
  )
}
