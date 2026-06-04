"use client";
import { useState, useEffect } from "react"
import { Clock, Search, Plus, X } from "lucide-react"

const TZ_LIST = [
  "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "America/Sao_Paulo", "America/Argentina/Buenos_Aires",
  "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Moscow",
  "Asia/Dubai", "Asia/Kolkata", "Asia/Shanghai", "Asia/Tokyo", "Asia/Seoul",
  "Asia/Singapore", "Asia/Bangkok", "Asia/Hong_Kong",
  "Australia/Sydney", "Australia/Melbourne",
  "Pacific/Auckland", "Pacific/Honolulu",
  "Africa/Cairo", "Africa/Lagos", "Africa/Johannesburg",
]

export default function WorldClock() {
  const [tzs, setTzs] = useState<string[]>(["America/New_York", "Europe/London", "Asia/Shanghai", "Asia/Tokyo"])
  const [query, setQuery] = useState("")
  const [now, setNow] = useState(new Date())

  useEffect(() => { const i = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(i) }, [])

  const add = (tz: string) => { if (!tzs.includes(tz)) setTzs([...tzs, tz]); setQuery("") }
  const remove = (tz: string) => setTzs(tzs.filter(t => t !== tz))

  const formatTZ = (tz: string) => {
    try {
      return new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true, timeZone: tz }).format(now)
    } catch { return "--:--" }
  }
  const getOffset = (tz: string) => {
    try {
      const d = new Date(now.toLocaleString("en-US", { timeZone: tz }))
      const off = (d.getTime() - now.getTime()) / 3600000 + now.getTimezoneOffset() / 60
      return off >= 0 ? `+${off.toFixed(1)}` : off.toFixed(1)
    } catch { return "" }
  }

  const filtered = TZ_LIST.filter(t => t.toLowerCase().includes(query.toLowerCase())).filter(t => !tzs.includes(t))

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">World Clock</h1>
      <p className="text-muted mb-6">Track time across multiple timezones.</p>
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search timezone..." className="w-full bg-card-bg border border-card-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-accent" />
        {query && filtered.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-card-border rounded-xl overflow-hidden z-10 max-h-48 overflow-y-auto">
            {filtered.map(tz => <button key={tz} onClick={() => add(tz)} className="w-full text-left px-4 py-2 text-sm hover:bg-card-bg transition-colors">{tz.replace(/_/g, " ")}</button>)}
          </div>
        )}
      </div>
      <div className="space-y-3">
        {tzs.map(tz => (
          <div key={tz} className="flex items-center justify-between bg-surface border border-card-border rounded-xl p-5">
            <div>
              <div className="text-sm font-medium">{tz.split("/").pop()!.replace(/_/g, " ")}</div>
              <div className="text-xs text-muted-soft">{tz} (UTC{getOffset(tz)})</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-mono font-bold">{formatTZ(tz)}</div>
              <button onClick={() => remove(tz)} className="text-muted-soft hover:text-danger transition-colors"><X size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
