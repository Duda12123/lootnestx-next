export function JsonLd({ data }: { data: Record<string, unknown> | (Record<string, unknown> | null)[] }) {
  if (Array.isArray(data)) {
    const items = data.filter(Boolean) as Record<string, unknown>[]
    if (items.length === 0) return null
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({ "@context": "https://schema.org", "@graph": items }),
        }}
      />
    )
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
