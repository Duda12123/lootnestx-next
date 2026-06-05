"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { AddToHomeScreen } from "./AddToHomeScreen"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/tool/calculator", label: "Calculator" },
  { href: "/tool/json-formatter", label: "JSON" },
  { href: "/tool/qrcode", label: "QR Code" },
  { href: "/tool/image-compressor", label: "Image" },
  { href: "/tool/password", label: "Generate" },
  { href: "/guides", label: "Guides" },
] as const

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <header className="sticky top-0 z-50 border-b border-card-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight shrink-0" translate="no">
          <span className="flex h-8 w-9 items-center justify-center rounded-lg bg-accent text-sm font-black text-white shadow-sm shadow-accent/25 tracking-[-0.1em]">TX</span>
          <span className="hidden sm:inline">ToolNest<span className="text-accent">X</span></span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-foreground hover:bg-card-bg transition-colors">
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <AddToHomeScreen />
          <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg p-2 text-muted hover:bg-card-bg transition-colors md:hidden" aria-label="Toggle menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-card-border bg-background/95 backdrop-blur-xl md:hidden">
            <nav className="flex flex-col gap-1 px-4 py-3">
              {navLinks.map(({ href, label }) => (
                <Link key={href} href={href} onClick={closeMenu} className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted hover:bg-card-bg hover:text-foreground transition-colors">
                  {label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
