import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-card-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Link href="/" className="inline-flex items-center gap-2 text-lg font-bold">
              <span className="flex h-8 w-9 items-center justify-center rounded-lg bg-accent text-sm font-black text-white tracking-[-0.1em]">LX</span>
              LootNest<span className="text-accent">X</span>
            </Link>
            <p className="text-sm text-muted leading-relaxed">Free online tools that work in your browser. No uploads to servers, no sign-ups, just tools that get things done.</p>

          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-soft">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/category/encode" className="text-sm text-muted hover:text-foreground transition-colors">Encode &amp; Decode</Link></li>
              <li><Link href="/category/formatters" className="text-sm text-muted hover:text-foreground transition-colors">Formatters</Link></li>
              <li><Link href="/category/generators" className="text-sm text-muted hover:text-foreground transition-colors">Generators</Link></li>
              <li><Link href="/category/css" className="text-sm text-muted hover:text-foreground transition-colors">CSS Tools</Link></li>
              <li><Link href="/category/image" className="text-sm text-muted hover:text-foreground transition-colors">Image Tools</Link></li>
              <li><Link href="/category/text" className="text-sm text-muted hover:text-foreground transition-colors">Text Tools</Link></li>
              <li><Link href="/category/dev" className="text-sm text-muted hover:text-foreground transition-colors">Developer</Link></li>
              <li><Link href="/category/audio" className="text-sm text-muted hover:text-foreground transition-colors">Audio &amp; Speech</Link></li>
              <li><Link href="/category/utilities" className="text-sm text-muted hover:text-foreground transition-colors">Everyday Utilities</Link></li>
              <li><Link href="/category/fun" className="text-sm text-muted hover:text-foreground transition-colors">Fun &amp; Games</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-soft">Popular</h3>
            <ul className="space-y-2">
              <li><Link href="/tool/json-formatter" className="text-sm text-muted hover:text-foreground transition-colors">JSON Formatter</Link></li>
              <li><Link href="/tool/qrcode" className="text-sm text-muted hover:text-foreground transition-colors">QR Code Generator</Link></li>
              <li><Link href="/tool/image-compressor" className="text-sm text-muted hover:text-foreground transition-colors">Image Compressor</Link></li>
              <li><Link href="/tool/password" className="text-sm text-muted hover:text-foreground transition-colors">Password Generator</Link></li>
              <li><Link href="/tool/markdown" className="text-sm text-muted hover:text-foreground transition-colors">Markdown Preview</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-soft">About</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-muted hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/guides" className="text-sm text-muted hover:text-foreground transition-colors">Guides</Link></li>
              <li><Link href="/privacy" className="text-sm text-muted hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="text-sm text-muted hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-card-border pt-8">
          <p className="text-center text-xs text-muted-soft"><span translate="no">&copy; {new Date().getFullYear()} LootNestX.</span> All tools run locally in your browser — your data never leaves your device.</p>
        </div>
      </div>
    </footer>
  )
}
