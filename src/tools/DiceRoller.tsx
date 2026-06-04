"use client";
import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Die = 4 | 6 | 8 | 10 | 12 | 20 | 100

export default function DiceRoller() {
  const [diceType, setDiceType] = useState<Die>(6)
  const [count, setCount] = useState(2)
  const [rolls, setRolls] = useState<number[]>([])
  const [rolling, setRolling] = useState(false)
  const [history, setHistory] = useState<{ dice: string; result: number[]; total: number }[]>([])

  const roll = useCallback(() => {
    setRolling(true)
    const interval = setInterval(() => {
      setRolls(Array.from({ length: count }, () => Math.floor(Math.random() * diceType) + 1))
    }, 80)
    setTimeout(() => {
      clearInterval(interval)
      const final = Array.from({ length: count }, () => Math.floor(Math.random() * diceType) + 1)
      setRolls(final)
      setRolling(false)
      setHistory(h => [{ dice: `${count}d${diceType}`, result: final, total: final.reduce((a, b) => a + b, 0) }, ...h].slice(0, 20))
    }, 600)
  }, [diceType, count])

  const total = rolls.reduce((a, b) => a + b, 0)

  const diceEmojis: Record<number, string> = { 4: "🔺", 6: "🎲", 8: "💎", 10: "🔷", 12: "⬡", 20: "🟡", 100: "💯" }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-1">Dice Roller</h1>
      <p className="text-muted mb-6">Roll virtual dice for tabletop games and random decisions.</p>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-soft block mb-2 uppercase tracking-wider">Dice Type</label>
          <div className="flex flex-wrap gap-2">
            {([4, 6, 8, 10, 12, 20, 100] as Die[]).map(d => (
              <button key={d} onClick={() => setDiceType(d)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${diceType === d ? "bg-accent text-white" : "bg-card-bg border border-card-border text-muted hover:text-foreground"}`}>d{d}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-soft block mb-2 uppercase tracking-wider">Count: {count}</label>
          <input type="range" min={1} max={10} value={count} onChange={(e) => setCount(+e.target.value)} className="w-full accent-accent" />
          <div className="flex justify-between text-xs text-muted-soft"><span>1</span><span>10</span></div>
        </div>
        <button onClick={roll} disabled={rolling} className="w-full bg-accent hover:bg-accent/90 text-white py-4 rounded-xl text-lg font-bold transition-colors disabled:opacity-50">
          {rolling ? "Rolling..." : `Roll ${count}d${diceType}`}
        </button>
        <AnimatePresence mode="wait">
          {rolls.length > 0 && (
            <motion.div key={rolls.join()} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-surface border border-card-border rounded-xl p-6 text-center">
              <div className="flex justify-center gap-3 mb-4 flex-wrap">
                {rolls.map((r, i) => (
                  <motion.div key={i} initial={{ rotate: rolling ? -180 : 0, scale: 0 }} animate={{ rotate: 0, scale: 1 }} className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold border-2 ${r === diceType ? "border-green-400 bg-green-400/10 text-green-400" : "border-card-border bg-card-bg"}`}>{r}</motion.div>
                ))}
              </div>
              <div className="text-4xl font-bold font-mono text-accent">
                {count > 1 ? `= ${total}` : ""}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {history.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs text-muted-soft uppercase tracking-wider">History</h3>
            {history.slice(0, 5).map((h, i) => (
              <div key={i} className="flex items-center justify-between bg-card-bg border border-card-border rounded-lg px-4 py-2 text-sm">
                <span className="text-muted-soft">{h.dice}</span>
                <div className="flex gap-1.5">{h.result.map((r, j) => <span key={j} className="font-mono">{r}</span>)}</div>
                <span className="font-bold font-mono text-accent">= {h.total}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
