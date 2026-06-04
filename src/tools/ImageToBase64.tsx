"use client";
import { useState } from "react"
import { Upload, Copy, Check, Image } from "lucide-react"

export default function ImageToBase64() {
  const [result, setResult] = useState("")
  const [copied, setCopied] = useState(false)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setResult(reader.result as string)
    reader.readAsDataURL(file)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Image to Base64</h1>
      <p className="text-muted mb-6">Convert images to Base64 data URIs for embedding in HTML, CSS, or JSON.</p>
      <div className="space-y-4">
        <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-card-border rounded-xl cursor-pointer hover:border-accent/30 transition-colors bg-surface">
          <Image size={36} className="text-muted-soft mb-2" />
          <span className="text-muted text-sm">Click to upload an image</span>
          <span className="text-muted-soft text-xs mt-1">Max 10MB</span>
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
        {result && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-soft">{result.length.toLocaleString()} characters</span>
              <button onClick={copy} className="tool-btn">{copied ? <Check size={14} className="mr-1 text-green-400" /> : <Copy size={14} className="mr-1" />}{copied ? "Copied" : "Copy"}</button>
            </div>
            <div className="bg-surface border border-card-border rounded-xl p-4 max-h-48 overflow-auto">
              <pre className="text-xs text-muted break-all whitespace-pre-wrap font-mono">{result.slice(0, 2000)}{result.length > 2000 ? "..." : ""}</pre>
            </div>
            <div className="flex justify-center bg-card-bg/50 rounded-xl p-4 border border-card-border">
              <img src={result} alt="preview" className="max-w-full max-h-64 rounded-lg object-contain" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
