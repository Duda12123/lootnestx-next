"use client"

import { useState, useEffect } from "react"

const fortunes = [
  "🌟 A great adventure awaits you this week. Pack your courage!",
  "🍀 Luck is on your side — buy that lottery ticket.",
  "💡 Someone you haven't spoken to in years will reach out soon.",
  "💰 A financial opportunity is heading your way. Stay alert.",
  "🎯 The project you've been struggling with will finally click.",
  "💕 Love is closer than you think. Look around carefully.",
  "✨ Your creativity will peak in the next 48 hours. Use it wisely.",
  "🏆 Success is not about luck, but you're getting both.",
  "🎵 Music will bring unexpected joy to your day today.",
  "🌊 Change is coming. Embrace it with open arms.",
  "🔥 Your passion project will attract the right people.",
  "🌈 After every storm comes a rainbow — yours is on its way.",
  "📚 Knowledge you acquire today will pay off tenfold.",
  "🧲 You're about to meet someone who changes your perspective.",
  "🎪 Life is about to get more interesting. Buckle up!",
  "🦋 A small decision today will lead to a beautiful transformation.",
  "🌙 Trust your intuition — it's sharper than usual right now.",
  "🎁 An unexpected gift is coming your way.",
  "⚡ Your energy is magnetic. People are drawn to you.",
  "🔑 You already know the answer. Trust yourself.",
]

export default function FortuneCookie() {
  const [fortune, setFortune] = useState("")
  const [opened, setOpened] = useState(false)

  const open = () => {
    setOpened(true)
    setFortune(fortunes[Math.floor(Math.random() * fortunes.length)])
  }

  const reset = () => {
    setOpened(false)
    setFortune("")
  }

  return (
    <div className="space-y-5 text-center">
      <div className="rounded-xl border border-card-border bg-card-bg/50 p-8">
        {!opened ? (
          <button onClick={open} className="text-7xl hover:scale-110 transition-transform mx-auto block cursor-pointer">
            🥠
          </button>
        ) : (
          <div className="animate-in fade-in space-y-4">
            <span className="text-4xl block">🥠</span>
            <p className="text-lg font-medium italic">{fortune}</p>
            <p className="text-xs text-muted-soft">Your lucky numbers: {Array.from({ length: 6 }, () => Math.floor(Math.random() * 69) + 1).join(" · ")}</p>
          </div>
        )}
      </div>
      {opened && (
        <button onClick={reset} className="text-sm text-muted hover:text-foreground transition-colors">
          Crack another cookie
        </button>
      )}
    </div>
  )
}
