import type { Metadata } from "next"

export const metadata: Metadata = { title: "Contact — ToolNestX" }

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight mb-4">Contact</h1>
      <p className="text-muted mb-8">Have a suggestion, found a bug, or want to request a tool? We&apos;d love to hear from you.</p>
      <div className="rounded-2xl border border-card-border bg-card-bg p-8 space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-muted-soft uppercase tracking-wider mb-2">Email</h2>
          <a href="mailto:legal@lootnestx.com" className="text-accent hover:text-accent-light transition-colors text-lg font-medium">legal@lootnestx.com</a>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-muted-soft uppercase tracking-wider mb-2">Report a Bug</h2>
          <p className="text-muted">Please include the tool name, what you expected, and what happened instead. Screenshots help!</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-muted-soft uppercase tracking-wider mb-2">Feature Request</h2>
          <p className="text-muted">Tell us what tool you&apos;d like to see. We prioritize based on demand.</p>
        </div>
      </div>
    </div>
  )
}
