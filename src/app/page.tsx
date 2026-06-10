import Link from "next/link"
import { Suspense } from "react"
import { Search, Sparkles, Zap, Lock, Monitor } from "lucide-react"
import { tools, categories } from "@/data/tools"
import { ToolCard } from "@/components/ToolCard"
import { HomeContent } from "@/components/HomeContent"

const featuredTools = tools.filter((t) => t.featured && !t.comingSoon)
const activeTools = tools.filter((t) => !t.comingSoon)

// Per-category color palette for visual differentiation
const CAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  encode:    { bg: '#3b82f618', text: '#60a5fa', border: '#3b82f635' },
  formatters:{ bg: '#a855f718', text: '#c084fc', border: '#a855f735' },
  generators:{ bg: '#22c55e18', text: '#4ade80', border: '#22c55e35' },
  css:       { bg: '#ec489918', text: '#f472b6', border: '#ec489935' },
  image:     { bg: '#f9731618', text: '#fb923c', border: '#f9731635' },
  text:      { bg: '#14b8a618', text: '#2dd4bf', border: '#14b8a635' },
  dev:       { bg: '#6366f118', text: '#818cf8', border: '#6366f135' },
  utilities: { bg: '#f59e0b18', text: '#fbbf24', border: '#f59e0b35' },
  audio:     { bg: '#ef444418', text: '#f87171', border: '#ef444435' },
  fun:       { bg: '#10b98118', text: '#34d399', border: '#10b98135' },
}

