"use client";
import { useState, useRef, useCallback } from "react"
import { Upload, Download, Trash2, ImageIcon } from "lucide-react"

export default function ImageCompressor() {
  const [original, setOriginal] = useState<File | null>(null)
  const [preview, setPreview] = useState("")
  const [result, setResult] = useState("")
  const [quality, setQuality] = useState(70)
  const [origSize, setOrigSize] = useState("")
  const [newSize, setNewSize] = useState("")
  const [format, setFormat] = useState<"jpeg" | "webp">("jpeg")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFile = useCallback((file: File) => {
    setOriginal(file)
    setOrigSize(formatBytes(file.size))
    setResult("")
    const url = URL.createObjectURL(file)
    setPreview(url)
  }, [])

  const compress = () => {
    if (!original || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")!
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      canvas.toBlob((blob) => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        setResult(url)
        setNewSize(formatBytes(blob.size))
      }, `image/${format}`, quality / 100)
    }
    img.src = preview
  }

  const download = () => {
    if (!result) return
    const a = document.createElement("a")
    a.href = result
    a.download = `compressed.${format}`
    a.click()
  }

  return (
    <div className="mx-auto max-w-xl px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Image Compressor</h1>
      <p className="text-muted mb-6">Compress PNG, JPEG, and WebP images right in your browser.</p>

      <canvas ref={canvasRef} className="hidden" />

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-5">
        {!original ? (
          <div className="rounded-xl border-2 border-dashed border-card-border p-12 text-center hover:border-accent/30 transition-colors cursor-pointer"
            onClick={() => document.getElementById("file-input")?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}>
            <ImageIcon size={40} className="mx-auto text-muted/50 mb-3" />
            <p className="text-muted font-medium">Drop image or click to browse</p>
            <p className="text-xs text-muted-soft mt-1">PNG, JPEG, WebP supported</p>
            <input id="file-input" type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} className="hidden" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview" className="h-16 w-16 rounded-xl object-cover border border-card-border" />
              <div className="flex-1">
                <div className="text-sm font-semibold truncate">{original.name}</div>
                <div className="text-xs text-muted mt-0.5">{origSize}</div>
              </div>
              <button onClick={() => { setOriginal(null); setPreview(""); setResult(""); }}
                className="rounded-lg border border-card-border p-2 text-muted hover:text-danger transition-colors"><Trash2 size={16} /></button>
            </div>

            <div className="flex gap-3 pt-3">
              <div className="flex-1">
                <label className="text-[10px] font-semibold text-muted-soft uppercase">Quality: {quality}%</label>
                <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(Number(e.target.value))}
                  className="mt-1 w-full accent-accent" />
              </div>
              <select value={format} onChange={(e) => setFormat(e.target.value as "jpeg" | "webp")}
                className="rounded-lg border border-card-border bg-surface px-3 py-2 text-sm text-foreground self-end">
                <option value="jpeg">JPEG</option>
                <option value="webp">WebP</option>
              </select>
            </div>

            <button onClick={compress} className="w-full rounded-xl bg-accent py-3 text-sm font-bold text-white hover:bg-accent-dark transition-colors">
              Compress
            </button>

            {result && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">New size:</span>
                  <span className="font-semibold text-success">{newSize}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Saved:</span>
                  <span className="font-semibold text-accent">{savings(origSize, newSize)}</span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={result} alt="Compressed" className="rounded-xl border border-card-border max-w-full" />
                <button onClick={download} className="inline-flex items-center gap-2 rounded-xl border border-card-border px-5 py-2.5 text-sm font-semibold text-muted hover:text-foreground hover:bg-surface transition-colors">
                  <Download size={16} /> Download
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / (1024 * 1024)).toFixed(2)} MB`
}

function savings(o: string, n: string) {
  const a = parseFloat(o), b = parseFloat(n)
  if (isNaN(a) || isNaN(b) || a === 0) return "—"
  return ((1 - b / a) * 100).toFixed(0) + "%"
}
