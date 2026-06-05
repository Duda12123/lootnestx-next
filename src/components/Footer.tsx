import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-card-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Link href="/" className="inline-flex items-center gap-2 text-lg font-bold">
              <span className="flex h-8 w-9 items-center justify-center rounded-lg bg-accent text-sm font-black text-white tracking-[-0.1em]">TX</span>
              ToolNest<span className="text-accent">X</span>
            </Link>
            <p className="text-sm text-muted leading-relaxed">Free online tools that work in your browser. No uploads to servers, no sign-ups, just tools that get things done.</p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="flex h-8 w-8 items-center justify-center rounded-lg border border-card-border bg-card-bg text-muted-soft hover:text-accent hover:border-accent/20 transition-colors" aria-label="Twitter"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg></a>
              <a href="#" className="flex h-8 w-8 items-center justify-center rounded-lg border border-card-border bg-card-bg text-muted-soft hover:text-accent hover:border-accent/20 transition-colors" aria-label="GitHub"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg></a>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-soft">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/?cat=encode" className="text-sm text-muted hover:text-foreground transition-colors">Encode &amp; Decode</Link></li>
              <li><Link href="/?cat=formatters" className="text-sm text-muted hover:text-foreground transition-colors">Formatters</Link></li>
              <li><Link href="/?cat=generators" className="text-sm text-muted hover:text-foreground transition-colors">Generators</Link></li>
              <li><Link href="/?cat=css" className="text-sm text-muted hover:text-foreground transition-colors">CSS Tools</Link></li>
              <li><Link href="/?cat=image" className="text-sm text-muted hover:text-foreground transition-colors">Image Tools</Link></li>
              <li><Link href="/?cat=text" className="text-sm text-muted hover:text-foreground transition-colors">Text Tools</Link></li>
              <li><Link href="/?cat=dev" className="text-sm text-muted hover:text-foreground transition-colors">Developer</Link></li>
              <li><Link href="/?cat=audio" className="text-sm text-muted hover:text-foreground transition-colors">Audio &amp; Speech</Link></li>
              <li><Link href="/?cat=utilities" className="text-sm text-muted hover:text-foreground transition-colors">Everyday Utilities</Link></li>
              <li><Link href="/?cat=fun" className="text-sm text-muted hover:text-foreground transition-colors">Fun &amp; Games</Link></li>
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
              <li><Link href="/privacy" className="text-sm text-muted hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="text-sm text-muted hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-card-border pt-8">
          <p className="text-center text-xs text-muted-soft">&copy; {new Date().getFullYear()} ToolNestX. All tools run locally in your browser — your data never leaves your device.</p>
        </div>
      </div>
    </footer>
  )
}
