import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About — ToolNestX",
  description: "Learn about ToolNestX — who we are, why we built this free online toolkit, and our mission to make useful tools accessible to everyone without sign-ups or paywalls.",
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
      <h1 className="text-3xl font-bold tracking-tight mb-4">About ToolNestX</h1>
      <p className="text-muted mb-12 text-lg leading-relaxed">
        We believe useful tools shouldn&apos;t require accounts, downloads, or subscriptions.
        Everything you need should work right in your browser — instantly, privately, and free.
      </p>

      <div className="prose prose-invert prose-zinc max-w-none space-y-6 text-muted leading-relaxed">
        <h2 className="text-xl font-semibold text-foreground">Who We Are</h2>
        <p>
          ToolNestX is an independent project built by a small team of developers who got tired
          of searching for simple online tools only to find ad-ridden pages, forced sign-ups,
          and paywalled features. We wanted a clean, fast, private alternative — so we built one.
        </p>
        <p>
          We&apos;re based in the United States and serve users worldwide. Every tool on this site
          is designed and maintained with care, and we add new tools regularly based on what
          people actually need.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-10">Why We Built This</h2>
        <p>
          Online tools should be simple: open a page, use the tool, get the result, move on.
          Instead, the web is full of tool sites that bombard you with popups, track your data,
          limit features behind paywalls, and upload your files to who-knows-where.
        </p>
        <p>ToolNestX is different because:</p>
        <ul className="space-y-2">
          <li>
            <strong className="text-foreground">Everything runs locally.</strong>{" "}
            Your data never leaves your device. Images, files, text — all processed right in your browser.
          </li>
          <li>
            <strong className="text-foreground">No accounts. No sign-ups.</strong>{" "}
            Just open a tool and use it. No email required, no password to remember.
          </li>
          <li>
            <strong className="text-foreground">Completely free.</strong>{" "}
            No premium tiers, no feature limits, no credit systems. All tools, all features, always free.
          </li>
          <li>
            <strong className="text-foreground">Privacy-first design.</strong>{" "}
            We don&apos;t track you. We don&apos;t use analytics. We don&apos;t store anything.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-10">What We Offer</h2>
        <p>
          ToolNestX includes <strong>80+ free tools</strong> across 10 categories:
        </p>
        <ul className="space-y-2">
          <li><strong className="text-foreground">Calculators</strong> — BMI, mortgage, GPA, gas cost, sales tax, and more</li>
          <li><strong className="text-foreground">Encoders & Decoders</strong> — Base64, URL encoding, HTML entities, hash generators</li>
          <li><strong className="text-foreground">Formatters</strong> — JSON, SQL, XML, YAML, CSV with syntax highlighting</li>
          <li><strong className="text-foreground">Image Tools</strong> — Compress, convert, crop, resize, watermark, and photo effects</li>
          <li><strong className="text-foreground">Text Tools</strong> — Case converter, text diff, slug generator, NATO alphabet</li>
          <li><strong className="text-foreground">Generators</strong> — Passwords, QR codes, UUIDs, barcodes, lorem ipsum</li>
          <li><strong className="text-foreground">CSS Tools</strong> — Gradients, shadows, glassmorphism, color pickers</li>
          <li><strong className="text-foreground">Developer Tools</strong> — Regex tester, JWT decoder, cron parser, minifiers</li>
          <li><strong className="text-foreground">Audio Tools</strong> — Text-to-speech, speech-to-text</li>
          <li><strong className="text-foreground">Fun & Games</strong> — Dice roller, coin flip, fortune cookie, name generators</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-10">Our Mission</h2>
        <p>
          Our mission is simple: make the web&apos;s most useful tools accessible to everyone,
          instantly, with zero friction. No accounts, no paywalls, no tracking — just tools that work.
        </p>
        <p>
          We believe that calculators, converters, formatters, and generators are basic utilities
          that should be as freely available as a search engine. The web already has too many
          gatekeepers. We&apos;re here to open the gates.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-10">Get In Touch</h2>
        <p>
          Have an idea for a tool? Found something that could be better? We&apos;d love to hear
          from you. Email us at{" "}
          <a href="mailto:legal@lootnestx.com" className="text-accent hover:text-accent-light transition-colors">
            legal@lootnestx.com
          </a>{" "}
          or visit our{" "}
          <a href="/contact" className="text-accent hover:text-accent-light transition-colors">
            contact page
          </a>
          .
        </p>
      </div>
    </div>
  )
}
