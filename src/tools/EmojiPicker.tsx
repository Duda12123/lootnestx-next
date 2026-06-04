"use client";
import { useState, useMemo } from "react"
import { Copy, Search } from "lucide-react"

const EMOJIS = [
  // Smileys
  "😀","😂","🤣","😍","🥰","😎","🤩","😊","🙂","😉","😋","😜","🤪","😇","🤗","🫡","🤔","😴","🥱",
  "😢","😭","😤","😡","🥺","😱","😰","🤯","😳","🥵","🥶","😶‍🌫️","🫠","😈","👻","💀","👽","🤖",
  // Gestures
  "👍","👎","👏","🙌","🤝","💪","✌️","🤞","🤘","👌","🤌","🤏","👋","🤚","🖐️","✋","🖖","🤟","🤙",
  "💅","🙏","💃","🕺","🧘","🧑‍💻","🤦","🤷",
  // Objects
  "❤️","💔","🔥","⭐","✨","💯","🎉","🎊","🏆","🥇","🎯","💡","📌","🔔","🔕","💬","🗨️","💭",
  "📧","📱","💻","🖥️","⌨️","🖱️","🖨️","📷","🎥","🎤","🎧","🎮","🕹️","💿","📀",
  // Nature
  "🌈","🌊","🌍","🌶️","🍕","🍔","🌮","🍣","🍩","🎂","☕","🍺","🍷","🍾",
  // Symbols
  "✅","❌","⚠️","🚫","🔒","🔓","🔑","🗝️","⏰","⌚","📅","📊","📈","📉","🔍",
  "🟢","🔴","🟡","🔵","🟣","⚪","⚫","🟤","♥️","♦️","♣️","♠️",
  // Animals
  "🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐦",
  "🦄","🐴","🐝","🐛","🦋","🐌","🐞","🐙","🦑","🦐","🐠","🐬","🐳","🦈","🐊","🦖",
  // Transport
  "🚗","🚕","🚙","🚌","🚎","🏎️","🚓","🚑","🚒","🚜","✈️","🚀","🛸","🚁","⛵","🚢","🚲",
  // Flags
  "🏳️","🏴","🏁","🚩","🎌","🇺🇸","🇬🇧","🇨🇳","🇯🇵","🇰🇷","🇨🇦","🇦🇺","🇩🇪","🇫🇷","🇪🇸",
  "🇮🇹","🇧🇷","🇮🇳","🇲🇽","🇿🇦","🇳🇱",
]

export default function EmojiPicker() {
  const [search, setSearch] = useState("")
  const [copied, setCopied] = useState("")

  const filtered = useMemo(() => {
    if (!search.trim()) return EMOJIS
    const q = search.toLowerCase()
    return EMOJIS.filter((e) => e.includes(q))
  }, [search])

  const copy = async (emoji: string) => {
    await navigator.clipboard.writeText(emoji)
    setCopied(emoji)
    setTimeout(() => setCopied(""), 1500)
  }

  return (
    <div className="mx-auto max-w-2xl px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Emoji Picker</h1>
      <p className="text-muted mb-6">Browse and copy emojis for social media, messages, and documents.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-card-border bg-surface pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-soft focus:border-accent/40 focus:outline-none"
            placeholder="Search emojis..." />
        </div>

        <div className="flex flex-wrap gap-1.5 max-h-96 overflow-y-auto p-2">
          {filtered.map((emoji, i) => (
            <button key={i} onClick={() => copy(emoji)}
              className="h-12 w-12 flex items-center justify-center rounded-xl border border-card-border bg-surface hover:border-accent/30 hover:bg-accent-soft text-2xl transition-all relative"
              title="Click to copy">
              {emoji}
              {copied === emoji && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-success text-[10px] text-white">
                  <Copy size={8} />
                </span>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-8 text-muted-soft text-sm">No emojis found. Try a different search.</div>
        )}
      </div>
    </div>
  )
}
