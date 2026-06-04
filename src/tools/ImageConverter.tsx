"use client";
import { useState, useRef } from "react"
import { Upload, Download, ImageIcon } from "lucide-react"

const FORMATS = ["png", "jpeg", "webp", "avif"] as const

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState("")
  const [target, setTarget] = useState<string>("webp")
  const [result, setResult] = useState("")
  const [origSize, setOrigSize] = useState("")
  const [newSize, setNewSize] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFile = (f: File) => {
    setFile(f)
    setOrigSize(formatBytes(f.size))
    setResult("")
    setPreview(URL.createObjectURL(f))
  }

  const convert = () => {
    if (!file || !canvasRef.current) return
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
      }, `image/${target}`, 0.9)
    }
    img.src = preview
  }

  return (
    <div className="mx-auto max-w-xl px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Image Format Converter</h1>
      <p className="text-muted mb-6">Convert images between PNG, JPEG, WebP, and AVIF formats.</p>

      <canvas ref={canvasRef} className="hidden" />

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-5">
        {!file ? (
          <div className="rounded-xl border-2 border-dashed border-card-border p-12 text-center hover:border-accent/30 transition-colors cursor-pointer"
            onClick={() => document.getElementById("fc-input")?.click()}>
            <ImageIcon size={40} className="mx-auto text-muted/50 mb-3" />
            <p className="text-muted font-medium">Drop image or click to browse</p>
            <input id="fc-input" type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} className="hidden" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Source" className="h-16 w-16 rounded-xl object-cover border border-card-border" />
              <div>
                <div className="text-sm font-semibold truncate">{file.name}</div>
                <div className="text-xs text-muted">{origSize}</div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-muted-soft uppercase">Convert to</label>
              <select value={target} onChange={(e) => setTarget(e.target.value)}
                className="mt-1 w-full rounded-lg border border-card-border bg-surface px-3 py-2 text-sm text-foreground">
                {FORMATS.map((f) => (<option key={f} value={f}>{f.toUpperCase()}</option>))}
              </select>
            </div>

            <button onClick={convert} className="w-full rounded-xl bg-accent py-3 text-sm font-bold text-white hover:bg-accent-dark transition-colors">
              Convert
            </button>

            {result && (
              <div className="space-y-3">
                <div className="text-sm text-success font-semibold">Converted — {newSize}</div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={result} alt="Converted" className="rounded-xl border border-card-border max-w-full" />
                <a href={result} download={`converted.${target}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-card-border px-5 py-2.5 text-sm font-semibold text-muted hover:text-foreground transition-colors">
                  <Download size={16} /> Download
                </a>
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
