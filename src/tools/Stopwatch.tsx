"use client";
import { useState, useRef, useCallback } from "react"
import { Play, RotateCcw, Clock } from "lucide-react"

export default function Stopwatch() {
  const [time, setTime] = useState(0)
  const [running, setRunning] = useState(false)
  const [laps, setLaps] = useState<number[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined)

  const startStop = useCallback(() => {
    if (running) {
      clearInterval(intervalRef.current)
      setRunning(false)
    } else {
      const start = Date.now() - time
      intervalRef.current = setInterval(() => setTime(Date.now() - start), 10)
      setRunning(true)
    }
  }, [running, time])

  const reset = () => {
    clearInterval(intervalRef.current)
    setTime(0)
    setRunning(false)
    setLaps([])
  }

  const lap = () => {
    setLaps((prev) => [time, ...prev])
  }

  const format = (ms: number) => {
    const min = Math.floor(ms / 60000)
    const sec = Math.floor((ms % 60000) / 1000)
    const cs = Math.floor((ms % 1000) / 10)
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}.${cs.toString().padStart(2, "0")}`
  }

  return (
    <div className="mx-auto max-w-md px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Stopwatch</h1>
      <p className="text-muted mb-6">Precise stopwatch with lap timing.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-6">
        <div className="text-center">
          <div className="text-5xl font-mono font-bold tracking-tighter text-foreground tabular-nums">{format(time)}</div>
          {running && <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-success"><span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Running</div>}
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={startStop}
            className={`rounded-xl px-6 py-3 text-sm font-bold transition-all ${running ? "bg-warning/10 border border-warning/20 text-warning hover:bg-warning/20" : "bg-accent text-white hover:bg-accent-dark"}`}>
            {running ? "Stop" : "Start"}
          </button>
          <button onClick={lap} disabled={!running}
            className="rounded-xl border border-card-border px-5 py-3 text-sm font-semibold text-muted hover:text-foreground transition-colors disabled:opacity-30">
            Lap
          </button>
          <button onClick={reset}
            className="rounded-xl border border-card-border px-5 py-3 text-sm font-semibold text-muted hover:text-danger transition-colors">
            Reset
          </button>
        </div>

        {laps.length > 0 && (
          <div className="space-y-2 pt-3 border-t border-card-border">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-2"><Clock size={12} /> Laps</h3>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {laps.map((t, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-surface px-4 py-2 text-sm">
                  <span className="text-muted-soft font-mono">#{laps.length - i}</span>
                  <span className="font-mono font-semibold tabular-nums">{format(t)}</span>
                  {i === 0 && <span className="text-xs text-success font-medium">Best</span>}
                  {i > 0 && (
                    <span className={`text-xs font-medium ${t - laps[0] > 0 ? "text-danger" : "text-success"}`}>
                      {t - laps[0] > 0 ? "+" : ""}{format(Math.abs(t - laps[0]))}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
