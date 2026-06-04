"use client";
import { Music } from "lucide-react"

export default function AudioSeparator() {
  return (
    <div className="mx-auto max-w-xl px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Audio Separator</h1>
      <p className="text-muted mb-6">Separate vocals from instrumentals using FFmpeg WASM.</p>
      <div className="rounded-2xl border border-card-border bg-card-bg p-6">
        <div className="rounded-xl border border-dashed border-card-border p-12 text-center">
          <Music size={48} className="mx-auto text-muted/40 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
          <p className="text-sm text-muted max-w-md mx-auto">
            Powered by FFmpeg WASM (~31MB). We're working on streaming download + Web Worker implementation for a smooth experience.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-warning/20 bg-warning/10 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-warning animate-pulse" />
            <span className="text-sm font-medium text-warning">Available in next update</span>
          </div>
        </div>
      </div>
    </div>
  )
}
