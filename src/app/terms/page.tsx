import type { Metadata } from "next"

export const metadata: Metadata = { title: "Terms of Service — ToolNestX" }

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Terms of Service</h1>
      <div className="prose prose-invert prose-zinc max-w-none space-y-4 text-muted leading-relaxed">
        <p><strong>Last updated:</strong> June 2026</p>
        <h2 className="text-xl font-semibold text-foreground mt-8">1. Acceptance</h2>
        <p>By using ToolNestX, you agree to these terms. If you disagree, please discontinue use.</p>
        <h2 className="text-xl font-semibold text-foreground mt-8">2. Service Description</h2>
        <p>ToolNestX provides free browser-based tools. All tools run locally in your browser — we do not host or process your data on our servers.</p>
        <h2 className="text-xl font-semibold text-foreground mt-8">3. No Warranty</h2>
        <p>Tools are provided &quot;as is&quot; without warranty of any kind. We do not guarantee accuracy, availability, or suitability for any purpose.</p>
        <h2 className="text-xl font-semibold text-foreground mt-8">4. Limitation of Liability</h2>
        <p>ToolNestX shall not be liable for any damages arising from the use or inability to use our tools.</p>
        <h2 className="text-xl font-semibold text-foreground mt-8">5. Changes</h2>
        <p>We reserve the right to modify these terms at any time. Continued use constitutes acceptance of changes.</p>
      </div>
    </div>
  )
}
