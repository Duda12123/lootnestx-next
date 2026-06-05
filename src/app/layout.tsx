import type { Metadata, Viewport } from "next"
import { Space_Grotesk, DM_Sans, JetBrains_Mono } from "next/font/google"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-heading" })
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" })
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: {
    default: "ToolNest — Free Online Tools, Right in Your Browser",
    template: "%s — ToolNest",
  },
  description:
    "Free online tools that work right in your browser. Calculators, converters, formatters, image tools, and more — no sign-ups, no uploads, no nonsense.",
  keywords: [
    "online tools", "free tools", "calculator", "json formatter", "base64",
    "qr code", "image compressor", "password generator", "markdown",
    "css gradient", "unit converter", "developer tools",
  ],
  authors: [{ name: "ToolNest" }],
  creator: "ToolNest",
  metadataBase: new URL("https://lootnestx.com"),
  openGraph: {
    type: "website",
    siteName: "ToolNest",
    title: "ToolNest — Free Online Tools",
    description:
      "Free online tools that work right in your browser. No sign-ups, no uploads, no nonsense.",
    url: "https://lootnestx.com",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolNest — Free Online Tools",
    description:
      "Free online tools that work right in your browser. No sign-ups, no uploads, no nonsense.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://lootnestx.com" },
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
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ToolNest" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <Header />
        <main className="flex-1"><ErrorBoundary>{children}</ErrorBoundary></main>
        <Footer />
        <ServiceWorkerRegistration />
      </body>
    </html>
  )
}
