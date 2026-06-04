"use client";
import { useState, useEffect, useCallback } from "react"
import { Play, Pause, RotateCcw, Plus, Trash2 } from "lucide-react"

interface Timer {
  id: number
  name: string
  total: number
  remaining: number
  running: boolean
}

let nextId = 0

export default function CountdownTimer() {
  const [timers, setTimers] = useState<Timer[]>([])
  const [name, setName] = useState("")
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(5)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) =>
        prev.map((t) => {
          if (!t.running || t.remaining <= 0) return t
          const remaining = t.remaining - 1
          if (remaining <= 0 && typeof Notification !== "undefined" && Notification.permission === "granted") {
            new Notification("Timer Done!", { body: `${t.name} finished!` })
          }
          return { ...t, remaining, running: remaining > 0 }
        })
      )
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const add = () => {
    const total = hours * 3600 + minutes * 60 + seconds
    if (total <= 0) return
    setTimers((prev) => [...prev, { id: nextId++, name: name || `Timer ${nextId}`, total, remaining: total, running: false }])
    setName(""); setHours(0); setMinutes(5); setSeconds(0)
  }

  const toggle = (id: number) => {
    setTimers((prev) => prev.map((t) => t.id === id ? { ...t, running: !t.running } : t))
  }

  const reset = (id: number) => {
    setTimers((prev) => prev.map((t) => t.id === id ? { ...t, remaining: t.total, running: false } : t))
  }

  const remove = (id: number) => {
    setTimers((prev) => prev.filter((t) => t.id !== id))
  }

  const format = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
  }

  return (
    <div className="mx-auto max-w-lg px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Countdown Timer</h1>
      <p className="text-muted mb-6">Set multiple countdown timers with browser notifications.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-4">
        {/* Add timer */}
        <div className="space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Timer name (optional)"
            className="w-full rounded-xl border border-card-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted-soft focus:border-accent/40 focus:outline-none" />
          <div className="flex gap-3">
            {(["Hours", "Minutes", "Seconds"] as const).map((label, i) => (
              <div key={label} className="flex-1">
                <label className="text-[10px] font-semibold text-muted-soft uppercase">{label}</label>
                <input type="number" min={0} max={99} value={i === 0 ? hours : i === 1 ? minutes : seconds}
                  onChange={(e) => {
                    const v = Number(e.target.value)
                    if (i === 0) setHours(v); else if (i === 1) setMinutes(v); else setSeconds(v)
                  }}
                  className="mt-1 w-full rounded-lg border border-card-border bg-surface px-3 py-2 text-sm font-mono text-center text-foreground focus:border-accent/40 focus:outline-none" />
              </div>
            ))}
          </div>
          <button onClick={add} className="w-full rounded-xl bg-accent py-3 text-sm font-bold text-white hover:bg-accent-dark transition-colors flex items-center justify-center gap-2">
            <Plus size={16} /> Add Timer
          </button>
        </div>

        {/* Active timers */}
        {timers.length > 0 && (
          <div className="space-y-2 pt-3">
            {timers.map((t) => (
              <div key={t.id} className={`rounded-xl border p-4 transition-all ${t.remaining <= 0 ? "border-success/30 bg-success/5" : "border-card-border bg-surface"}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${t.running ? "bg-success animate-pulse" : t.remaining <= 0 ? "bg-success" : "bg-muted-soft"}`} />
                    <span className="text-sm font-semibold">{t.name}</span>
                  </div>
                  <span className="text-xs text-muted">{Math.round((t.remaining / t.total) * 100)}%</span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 rounded-full bg-card-border mb-3 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ${t.remaining <= 0 ? "bg-success" : "bg-accent"}`}
                    style={{ width: `${(t.remaining / t.total) * 100}%` }} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-mono font-bold tracking-wider">{format(t.remaining)}</span>
                  <div className="flex gap-1">
                    <button onClick={() => toggle(t.id)} disabled={t.remaining <= 0}
                      className="rounded-lg border border-card-border p-2 text-muted hover:text-accent transition-colors disabled:opacity-30">
                      {t.running ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button onClick={() => reset(t.id)} className="rounded-lg border border-card-border p-2 text-muted hover:text-foreground transition-colors">
                      <RotateCcw size={16} />
                    </button>
                    <button onClick={() => remove(t.id)} className="rounded-lg border border-card-border p-2 text-muted hover:text-danger transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notification permission */}
        {typeof Notification !== "undefined" && Notification.permission !== "granted" && Notification.permission !== "denied" && (
          <button onClick={() => typeof Notification !== "undefined" && Notification.requestPermission()}
            className="text-xs text-accent hover:text-accent-light transition-colors pt-2">
            Enable notifications →
          </button>
        )}
      </div>
    </div>
  )
}
