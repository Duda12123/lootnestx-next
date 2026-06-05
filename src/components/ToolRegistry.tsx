"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

const toolMap: Record<string, React.ComponentType> = {
  calculator: dynamic(() => import("@/tools/Calculator")),
  timestamp: dynamic(() => import("@/tools/TimestampConverter")),
  "unit-converter": dynamic(() => import("@/tools/UnitConverter")),
  "text-counter": dynamic(() => import("@/tools/TextCounter")),
  countdown: dynamic(() => import("@/tools/CountdownTimer")),
  stopwatch: dynamic(() => import("@/tools/Stopwatch")),
  "random-generator": dynamic(() => import("@/tools/RandomGenerator")),
  percentage: dynamic(() => import("@/tools/PercentageCalculator")),
  "date-calculator": dynamic(() => import("@/tools/DateCalculator")),
  "emoji-picker": dynamic(() => import("@/tools/EmojiPicker")),
  base64: dynamic(() => import("@/tools/Base64Tool")),
  "json-formatter": dynamic(() => import("@/tools/JsonFormatter")),
  "url-encoder": dynamic(() => import("@/tools/UrlEncoder")),
  hash: dynamic(() => import("@/tools/HashGenerator")),
  "html-entity": dynamic(() => import("@/tools/HtmlEntityEncoder")),
  "morse-code": dynamic(() => import("@/tools/MorseCode")),
  "binary-text": dynamic(() => import("@/tools/BinaryTextConverter")),
  "number-base": dynamic(() => import("@/tools/NumberBaseConverter")),
  "sql-formatter": dynamic(() => import("@/tools/SqlFormatter")),
  "xml-formatter": dynamic(() => import("@/tools/XmlFormatter")),
  "yaml-json": dynamic(() => import("@/tools/YamlJsonConverter")),
  "csv-json": dynamic(() => import("@/tools/CsvJsonConverter")),
  "image-compressor": dynamic(() => import("@/tools/ImageCompressor")),
  "image-converter": dynamic(() => import("@/tools/ImageConverter")),
  "image-cropper": dynamic(() => import("@/tools/ImageCropper")),
  "image-resizer": dynamic(() => import("@/tools/ImageResizer")),
  "image-to-base64": dynamic(() => import("@/tools/ImageToBase64")),
  ocr: dynamic(() => import("@/tools/OcrTool")),
  barcode: dynamic(() => import("@/tools/BarcodeGenerator")),
  "case-converter": dynamic(() => import("@/tools/CaseConverter")),
  "list-tools": dynamic(() => import("@/tools/ListTools")),
  "text-diff": dynamic(() => import("@/tools/TextDiff")),
  "slug-generator": dynamic(() => import("@/tools/SlugGenerator")),
  qrcode: dynamic(() => import("@/tools/QrCodeGenerator")),
  password: dynamic(() => import("@/tools/PasswordGenerator")),
  "color-palette": dynamic(() => import("@/tools/ColorPalette")),
  markdown: dynamic(() => import("@/tools/MarkdownPreview")),
  "uuid-generator": dynamic(() => import("@/tools/UuidGenerator")),
  "lorem-ipsum": dynamic(() => import("@/tools/LoremIpsum")),
  "dice-roller": dynamic(() => import("@/tools/DiceRoller")),
  "coin-flip": dynamic(() => import("@/tools/CoinFlip")),
  "css-gradient": dynamic(() => import("@/tools/CssGradientGenerator")),
  "css-shadow": dynamic(() => import("@/tools/CssShadowGenerator")),
  "color-converter": dynamic(() => import("@/tools/ColorConverter")),
  "color-picker": dynamic(() => import("@/tools/ColorPickerAdvanced")),
  "regex-tester": dynamic(() => import("@/tools/RegexTester")),
  "jwt-decoder": dynamic(() => import("@/tools/JwtDecoder")),
  "cron-parser": dynamic(() => import("@/tools/CronParser")),
  "css-minifier": dynamic(() => import("@/tools/CssMinifier")),
  "html-formatter": dynamic(() => import("@/tools/HtmlFormatter")),
  "js-minifier": dynamic(() => import("@/tools/JsMinifier")),
  "json-diff": dynamic(() => import("@/tools/JsonDiff")),
  "http-status": dynamic(() => import("@/tools/HttpStatus")),
  tts: dynamic(() => import("@/tools/TextToSpeech")),
  "speech-to-text": dynamic(() => import("@/tools/SpeechToText")),
  "audio-separator": dynamic(() => import("@/tools/AudioSeparator")),
  "subtitle-remover": dynamic(() => import("@/tools/SubtitleRemover")),
  "tip-calculator": dynamic(() => import("@/tools/TipCalculator")),
  "discount-calculator": dynamic(() => import("@/tools/DiscountCalculator")),
  "bmi-calculator": dynamic(() => import("@/tools/BmiCalculator")),
  "age-calculator": dynamic(() => import("@/tools/AgeCalculator")),
  "password-strength": dynamic(() => import("@/tools/PasswordStrength")),
  "world-clock": dynamic(() => import("@/tools/WorldClock")),
  "what-to-eat": dynamic(() => import("@/tools/WhatToEat")),
  "random-joke": dynamic(() => import("@/tools/RandomJoke")),
  "truth-or-dare": dynamic(() => import("@/tools/TruthOrDare")),
  "fortune-cookie": dynamic(() => import("@/tools/FortuneCookie")),
  "currency-converter": dynamic(() => import("@/tools/CurrencyConverter")),
  "pomodoro": dynamic(() => import("@/tools/PomodoroTimer")),
  "ip-lookup": dynamic(() => import("@/tools/IpLookup")),
  "screen-info": dynamic(() => import("@/tools/ScreenInfo")),
  "glassmorphism": dynamic(() => import("@/tools/GlassmorphismGenerator")),
  "placeholder-image": dynamic(() => import("@/tools/PlaceholderImage")),
}

export function getToolComponent(slug: string): React.ComponentType | null {
  return toolMap[slug] || null
}

const shimmer = "animate-pulse bg-card-bg rounded-lg"

function PlaceholderTool({ name }: { name: string }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">{name}</h1>
      <p className="text-muted mb-8">This tool is under development and coming soon.</p>
      <div className="space-y-4">
        <div className={`${shimmer} h-12 w-full`} />
        <div className={`${shimmer} h-64 w-full`} />
        <div className={`${shimmer} h-10 w-32`} />
      </div>
    </div>
  )
}

export function ToolRenderer({ slug, name }: { slug: string; name: string }) {
  const Component = getToolComponent(slug)

  if (!Component) {
    return <PlaceholderTool name={name} />
  }

  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
          <div className={`${shimmer} h-8 w-64`} />
          <div className={`${shimmer} h-96 w-full`} />
        </div>
      }
    >
      <Component />
    </Suspense>
  )
}
