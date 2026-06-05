"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function IpLookup() {
  const [ip, setIp] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then(r => r.json())
      .then(data => setIp(data.ip))
      .catch(() => setIp("Unable to detect"))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-card-border bg-card-bg/50 p-6 text-center">
        <p className="text-sm text-muted-soft mb-2">Your Public IP Address</p>
        {loading ? (
          <div className="flex items-center justify-center gap-2 text-muted">
            <Loader2 size={20} className="animate-spin" />
            <span>Detecting...</span>
          </div>
        ) : (
          <p className="text-3xl font-mono font-bold text-accent select-all">{ip}</p>
        )}
        {!loading && (
          <button onClick={() => navigator.clipboard.writeText(ip)} className="mt-3 rounded-lg bg-accent/10 px-3 py-1.5 text-xs text-accent hover:bg-accent/20 transition-colors">
            Copy IP
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-sm">
        <div className="rounded-lg border border-card-border bg-card-bg/30 p-3">
          <p className="text-muted-soft">IPv4</p>
          <p className="font-mono text-accent">{ip || "..."}</p>
        </div>
        <div className="rounded-lg border border-card-border bg-card-bg/30 p-3">
          <p className="text-muted-soft">Browser</p>
          <p className="truncate">{navigator.userAgent.includes("Chrome") ? "Chrome" : navigator.userAgent.includes("Firefox") ? "Firefox" : "Other"}</p>
        </div>
        <div className="rounded-lg border border-card-border bg-card-bg/30 p-3">
          <p className="text-muted-soft">Platform</p>
          <p>{navigator.platform || "Unknown"}</p>
        </div>
      </div>
    </div>
  )
}
