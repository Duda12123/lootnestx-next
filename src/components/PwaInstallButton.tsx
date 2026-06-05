"use client"

import { useState, useEffect } from "react"
import { Download } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PwaInstallButton() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  if (!prompt) return null

  return (
    <button
      onClick={async () => {
        prompt.prompt()
        const { outcome } = await prompt.userChoice
        if (outcome === "accepted") setPrompt(null)
      }}
      className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-dark transition-colors shadow-sm shadow-accent/25"
    >
      <Download size={14} />
      Install App
    </button>
  )
}
