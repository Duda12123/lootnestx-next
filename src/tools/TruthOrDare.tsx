"use client"

import { useState, useCallback } from "react"
import { RefreshCw, Users, Flame, Heart } from "lucide-react"

const levels = [
  { label: "😇 Mild", questions: [
    "What's the most embarrassing song on your playlist?",
    "If you could be any animal, what would you be?",
    "What's your secret talent?",
    "Have you ever Googled yourself?",
    "What's the weirdest food combination you love?",
    "If your pet could talk, what's the first thing it'd say?",
  ]},
  { label: "😏 Spicy", questions: [
    "What's the most childish thing you still do?",
    "Have you ever stalked someone on social media?",
    "What's your biggest fear?",
    "What's a lie you told to get out of a plan?",
    "What's the worst date you've ever been on?",
    "What's your phone wallpaper and why?",
  ]},
  { label: "🔥 Hot", questions: [
    "What's something you'd never tell your parents?",
    "Have you ever sent a text to the wrong person? 😳",
    "What's the most trouble you've gotten into?",
    "Have you ever pretended to be sick to skip something?",
    "What's a secret you've never told anyone?",
    "What's the worst thing you did as a kid?",
  ]},
]

const dares = [
  "🗣️ Speak in an accent for the next 3 rounds",
  "🎤 Sing the chorus of your favorite song",
  "💃 Do 10 seconds of your best dance move",
  "📱 Text someone \"I love potatoes\" without context",
  "🤳 Take a funny selfie and show everyone",
  "🦜 Repeat everything the next person says for 1 minute",
  "🎭 Act out your favorite meme",
  "📖 Narrate your next sentence in a dramatic voice",
  "👏 Give yourself a round of applause for 5 seconds",
  "🪞 Give a compliment to your reflection",
]

export default function TruthOrDare() {
  const [mode, setMode] = useState<"truth" | "dare" | null>(null)
  const [question, setQuestion] = useState("")
  const [level, setLevel] = useState(0)

  const random = useCallback((m: "truth" | "dare") => {
    setMode(m)
    if (m === "truth") {
      const pool = levels[level].questions
      setQuestion(pool[Math.floor(Math.random() * pool.length)])
    } else {
      setQuestion(dares[Math.floor(Math.random() * dares.length)])
    }
  }, [level])

  return (
    <div className="space-y-5">
      {!mode ? (
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => random("truth")} className="rounded-xl border-2 border-green-500/30 bg-green-500/5 p-8 hover:bg-green-500/10 transition-colors text-center">
            <Flame size={32} className="mx-auto mb-2 text-green-400" />
            <span className="font-bold text-lg">Truth</span>
            <p className="text-xs text-muted-soft mt-1">Spill the beans</p>
          </button>
          <button onClick={() => random("dare")} className="rounded-xl border-2 border-orange-500/30 bg-orange-500/5 p-8 hover:bg-orange-500/10 transition-colors text-center">
            <Heart size={32} className="mx-auto mb-2 text-orange-400" />
            <span className="font-bold text-lg">Dare</span>
            <p className="text-xs text-muted-soft mt-1">Do it now</p>
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-card-border bg-card-bg/50 p-6 text-center">
          <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent mb-3 inline-block">{mode === "truth" ? "Truth" : "Dare"}</span>
          <p className="text-xl font-semibold my-4">{question}</p>
          <div className="flex justify-center gap-3 flex-wrap">
            <button onClick={() => random("truth")} className="flex items-center gap-1.5 rounded-lg bg-green-500/10 px-3 py-1.5 text-sm text-green-400 hover:bg-green-500/20 transition-colors">
              <Flame size={14} /> Truth
            </button>
            <button onClick={() => random("dare")} className="flex items-center gap-1.5 rounded-lg bg-orange-500/10 px-3 py-1.5 text-sm text-orange-400 hover:bg-orange-500/20 transition-colors">
              <Heart size={14} /> Dare
            </button>
          </div>
        </div>
      )}
      {mode === "truth" && (
        <div className="flex justify-center gap-2">
          {levels.map((l, i) => (
            <button key={i} onClick={() => { setLevel(i); random("truth") }}
              className={`rounded-full px-3 py-1 text-xs transition-colors ${i === level ? "bg-accent/20 text-accent" : "bg-card-bg text-muted-soft hover:bg-card-bg/80"}`}>
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
