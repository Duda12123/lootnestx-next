import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { JsonLd } from "@/components/JsonLd"
import { generateArticleSchema, generateBreadcrumbSchema } from "@/lib/schema/tool-schema"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lootnestx.com"

export const metadata: Metadata = {
  title: "Base64 Encoding Explained — Guide",
  description: "Learn what Base64 encoding is, how it works, and when to use it. Covers data URIs, API authentication, email attachments, and common use cases.",
}

export default function Base64Guide() {
  const guideUrl = `${baseUrl}/guides/base64-encoding-guide`
  return (
    <>
      <JsonLd data={[
        generateArticleSchema({
          headline: "Base64 Encoding & Decoding — The Complete Guide",
          description: "Learn what Base64 encoding is, how it works, and when to use it. Covers data URIs, API authentication, email attachments, and common use cases.",
          url: guideUrl,
        }),
        generateBreadcrumbSchema([
          { name: "Home", url: baseUrl },
          { name: "Guides", url: `${baseUrl}/guides` },
          { name: "Base64 Encoding Guide", url: guideUrl },
        ]),
      ]} />
    <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
      <Link href="/guides" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8">
        <ArrowLeft size={16} /> Back to Guides
      </Link>

      <article className="prose prose-invert prose-zinc max-w-none space-y-6 text-muted leading-relaxed">
        <h1 className="text-3xl font-bold tracking-tight text-foreground not-prose mb-4">
          Base64 Encoding & Decoding — The Complete Guide
        </h1>
        <p className="text-sm text-muted-soft not-prose">June 2026 · 5 min read</p>

        <h2 className="text-xl font-semibold text-foreground mt-8">What Is Base64 Encoding?</h2>
        <p>
          Base64 is a way to represent binary data (images, files, audio) as plain text using only
          64 printable ASCII characters: A-Z, a-z, 0-9, plus (+) and slash (/). It&apos;s not encryption
          or compression — it&apos;s an encoding scheme that makes binary data safe for transmission
          through text-based systems.
        </p>
        <p>
          Think of it like translating a song into sheet music. The music (binary data) becomes text
          (Base64) that can be written down, emailed, or embedded anywhere text can go — and then
          played back (decoded) perfectly on the other end.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">When to Use Base64 Encoding</h2>

        <h3 className="text-lg font-semibold text-foreground">1. Data URIs for Images</h3>
        <p>
          Embed small images directly in HTML or CSS using data URIs. This eliminates a separate HTTP
          request, which can speed up page loading for icons and tiny graphics. The format looks like:
        </p>
        <pre className="bg-card-bg border border-card-border rounded-lg p-4 text-sm overflow-x-auto not-prose">
          <code className="text-accent">{`<img src="data:image/png;base64,iVBORw0K..."/ >`}</code>
        </pre>
        <p>
          <strong className="text-foreground">Important:</strong> Base64 increases file size by ~33%,
          so only use it for images under ~5KB. For larger images, regular file serving with HTTP/2
          multiplexing is more efficient.
        </p>

        <h3 className="text-lg font-semibold text-foreground">2. API Authentication</h3>
        <p>
          HTTP Basic Authentication encodes <code className="text-accent text-sm">username:password</code>{" "}
          as Base64. Many REST APIs use Base64-encoded credentials in the Authorization header. While it
          looks scrambled, remember: Base64 is <strong>not encryption</strong> — always use HTTPS with
          Basic Auth.
        </p>

        <h3 className="text-lg font-semibold text-foreground">3. Email Attachments (MIME)</h3>
        <p>
          Email was designed for text, not binary files. MIME (Multipurpose Internet Mail Extensions)
          uses Base64 to encode file attachments so they can travel through email servers safely.
          Every email attachment you&apos;ve ever sent or received was Base64-encoded at some point.
        </p>

        <h3 className="text-lg font-semibold text-foreground">4. JSON Web Tokens (JWT)</h3>
        <p>
          JWTs use Base64URL encoding (a URL-safe variant of Base64) for their header, payload, and
          signature sections. If you&apos;ve ever decoded a JWT on jwt.io, you were decoding Base64.
        </p>

        <h3 className="text-lg font-semibold text-foreground">5. Storing Binary in Text-Based Systems</h3>
        <p>
          Need to store an image in a JSON field? A PDF in a database text column? Base64-encode it first.
          Many systems that only accept text (like localStorage in browsers) work with Base64-encoded binary data.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">Common Mistakes to Avoid</h2>
        <ul className="space-y-3">
          <li>
            <strong className="text-foreground">Using Base64 for large files.</strong> A 10MB image
            becomes ~13.3MB in Base64. That&apos;s 33% more data for no benefit. Use it for small
            payloads only.
          </li>
          <li>
            <strong className="text-foreground">Thinking it&apos;s encryption.</strong> Base64 provides
            zero security. Anyone can decode it instantly. Never use Base64 to &quot;protect&quot;
            sensitive data.
          </li>
          <li>
            <strong className="text-foreground">Forgetting the data prefix.</strong> When embedding
            images as data URIs, include the MIME type:{" "}
            <code className="text-accent text-sm">data:image/png;base64,...</code> not just the
            Base64 string.
          </li>
          <li>
            <strong className="text-foreground">Mixing up Base64 and Base64URL.</strong> URLs
            can&apos;t contain <code className="text-accent text-sm">+</code> or{" "}
            <code className="text-accent text-sm">/</code> characters. Use Base64URL (which replaces
            them with <code className="text-accent text-sm">-</code> and{" "}
            <code className="text-accent text-sm">_</code>) for URL-safe contexts.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-8">How to Encode and Decode Base64</h2>
        <ol className="space-y-4 list-decimal pl-5">
          <li>
            <strong className="text-foreground">To encode:</strong> Paste your text or upload a file
            into our Base64 tool. The encoded output appears instantly — copy it for use in your
            HTML, CSS, API request, or email.
          </li>
          <li>
            <strong className="text-foreground">To decode:</strong> Paste a Base64 string into the
            tool. If it started as text, you&apos;ll see the original text. If it started as a file,
            you can download the decoded binary.
          </li>
          <li>
            <strong className="text-foreground">Image to Base64:</strong> Use our dedicated Image to
            Base64 converter for generating data URIs from image files. Perfect for embedding icons
            and small graphics directly in your code.
          </li>
        </ol>

        <h2 className="text-xl font-semibold text-foreground mt-8">Quick Reference</h2>
        <div className="overflow-x-auto not-prose">
          <table className="w-full text-sm border border-card-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-card-bg">
                <th className="text-left p-3 font-semibold text-foreground">Use Case</th>
                <th className="text-left p-3 font-semibold text-foreground">Tool to Use</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-card-border">
                <td className="p-3">Encode text to Base64</td>
                <td className="p-3">
                  <Link href="/tool/base64" className="text-accent hover:text-accent-light transition-colors">Base64 Encoder/Decoder</Link>
                </td>
              </tr>
              <tr className="border-t border-card-border">
                <td className="p-3">Image to data URI</td>
                <td className="p-3">
                  <Link href="/tool/image-to-base64" className="text-accent hover:text-accent-light transition-colors">Image to Base64</Link>
                </td>
              </tr>
              <tr className="border-t border-card-border">
                <td className="p-3">Decode JWT tokens</td>
                <td className="p-3">
                  <Link href="/tool/jwt-decoder" className="text-accent hover:text-accent-light transition-colors">JWT Decoder</Link>
                </td>
              </tr>
              <tr className="border-t border-card-border">
                <td className="p-3">URL-safe encoding</td>
                <td className="p-3">
                  <Link href="/tool/url-encoder" className="text-accent hover:text-accent-light transition-colors">URL Encoder/Decoder</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-10 p-6 rounded-xl border border-accent/15 bg-accent/5 not-prose">
          <p className="text-sm font-semibold text-accent mb-2">Tools mentioned in this guide</p>
          <div className="space-y-2">
            <div>
              <Link href="/tool/base64" className="text-foreground hover:text-accent transition-colors text-sm font-medium">Base64 Encoder/Decoder →</Link>
              <span className="text-muted-soft text-sm ml-2">Encode and decode Base64 strings instantly</span>
            </div>
            <div>
              <Link href="/tool/image-to-base64" className="text-foreground hover:text-accent transition-colors text-sm font-medium">Image to Base64 →</Link>
              <span className="text-muted-soft text-sm ml-2">Convert images to Base64 data URIs</span>
            </div>
          </div>
        </div>
      </article>
    </div>
    </>
  )
}
