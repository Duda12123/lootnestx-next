"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react"

const PRESETS = [
  { label: "Focus", work: 25, break: 5 },
  { label: "Deep Work", work: 50, break: 10 },
  { label: "Quick", work: 15, break: 3 },
]

export default function PomodoroTimer() {
  const [presetIdx, setPresetIdx] = useState(0)
  const [minutes, setMinutes] = useState(PRESETS[0].work)
  const [seconds, setSeconds] = useState(0)
  const [isWork, setIsWork] = useState(true)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  const tick = useCallback(() => {
    setSeconds(s => {
      if (s > 0) return s - 1
      setMinutes(m => {
        if (m > 0) return m - 1
        // Timer done
        if (isWork) {
          setSessions(ses => ses + 1)
          setMinutes(PRESETS[presetIdx].break)
          setIsWork(false)
        } else {
          setMinutes(PRESETS[presetIdx].work)
          setIsWork(true)
        }
        return PRESETS[presetIdx].work
      })
      setRunning(false)
      return 0
    })
  }, [isWork, presetIdx])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, tick])

  const reset = () => {
    setRunning(false)
    setIsWork(true)
    setMinutes(PRESETS[presetIdx].work)
    setSeconds(0)
  }

  const switchPreset = (i: number) => {
    setPresetIdx(i)
    setRunning(false)
    setIsWork(true)
    setMinutes(PRESETS[i].work)
    setSeconds(0)
  }

  const mm = String(minutes).padStart(2, "0")
  const ss = String(seconds).padStart(2, "0")

  return (
    <div className="space-y-5 text-center">
      <div className="flex justify-center gap-2">
        {PRESETS.map((p, i) => (
          <button key={i} onClick={() => switchPreset(i)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${i === presetIdx ? "bg-accent/20 text-accent" : "bg-card-bg/50 text-muted-soft hover:bg-card-bg"}`}>
            {p.label} ({p.work}m)
          </button>
        ))}
      </div>
      <div className={`rounded-full w-48 h-48 mx-auto flex items-center justify-center border-4 transition-colors ${isWork ? "border-accent/30 bg-accent/5" : "border-green-500/30 bg-green-500/5"}`}>
        <div>
          <span className="text-4xl font-mono font-bold">{mm}:{ss}</span>
          <p className="text-xs text-muted-soft mt-1">{isWork ? "🔴 Focus" : "🟢 Break"}</p>
        </div>
      </div>
      <div className="flex justify-center gap-3">
        <button onClick={() => setRunning(!running)}
          className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark transition-colors flex items-center gap-2">
          {running ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Start</>}
        </button>
        <button onClick={reset} className="rounded-xl border border-card-border bg-card-bg px-4 py-2.5 text-sm text-muted hover:text-foreground transition-colors">
          <RotateCcw size={16} />
        </button>
      </div>
      <p className="text-sm text-muted-soft">Completed: {sessions} sessions</p>
    </div>
  )
}
