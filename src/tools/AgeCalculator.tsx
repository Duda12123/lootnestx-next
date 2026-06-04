"use client";
import { useState, useMemo } from "react"
import { Calendar } from "lucide-react"

export default function AgeCalculator() {
  const [birth, setBirth] = useState("")

  const age = useMemo(() => {
    if (!birth) return null
    const bd = new Date(birth), now = new Date()
    let years = now.getFullYear() - bd.getFullYear()
    let months = now.getMonth() - bd.getMonth()
    let days = now.getDate() - bd.getDate()
    if (days < 0) { months--; const prev = new Date(now.getFullYear(), now.getMonth(), 0); days += prev.getDate() }
    if (months < 0) { years--; months += 12 }
    const totalDays = Math.floor((now.getTime() - bd.getTime()) / 86400000)
    return { years, months, days, totalDays, totalMonths: years * 12 + months, totalWeeks: Math.floor(totalDays / 7) }
  }, [birth])

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-1">Age Calculator</h1>
      <p className="text-muted mb-6">Calculate your exact age from your birth date.</p>
      <div>
        <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">Date of Birth</label>
        <div className="relative"><Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft" /><input type="date" value={birth} onChange={(e) => setBirth(e.target.value)} max={today} className="w-full bg-card-bg border border-card-border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-accent" /></div>
      </div>
      {age && (
        <div className="mt-5 bg-surface border border-card-border rounded-xl p-5">
          <div className="text-center mb-4">
            <span className="text-5xl font-bold font-mono text-accent">{age.years}</span>
            <span className="text-muted ml-2">years old</span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-card-bg rounded-xl p-3"><div className="text-2xl font-bold font-mono">{age.months}</div><div className="text-xs text-muted-soft">Months</div></div>
            <div className="bg-card-bg rounded-xl p-3"><div className="text-2xl font-bold font-mono">{age.days}</div><div className="text-xs text-muted-soft">Days</div></div>
            <div className="bg-card-bg rounded-xl p-3"><div className="text-2xl font-bold font-mono">{age.totalDays.toLocaleString()}</div><div className="text-xs text-muted-soft">Total Days</div></div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="bg-card-bg rounded-xl p-3 text-center"><div className="text-lg font-bold font-mono">{age.totalWeeks.toLocaleString()}</div><div className="text-xs text-muted-soft">Total Weeks</div></div>
            <div className="bg-card-bg rounded-xl p-3 text-center"><div className="text-lg font-bold font-mono">{age.totalMonths.toLocaleString()}</div><div className="text-xs text-muted-soft">Total Months</div></div>
          </div>
        </div>
      )}
    </div>
  )
}
