"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Search } from "lucide-react"
import { AddToHomeScreen } from "./AddToHomeScreen"
import { SearchModal } from "./SearchModal"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/tool/calculator", label: "Calculator" },
  { href: "/tool/json-formatter", label: "JSON Formatter" },
  { href: "/tool/qrcode", label: "QR Code" },
  { href: "/tool/image-compressor", label: "Image Compressor" },
  { href: "/tool/password", label: "Password Generator" },
  { href: "/category/encode", label: "Encode & Decode" },
  { href: "/category/formatters", label: "Formatters" },
  { href: "/category/generators", label: "Generators" },
  { href: "/category/image", label: "Image Tools" },
  { href: "/category/css", label: "CSS Tools" },
  { href: "/category/utilities", label: "Everyday Utilities" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
] as const

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  // Global u2318K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen(prev => !prev)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  // Close mobile menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [menuOpen])

  // Close mobile menu on Escape
  useEffect(() => {
    if (!menuOpen) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false)
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [menuOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-card-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight shrink-0" translate="no">
            <span className="flex h-8 w-9 items-center justify-center rounded-lg bg-accent text-sm font-black text-white shadow-sm shadow-accent/25 tracking-[-0.1em]">LX</span>
            <span>LootNest<span className="text-accent">X</span></span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} className="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-foreground hover:bg-card-bg transition-colors">
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 rounded-lg border border-card-border bg-card-bg px-3 py-1.5 text-sm text-muted-soft hover:text-foreground hover:border-accent/20 transition-all"
            >
              <Search size={15} />
              <span className="text-xs">Search...</span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted-soft border border-card-border">&#8984;K</kbd>
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="sm:hidden rounded-lg p-2 text-muted-soft hover:text-foreground hover:bg-card-bg transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <AddToHomeScreen />
            <div ref={menuRef} className="md:hidden">
              <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg p-2 text-muted hover:bg-card-bg transition-colors" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-card-border bg-background/95 backdrop-blur-xl md:hidden">
              <nav className="max-h-[70vh] overflow-y-auto px-4 py-3 flex flex-col gap-0.5">
                {navLinks.map(({ href, label }) => (
                  <Link key={href} href={href} onClick={closeMenu} className="rounded-lg px-4 py-3 text-base font-medium text-foreground hover:bg-accent/10 active:bg-accent/20 transition-colors">
                    {label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}