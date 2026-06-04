"use client"

import { useState, useEffect } from "react"
import { X, Download } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function AddToHomeScreen() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowBanner(true)
    }
    const dismissedCheck = localStorage.getItem("pwa-banner-dismissed")
    if (dismissedCheck) setDismissed(true)

    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const install = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === "accepted") setShowBanner(false)
    setDeferredPrompt(null)
  }

  const dismiss = () => {
    setShowBanner(false)
    setDismissed(true)
    localStorage.setItem("pwa-banner-dismissed", "true")
  }

  if (!showBanner || dismissed) return null

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 animate-slide-up">
      <div className="flex items-center gap-4 rounded-2xl border border-accent/20 bg-card-bg/95 backdrop-blur-xl px-5 py-4 shadow-2xl shadow-accent/5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white font-black">T</div>
        <div>
          <p className="text-sm font-semibold">Install ToolNest</p>
          <p className="text-xs text-muted-soft">Add to home screen for quick access</p>
        </div>
        <button onClick={install} className="shrink-0 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-white hover:bg-accent-dark transition-colors flex items-center gap-1.5">
          <Download size={14} /> Install
        </button>
        <button onClick={dismiss} className="shrink-0 text-muted-soft hover:text-foreground transition-colors">
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
