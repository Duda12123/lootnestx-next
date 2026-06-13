import Link from "next/link"

const popularLinks = [
  { name: "JSON Formatter", href: "/tool/json-formatter" },
  { name: "QR Code Generator", href: "/tool/qrcode" },
  { name: "Image Compressor", href: "/tool/image-compressor" },
  { name: "Password Generator", href: "/tool/password" },
  { name: "Base64 Encoder / Decoder", href: "/tool/base64" },
  { name: "BMI Calculator", href: "/tool/bmi-calculator" },
  { name: "CSS Gradient Generator", href: "/tool/css-gradient" },
  { name: "Markdown Preview", href: "/tool/markdown" },
  { name: "URL Encoder", href: "/tool/url-encoder" },
  { name: "Unit Converter", href: "/tool/unit-converter" },
  { name: "Text Counter", href: "/tool/text-counter" },
  { name: "Color Palette Generator", href: "/tool/color-palette" },
]

export default function NotFound() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 sm:py-24 text-center">
      <span className="text-7xl">🧭</span>

      <h1 className="mt-6 text-3xl sm:text-4xl font-bold tracking-tight">
        Page Not Found
      </h1>
      <p className="mt-3 text-lg text-muted max-w-lg mx-auto">
        Oops! This page doesn&apos;t exist. But we&apos;ve got plenty of free online tools you might be looking for.
      </p>

      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
        >
          ← Back to Free Tools
        </Link>
      </div>

      <div className="mt-12 text-left">
        <h2 className="text-center text-lg font-semibold mb-6">
          Popular Tools You Might Be Looking For
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {popularLinks.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="rounded-lg border border-card-border bg-card-bg px-3 py-2.5 text-sm font-medium text-muted hover:border-accent/20 hover:text-foreground transition-all"
            >
              {tool.name}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
