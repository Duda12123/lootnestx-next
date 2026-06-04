"use client";
import { useState, useCallback } from "react"

type Op = "+" | "-" | "*" | "/" | null

export default function Calculator() {
  const [display, setDisplay] = useState("0")
  const [stored, setStored] = useState<number | null>(null)
  const [op, setOp] = useState<Op>(null)
  const [history, setHistory] = useState<string[]>([])
  const [waiting, setWaiting] = useState(false)

  const press = useCallback(
    (key: string) => {
      if (key >= "0" && key <= "9") {
        if (waiting || display === "0") {
          setDisplay(key)
          setWaiting(false)
        } else {
          setDisplay(display + key)
        }
        return
      }
      if (key === ".") {
        if (waiting) { setDisplay("0."); setWaiting(false); return }
        if (!display.includes(".")) setDisplay(display + ".")
        return
      }
      if (key === "C") {
        setDisplay("0"); setStored(null); setOp(null); setWaiting(false)
      }
      if (key === "±") {
        setDisplay(String(-parseFloat(display)))
      }
      if (key === "%") {
        setDisplay(String(parseFloat(display) / 100))
      }

      if (key === "+" || key === "-" || key === "*" || key === "/") {
        const current = parseFloat(display)
        if (stored !== null && op) {
          const result = compute(stored, current, op)
          setDisplay(String(result))
          setStored(result)
          setHistory((h) => [...h, `${stored} ${op} ${current} = ${result}`])
        } else {
          setStored(current)
        }
        setOp(key)
        setWaiting(true)
      }

      if (key === "=" || key === "Enter") {
        if (stored !== null && op) {
          const current = parseFloat(display)
          const result = compute(stored, current, op)
          setHistory((h) => [...h, `${stored} ${op} ${current} = ${result}`])
          setDisplay(String(result))
          setStored(null)
          setOp(null)
          setWaiting(true)
        }
      }
    },
    [display, stored, op, waiting]
  )

  const keys = [
    ["C", "±", "%", "/"],
    ["7", "8", "9", "*"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ]

  return (
    <div className="mx-auto max-w-lg px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Scientific Calculator</h1>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6">
        {/* Display */}
        <div className="mb-4 rounded-xl bg-background border border-card-border p-4 text-right">
          <div className="text-xs text-muted-soft mb-1">{op ? `${stored} ${op}` : "\u00A0"}</div>
          <div className="text-3xl font-mono font-bold tracking-tight overflow-x-auto whitespace-nowrap">
            {display}
          </div>
        </div>

        {/* Keys */}
        <div className="grid gap-2">
          {keys.map((row, ri) => (
            <div key={ri} className="flex gap-2">
              {row.map((key) => {
                const isOp = key === "+" || key === "-" || key === "*" || key === "/"
                const isActive = op === key
                return (
                  <button
                    key={key}
                    onClick={() => press(key)}
                    className={`
                      flex-1 rounded-xl py-3.5 text-lg font-semibold transition-all duration-150 active:scale-95
                      ${key === "C" ? "bg-danger/10 text-danger hover:bg-danger/20" : ""}
                      ${key === "=" ? "bg-accent text-white hover:bg-accent-dark col-span-2" : ""}
                      ${isOp && isActive ? "bg-accent text-white" : isOp ? "bg-accent-soft text-accent hover:bg-accent/20" : ""}
                      ${key >= "0" && key <= "9" || key === "." || key === "±" || key === "%" ? "bg-surface text-foreground hover:bg-card-hover border border-card-border" : ""}
                    `}
                  >
                    {key}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="mt-6 rounded-2xl border border-card-border bg-card-bg p-5">
          <h3 className="text-sm font-semibold text-muted mb-3">History</h3>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {history.map((h, i) => (
              <div key={i} className="text-sm font-mono text-muted">{h}</div>
            ))}
          </div>
          <button
            onClick={() => setHistory([])}
            className="mt-3 text-xs text-muted-soft hover:text-danger transition-colors"
          >
            Clear history
          </button>
        </div>
      )}
    </div>
  )
}

function compute(a: number, b: number, op: string): number {
  switch (op) {
    case "+": return a + b
    case "-": return a - b
    case "*": return a * b
    case "/": return b === 0 ? 0 : a / b
    default: return b
  }
}
