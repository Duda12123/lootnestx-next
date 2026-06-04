"use client";
import { useState, useMemo } from "react"
import { Search, ExternalLink } from "lucide-react"

const STATUS_CODES: { code: number; name: string; desc: string; cat: string }[] = [
  { code: 100, name: "Continue", desc: "Server received initial request, client should continue.", cat: "1xx Informational" },
  { code: 101, name: "Switching Protocols", desc: "Server switching protocols as requested by client.", cat: "1xx Informational" },
  { code: 200, name: "OK", desc: "Request succeeded.", cat: "2xx Success" },
  { code: 201, name: "Created", desc: "New resource created.", cat: "2xx Success" },
  { code: 204, name: "No Content", desc: "Request succeeded, no content to return.", cat: "2xx Success" },
  { code: 301, name: "Moved Permanently", desc: "Resource moved to a new permanent URL.", cat: "3xx Redirection" },
  { code: 302, name: "Found", desc: "Resource temporarily at a different URL.", cat: "3xx Redirection" },
  { code: 304, name: "Not Modified", desc: "Resource not modified since last request.", cat: "3xx Redirection" },
  { code: 307, name: "Temporary Redirect", desc: "Temporary redirect, method must not change.", cat: "3xx Redirection" },
  { code: 400, name: "Bad Request", desc: "Server cannot process malformed request.", cat: "4xx Client Error" },
  { code: 401, name: "Unauthorized", desc: "Authentication required.", cat: "4xx Client Error" },
  { code: 403, name: "Forbidden", desc: "Client lacks permission to access this resource.", cat: "4xx Client Error" },
  { code: 404, name: "Not Found", desc: "Requested resource does not exist.", cat: "4xx Client Error" },
  { code: 405, name: "Method Not Allowed", desc: "HTTP method not allowed for this resource.", cat: "4xx Client Error" },
  { code: 408, name: "Request Timeout", desc: "Server timed out waiting for request.", cat: "4xx Client Error" },
  { code: 409, name: "Conflict", desc: "Request conflicts with current state.", cat: "4xx Client Error" },
  { code: 410, name: "Gone", desc: "Resource permanently deleted.", cat: "4xx Client Error" },
  { code: 422, name: "Unprocessable Entity", desc: "Semantic errors in the request.", cat: "4xx Client Error" },
  { code: 429, name: "Too Many Requests", desc: "Rate limit exceeded.", cat: "4xx Client Error" },
  { code: 500, name: "Internal Server Error", desc: "Server encountered an unexpected error.", cat: "5xx Server Error" },
  { code: 502, name: "Bad Gateway", desc: "Upstream server returned invalid response.", cat: "5xx Server Error" },
  { code: 503, name: "Service Unavailable", desc: "Server temporarily unavailable.", cat: "5xx Server Error" },
  { code: 504, name: "Gateway Timeout", desc: "Upstream server timed out.", cat: "5xx Server Error" },
]

const CATS = ["All", "1xx", "2xx", "3xx", "4xx", "5xx"]

export default function HttpStatus() {
  const [query, setQuery] = useState("")
  const [cat, setCat] = useState("All")

  const filtered = useMemo(() => STATUS_CODES.filter(s => {
    if (cat !== "All" && !s.cat.startsWith(cat)) return false
    if (query && !`${s.code} ${s.name} ${s.desc}`.toLowerCase().includes(query.toLowerCase())) return false
    return true
  }), [query, cat])

  const color = (c: number) => c < 200 ? "text-blue-400" : c < 300 ? "text-green-400" : c < 400 ? "text-yellow-400" : c < 500 ? "text-orange-400" : "text-red-400"

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">HTTP Status Codes</h1>
      <p className="text-muted mb-6">Quick reference for HTTP response status codes.</p>
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-[200px]"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search codes..." className="w-full bg-card-bg border border-card-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent" /></div>
        {CATS.map(c => <button key={c} onClick={() => setCat(c)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${cat === c ? "bg-accent text-white" : "bg-card-bg border border-card-border text-muted hover:text-foreground"}`}>{c}</button>)}
      </div>
      <div className="grid gap-2">
        {filtered.map(s => (
          <div key={s.code} className="flex items-center gap-4 bg-surface border border-card-border rounded-xl p-4 hover:border-card-hover transition-colors">
            <span className={`text-lg font-mono font-bold min-w-[60px] ${color(s.code)}`}>{s.code}</span>
            <div>
              <span className="font-medium text-sm">{s.name}</span>
              <p className="text-xs text-muted-soft mt-0.5">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-muted py-8">No matching status codes found.</p>}
    </div>
  )
}
