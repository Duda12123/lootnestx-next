"use client";
import { Film } from "lucide-react"

export default function SubtitleRemover() {
  return (
    <div className="mx-auto max-w-xl px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Subtitle Remover</h1>
      <p className="text-muted mb-6">Remove embedded subtitles and watermarks from videos using FFmpeg WASM.</p>
      <div className="rounded-2xl border border-card-border bg-card-bg p-6">
        <div className="rounded-xl border border-dashed border-card-border p-12 text-center">
          <Film size={48} className="mx-auto text-muted/40 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
          <p className="text-sm text-muted max-w-md mx-auto">
            FFmpeg WASM video processing pipeline. We're building the crop-blur workflow for automatic subtitle and watermark removal.
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
