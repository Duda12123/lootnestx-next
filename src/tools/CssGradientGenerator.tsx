"use client";
import { useState } from "react"
import { Copy, Plus, Trash2 } from "lucide-react"

interface Stop { color: string; position: number }

function defaultStops(): Stop[] {
  return [
    { color: "#3b82f6", position: 0 },
    { color: "#8b5cf6", position: 50 },
    { color: "#ec4899", position: 100 },
  ]
}

export default function CssGradientGenerator() {
  const [stops, setStops] = useState<Stop[]>(defaultStops())
  const [angle, setAngle] = useState(135)
  const [type, setType] = useState<"linear" | "radial">("linear")
  const [copied, setCopied] = useState(false)

  const css = (() => {
    const s = stops.map((st) => `${st.color} ${st.position}%`).join(", ")
    return type === "linear"
      ? `background: linear-gradient(${angle}deg, ${s});`
      : `background: radial-gradient(circle, ${s});`
  })()

  const updateStop = (i: number, field: keyof Stop, value: string | number) => {
    setStops((prev) => prev.map((st, j) => j === i ? { ...st, [field]: value } : st))
  }

  const addStop = () => {
    const pos = stops.length > 1 ? Math.round((stops[stops.length - 1].position + stops[0].position) / 2) : 50
    setStops((prev) => [...prev, { color: "#a0a0a0", position: pos }])
  }

  const removeStop = (i: number) => {
    if (stops.length <= 2) return
    setStops((prev) => prev.filter((_, j) => j !== i))
  }

  return (
    <div className="mx-auto max-w-lg px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">CSS Gradient Generator</h1>
      <p className="text-muted mb-6">Create beautiful CSS gradients with a visual editor.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-5">
        {/* Preview */}
        <div className="h-40 rounded-2xl border border-card-border transition-all"
          style={{ background: type === "linear" ? `linear-gradient(${angle}deg, ${stops.map((s) => `${s.color} ${s.position}%`).join(", ")})` : `radial-gradient(circle, ${stops.map((s) => `${s.color} ${s.position}%`).join(", ")})` }} />

        {/* Type + Angle */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-[10px] font-semibold text-muted-soft uppercase">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as typeof type)}
              className="mt-1 w-full rounded-lg border border-card-border bg-surface px-3 py-2 text-sm text-foreground">
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
            </select>
          </div>
          {type === "linear" && (
            <div className="flex-1">
              <label className="text-[10px] font-semibold text-muted-soft uppercase">Angle: {angle}°</label>
              <input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(Number(e.target.value))}
                className="mt-1 w-full accent-accent" />
            </div>
          )}
        </div>

        {/* Color stops */}
        <div className="space-y-2">
          {stops.map((st, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-muted-soft w-5">{i + 1}</span>
              <input type="color" value={st.color} onChange={(e) => updateStop(i, "color", e.target.value)}
                className="h-8 w-8 rounded-lg border-0 cursor-pointer shrink-0" />
              <input value={st.color} onChange={(e) => updateStop(i, "color", e.target.value)}
                className="flex-1 rounded-lg border border-card-border bg-surface px-2 py-1.5 text-xs font-mono text-foreground" />
              <input type="number" min={0} max={100} value={st.position} onChange={(e) => updateStop(i, "position", Number(e.target.value))}
                className="w-14 rounded-lg border border-card-border bg-surface px-2 py-1.5 text-xs font-mono text-center text-foreground" />
              <span className="text-xs text-muted-soft">%</span>
              {stops.length > 2 && (
                <button onClick={() => removeStop(i)} className="text-muted-soft hover:text-danger transition-colors"><Trash2 size={14} /></button>
              )}
            </div>
          ))}
          <button onClick={addStop} className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent-light font-medium transition-colors">
            <Plus size={12} /> Add Color Stop
          </button>
        </div>

        {/* CSS Output */}
        <div className="flex items-center gap-2 rounded-xl border border-accent/20 bg-accent-soft p-4">
          <code className="flex-1 text-sm font-mono text-foreground break-all">{css}</code>
          <button onClick={async () => { await navigator.clipboard.writeText(css); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
            className="shrink-0 rounded-lg border border-card-border p-2 text-muted-soft hover:text-accent transition-colors bg-surface">
            <Copy size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
