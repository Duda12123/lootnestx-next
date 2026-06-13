import type { Metadata, Viewport } from "next"
import { Space_Grotesk, DM_Sans, JetBrains_Mono } from "next/font/google"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { Analytics } from "@vercel/analytics/react"
import { JsonLd } from "@/components/JsonLd"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-heading" })
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" })
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: {
    default: "Free Online Tools —No Sign-Up, No Uploads | LootNestX",
    template: "%s | LootNestX",
  },
  description:
    "Free online tools that work right in your browser. Calculators, converters, formatters, image tools, and more —no sign-ups, no uploads, no nonsense.",
  keywords: [
    "free online tools", "calculator", "json formatter", "base64 encoder",
    "qr code generator", "image compressor", "password generator", "markdown preview",
    "css gradient", "unit converter", "developer tools", "meme generator",
    "youtube thumbnail", "logo generator", "gaming name generator", "screen recorder",
    "mortgage calculator", "sales tax calculator", "bmi calculator", "color picker",
    "text tools", "image tools", "encoding tools", "productivity tools",
  ],
  authors: [{ name: "LootNestX" }],
  creator: "LootNestX",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://lootnestx.com"),
  openGraph: {
    type: "website",
    siteName: "LootNestX",
    title: "Free Online Tools —No Sign-Up, No Uploads | LootNestX",
    description:
      "Free online tools that work right in your browser. No sign-ups, no uploads, no nonsense.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://lootnestx.com",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Tools —No Sign-Up, No Uploads | LootNestX",
    description:
      "Free online tools that work right in your browser. No sign-ups, no uploads, no nonsense.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrains.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="LootNestX" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <JsonLd data={[{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "LootNestX",
          "url": process.env.NEXT_PUBLIC_SITE_URL || "https://lootnestx.com",
          "description": "Free online tools that work right in your browser —85+ tools, calculators, converters, formatters, and more.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || "https://lootnestx.com"}/?search={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        }, {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "LootNestX",
          "url": process.env.NEXT_PUBLIC_SITE_URL || "https://lootnestx.com",
          "description": "Free online tools that work in your browser —no sign-ups, no uploads.",
          "logo": `${process.env.NEXT_PUBLIC_SITE_URL || "https://lootnestx.com"}/icon-192.png`,
          "contactPoint": {
            "@type": "ContactPoint",
            "email": "legal@lootnestx.com",
            "contactType": "customer support"
          }
        }, {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "LootNestX",
          "url": process.env.NEXT_PUBLIC_SITE_URL || "https://lootnestx.com",
          "description": "Free online tools that work right in your browser. No sign-ups, no uploads.",
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "All",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "browserRequirements": "Requires JavaScript"
        }]} />
        <Header />
        <main className="flex-1"><ErrorBoundary>{children}</ErrorBoundary></main>
        <Footer />
        <ServiceWorkerRegistration />
        <Analytics />
      </body>
    </html>
  )
}
