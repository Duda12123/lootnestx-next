"use client";
import { useState } from "react"
import { Copy, RefreshCw } from "lucide-react"

const PARAGRAPHS = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
]

const WORDS = ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "reprehenderit", "voluptate", "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"]

function generateParagraphs(n: number) {
  const result: string[] = []
  for (let i = 0; i < n; i++) result.push(PARAGRAPHS[i % PARAGRAPHS.length])
  return result.join("\n\n")
}

function generateSentences(n: number) {
  const sentences: string[] = []
  for (let i = 0; i < n; i++) {
    const len = 5 + Math.floor(Math.random() * 10)
    const words = Array.from({ length: len }, () => WORDS[Math.floor(Math.random() * WORDS.length)])
    words[0] = words[0][0].toUpperCase() + words[0].slice(1)
    sentences.push(words.join(" ") + ".")
  }
  return sentences.join(" ")
}

function generateWords(n: number) {
  return Array.from({ length: n }, () => WORDS[Math.floor(Math.random() * WORDS.length)]).join(" ")
}

export default function LoremIpsum() {
  const [mode, setMode] = useState<"paragraphs" | "sentences" | "words">("paragraphs")
  const [count, setCount] = useState(3)
  const [output, setOutput] = useState("")
  const [copied, setCopied] = useState(false)

  const generate = () => {
    let result = ""
    switch (mode) {
      case "paragraphs": result = generateParagraphs(count); break
      case "sentences": result = generateSentences(count); break
      case "words": result = generateWords(count); break
    }
    setOutput(result)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="mx-auto max-w-2xl px-4">
      <h1 className="text-2xl font-bold tracking-tight mb-2">Lorem Ipsum Generator</h1>
      <p className="text-muted mb-6">Generate placeholder text for your designs and prototypes.</p>

      <div className="rounded-2xl border border-card-border bg-card-bg p-6 space-y-5">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-[10px] font-semibold text-muted-soft uppercase">Type</label>
            <select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}
              className="mt-1 rounded-lg border border-card-border bg-surface px-3 py-2 text-sm text-foreground">
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-muted-soft uppercase">Count</label>
            <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Number(e.target.value))}
              className="mt-1 w-20 rounded-lg border border-card-border bg-surface px-3 py-2 text-sm font-mono text-center text-foreground" />
          </div>
          <button onClick={generate} className="rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-dark transition-colors flex items-center gap-2">
            <RefreshCw size={16} /> Generate
          </button>
        </div>

        {output && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">{output.split(/\s+/).length} words</span>
              <button onClick={copy} className="flex items-center gap-1 text-xs text-accent hover:text-accent-light font-medium transition-colors">
                <Copy size={12} /> {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="rounded-xl border border-card-border bg-surface p-5 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {output}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
