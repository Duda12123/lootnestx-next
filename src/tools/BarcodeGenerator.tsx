"use client";
import { useState, useRef, useEffect, useCallback } from "react"
import { Download } from "lucide-react"

export default function BarcodeGenerator() {
  const [text, setText] = useState("123456789012")
  const [error, setError] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [BarcodeLib, setBarcodeLib] = useState<any>(null)

  useEffect(() => {
    import("jsbarcode").then((m) => setBarcodeLib(m.default || m))
  }, [])

  const generate = useCallback(() => {
    if (!BarcodeLib || !canvasRef.current || !text.trim()) return
    setError("")
    const canvas = canvasRef.current
    try {
      BarcodeLib(canvas, text, {
        format: "CODE128",
        width: 2,
        height: 100,
        displayValue: true,
        fontSize: 16,
        font: "monospace",
        textMargin: 4,
        background: "#131317",
        lineColor: "#f5f5f5",
        margin: 10,
      })
    } catch (e) {
      setError((e as Error).message || "Failed to generate barcode. Try different text.")
    }
  }, [text, BarcodeLib])

  const download = () => {
    if (!canvasRef.current) return
    const a = document.createElement("a")
    a.href = canvasRef.current.toDataURL("image/png")
    a.download = "barcode.png"
    a.click()
  }

  return (
    <div className="mx-auto max-w-lg px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Barcode Generator</h1>
      <p className="text-muted mb-6">Generate CODE128 barcodes for products, shipping labels, and more.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-5">
        <div>
          <label className="text-[10px] font-semibold text-muted-soft uppercase">Barcode Text</label>
          <input value={text} onChange={(e) => setText(e.target.value.toUpperCase())}
            className="mt-1 w-full rounded-xl border border-card-border bg-surface px-4 py-3 text-sm font-mono text-foreground focus:border-accent/40 focus:outline-none"
            placeholder="Enter numbers or text..." />
        </div>

        <button onClick={generate} className="w-full rounded-xl bg-accent py-3 text-sm font-bold text-white hover:bg-accent-dark transition-colors">
          Generate Barcode
        </button>

        {error && <div className="rounded-xl bg-danger/10 border border-danger/20 p-3 text-sm text-danger">{error}</div>}

        <div className="rounded-xl border border-card-border bg-white p-6 flex items-center justify-center overflow-x-auto">
          <canvas ref={canvasRef} />
        </div>

        <button onClick={download} className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-card-border px-5 py-2.5 text-sm font-semibold text-muted hover:text-foreground hover:bg-surface transition-colors">
          <Download size={16} /> Download PNG
        </button>
      </div>
    </div>
  )
}
