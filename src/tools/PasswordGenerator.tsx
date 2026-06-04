"use client";
import { useState, useCallback } from "react"
import { Copy, RefreshCw } from "lucide-react"

export default function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [useUpper, setUseUpper] = useState(true)
  const [useLower, setUseLower] = useState(true)
  const [useNumbers, setUseNumbers] = useState(true)
  const [useSymbols, setUseSymbols] = useState(true)
  const [password, setPassword] = useState("")
  const [copied, setCopied] = useState(false)

  const generate = useCallback(() => {
    let chars = ""
    if (useUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (useLower) chars += "abcdefghijklmnopqrstuvwxyz"
    if (useNumbers) chars += "0123456789"
    if (useSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?"
    if (!chars) return

    let result = ""
    const array = new Uint32Array(length)
    crypto.getRandomValues(array)
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length]
    }
    setPassword(result)
    setCopied(false)
  }, [length, useUpper, useLower, useNumbers, useSymbols])

  const copy = async () => {
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const strength = useUpper && useLower && useNumbers && useSymbols && length >= 12 ? "Strong" :
    length >= 8 ? "Medium" : "Weak"

  return (
    <div className="mx-auto max-w-lg px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Password Generator</h1>
      <p className="text-muted mb-6">Create strong, random passwords with customizable rules.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-6">
        {/* Output */}
        <div className="relative">
          <div className="rounded-xl border border-card-border bg-surface p-5">
            <div className="text-2xl font-mono font-bold tracking-wider text-center break-all min-h-[40px] flex items-center justify-center">
              {password || "Click Generate"}
            </div>
          </div>
          <div className="absolute right-3 top-3 flex gap-1">
            <button onClick={copy} className="rounded-lg border border-card-border bg-card-bg p-2 text-muted hover:text-accent transition-colors" title="Copy">
              <Copy size={16} />
            </button>
            <button onClick={generate} className="rounded-lg bg-accent p-2 text-white hover:bg-accent-dark transition-colors" title="Regenerate">
              <RefreshCw size={16} />
            </button>
          </div>
          {password && (
            <div className="mt-2 flex items-center gap-2">
              <div className={`h-1.5 flex-1 rounded-full ${strength === "Strong" ? "bg-success" : strength === "Medium" ? "bg-warning" : "bg-danger"}`} />
              <span className={`text-xs font-semibold ${strength === "Strong" ? "text-success" : strength === "Medium" ? "text-warning" : "text-danger"}`}>{strength}</span>
            </div>
          )}
          {copied && <p className="mt-2 text-xs text-success">Copied to clipboard!</p>}
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-muted">Length: {length}</label>
            </div>
            <input type="range" min={6} max={64} value={length} onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-accent" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(
              [
                [useUpper, setUseUpper, "A-Z", "Uppercase"] as const,
                [useLower, setUseLower, "a-z", "Lowercase"] as const,
                [useNumbers, setUseNumbers, "0-9", "Numbers"] as const,
                [useSymbols, setUseSymbols, "!@#", "Symbols"] as const,
              ] as const
            ).map(([val, set, chars, label]) => (
              <label key={label} className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all ${val ? "border-accent/30 bg-accent-soft" : "border-card-border bg-surface"}`}>
                <input type="checkbox" checked={val} onChange={(e) => set(e.target.checked)} className="rounded accent-accent" />
                <div>
                  <div className="text-sm font-medium text-foreground">{label}</div>
                  <div className="text-[10px] text-muted-soft">{chars}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <button onClick={generate} className="w-full rounded-xl bg-accent py-3 text-sm font-bold text-white hover:bg-accent-dark transition-colors active:scale-[0.99]">
          Generate Password
        </button>
      </div>
    </div>
  )
}
