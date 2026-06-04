"use client";
import { useState, useMemo } from "react"
import { Copy } from "lucide-react"

interface CronField {
  name: string; min: number; max: number; values: string
}

function parseField(field: string, min: number, max: number): string {
  if (field === "*") return `every ${min === 0 ? "minute" : min === 1 ? "hour" : "value"}`
  if (field.includes(",")) return field.split(",").map((p) => parseField(p, min, max)).join(", ")
  if (field.includes("/")) {
    const [range, step] = field.split("/")
    const rangeDesc = range === "*" ? "" : parseField(range, min, max)
    return `every ${step}${range === "*" ? "" : ` starting at ${rangeDesc}`}`
  }
  if (field.includes("-")) {
    const [s, e] = field.split("-").map(Number)
    return `${s} through ${e}`
  }
  if (!isNaN(Number(field))) return field
  return field
}

function describeCron(expr: string): string {
  const parts = expr.trim().split(/\s+/)
  if (parts.length !== 5) return "Invalid cron expression (need 5 fields: minute hour day month weekday)"
  const [min, hour, dom, month, dow] = parts
  return [
    // Minute
    parseField(min, 0, 59).startsWith("every") ? parseField(min, 0, 59) : `At minute ${parseField(min, 0, 59)}`,
    // Hour
    parseField(hour, 0, 23).startsWith("every") ? "" : `past hour ${parseField(hour, 0, 23)}`,
    // Day of month
    dom !== "*" ? `on day-of-month ${dom}` : "",
    // Month
    month !== "*" ? `in month ${month}` : "",
    // DOW
    dow !== "*" ? `on ${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][Number(dow) % 7] || dow}` : "",
  ].filter(Boolean).join(" ")
}

const PRESETS: Record<string, string> = {
  "Every minute": "* * * * *",
  "Every 15 minutes": "*/15 * * * *",
  "Every hour": "0 * * * *",
  "Every day at midnight": "0 0 * * *",
  "Every day at 6 AM": "0 6 * * *",
  "Every Monday at 9 AM": "0 9 * * 1",
  "Every weekday at 9 AM": "0 9 * * 1-5",
  "First day of month": "0 0 1 * *",
}

function getNext5(expr: string): Date[] {
  const parts = expr.trim().split(/\s+/)
  if (parts.length !== 5) return []
  const results: Date[] = []
  let d = new Date()
  d.setSeconds(0, 0)
  for (let i = 0; i < 5; i++) {
    d = new Date(d.getTime() + 60000)
    // Simple approximation: increment until we find a match
    let tries = 0
    while (tries < 525600 && !matchesSimple(expr, d)) { d = new Date(d.getTime() + 60000); tries++ }
    results.push(new Date(d))
  }
  return results
}

function matchesSimple(expr: string, d: Date): boolean {
  const [min, hour, dom, month, dow] = expr.trim().split(/\s+/)
  return matchSimpleField(min, d.getMinutes(), 0, 59) &&
    matchSimpleField(hour, d.getHours(), 0, 23) &&
    matchSimpleField(dom, d.getDate(), 1, 31) &&
    matchSimpleField(month, d.getMonth() + 1, 1, 12) &&
    matchSimpleField(dow, d.getDay(), 0, 6)
}
function matchSimpleField(field: string, value: number, _min: number, _max: number): boolean {
  if (field === "*") return true
  if (field.includes(",")) return field.split(",").some((f) => matchSimpleField(f, value, _min, _max))
  if (field.includes("/")) { const [range, step] = field.split("/"); const start = range === "*" ? _min : Number(range); return value >= start && (value - start) % Number(step) === 0 }
  if (field.includes("-")) { const [s, e] = field.split("-").map(Number); return value >= s && value <= e }
  return Number(field) === value
}

export default function CronParser() {
  const [expr, setExpr] = useState("0 9 * * 1")
  const [copied, setCopied] = useState(false)

  const description = useMemo(() => describeCron(expr), [expr])
  const nextRuns = useMemo(() => getNext5(expr), [expr])

  return (
    <div className="mx-auto max-w-lg px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Cron Expression Parser</h1>
      <p className="text-muted mb-6">Understand and validate cron schedule expressions.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-5">
        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(PRESETS).slice(0, 6).map(([label, val]) => (
            <button key={label} onClick={() => setExpr(val)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${expr === val ? "bg-accent text-white" : "border border-card-border text-muted hover:text-foreground"}`}>
              {label}
            </button>
          ))}
        </div>

        <div>
          <label className="text-[10px] font-semibold text-muted-soft uppercase">Cron Expression</label>
          <input value={expr} onChange={(e) => setExpr(e.target.value)}
            className="mt-1 w-full rounded-xl border border-card-border bg-surface px-4 py-3 text-lg font-mono font-bold text-foreground text-center tracking-wider focus:border-accent/40 focus:outline-none"
            placeholder="* * * * *" />
        </div>

        {/* Human readable */}
        <div className="rounded-xl border border-accent/20 bg-accent-soft p-4">
          <div className="text-sm font-medium text-foreground leading-relaxed">{description}</div>
        </div>

        {/* Next Runs */}
        {nextRuns.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Next 5 Runs</h3>
            {nextRuns.map((d, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg bg-surface px-4 py-2 text-sm">
                <span className="text-muted-soft font-mono w-4">{i + 1}</span>
                <span className="font-mono text-foreground">{d.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            ))}
          </div>
        )}

        {/* Field breakdown */}
        <div className="space-y-1 pt-2 border-t border-card-border">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Field Breakdown</h3>
          {["Minute", "Hour", "Day of Month", "Month", "Day of Week"].map((name, i) => {
            const val = expr.trim().split(/\s+/)[i] || "—"
            return (
              <div key={name} className="flex items-center rounded-lg bg-surface px-4 py-1.5 text-xs">
                <span className="w-24 text-muted-soft font-medium">{name}</span>
                <code className="text-accent font-mono font-bold">{val}</code>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
