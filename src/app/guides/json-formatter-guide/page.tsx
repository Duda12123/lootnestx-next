import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { JsonLd } from "@/components/JsonLd"
import { generateArticleSchema, generateBreadcrumbSchema } from "@/lib/schema/tool-schema"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lootnestx.com"

export const metadata: Metadata = {
  title: "How to Format and Validate JSON — Guide",
  description: "Master JSON formatting, validation, and debugging. Learn how to read nested JSON, spot common syntax errors, and format data for APIs, configs, and databases.",
}

export default function JsonFormatterGuide() {
  const guideUrl = `${baseUrl}/guides/json-formatter-guide`
  return (
    <>
      <JsonLd data={[
        generateArticleSchema({
          headline: "How to Format and Validate JSON — A Developer's Guide",
          description: "Master JSON formatting, validation, and debugging. Learn how to read nested JSON, spot common syntax errors, and format data for APIs, configs, and databases.",
          url: guideUrl,
        }),
        generateBreadcrumbSchema([
          { name: "Home", url: baseUrl },
          { name: "Guides", url: `${baseUrl}/guides` },
          { name: "JSON Formatter Guide", url: guideUrl },
        ]),
      ]} />
    <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
      <Link href="/guides" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8">
        <ArrowLeft size={16} /> Back to Guides
      </Link>

      <article className="prose prose-invert prose-zinc max-w-none space-y-6 text-muted leading-relaxed">
        <h1 className="text-3xl font-bold tracking-tight text-foreground not-prose mb-4">
          How to Format and Validate JSON — A Developer&apos;s Guide
        </h1>
        <p className="text-sm text-muted-soft not-prose">June 2026 · 6 min read</p>

        <h2 className="text-xl font-semibold text-foreground mt-8">Why JSON Formatting Is Essential</h2>
        <p>
          JSON (JavaScript Object Notation) is the universal language of web APIs, configuration files,
          and data exchange. But raw JSON — especially minified JSON from API responses — is nearly
          impossible to read. A single 500-line API response can be a wall of unreadable text.
        </p>
        <p>
          That&apos;s where a JSON formatter comes in. It takes minified or messy JSON and transforms it
          into properly indented, syntax-highlighted, human-readable output. You can instantly spot
          missing commas, mismatched brackets, incorrect nesting, and other common JSON errors.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">Common JSON Errors (and How to Catch Them)</h2>

        <h3 className="text-lg font-semibold text-foreground">1. Trailing Commas</h3>
        <p>
          This is the #1 JSON error. A trailing comma after the last item in an object or array will
          break JSON parsing in most environments. While JavaScript objects allow trailing commas, the
          JSON spec does not.
        </p>
        <pre className="bg-card-bg border border-card-border rounded-lg p-4 text-sm overflow-x-auto not-prose">
          <code className="text-accent">{`// ❌ Invalid — trailing comma
{
  "name": "Alice",
  "age": 30,
}

// ✅ Fixed
{
  "name": "Alice",
  "age": 30
}`}</code>
        </pre>

        <h3 className="text-lg font-semibold text-foreground">2. Missing or Extra Quotes</h3>
        <p>
          JSON requires double quotes around property names and string values. Single quotes are not
          valid JSON, and unquoted property names will fail validation.
        </p>

        <h3 className="text-lg font-semibold text-foreground">3. Comment Lines</h3>
        <p>
          JSON does not support comments. If you need comments in a configuration file, consider using
          JSONC (JSON with Comments), YAML, or adding a{" "}
          <code className="text-accent text-sm">&quot;_comment&quot;: &quot;...&quot;</code> field.
        </p>

        <h3 className="text-lg font-semibold text-foreground">4. Mismatched Brackets</h3>
        <p>
          In deeply nested JSON, it&apos;s easy to misplace a closing bracket. A well-formatted JSON
          output with consistent indentation makes this error immediately visible — each opening bracket
          has a clear matching closing bracket at the same indentation level.
        </p>

        <h2 className="text-xl font-semibold text-foreground mt-8">How to Format JSON: Step by Step</h2>
        <ol className="space-y-4 list-decimal pl-5">
          <li>
            <strong className="text-foreground">Copy your JSON data.</strong> It can be minified,
            partially formatted, or even broken — the formatter will tell you if there&apos;s an error.
          </li>
          <li>
            <strong className="text-foreground">Paste into the JSON Formatter tool.</strong> Our tool
            auto-detects the format and applies proper indentation with syntax highlighting.
          </li>
          <li>
            <strong className="text-foreground">Review the output.</strong> Look for red error markers
            that highlight syntax issues. Click on any error to jump to the problematic line.
          </li>
          <li>
            <strong className="text-foreground">Validate the structure.</strong> Check that nested
            objects and arrays are properly closed, all keys have matching values, and no unexpected
            data types appear.
          </li>
          <li>
            <strong className="text-foreground">Copy the formatted version.</strong> Use the copy button
            to grab the cleaned-up JSON for your project, API documentation, or debugging session.
          </li>
        </ol>

        <h2 className="text-xl font-semibold text-foreground mt-8">JSON Formatting Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong className="text-foreground">Use 2-space indentation.</strong> It&apos;s the
            community standard and keeps nested data readable without wasting horizontal space.
          </li>
          <li>
            <strong className="text-foreground">Sort keys alphabetically.</strong> Consistent key
            ordering makes diffs cleaner and helps you find specific fields faster.
          </li>
          <li>
            <strong className="text-foreground">Minify for production.</strong> Use the minify option to
            strip whitespace before sending JSON in API responses — it reduces payload size by 10-30%.
          </li>
          <li>
            <strong className="text-foreground">Format before committing.</strong> Always format JSON
            config files before committing to version control. It prevents unnecessary diff noise when
            teammates edit the same file.
          </li>
          <li>
            <strong className="text-foreground">Validate after editing.</strong> Whenever you manually
            edit JSON, run it through a validator immediately. Catching errors at edit-time saves hours
            of debugging.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-foreground mt-8">Reading Nested JSON</h2>
        <p>
          When JSON objects are deeply nested — common in API responses from services like Stripe,
          GitHub, or AWS — proper formatting is your best friend. Here&apos;s what to look for:
        </p>
        <ul className="space-y-2">
          <li>Each indentation level represents one level of nesting</li>
          <li>Arrays are marked with <code className="text-accent text-sm">[ ]</code> brackets</li>
          <li>Objects use <code className="text-accent text-sm">{ }</code> curly braces</li>
          <li>Follow the indentation to trace parent-child relationships</li>
        </ul>

        <div className="mt-10 p-6 rounded-xl border border-accent/15 bg-accent/5 not-prose">
          <p className="text-sm font-semibold text-accent mb-2">Tools mentioned in this guide</p>
          <Link href="/tool/json-formatter" className="text-foreground hover:text-accent transition-colors text-sm font-medium">
            JSON Formatter →
          </Link>
          <span className="text-muted-soft text-sm"> Format, validate, and beautify JSON in your browser</span>
        </div>
      </article>
    </div>
    </>
  )
}
