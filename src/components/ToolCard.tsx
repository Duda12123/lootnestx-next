import Link from "next/link"
import { tools } from "@/data/tools"

export function ToolCard({ tool, index }: { tool: typeof tools[number]; index: number }) {
  if (tool.comingSoon) {
    return (
      <div className="group relative rounded-xl border border-dashed border-card-border bg-card-bg/50 p-5 transition-all">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-card-bg text-2xl opacity-60">{tool.icon}</span>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-muted">{tool.name}</h3>
            <p className="mt-1 text-sm text-muted-soft line-clamp-2">{tool.description}</p>
          </div>
        </div>
        <span className="absolute right-3 top-3 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent uppercase tracking-wide">Soon</span>
      </div>
    )
  }

  return (
    <Link
      href={`/tool/${tool.slug}`}
      className="tool-card group relative block rounded-xl border border-card-border bg-card-bg p-5"
    >
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-2xl transition-transform group-hover:scale-110">
            {tool.icon}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-foreground group-hover:text-accent transition-colors">{tool.name}</h3>
            <p className="mt-1 text-sm text-muted line-clamp-2">{tool.description}</p>
          </div>
        </div>

        {tool.featured && (
          <span className="absolute right-3 top-3 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent uppercase tracking-wide">Featured</span>
        )}

        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5 transition-all group-hover:ring-accent/20" />
    </Link>
  )
}
