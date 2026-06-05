import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "How to Compress Images for the Web — Guide",
  description: "Learn how to compress JPEG, PNG, WebP, and AVIF images without losing quality. Complete guide with best practices, tools, and optimization tips for faster websites.",
}

export default function CompressImagesGuide() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
      <Link href="/guides" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8">
        <ArrowLeft size={16} /> Back to Guides
      </Link>

      <article className="prose prose-invert prose-zinc max-w-none space-y-6 text-muted leading-relaxed">
        <h1 className="text-3xl font-bold tracking-tight text-foreground not-prose mb-4">
          How to Compress Images for the Web — The Complete Guide
        </h1>
        <p className="text-sm text-muted-soft not-prose">June 2026 · 5 min read</p>

        <h2 className="text-xl font-semibold text-foreground mt-8">Why Image Compression Matters</h2>
        <p>
          Images make up an average of <strong>50-60% of a webpage&apos;s total size</strong>. On an average
          website, that&apos;s over 1MB of images per page. For visitors on mobile data or slower connections,
          every kilobyte counts.
        </p>
        <p>
          Compressing images before uploading them to your website can reduce page load times by 30-50%,
          improve your Google Core Web Vitals score, and boost your search ranking. It&apos;s one of the
          highest-impact optimizations you can make with minimal effort.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">Understanding Image Formats</h2>
        <p>Choosing the right format is half the battle. Here&apos;s what you need to know:</p>

        <h3 className="text-lg font-semibold text-foreground">JPEG</h3>
        <p>
          Best for photographs and complex images with lots of colors. JPEG uses lossy compression — it
          discards some image data to reduce file size. At 70-80% quality, the visual difference is nearly
          invisible, but the file size drops dramatically.
        </p>
        <ul className="space-y-1">
          <li>✅ Best for: photos, gradients, complex images</li>
          <li>❌ Avoid for: logos, text, sharp edges (use PNG)</li>
          <li>🎯 Target: compress to 50-200KB for web use</li>
        </ul>

        <h3 className="text-lg font-semibold text-foreground">PNG</h3>
        <p>
          Best for graphics with sharp edges, text, logos, and images requiring transparency. PNG uses
          lossless compression — it preserves every pixel exactly. Use PNG-8 (256 colors) for simple
          graphics and PNG-24 for images needing full color with transparency.
        </p>
        <ul className="space-y-1">
          <li>✅ Best for: logos, icons, screenshots, UI elements</li>
          <li>❌ Avoid for: photographs (files will be huge)</li>
          <li>🎯 Target: compress to 10-100KB for web use</li>
        </ul>

        <h3 className="text-lg font-semibold text-foreground">WebP</h3>
        <p>
          Google&apos;s modern image format that supports both lossy and lossless compression. WebP files
          are typically <strong>25-35% smaller</strong> than equivalent JPEG or PNG files at the same visual
          quality. All modern browsers support WebP (97%+ global coverage).
        </p>
        <ul className="space-y-1">
          <li>✅ Best for: almost everything — it&apos;s the default choice now</li>
          <li>❌ Avoid for: very old browser support (IE11)</li>
          <li>🎯 Target: 30-50% smaller than JPEG equivalent</li>
        </ul>

        <h3 className="text-lg font-semibold text-foreground">AVIF</h3>
        <p>
          The newest kid on the block. AVIF offers even better compression than WebP — files can be
          <strong>50% smaller</strong> than JPEG at equivalent quality. Browser support is growing
          rapidly (Chrome, Firefox, Opera) with Safari adding support in recent versions.
        </p>
        <ul className="space-y-1">
          <li>✅ Best for: forward-looking projects, CDN auto-conversion</li>
          <li>❌ Avoid for: maximum compatibility (use WebP as fallback)</li>
          <li>🎯 Target: 50%+ smaller than JPEG equivalent</li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-8">How to Compress Images: Step by Step</h2>
        <ol className="space-y-4 list-decimal pl-5">
          <li>
            <strong className="text-foreground">Choose the right format.</strong> Photos → JPEG or WebP.
            Graphics/logos → PNG or WebP. When in doubt, WebP is your safest bet.
          </li>
          <li>
            <strong className="text-foreground">Resize before compressing.</strong> If your image is
            4000×3000px but displays at 800×600px on your site, resize it first. Compression can&apos;t
            fix wasted pixels.
          </li>
          <li>
            <strong className="text-foreground">Set the quality level.</strong> For JPEG, 70-80% quality
            is the sweet spot. For WebP, 75% quality typically produces excellent results. Test visually —
            if you can&apos;t see the difference, the quality is high enough.
          </li>
          <li>
            <strong className="text-foreground">Use our free Image Compressor tool</strong> — drag and
            drop your images, adjust the quality slider, and download the compressed version instantly.
            All processing happens in your browser.
          </li>
          <li>
            <strong className="text-foreground">Test the result.</strong> Compare the original and compressed
            images side by side. Check for artifacts, color shifts, or blurring. If it looks good to you,
            it&apos;ll look good to your visitors.
          </li>
        </ol>

        <h2 className="text-xl font-semibold text-foreground mt-8">Pro Tips</h2>
        <ul className="space-y-3">
          <li>
            <strong className="text-foreground">Use responsive images.</strong> Serve different sizes for
            different screens with the <code className="text-accent text-sm">&lt;picture&gt;</code> element
            or <code className="text-accent text-sm">srcset</code> attribute.
          </li>
          <li>
            <strong className="text-foreground">Lazy-load below-the-fold images.</strong> Add{" "}
            <code className="text-accent text-sm">loading=&quot;lazy&quot;</code> to images that aren&apos;t
            immediately visible. This cuts initial page weight significantly.
          </li>
          <li>
            <strong className="text-foreground">Strip metadata.</strong> Photos often contain EXIF data
            (camera model, GPS location, date) that adds unnecessary kilobytes. Our compressor strips
            this automatically.
          </li>
          <li>
            <strong className="text-foreground">Batch process.</strong> Compress all images for a page
            in one session to maintain consistent quality across your site.
          </li>
        </ul>

        <div className="mt-10 p-6 rounded-xl border border-accent/15 bg-accent/5 not-prose">
          <p className="text-sm font-semibold text-accent mb-2">Tools mentioned in this guide</p>
          <Link href="/tool/image-compressor" className="text-foreground hover:text-accent transition-colors text-sm font-medium">
            Image Compressor →{" "}
          </Link>
          <span className="text-muted-soft text-sm">Compress JPEG, PNG, and WebP images right in your browser</span>
        </div>
      </article>
    </div>
  )
}
