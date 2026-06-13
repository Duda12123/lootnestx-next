"use client"

import { useState, useEffect, useCallback } from "react"
import { Download, Share, X } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

function getPlatform(): "ios" | "android" | "other" {
  if (typeof navigator === "undefined") return "other"
  const ua = navigator.userAgent || ""
  if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) return "ios"
  if (/Android/.test(ua)) return "android"
  return "other"
}

export function AddToHomeScreen() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showIosGuide, setShowIosGuide] = useState(false)
  const [platform, setPlatform] = useState<"ios" | "android" | "other">("other")
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    setPlatform(getPlatform())

    // Check if already dismissed this session
    const wasDismissed = sessionStorage.getItem("aths-dismissed")
    if (wasDismissed) setDismissed(true)

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  // Show iOS guide after a short delay if not dismissed and not in standalone mode
  useEffect(() => {
    if (platform !== "ios" || dismissed) return
    if (window.matchMedia("(display-mode: standalone)").matches) return

    const timer = setTimeout(() => setShowIosGuide(true), 2000)
    return () => clearTimeout(timer)
  }, [platform, dismissed])

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setDismissed(true)
    }
  }, [deferredPrompt])

  const handleDismiss = useCallback(() => {
    setDismissed(true)
    setShowIosGuide(false)
    sessionStorage.setItem("aths-dismissed", "1")
  }, [])

  // Nothing to show if no platform support and no prompt
  if (platform === "other" && !deferredPrompt) return null
  if (dismissed && !deferredPrompt) return null

  return (
    <>
      {/* Android / Chrome install button — only when beforeinstallprompt fires */}
      {deferredPrompt && (
        <button
          onClick={handleInstall}
          className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-dark transition-colors shadow-sm shadow-accent/25"
        >
          <Download size={14} />
          <span className="hidden sm:inline">Install App</span>
          <span className="sm:hidden">Install</span>
        </button>
      )}

      {/* iOS: floating install guide banner */}
      {platform === "ios" && showIosGuide && (
        <div className="fixed bottom-4 left-4 right-4 z-[100] animate-slide-up">
          <div className="mx-auto max-w-md rounded-xl border border-card-border bg-card-bg/95 backdrop-blur-xl p-4 shadow-lg shadow-black/20">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <Share size={20} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">Add to Home Screen</p>
                <p className="mt-0.5 text-xs text-muted">
                  Tap <span className="inline-flex items-center gap-0.5 rounded bg-surface px-1 py-0.5 text-xs">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                    Share
                  </span> then &quot;Add to Home Screen&quot; for quick access.
                </p>
              </div>
              <button onClick={handleDismiss} className="shrink-0 rounded-lg p-1 text-muted-soft hover:text-foreground hover:bg-surface transition-colors" aria-label="Dismiss">
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
