"use client";
import { useState, useMemo } from "react"
import { Plus } from "lucide-react"

type Diff = { type: "same" | "added" | "removed" | "changed"; left: any; right: any }[]

export default function JsonDiff() {
  const [left, setLeft] = useState("")
  const [right, setRight] = useState("")
  const [diff, setDiff] = useState<Diff | null>(null)
  const [error, setError] = useState("")

  const compare = () => {
    setError("")
    try {
      const a = JSON.parse(left); const b = JSON.parse(right)
      const result = deepDiff(a, b, "")
      setDiff(result)
    } catch { setError("Invalid JSON in one or both inputs") }
  }

  const deepDiff = (a: any, b: any, path: string): Diff => {
    const results: Diff = []
    if (a === b) return results
    if (typeof a !== typeof b) { results.push({ type: "changed", left: a, right: b }); return results }
    if (a === null || b === null || typeof a !== "object") { results.push({ type: "changed", left: a, right: b }); return results }
    const keys = new Set([...Object.keys(a), ...Object.keys(b)])
    for (const k of keys) {
      const p = path ? `${path}.${k}` : k
      if (!(k in a)) results.push({ type: "added", left: undefined, right: b[k] })
      else if (!(k in b)) results.push({ type: "removed", left: a[k], right: undefined })
      else {
        const sub = deepDiff(a[k], b[k], p)
        if (sub.length) results.push(...sub)
      }
    }
    return results
  }

  const sample = () => { setLeft('{"name":"John","age":30,"city":"NYC"}'); setRight('{"name":"John","age":31,"country":"USA"}') }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">JSON Diff</h1>
      <p className="text-muted mb-6">Compare two JSON objects and find differences.</p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-muted-soft mb-1 uppercase tracking-wider">Original</div>
          <textarea value={left} onChange={(e) => setLeft(e.target.value)} className="w-full h-36 bg-card-bg border border-card-border rounded-xl p-3 text-sm font-mono resize-y focus:outline-none focus:border-accent" />
        </div>
        <div>
          <div className="text-xs text-muted-soft mb-1 uppercase tracking-wider">Modified</div>
          <textarea value={right} onChange={(e) => setRight(e.target.value)} className="w-full h-36 bg-card-bg border border-card-border rounded-xl p-3 text-sm font-mono resize-y focus:outline-none focus:border-accent" />
        </div>
      </div>
      <div className="flex gap-2 mb-4"><button onClick={compare} className="tool-btn-primary"><Plus size={14} className="mr-1" /> Compare</button><button onClick={sample} className="tool-btn">Sample</button></div>
      {error && <p className="text-danger text-sm mb-3">{error}</p>}
      {diff && (
        <div className="bg-surface border border-card-border rounded-xl p-4 max-h-80 overflow-auto">
          {diff.length === 0 ? <p className="text-green-400 text-sm">No differences found!</p> : diff.map((d, i) => (
            <div key={i} className={`text-sm font-mono py-0.5 ${d.type === "added" ? "text-green-400" : d.type === "removed" ? "text-danger" : "text-yellow-400"}`}>
              {d.type === "added" && "+"} {d.type === "removed" && "-"} {d.type === "changed" ? `${JSON.stringify(d.left)} → ${JSON.stringify(d.right)}` : JSON.stringify(d.right ?? d.left)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
