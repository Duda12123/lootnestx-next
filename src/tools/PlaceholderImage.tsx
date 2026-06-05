"use client"

import { useState, useCallback } from "react"

const SIZES = [640, 768, 1024, 1280, 1920]
const RATIOS = ["16:9", "4:3", "1:1", "3:2", "21:9"]

function ratioToSize(ratio: string, w: number): [number, number] {
  const [rw, rh] = ratio.split(":").map(Number)
  return [w, Math.round(w * rh / rw)]
}

export default function PlaceholderImage() {
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(400)
  const [text, setText] = useState("800×400")
  const [bgColor, setBgColor] = useState("3b82f6")
  const [fgColor, setFgColor] = useState("ffffff")
  const [ratio, setRatio] = useState("16:9")

  const previewUrl = `https://placehold.co/${width}x${height}/${bgColor}/${fgColor}?text=${encodeURIComponent(text)}&font=raleway`

  const applyRatio = useCallback((r: string) => {
    setRatio(r)
    const [w, h] = ratioToSize(r, width)
    setWidth(w)
    setHeight(h)
    setText(`${w}×${h}`)
  }, [width])

  const applySize = useCallback((w: number) => {
    setWidth(w)
    const [, h] = ratioToSize(ratio, w)
    setHeight(h)
    setText(`${w}×${h}`)
  }, [ratio])

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-card-border bg-card-bg/50 overflow-hidden">
        <img src={previewUrl} alt="Preview" className="w-full" />
      </div>
      <div className="flex flex-wrap gap-2">
        {SIZES.map(s => (
          <button key={s} onClick={() => applySize(s)}
            className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${s === width ? "bg-accent/20 text-accent" : "bg-card-bg/30 text-muted-soft hover:bg-card-bg"}`}>
            {s}px
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {RATIOS.map(r => (
          <button key={r} onClick={() => applyRatio(r)}
            className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${r === ratio ? "bg-accent/20 text-accent" : "bg-card-bg/30 text-muted-soft hover:bg-card-bg"}`}>
            {r}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-muted-soft">Width</label>
          <input type="number" value={width} onChange={e => { setWidth(+e.target.value); setText(`${e.target.value}×${height}`) }}
            className="w-full rounded-lg border border-card-border bg-card-bg px-3 py-2 text-sm font-mono focus:border-accent focus:outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-soft">Height</label>
          <input type="number" value={height} onChange={e => { setHeight(+e.target.value); setText(`${width}×${e.target.value}`) }}
            className="w-full rounded-lg border border-card-border bg-card-bg px-3 py-2 text-sm font-mono focus:border-accent focus:outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-soft">BG Color</label>
          <div className="flex items-center gap-2 rounded-lg border border-card-border bg-card-bg px-3 py-1.5">
            <span className="text-xs text-muted-soft">#</span>
            <input value={bgColor} onChange={e => setBgColor(e.target.value.replace("#", ""))} className="w-full bg-transparent text-sm font-mono focus:outline-none" />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-soft">Text Color</label>
          <div className="flex items-center gap-2 rounded-lg border border-card-border bg-card-bg px-3 py-1.5">
            <span className="text-xs text-muted-soft">#</span>
            <input value={fgColor} onChange={e => setFgColor(e.target.value.replace("#", ""))} className="w-full bg-transparent text-sm font-mono focus:outline-none" />
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-card-border bg-card-bg/50 p-3">
        <p className="text-xs font-mono text-muted-soft select-all break-all">{previewUrl}</p>
        <button onClick={() => { navigator.clipboard.writeText(previewUrl) }} className="mt-2 rounded-lg bg-accent/10 px-3 py-1 text-xs text-accent hover:bg-accent/20 transition-colors">
          Copy URL
        </button>
      </div>
    </div>
  )
}
