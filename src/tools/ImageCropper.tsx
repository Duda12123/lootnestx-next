"use client";
import { useState, useRef, useCallback, useEffect } from "react"
import { Crop, RotateCw, FlipHorizontal, FlipVertical, Download, Upload, X } from "lucide-react"

export default function ImageCropper() {
  const [src, setSrc] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [dragging, setDragging] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [imgLoaded, setImgLoaded] = useState(false)

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      imgRef.current = img
      setSrc(url)
      setImgLoaded(true)
      setRotation(0); setFlipH(false); setFlipV(false); setZoom(1)
    }
    img.src = url
  }, [])

  useEffect(() => {
    if (!imgLoaded || !canvasRef.current || !imgRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")!
    const img = imgRef.current
    const maxW = 500, maxH = 400
    let w = img.width, h = img.height
    const scale = Math.min(maxW / w, maxH / h, zoom)
    w *= scale; h *= scale
    canvas.width = w; canvas.height = h
    ctx.save()
    ctx.translate(w / 2, h / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    if (flipH) ctx.scale(-1, 1)
    if (flipV) ctx.scale(1, -1)
    ctx.drawImage(img, -w / 2, -h / 2, w, h)
    ctx.restore()
  }, [src, rotation, flipH, flipV, zoom, imgLoaded])

  const download = () => {
    if (!canvasRef.current) return
    const a = document.createElement("a")
    a.download = "cropped-image.png"
    a.href = canvasRef.current.toDataURL("image/png")
    a.click()
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Image Cropper</h1>
      <p className="text-muted mb-6">Crop, rotate, and flip images right in your browser.</p>

      {!src ? (
        <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-card-border rounded-xl cursor-pointer hover:border-accent/30 transition-colors bg-surface">
          <Upload size={40} className="text-muted-soft mb-3" />
          <span className="text-muted">Click to upload an image</span>
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center">
            <button onClick={() => setRotation((r) => r - 90)} className="tool-btn" title="Rotate Left"><RotateCw size={16} className="rotate-[-90deg]" /></button>
            <button onClick={() => setRotation((r) => r + 90)} className="tool-btn" title="Rotate Right"><RotateCw size={16} /></button>
            <button onClick={() => setFlipH(!flipH)} className={`tool-btn ${flipH ? 'bg-accent/20 text-accent' : ''}`} title="Flip Horizontal"><FlipHorizontal size={16} /></button>
            <button onClick={() => setFlipV(!flipV)} className={`tool-btn ${flipV ? 'bg-accent/20 text-accent' : ''}`} title="Flip Vertical"><FlipVertical size={16} /></button>
            <div className="h-6 w-px bg-card-border mx-1" />
            <span className="text-xs text-muted-soft mr-1">Zoom:</span>
            <input type="range" min="0.25" max="3" step="0.05" value={zoom} onChange={(e) => setZoom(+e.target.value)} className="w-24 accent-accent" />
            <span className="text-xs text-muted">{Math.round(zoom * 100)}%</span>
            <div className="flex-1" />
            <button onClick={download} className="tool-btn-primary"><Download size={14} className="mr-1" /> Download</button>
            <button onClick={() => { setSrc(null); setImgLoaded(false); imgRef.current = null }} className="tool-btn text-danger"><X size={16} className="mr-1" />Clear</button>
          </div>
          <div className="flex justify-center bg-card-bg/50 rounded-xl p-4 border border-card-border">
            <canvas ref={canvasRef} className="max-w-full rounded-lg" />
          </div>
        </div>
      )}
    </div>
  )
}
