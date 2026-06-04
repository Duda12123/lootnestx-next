"use client";
import { useState, useRef } from "react"
import { Upload, Download, Image } from "lucide-react"

export default function ImageResizer() {
  const [src, setSrc] = useState<string | null>(null)
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(600)
  const [keepRatio, setKeepRatio] = useState(true)
  const [format, setFormat] = useState<"png" | "jpeg" | "webp">("png")
  const [quality, setQuality] = useState(0.9)
  const [preview, setPreview] = useState<string | null>(null)
  const origRef = useRef<{ w: number; h: number } | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    const img = new window.Image()
    img.onload = () => {
      origRef.current = { w: img.width, h: img.height }
      setSrc(url)
      setWidth(img.width)
      setHeight(img.height)
      resize(img.width, img.height, format, quality)
    }
    img.src = url
  }

  const resize = (w: number, h: number, fmt = format, q = quality) => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")!
    const img = new window.Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0, w, h)
      setPreview(canvas.toDataURL(`image/${fmt === "jpeg" ? "jpeg" : fmt}`, q))
    }
    if (src) img.src = src
  }

  const handleWidth = (v: number) => {
    setWidth(v)
    if (keepRatio && origRef.current) setHeight(Math.round(v * origRef.current.h / origRef.current.w))
  }
  const handleHeight = (v: number) => {
    setHeight(v)
    if (keepRatio && origRef.current) setWidth(Math.round(v * origRef.current.w / origRef.current.h))
  }

  const download = () => {
    if (!preview) return
    const a = document.createElement("a")
    a.download = `resized.${format}`
    a.href = preview
    a.click()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Image Resizer</h1>
      <p className="text-muted mb-6">Resize images by dimensions, percentage, or preset sizes.</p>
      {!src ? (
        <label className="flex flex-col items-center justify-center h-56 border-2 border-dashed border-card-border rounded-xl cursor-pointer hover:border-accent/30 transition-colors bg-surface">
          <Image size={40} className="text-muted-soft mb-3" />
          <span className="text-muted">Click to upload an image</span>
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-soft block mb-1">Width (px)</label>
              <input type="number" value={width} onChange={(e) => handleWidth(+e.target.value)} className="w-full bg-card-bg border border-card-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="text-xs text-muted-soft block mb-1">Height (px)</label>
              <input type="number" value={height} onChange={(e) => handleHeight(+e.target.value)} className="w-full bg-card-bg border border-card-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
            <input type="checkbox" checked={keepRatio} onChange={(e) => setKeepRatio(e.target.checked)} className="accent-accent" /> Keep aspect ratio
          </label>
          <div className="flex gap-3 items-end flex-wrap">
            <div>
              <label className="text-xs text-muted-soft block mb-1">Format</label>
              <select value={format} onChange={(e) => { setFormat(e.target.value as any); resize(width, height, e.target.value as any) }} className="bg-card-bg border border-card-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent">
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
                <option value="webp">WebP</option>
              </select>
            </div>
            {format !== "png" && (
              <div>
                <label className="text-xs text-muted-soft block mb-1">Quality ({Math.round(quality * 100)}%)</label>
                <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(e) => { setQuality(+e.target.value); resize(width, height, format, +e.target.value) }} className="w-32 accent-accent" />
              </div>
            )}
            <div className="flex-1" />
            <button onClick={download} className="tool-btn-primary"><Download size={14} className="mr-1" /> Download</button>
          </div>
          {preview && <div className="flex justify-center bg-card-bg/50 rounded-xl p-4 border border-card-border"><img src={preview} alt="preview" className="max-w-full max-h-80 rounded-lg object-contain" /></div>}
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
