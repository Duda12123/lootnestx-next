import { NextResponse } from "next/server"
import { tools } from "@/data/tools"

interface Params {
  params: Promise<{ slug: string }>
}

export async function GET(_req: Request, { params }: Params) {
  const { slug } = await params
  const tool = tools.find(t => t.slug === slug && !t.comingSoon)

  if (!tool) {
    return new NextResponse("Tool not found", { status: 404 })
  }

  const manifest = {
    name: `${tool.name} — ToolNest`,
    short_name: tool.name,
    description: tool.description,
    start_url: `/tool/${slug}`,
    scope: `/tool/${slug}`,
    display: "standalone",
    background_color: "#0a0a0f",
    theme_color: "#3b82f6",
    orientation: "any",
    icons: [
      { src: "/favicon.svg", sizes: "48x48", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
    categories: ["utilities", "developer tools", "productivity"],
  }

  return NextResponse.json(manifest)
}

export async function generateStaticParams() {
  return tools.filter(t => !t.comingSoon).map(t => ({ slug: t.slug }))
}
