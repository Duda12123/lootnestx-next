"use client";
import { useState, useMemo } from "react"
import QRCode from "qrcode"
import { Download } from "lucide-react"

const DEFAULT_URL = typeof window !== "undefined" ? `https://${window.location.hostname}` : ""

export default function QrCodeGenerator() {
  const [text, setText] = useState(DEFAULT_URL)
  const [size, setSize] = useState(300)
  const [fgColor, setFgColor] = useState("#ffffff")
  const [bgColor, setBgColor] = useState("#131317")
  const [dataUrl, setDataUrl] = useState("")
  const [error, setError] = useState("")

  const generate = async () => {
    if (!text.trim()) return
    try {
      setError("")
      const url = await QRCode.toDataURL(text, {
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
      })
      setDataUrl(url)
    } catch {
      setError("Failed to generate QR code")
    }
  }

  const download = () => {
    if (!dataUrl) return
    const a = document.createElement("a")
    a.href = dataUrl
    a.download = "qrcode.png"
    a.click()
  }

  return (
    <div className="mx-auto max-w-xl px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">QR Code Generator</h1>
      <p className="text-muted mb-6">Create QR codes for URLs, text, and more.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-5">
        <div>
          <label className="text-xs font-semibold text-muted uppercase tracking-wider">Content</label>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter URL or text..."
            className="mt-2 w-full rounded-xl border border-card-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-soft focus:border-accent/40 focus:outline-none font-mono" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-[10px] font-semibold text-muted-soft uppercase">Size</label>
            <select value={size} onChange={(e) => setSize(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-card-border bg-surface px-3 py-2 text-sm text-foreground">
              <option value={200}>200px</option>
              <option value={300}>300px</option>
              <option value={400}>400px</option>
              <option value={500}>500px</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-muted-soft uppercase">Foreground</label>
            <div className="flex gap-2 mt-1">
              <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="h-10 w-10 rounded-lg border-0 cursor-pointer" />
              <input value={fgColor} onChange={(e) => setFgColor(e.target.value)}
                className="flex-1 rounded-lg border border-card-border bg-surface px-2 text-xs font-mono text-foreground" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-muted-soft uppercase">Background</label>
            <div className="flex gap-2 mt-1">
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-10 w-10 rounded-lg border-0 cursor-pointer" />
              <input value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                className="flex-1 rounded-lg border border-card-border bg-surface px-2 text-xs font-mono text-foreground" />
            </div>
          </div>
        </div>

        <button onClick={generate} className="w-full rounded-xl bg-accent py-3 text-sm font-bold text-white hover:bg-accent-dark transition-colors">
          Generate QR Code
        </button>

        {error && <div className="rounded-xl bg-danger/10 border border-danger/20 p-3 text-sm text-danger">{error}</div>}

        {dataUrl && (
          <div className="flex flex-col items-center space-y-4">
            <div className="rounded-2xl border border-card-border bg-surface p-6 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={dataUrl} alt="QR Code" className="max-w-full rounded-xl" />
            </div>
            <button onClick={download} className="inline-flex items-center gap-2 rounded-xl border border-card-border px-5 py-2.5 text-sm font-semibold text-muted hover:text-foreground hover:bg-surface transition-colors">
              <Download size={16} /> Download PNG
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