export default function Page() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-card-border">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-accent/3 blur-[120px]" />
        {/* Floating tool emojis — visual anchor on mobile & desktop */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
          {['🔧','🔢','📷','🔐','🎨','📝','💻','🎲','🎵','📊'].map((emoji, i) => (
            <span
              key={i}
              className="absolute text-lg sm:text-xl opacity-15 sm:opacity-20"
              style={{
                left: `${8 + (i * 10) % 85}%`,
                top: `${12 + (i * 7) % 70}%`,
                animation: `fade-in-up ${1.5 + i * 0.2}s ease-out both`,
              }}
            >{emoji}</span>
          ))}
        </div>
        <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-20 sm:pb-20 sm:pt-28 lg:pt-32">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/15 bg-accent-soft px-4 py-1.5 text-sm font-medium text-accent">
              <Sparkles size={16} />
              {activeTools.length} free tools &mdash; no sign-up required
            </span>
            <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Every tool you need,{" "}
              <span className="text-accent">right in your browser</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted sm:text-lg">
              Free online tools that run locally. No uploads, no accounts, no limits. Just tools that get things done &mdash; fast.
            </p>
          </div>
        </div>
      </section>

      <Suspense fallback={
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
          {/* Search area — text fallback for crawlers */}
          <div className="mx-auto max-w-md text-center pb-6">
            <p className="text-sm text-muted">Search 85+ free online tools</p>
          </div>

          {/* Category links — per-category colors + real text for SEO */}
          <div className="flex flex-wrap items-center justify-center gap-2 pb-10 border-b border-card-border">
            <span className="text-sm font-semibold text-muted">Categories:</span>
            {categories.filter((c) => c.id !== "all").map((cat) => {
              const cc = CAT_COLORS[cat.id] || CAT_COLORS.encode
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.id}`}
                  className="rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all hover:brightness-125 hover:scale-105"
                  style={{
                    borderColor: cc.border,
                    backgroundColor: cc.bg,
                    color: cc.text,
                  }}
                >
                  {cat.name}
                </Link>
              )
            })}
          </div>

          {/* All tools — real name/text links, ranked by priority */}
          <div className="pt-8">
            <h2 className="text-lg font-semibold mb-4">All Tools</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {tools.filter((t) => !t.comingSoon).slice(0, 30).map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tool/${tool.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-card-border bg-card-bg px-4 py-3 text-sm font-medium text-foreground hover:border-accent/20 hover:bg-accent/5 transition-colors"
                >
                  <span className="text-lg" role="img" aria-hidden="true">{tool.icon || '🔧'}</span>
                  <span>{tool.name}</span>
                </Link>
              ))}
            </div>
            <p className="text-center text-xs text-muted-soft mt-6">
              {activeTools.length}+ tools &mdash; more loading&hellip;
            </p>
          </div>
        </section>
      }>
        <HomeContent />
      </Suspense>

      <section className="border-t border-card-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Popular Tools</h2>
              <p className="mt-1 text-sm text-muted">Most used tools, hand-picked for you</p>
            </div>
            <Link href="/?cat=all" className="text-sm font-medium text-accent hover:text-accent-light transition-colors">
              View all &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {featuredTools.map((tool, idx) => (
              <ToolCard key={tool.id} tool={tool} index={idx} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-card-border">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold tracking-tight">How It Works</h2>
            <p className="mt-2 text-muted">Three steps. Zero friction.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3 max-w-3xl mx-auto">
            {[
              { icon: Search, num: "1", title: "Find Your Tool", desc: "Browse 80+ tools by category or search for exactly what you need. Every tool is one click away." },
              { icon: Zap, num: "2", title: "Use It Instantly", desc: "No sign-ups, no installs. Type, paste, or upload \u2014 results appear as you work. Everything happens in your browser." },
              { icon: Lock, num: "3", title: "Your Data Stays Private", desc: "Nothing uploaded to servers. No tracking, no analytics, no logs. What happens in your browser stays in your browser." },
            ].map((step) => (
              <div key={step.num} className="text-center space-y-3">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <step.icon size={24} />
                </div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-card-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-sm text-muted-soft">
            <span className="flex items-center gap-2">
              <Lock size={15} className="text-accent" />
              No data uploaded &mdash; 100% local
            </span>
            <span className="flex items-center gap-2">
              <Monitor size={15} className="text-accent" />
              Works on desktop, tablet &amp; mobile
            </span>
            <span className="flex items-center gap-2">
              <Sparkles size={15} className="text-accent" />
              {activeTools.length}+ tools &mdash; all free forever
            </span>
          </div>
        </div>
      </section>

      <section className="border-t border-card-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-3xl space-y-12">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-3">A Complete Toolkit for Your Browser</h2>
              <p className="text-muted leading-relaxed">
                LootNestX brings together over 80 free online tools in one place. Whether you"'"re a developer
                debugging JSON responses, a student calculating your GPA, a designer picking color palettes,
                or someone who just needs to compress an image &mdash; every tool runs entirely in your browser.
                No installs, no sign-ups, and nothing uploaded to any server. Your data stays on your device,
                and all processing happens locally. That means faster performance, better privacy, and zero
                waiting for cloud processing.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight mb-3">Calculators for Real Life</h2>
              <p className="text-muted leading-relaxed">
                From mortgage payments and GPA scores to gas costs and sales tax, our calculators are built
                with US users in mind. Calculate BMI using standard or metric units, figure out how much
                sleep you need based on sleep cycles, or convert cooking measurements between cups, ounces,
                and grams. Each calculator updates results instantly as you type &mdash; no submit buttons needed.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight mb-3">Developer Tools That Just Work</h2>
              <p className="text-muted leading-relaxed">
                Format JSON with syntax highlighting, encode strings to Base64, validate JWT tokens, test
                regular expressions in real-time, and minify CSS or JavaScript &mdash; all without leaving your
                browser tab. Our developer tools are designed to be fast and distraction-free, with copy
                buttons where you need them and clear error messages when something goes wrong.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight mb-3">Privacy You Can Count On</h2>
              <p className="text-muted leading-relaxed">
                Unlike many online tool sites, LootNestX doesn"'"t upload your files to a remote server
                for processing. Images stay in your browser. Text stays in your browser. Everything you
                type, paste, or upload is processed locally using Web APIs and client-side JavaScript.
                We don"'"t track you with analytics, we don"'"t serve behavior-targeted ads, and we
                don"'"t store any of your data. What happens in your browser stays in your browser.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}