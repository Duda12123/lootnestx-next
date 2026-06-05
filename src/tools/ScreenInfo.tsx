"use client"

import { useState, useEffect } from "react"

interface ScreenData {
  width: number
  height: number
  availWidth: number
  availHeight: number
  colorDepth: number
  pixelRatio: number
  innerW: number
  innerH: number
}

export default function ScreenInfo() {
  const [info, setInfo] = useState<ScreenData>({
    width: 0, height: 0, availWidth: 0, availHeight: 0,
    colorDepth: 0, pixelRatio: 1, innerW: 0, innerH: 0,
  })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setInfo({
      width: window.screen.width,
      height: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
      innerW: window.innerWidth,
      innerH: window.innerHeight,
    })
    setLoaded(true)
  }, [])

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-16 w-48 rounded-xl bg-card-bg mx-auto" />
          <div className="flex gap-3">
            <div className="h-16 w-20 rounded-lg bg-card-bg" />
            <div className="h-16 w-20 rounded-lg bg-card-bg" />
            <div className="h-16 w-20 rounded-lg bg-card-bg" />
            <div className="h-16 w-20 rounded-lg bg-card-bg" />
          </div>
        </div>
      </div>
    )
  }

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
