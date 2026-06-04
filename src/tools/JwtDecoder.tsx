"use client";
import { useState, useMemo } from "react"
import { Copy, Eye, EyeOff } from "lucide-react"

interface JwtParts { header: any; payload: any; signature: string }

function decodeJwt(token: string): JwtParts | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    const header = JSON.parse(atob(parts[0]))
    const payload = JSON.parse(atob(parts[1]))
    return { header, payload, signature: parts[2] }
  } catch { return null }
}

export default function JwtDecoder() {
  const [token, setToken] = useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c")
  const [showSignature, setShowSignature] = useState(false)

  const decoded = useMemo(() => decodeJwt(token), [token])

  const expiryInfo = decoded?.payload.exp ? (() => {
    const now = Math.floor(Date.now() / 1000)
    const remaining = decoded.payload.exp - now
    if (remaining <= 0) return { text: "EXPIRED", color: "text-danger" }
    if (remaining < 300) return { text: `Expires in ${remaining}s ⚠️`, color: "text-warning" }
    if (remaining < 3600) return { text: `Expires in ${Math.floor(remaining / 60)}min`, color: "text-warning" }
    return { text: `Expires in ${Math.floor(remaining / 3600)}h`, color: "text-success" }
  })() : null

  return (
    <div className="mx-auto max-w-2xl px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">JWT Decoder</h1>
      <p className="text-muted mb-6">Decode and inspect JSON Web Tokens. All decoding happens locally — your tokens never leave the browser.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-5">
        <textarea value={token} onChange={(e) => setToken(e.target.value)} rows={3}
          className="w-full rounded-xl border border-card-border bg-surface p-4 text-sm font-mono text-foreground focus:border-accent/40 focus:outline-none resize-y break-all"
          placeholder="Paste JWT token here..." />

        {decoded ? (
          <div className="space-y-4">
            {/* Status bar */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> Valid JWT
              </span>
              {decoded.payload.exp && <span className={`text-xs font-medium ${expiryInfo!.color}`}>{expiryInfo!.text}</span>}
              <span className="text-xs text-muted">Algorithm: {decoded.header.alg}</span>
            </div>

            {/* Header */}
            <Section title="Header" data={decoded.header} />
            {/* Payload */}
            <Section title="Payload" data={decoded.payload} />

            {/* Signature */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Signature</h3>
                <button onClick={() => setShowSignature(!showSignature)}
                  className="text-xs text-accent hover:text-accent-light font-medium flex items-center gap-1">
                  {showSignature ? <EyeOff size={12} /> : <Eye size={12} />}
                  {showSignature ? "Hide" : "Show"}
                </button>
              </div>
              <div className="rounded-xl border border-card-border bg-surface p-3">
                <code className="text-xs font-mono text-muted break-all">
                  {showSignature ? decoded.signature : "••••••••••••••••••••••••••••••••••••••••••••"}
                </code>
              </div>
            </div>

            {/* Raw JSON copies */}
            <div className="flex gap-2 pt-2">
              <button onClick={() => navigator.clipboard.writeText(JSON.stringify(decoded.header, null, 2))}
                className="flex items-center gap-1 rounded-lg border border-card-border px-3 py-1.5 text-xs text-muted hover:text-foreground transition-colors">
                <Copy size={12} /> Copy Header
              </button>
              <button onClick={() => navigator.clipboard.writeText(JSON.stringify(decoded.payload, null, 2))}
                className="flex items-center gap-1 rounded-lg border border-card-border px-3 py-1.5 text-xs text-muted hover:text-foreground transition-colors">
                <Copy size={12} /> Copy Payload
              </button>
            </div>
          </div>
        ) : (
          token && <div className="rounded-xl bg-danger/10 border border-danger/20 p-3 text-sm text-danger">Invalid JWT format. Expected format: header.payload.signature</div>
        )}
      </div>
    </div>
  )
}

function Section({ title, data }: { title: string; data: Record<string, any> }) {
  const [copied, setCopied] = useState(false)
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">{title}</h3>
        <button onClick={async () => { await navigator.clipboard.writeText(JSON.stringify(data, null, 2)); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          className="text-xs text-accent hover:text-accent-light font-medium">{copied ? "Copied!" : "Copy"}</button>
      </div>
      <div className="rounded-xl border border-card-border bg-surface p-4">
        <table className="w-full text-xs">
          <tbody>
            {Object.entries(data).map(([k, v]) => (
              <tr key={k} className="border-b border-card-border last:border-0">
                <td className="py-1.5 pr-3 text-accent font-mono font-semibold align-top whitespace-nowrap">{k}</td>
                <td className="py-1.5 text-foreground font-mono break-all">{typeof v === "object" ? JSON.stringify(v, null, 2) : String(v)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
