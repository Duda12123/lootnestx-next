"use client";
import { useState, useCallback } from "react"
import { Copy, ArrowRightLeft } from "lucide-react"

export default function YamlJsonConverter() {
  const [mode, setMode] = useState<"yaml2json" | "json2yaml">("yaml2json")
  const [input, setInput] = useState(`name: John Doe
age: 30
address:
  street: 123 Main St
  city: New York
hobbies:
  - coding
  - reading
  - gaming`)
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [Yaml, setYaml] = useState<any>(null)

  import("js-yaml").then((m) => setYaml(m))

  const convert = useCallback(() => {
    if (!Yaml || !input.trim()) return
    setError("")
    try {
      if (mode === "yaml2json") {
        const obj = Yaml.load(input)
        setOutput(JSON.stringify(obj, null, 2))
      } else {
        const obj = JSON.parse(input)
        setOutput(Yaml.dump(obj, { indent: 2, lineWidth: -1, noRefs: true }))
      }
    } catch (e) {
      setError((e as Error).message)
    }
  }, [input, mode, Yaml])

  if (!Yaml) {
    import("js-yaml").then((m) => setYaml(m)) // retry
  }

  const swap = () => {
    setMode(mode === "yaml2json" ? "json2yaml" : "yaml2json")
    setInput(output)
    setOutput("")
    setError("")
  }

  const sample = mode === "yaml2json"
    ? `name: Example\nage: 25\ntags:\n  - dev\n  - design`
    : `{\n  "name": "Example",\n  "age": 25,\n  "tags": ["dev", "design"]\n}`

  return (
    <div className="mx-auto max-w-3xl px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">YAML ↔ JSON Converter</h1>
      <p className="text-muted mb-6">Convert between YAML and JSON formats seamlessly.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => { if (mode !== "yaml2json") { setMode("yaml2json"); setInput(""); setOutput(""); } }}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${mode === "yaml2json" ? "bg-accent text-white" : "border border-card-border text-muted hover:text-foreground"}`}>YAML → JSON</button>
          <button onClick={() => { if (mode !== "json2yaml") { setMode("json2yaml"); setInput(""); setOutput(""); } }}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${mode === "json2yaml" ? "bg-accent text-white" : "border border-card-border text-muted hover:text-foreground"}`}>JSON → YAML</button>
          <button onClick={convert} disabled={!Yaml} className="rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-dark transition-colors disabled:opacity-50">Convert</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-semibold text-muted-soft uppercase">{mode === "yaml2json" ? "YAML" : "JSON"}</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={14}
              className="mt-1 w-full rounded-xl border border-card-border bg-surface p-4 text-sm font-mono text-foreground focus:border-accent/40 focus:outline-none resize-y"
              placeholder={sample} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-semibold text-muted-soft uppercase">{mode === "yaml2json" ? "JSON" : "YAML"}</label>
              <div className="flex items-center gap-2">
                {output && (
                  <button onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                    className="flex items-center gap-1 text-xs text-accent hover:text-accent-light font-medium">
                    <Copy size={12} /> {copied ? "Copied!" : "Copy"}
                  </button>
                )}
                <button onClick={swap} className="text-xs text-muted hover:text-foreground transition-colors"><ArrowRightLeft size={14} /></button>
              </div>
            </div>
            <textarea value={output} readOnly rows={14}
              className="mt-0 w-full rounded-xl border border-card-border bg-surface p-4 text-sm font-mono text-foreground resize-y"
              placeholder={mode === "yaml2json" ? "JSON output..." : "YAML output..."} />
          </div>
        </div>

        {error && <div className="rounded-xl bg-danger/10 border border-danger/20 p-3 text-sm text-danger font-mono">{error}</div>}
      </div>
    </div>
  )
}
