import type { Metadata } from "next"

export const metadata: Metadata = { title: "Privacy Policy — ToolNest" }

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Privacy Policy</h1>
      <div className="prose prose-invert prose-zinc max-w-none space-y-4 text-muted leading-relaxed">
        <p><strong>Last updated:</strong> June 2026</p>
        <h2 className="text-xl font-semibold text-foreground mt-8">1. No Data Collection</h2>
        <p>ToolNest tools run entirely in your browser. We do not collect, store, or transmit any of your data. All processing happens locally on your device.</p>
        <h2 className="text-xl font-semibold text-foreground mt-8">2. No Cookies</h2>
        <p>We do not use tracking cookies or analytics. The only cookies used are functional (e.g., remembering your theme preference) and stored locally.</p>
        <h2 className="text-xl font-semibold text-foreground mt-8">3. Image & File Processing</h2>
        <p>When you use our image or file tools, all processing happens in your browser. Files are never uploaded to any server.</p>
        <h2 className="text-xl font-semibold text-foreground mt-8">4. Third-Party Services</h2>
        <p>This site is hosted on Vercel. Vercel may collect standard server logs (IP address, user agent) for operational purposes. See Vercel&apos;s privacy policy for details.</p>
        <h2 className="text-xl font-semibold text-foreground mt-8">5. Contact</h2>
        <p>For privacy questions, contact us at legal@lootnestx.com.</p>
      </div>
    </div>
  )
}
