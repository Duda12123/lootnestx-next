"use client";
import { useState, useRef, useCallback } from "react"
import { Mic, MicOff, Copy, Trash2 } from "lucide-react"

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult
  length: number
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
  length: number
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

export default function SpeechToText() {
  const [listening, setListening] = useState(false)
  const [text, setText] = useState("")
  const [interim, setInterim] = useState("")
  const [lang, setLang] = useState("en-US")
  const [error, setError] = useState("")
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const start = useCallback(() => {
    setError("")
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser. Try Chrome or Edge.")
      return
    }

    const r = new SpeechRecognition()
    r.lang = lang
    r.interimResults = true
    r.continuous = true
    r.onresult = (e: SpeechRecognitionEvent) => {
      let interim = ""
      let final = ""
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript
        else interim += e.results[i][0].transcript
      }
      if (final) setText((prev) => prev + " " + final)
      setInterim(interim)
    }
    r.onerror = () => { setListening(false); setError("Recognition error — try again.") }
    r.onend = () => { if (listening) r.start() }
    r.start()
    recognitionRef.current = r
    setListening(true)
  }, [lang, listening])

  const stop = () => {
    recognitionRef.current?.stop()
    setListening(false)
    setInterim("")
  }

  const copy = () => navigator.clipboard.writeText(text)
  const clear = () => setText("")

  return (
    <div className="mx-auto max-w-2xl px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Speech to Text</h1>
      <p className="text-muted mb-6">Transcribe your voice to text using browser speech recognition. Works best in Chrome.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-5">
        <div className="flex items-center gap-3">
          <select value={lang} onChange={(e) => setLang(e.target.value)}
            className="rounded-lg border border-card-border bg-surface px-3 py-2 text-sm text-foreground">
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="es-ES">Spanish</option>
            <option value="fr-FR">French</option>
            <option value="de-DE">German</option>
            <option value="zh-CN">Chinese (Simplified)</option>
            <option value="ja-JP">Japanese</option>
            <option value="ko-KR">Korean</option>
            <option value="pt-BR">Portuguese</option>
          </select>
          <button onClick={listening ? stop : start}
            className={`rounded-xl px-5 py-3 text-sm font-bold transition-all flex items-center gap-2 ${
              listening ? "bg-danger text-white animate-pulse" : "bg-accent text-white hover:bg-accent-dark"
            }`}>
            {listening ? <><MicOff size={16} /> Stop</> : <><Mic size={16} /> Start</>}
          </button>
          {listening && <span className="text-sm text-success">Listening...</span>}
        </div>

        {error && <div className="rounded-xl bg-danger/10 border border-danger/20 p-3 text-sm text-danger">{error}</div>}

        <div className="relative rounded-xl border border-card-border bg-surface p-5 min-h-[200px]">
          <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
            {text}
            <span className="text-accent/60 italic">{interim}</span>
          </div>
          {!text && !interim && !listening && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-soft text-sm">
              Click "Start" and begin speaking...
            </div>
          )}
          {!text && !interim && listening && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-1.5 rounded-full bg-accent animate-pulse" style={{ animationDelay: `${i * 0.1}s`, opacity: 0.3 + i * 0.15 }} />
                ))}
              </div>
            </div>
          )}
        </div>

        {text && (
          <div className="flex items-center gap-2">
            <button onClick={copy} className="inline-flex items-center gap-2 rounded-lg border border-card-border px-4 py-2 text-sm font-semibold text-muted hover:text-foreground transition-colors">
              <Copy size={14} /> Copy
            </button>
            <button onClick={clear} className="inline-flex items-center gap-2 rounded-lg border border-card-border px-4 py-2 text-sm font-semibold text-muted hover:text-danger transition-colors">
              <Trash2 size={14} /> Clear
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}
