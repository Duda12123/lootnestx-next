"use client";
import { useState } from "react"

export default function TimestampConverter() {
  const now = Math.floor(Date.now() / 1000)
  const [unix, setUnix] = useState(String(now))
  const [dateStr, setDateStr] = useState("")
  const [dateObj, setDateObj] = useState<Date | null>(null)
  const [mode, setMode] = useState<"unix-to-date" | "date-to-unix">("unix-to-date")

  const convertUnix = () => {
    const ts = Number(unix)
    if (isNaN(ts)) return
    const d = new Date(ts * 1000)
    setDateObj(d)
    setDateStr(d.toISOString())
  }

  const convertDate = () => {
    const ts = Math.floor(new Date(dateStr).getTime() / 1000)
    if (isNaN(ts)) return
    setUnix(String(ts))
    setDateObj(new Date(ts * 1000))
  }

  const relative = (d: Date) => {
    const diff = Math.floor((Date.now() - d.getTime()) / 1000)
    if (diff < 0) return "in the future"
    if (diff < 60) return "just now"
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  const format = (d: Date, opts: Intl.DateTimeFormatOptions) => d.toLocaleString("en-US", opts)

  return (
    <div className="mx-auto max-w-lg px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Timestamp Converter</h1>
      <p className="text-muted mb-6">Convert between Unix timestamps and human-readable dates.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-5">
        <div className="flex gap-2">
          <button onClick={() => setMode("unix-to-date")} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${mode === "unix-to-date" ? "bg-accent text-white" : "border border-card-border text-muted"}`}>Unix → Date</button>
          <button onClick={() => setMode("date-to-unix")} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${mode === "date-to-unix" ? "bg-accent text-white" : "border border-card-border text-muted"}`}>Date → Unix</button>
          <button onClick={() => { setUnix(String(now)); convertUnix(); }} className="ml-auto rounded-lg border border-card-border px-3 py-2 text-xs text-muted hover:text-foreground transition-colors">
            Now
          </button>
        </div>

        {mode === "unix-to-date" ? (
          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wider">Unix Timestamp (seconds)</label>
            <input value={unix} onChange={(e) => setUnix(e.target.value)} placeholder="1700000000"
              className="mt-2 w-full rounded-xl border border-card-border bg-surface p-3 text-sm font-mono text-foreground focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/10" />
            <button onClick={convertUnix} className="mt-3 w-full rounded-xl bg-accent py-3 text-sm font-bold text-white hover:bg-accent-dark transition-colors">Convert</button>
          </div>
        ) : (
          <div>
            <label className="text-xs font-semibold text-muted uppercase tracking-wider">Date & Time</label>
            <input type="datetime-local" value={dateStr} onChange={(e) => setDateStr(e.target.value)}
              className="mt-2 w-full rounded-xl border border-card-border bg-surface p-3 text-sm font-mono text-foreground focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/10 [color-scheme:dark]" />
            <button onClick={convertDate} className="mt-3 w-full rounded-xl bg-accent py-3 text-sm font-bold text-white hover:bg-accent-dark transition-colors">Convert</button>
          </div>
        )}

        {dateObj && (
          <div className="rounded-xl border border-accent/10 bg-accent-soft p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">UTC</span>
              <span className="text-sm font-mono font-medium">{dateObj.toISOString().replace("T", " ").split(".")[0]}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Local</span>
              <span className="text-sm font-mono font-medium">{dateObj.toLocaleString("en-US")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Relative</span>
              <span className="text-sm font-mono font-medium">{relative(dateObj)}</span>
            </div>
            <hr className="border-card-border my-1" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Day</span>
              <span className="text-sm font-mono font-medium">{format(dateObj, { weekday: "long" })}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Date</span>
              <span className="text-sm font-mono font-medium">{format(dateObj, { year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
