"use client";
import { useState, useMemo } from "react"

export default function PasswordStrength() {
  const [password, setPassword] = useState("")

  const strength = useMemo(() => {
    if (!password) return { score: 0, label: "", color: "", checks: [] as { label: string; pass: boolean }[] }
    let score = 0
    const checks = [
      { label: "At least 8 characters", pass: password.length >= 8 },
      { label: "Contains uppercase letter", pass: /[A-Z]/.test(password) },
      { label: "Contains lowercase letter", pass: /[a-z]/.test(password) },
      { label: "Contains number", pass: /[0-9]/.test(password) },
      { label: "Contains special character", pass: /[^A-Za-z0-9]/.test(password) },
      { label: "At least 12 characters", pass: password.length >= 12 },
      { label: "No repeating characters (3+)", pass: !/(.)\1{2,}/.test(password) },
      { label: "Not common pattern", pass: !/^(password|12345|qwerty|abc123)/i.test(password) },
    ]
    score = checks.filter(c => c.pass).length
    const colors = ["bg-gray-600", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-400", "bg-green-400"]
    const labels = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"]
    return { score, label: labels[Math.min(score, 5)], color: colors[Math.min(score, 5)], checks }
  }, [password])

  const estimateCrackTime = () => {
    const len = password.length
    if (len < 6) return "Instantly"
    let charset = 0
    if (/[a-z]/.test(password)) charset += 26
    if (/[A-Z]/.test(password)) charset += 26
    if (/[0-9]/.test(password)) charset += 10
    if (/[^A-Za-z0-9]/.test(password)) charset += 32
    const combos = Math.pow(charset, len)
    const sec = combos / 1e9
    if (sec < 60) return "Seconds"
    if (sec < 3600) return `${Math.round(sec / 60)} min`
    if (sec < 86400) return `${Math.round(sec / 3600)} hours`
    if (sec < 31536000) return `${Math.round(sec / 86400)} days`
    if (sec < 3153600000) return `${Math.round(sec / 31536000)} years`
    return "Centuries"
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Password Strength Checker</h1>
      <p className="text-muted mb-6">Check how strong your password is. Everything happens locally in your browser.</p>
      <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Type a password to check..." className="w-full bg-card-bg border border-card-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent mb-4 font-mono" />
      {password && (
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{strength.label}</span>
              <span className="text-xs text-muted-soft">Crack time: ~{estimateCrackTime()}</span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`h-2 flex-1 rounded-full ${strength.score >= i ? strength.color : "bg-card-border"}`} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {strength.checks.map((c, i) => (
              <div key={i} className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${c.pass ? "bg-green-400/10 text-green-400" : "bg-card-bg border border-card-border text-muted-soft"}`}>
                <span className={c.pass ? "text-green-400" : "text-card-border"}>{c.pass ? "✓" : "○"}</span> {c.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
