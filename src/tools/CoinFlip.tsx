"use client";
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function CoinFlip() {
  const [result, setResult] = useState<"heads" | "tails" | null>(null)
  const [flipping, setFlipping] = useState(false)
  const [stats, setStats] = useState({ heads: 0, tails: 0, total: 0 })

  const flip = () => {
    if (flipping) return
    setFlipping(true)
    setResult(null)
    const final: "heads" | "tails" = Math.random() < 0.5 ? "heads" : "tails"
    setTimeout(() => {
      setResult(final)
      setFlipping(false)
      setStats(s => ({ ...s, [final]: s[final] + 1, total: s.total + 1 }))
    }, 1200)
  }

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-1">Coin Flip</h1>
      <p className="text-muted mb-6">Flip a virtual coin to make decisions.</p>
      <div className="flex flex-col items-center">
        <button onClick={flip} disabled={flipping} className="mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={result ?? "idle"}
              initial={{ rotateY: 0 }}
              animate={flipping ? { rotateY: [0, 360, 720, 1080, 1440] } : { rotateY: 0 }}
              transition={flipping ? { duration: 1.2, ease: "easeInOut" } : { duration: 0.3 }}
              className="w-40 h-40 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-4 border-yellow-700 shadow-xl flex items-center justify-center"
            >
              {!result && !flipping && <span className="text-4xl">💰</span>}
              {flipping && <span className="text-4xl">🪙</span>}
              {result === "heads" && !flipping && <span className="text-5xl">🦅</span>}
              {result === "tails" && !flipping && <span className="text-5xl">🏛️</span>}
            </motion.div>
          </AnimatePresence>
        </button>
        <button onClick={flip} disabled={flipping} className="bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-xl text-lg font-bold transition-colors disabled:opacity-50">
          {flipping ? "Flipping..." : "Flip Coin"}
        </button>
        {stats.total > 0 && (
          <div className="mt-6 w-full">
            <div className="flex items-center h-4 rounded-full overflow-hidden bg-card-bg border border-card-border">
              <div className="h-full bg-yellow-500 transition-all" style={{ width: `${stats.total > 0 ? (stats.heads / stats.total) * 100 : 50}%` }} />
              <div className="h-full bg-gray-500 transition-all" style={{ width: `${stats.total > 0 ? (stats.tails / stats.total) * 100 : 50}%` }} />
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-muted">🦅 Heads: {stats.heads} ({stats.total > 0 ? Math.round(stats.heads / stats.total * 100) : 0}%)</span>
              <span className="text-muted">Tails: {stats.tails} ({stats.total > 0 ? Math.round(stats.tails / stats.total * 100) : 0}%) 🏛️</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
