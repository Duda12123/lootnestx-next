"use client";
import { useState, useMemo } from "react"

export default function TextCounter() {
  const [text, setText] = useState("")

  const stats = useMemo(() => {
    const chars = text.length
    const charsNoSpaces = text.replace(/\s/g, "").length
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const sentences = text.split(/[.!?]+/).filter(Boolean).length
    const paragraphs = text.split(/\n\s*\n/).filter(Boolean).length
    const lines = text.split("\n").length
    const readingTime = Math.max(1, Math.ceil(words / 200))
    const speakingTime = Math.max(1, Math.ceil(words / 130))
    const bytes = new TextEncoder().encode(text).length

    return { chars, charsNoSpaces, words, sentences, paragraphs, lines, readingTime, speakingTime, bytes }
  }, [text])

  const items = [
    { label: "Characters", value: stats.chars.toLocaleString() },
    { label: "Characters (no spaces)", value: stats.charsNoSpaces.toLocaleString() },
    { label: "Words", value: stats.words.toLocaleString() },
    { label: "Sentences", value: stats.sentences.toLocaleString() },
    { label: "Paragraphs", value: stats.paragraphs.toLocaleString() },
    { label: "Lines", value: stats.lines.toLocaleString() },
    { label: "Reading Time", value: `~${stats.readingTime} min` },
    { label: "Speaking Time", value: `~${stats.speakingTime} min` },
    { label: "Bytes (UTF-8)", value: `${stats.bytes.toLocaleString()} B` },
  ]

  return (
    <div className="mx-auto max-w-3xl px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Text Counter</h1>
      <p className="text-muted mb-6">Real-time character, word, and readability statistics.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-5">
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={12}
          className="w-full rounded-xl border border-card-border bg-surface p-4 text-sm text-foreground placeholder:text-muted-soft focus:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/10 resize-y"
          placeholder="Paste or type your text here..." />

        <div className="grid grid-cols-3 gap-3">
          {items.map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-card-border bg-surface p-3 text-center">
              <div className="text-lg font-bold">{value}</div>
              <div className="text-[10px] text-muted-soft uppercase tracking-wider mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <button onClick={() => setText("")} className="text-xs text-muted-soft hover:text-danger transition-colors">
          Clear text
        </button>
      </div>
    </div>
  )
}
