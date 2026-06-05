"use client"

import { useState } from "react"

export default function ScreenInfo() {
  const [info] = useState({
    width: typeof window !== "undefined" ? window.screen.width : 0,
    height: typeof window !== "undefined" ? window.screen.height : 0,
    availWidth: typeof window !== "undefined" ? window.screen.availWidth : 0,
    availHeight: typeof window !== "undefined" ? window.screen.availHeight : 0,
    colorDepth: typeof window !== "undefined" ? window.screen.colorDepth : 0,
    pixelRatio: typeof window !== "undefined" ? window.devicePixelRatio : 0,
    innerW: typeof window !== "undefined" ? window.innerWidth : 0,
    innerH: typeof window !== "undefined" ? window.innerHeight : 0,
  })

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-card-border bg-card-bg/50 p-5 text-center">
        <p className="text-sm text-muted-soft mb-1">Your Screen Resolution</p>
        <p className="text-3xl font-mono font-bold text-accent">{info.width} × {info.height}</p>
        <p className="text-xs text-muted-soft mt-1">@{info.pixelRatio}x · {info.colorDepth}-bit color</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        {[
          { label: "Screen", value: `${info.width}×${info.height}` },
          { label: "Available", value: `${info.availWidth}×${info.availHeight}` },
          { label: "Viewport", value: `${info.innerW}×${info.innerH}` },
          { label: "DPR", value: `${info.pixelRatio}x` },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg border border-card-border bg-card-bg/30 p-3">
            <p className="text-xs text-muted-soft">{label}</p>
            <p className="font-mono text-sm mt-0.5">{value}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-soft text-center">Useful for responsive design testing and debugging viewport issues.</p>
    </div>
  )
}
