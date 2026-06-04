"use client";
import { useState } from "react"
import { Copy } from "lucide-react"

function csvToJson(csv: string): string {
  const lines = csv.trim().split("\n")
  const headers = parseLine(lines[0])
  const result: Record<string, string>[] = []
  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i])
    const obj: Record<string, string> = {}
    headers.forEach((h, j) => { obj[h] = values[j] || "" })
    result.push(obj)
  }
  return JSON.stringify(result, null, 2)
}

function jsonToCsv(jsonStr: string): string {
  const arr = JSON.parse(jsonStr)
  if (!Array.isArray(arr) || arr.length === 0) return ""
  const headers = Object.keys(arr[0])
  const lines = [headers.join(",")]
  for (const row of arr) {
    lines.push(headers.map((h) => csvEscape(String(row[h] ?? ""))).join(","))
  }
  return lines.join("\n")
}

function parseLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') { inQuotes = !inQuotes; continue }
    if (ch === "," && !inQuotes) { result.push(current.trim()); current = ""; continue }
    current += ch
  }
  result.push(current.trim())
  return result
}

function csvEscape(val: string): string {
  if (val.includes(",") || val.includes('"') || val.includes("\n")) return `"${val.replace(/"/g, '""')}"`
  return val
}

export default function CsvJsonConverter() {
  const [mode, setMode] = useState<"csv2json" | "json2csv">("csv2json")
  const [input, setInput] = useState(`name,age,city,score\nJohn,30,New York,95\nJane,25,Los Angeles,88\nBob,35,Chicago,72`)
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")

  const convert = () => {
    if (!input.trim()) return
    setError("")
    try {
      setOutput(mode === "csv2json" ? csvToJson(input) : jsonToCsv(input))
    } catch (e) {
      setError((e as Error).message)
    }
  }

  const swap = () => {
    setMode(mode === "csv2json" ? "json2csv" : "csv2json")
    setInput(output || "")
    setOutput(input)
  }

  return (
    <div className="mx-auto max-w-3xl px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">CSV ↔ JSON Converter</h1>
      <p className="text-muted mb-6">Convert between CSV and JSON data formats.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => { setMode("csv2json"); setInput(""); setOutput(""); }}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${mode === "csv2json" ? "bg-accent text-white" : "border border-card-border text-muted hover:text-foreground"}`}>CSV → JSON</button>
          <button onClick={() => { setMode("json2csv"); setInput(""); setOutput(""); }}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${mode === "json2csv" ? "bg-accent text-white" : "border border-card-border text-muted hover:text-foreground"}`}>JSON → CSV</button>
          <button onClick={convert} className="rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-dark transition-colors">Convert</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-semibold text-muted-soft uppercase">{mode === "csv2json" ? "CSV" : "JSON"}</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14}
              className="mt-1 w-full rounded-xl border border-card-border bg-surface p-4 text-sm font-mono text-foreground focus:border-accent/40 focus:outline-none resize-y"
              placeholder={mode === "csv2json" ? "name,age,city\n..." : '[{"name":"...","age":...}]'} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-semibold text-muted-soft uppercase">{mode === "csv2json" ? "JSON" : "CSV"}</label>
              <div className="flex items-center gap-2">
                {output && (
                  <button onClick={() => navigator.clipboard.writeText(output)}
                    className="flex items-center gap-1 text-xs text-accent hover:text-accent-light font-medium">
                    <Copy size={12} /> Copy
                  </button>
                )}
                <button onClick={swap} className="text-xs text-muted hover:text-foreground transition-colors" title="Swap input/output">↔</button>
              </div>
            </div>
            <textarea value={output} readOnly rows={14}
              className="mt-0 w-full rounded-xl border border-card-border bg-surface p-4 text-sm font-mono text-foreground resize-y"
              placeholder={mode === "csv2json" ? "JSON output..." : "CSV output..."} />
          </div>
        </div>

        {error && <div className="rounded-xl bg-danger/10 border border-danger/20 p-3 text-sm text-danger font-mono">{error}</div>}
      </div>
    </div>
  )
}
