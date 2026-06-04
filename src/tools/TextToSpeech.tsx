"use client";
import { useState, useRef } from "react"
import { Play, Pause, Square, Volume2 } from "lucide-react"

export default function TextToSpeech() {
  const [text, setText] = useState("Hello! This is a text to speech demo. Try typing your own text and click play to hear it spoken aloud.")
  const [speaking, setSpeaking] = useState(false)
  const [paused, setPaused] = useState(false)
  const [voice, setVoice] = useState("")
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null)

  const voices = typeof window !== "undefined" ? window.speechSynthesis?.getVoices() || [] : []

  const speak = () => {
    if (!text.trim()) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.rate = rate
    u.pitch = pitch
    u.onstart = () => setSpeaking(true)
    u.onend = () => { setSpeaking(false); setPaused(false) }

    if (voice) {
      const v = voices.find((v) => v.name === voice)
      if (v) u.voice = v
    }

    synthRef.current = u
    window.speechSynthesis.speak(u)
  }

  const pauseResume = () => {
    if (paused) { window.speechSynthesis.resume(); setPaused(false) }
    else { window.speechSynthesis.pause(); setPaused(true) }
  }

  const stop = () => {
    window.speechSynthesis.cancel()
    setSpeaking(false)
    setPaused(false)
  }

  const voiceOptions = voices.filter((v) => v.lang.startsWith("en"))

  return (
    <div className="mx-auto max-w-2xl px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Text to Speech</h1>
      <p className="text-muted mb-6">Convert text to natural speech using your browser's built-in TTS engine.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-5">
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8}
          className="w-full rounded-xl border border-card-border bg-surface p-4 text-sm text-foreground placeholder:text-muted-soft focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/10 resize-y"
          placeholder="Type or paste text to speak..." />

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button onClick={speak} disabled={speaking && !paused}
            className="rounded-xl bg-accent px-5 py-3 text-sm font-bold text-white hover:bg-accent-dark transition-colors disabled:opacity-50 flex items-center gap-2">
            <Play size={16} /> Play
          </button>
          <button onClick={pauseResume} disabled={!speaking}
            className="rounded-xl border border-card-border px-4 py-3 text-sm font-semibold text-muted hover:text-foreground transition-colors disabled:opacity-40">
            <Pause size={16} />
          </button>
          <button onClick={stop} disabled={!speaking}
            className="rounded-xl border border-card-border px-4 py-3 text-sm font-semibold text-muted hover:text-danger transition-colors disabled:opacity-40">
            <Square size={16} />
          </button>
          {speaking && <span className="ml-auto text-xs text-success animate-pulse">Speaking...</span>}
        </div>

        {/* Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-card-border">
          <div>
            <label className="text-[10px] font-semibold text-muted-soft uppercase">Voice</label>
            <select value={voice} onChange={(e) => setVoice(e.target.value)}
              className="mt-1 w-full rounded-lg border border-card-border bg-surface px-3 py-2 text-sm text-foreground">
              <option value="">Default</option>
              {voiceOptions.map((v) => (<option key={v.name} value={v.name}>{v.name}</option>))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-muted-soft uppercase">Speed: {rate}x</label>
            <input type="range" min={0.5} max={2} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value))}
              className="mt-1 w-full accent-accent" />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-muted-soft uppercase">Pitch: {pitch}</label>
            <input type="range" min={0.5} max={2} step={0.1} value={pitch} onChange={(e) => setPitch(Number(e.target.value))}
              className="mt-1 w-full accent-accent" />
          </div>
        </div>
      </div>
    </div>
  )
}
