"use client";
import { useState } from "react"
import { Copy, RefreshCw } from "lucide-react"

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16)
  })
}

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState(5)
  const [lowercase, setLowercase] = useState(false)
  const [hyphens, setHyphens] = useState(true)
  const [copiedAll, setCopiedAll] = useState(false)

  const generate = () => {
    const arr: string[] = []
    for (let i = 0; i < count; i++) {
      let id = uuidv4()
      if (!hyphens) id = id.replace(/-/g, "")
      if (lowercase) id = id.toLowerCase()
      arr.push(id)
    }
    setUuids(arr)
  }

  const copyAll = async () => {
    await navigator.clipboard.writeText(uuids.join("\n"))
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 1500)
  }

  const copyOne = async (id: string) => {
    await navigator.clipboard.writeText(id)
  }

  return (
    <div className="mx-auto max-w-xl px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">UUID Generator</h1>
      <p className="text-muted mb-6">Generate random UUID v4 identifiers. RFC 4122 compliant.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-5">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="text-[10px] font-semibold text-muted-soft uppercase">Count</label>
            <select value={count} onChange={(e) => setCount(Number(e.target.value))}
              className="mt-1 rounded-lg border border-card-border bg-surface px-3 py-2 text-sm text-foreground">
              {[1, 5, 10, 25, 50, 100].map((n) => (<option key={n} value={n}>{n}</option>))}
            </select>
          </div>
          <div className="flex items-end gap-3 pb-1">
            <label className="flex items-center gap-2 text-xs text-muted cursor-pointer select-none">
              <input type="checkbox" checked={lowercase} onChange={(e) => setLowercase(e.target.checked)} className="rounded accent-accent" />
              Lowercase
            </label>
            <label className="flex items-center gap-2 text-xs text-muted cursor-pointer select-none">
              <input type="checkbox" checked={hyphens} onChange={(e) => setHyphens(e.target.checked)} className="rounded accent-accent" />
              Hyphens
            </label>
          </div>
        </div>

        <button onClick={generate} className="w-full rounded-xl bg-accent py-3 text-sm font-bold text-white hover:bg-accent-dark transition-colors flex items-center justify-center gap-2">
          <RefreshCw size={16} /> Generate
        </button>

        {uuids.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">{uuids.length} UUIDs generated</span>
              <button onClick={copyAll} className="flex items-center gap-1 text-xs text-accent hover:text-accent-light font-medium transition-colors">
                <Copy size={12} /> {copiedAll ? "Copied!" : "Copy All"}
              </button>
            </div>
            <div className="rounded-xl border border-card-border bg-surface p-4 space-y-1">
              {uuids.map((id, i) => (
                <div key={i} className="flex items-center justify-between group py-0.5">
                  <code className="text-xs font-mono text-foreground">{id}</code>
                  <button onClick={() => copyOne(id)} className="opacity-0 group-hover:opacity-100 text-muted-soft hover:text-accent transition-all">
                    <Copy size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
