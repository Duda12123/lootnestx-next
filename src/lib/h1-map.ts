/**
 * Centralized H1 map for all pages.
 * Each tool gets a unique, keyword-rich H1 for SEO.
 * Static pages also get optimized H1s.
 */

export const toolH1Map: Record<string, string> = {
  // === Calculator Tools ===
  "calculator": "Free Online Calculator — Basic & Scientific Calculations in Your Browser",
  "timestamp": "Free Online Timestamp Converter — Convert Unix Timestamps Instantly",
  "tip-calculator": "Free Tip Calculator — Calculate Tips & Split Bills Instantly",
  "discount-calculator": "Free Discount Calculator — Calculate Sale Prices & Savings",
  "bmi-calculator": "Free BMI Calculator — Check Your Body Mass Index Online",
  "age-calculator": "Free Age Calculator — Calculate Your Exact Age in Years, Months & Days",
  "mortgage-calc": "Free Mortgage Calculator — Calculate Monthly Payments & Amortization",
  "gpa-calc": "Free GPA Calculator — Calculate Your Grade Point Average",
  "gas-calc": "Free Gas Cost Calculator — Estimate Your Trip Fuel Costs",
  "sales-tax": "Free Sales Tax Calculator — Calculate Tax for Any US State",
  "sleep-calc": "Free Sleep Calculator — Find Your Ideal Bedtime & Wake-Up Time",
  "percentage": "Free Percentage Calculator — Calculate Percentages Online",
  "date-calculator": "Free Date Calculator — Add or Subtract Days Between Dates",
  "sqft-calc": "Free Square Footage Calculator — Calculate Area Instantly",
  "currency-converter": "Free Currency Converter — Live Exchange Rates Online",

  // === Unit & Conversion Tools ===
  "unit-converter": "Free Unit Converter — Convert Length, Weight, Temperature & More",
  "cooking-converter": "Free Cooking Converter — Convert Cups, Ounces, Grams & More",

  // === Time & Utility Tools ===
  "countdown": "Free Online Countdown Timer — Set Custom Countdowns",
  "stopwatch": "Free Online Stopwatch — Precise Lap Timing in Your Browser",
  "world-clock": "Free World Clock — Check Current Time in Any Timezone",
  "pomodoro": "Free Pomodoro Timer — Boost Your Productivity Online",
  "screen-recorder": "Free Screen Recorder — Record Your Screen in the Browser",

  // === Text Tools ===
  "text-counter": "Free Word & Character Counter — Count Words, Characters & Sentences",
  "case-converter": "Free Case Converter — Convert Text to UPPER, lower, Title & More",
  "text-diff": "Free Online Text Diff Checker — Compare Text Side by Side",
  "slug-generator": "Free URL Slug Generator — Create SEO-Friendly Slugs Instantly",
  "nato-alphabet": "Free NATO Phonetic Alphabet Translator — Spell Words Phonetically",
  "list-tools": "Free List Tools — Sort, Shuffle, Dedupe & Format Lists",

  // === Generators ===
  "qrcode": "Free QR Code Generator — Create Custom QR Codes Online",
  "password": "Free Password Generator — Generate Strong, Secure Passwords",
  "random-generator": "Free Random Number Generator — Generate True Random Numbers",
  "uuid-generator": "Free UUID/GUID Generator — Generate Unique Identifiers",
  "lorem-ipsum": "Free Lorem Ipsum Generator — Generate Placeholder Text",
  "barcode": "Free Barcode Generator — Create Barcodes Online",
  "logo-generator": "Free Logo Generator — Create Custom Logos in Minutes",
  "name-generator": "Free Random Name Generator — Generate Names for Characters & Projects",
  "gaming-name-generator": "Free Gaming Name Generator — Create Cool Gamer Tags",
  "story-generator": "Free Story Generator — Generate Creative Story Ideas",
  "wwdc-bingo": "WWDC 2026 Keynote Bingo — Play Along Live During Apple's Event",
  "placeholder-image": "Free Placeholder Image Generator — Create Custom Placeholder Images",

  // === Encode & Decode Tools ===
  "base64": "Free Base64 Encoder & Decoder — Encode & Decode Base64 Online",
  "url-encoder": "Free URL Encoder & Decoder — Encode URLs for the Web",
  "html-entity": "Free HTML Entity Encoder & Decoder — Escape & Unescape HTML",
  "hash": "Free Hash Generator — Generate MD5, SHA-1, SHA-256 Hashes Online",

  // === Formatter Tools ===
  "json-formatter": "Free JSON Formatter — Beautify, Validate & Minify JSON Online",
  "sql-formatter": "Free SQL Formatter — Beautify & Format SQL Queries Online",
  "xml-formatter": "Free XML Formatter — Beautify & Format XML Online",
  "yaml-json": "Free YAML to JSON Converter — Convert Between YAML & JSON",
  "csv-json": "Free CSV to JSON Converter — Convert CSV Data to JSON",
  "html-formatter": "Free HTML Formatter — Beautify & Format HTML Code",
  "markdown": "Free Markdown Preview — Write & Preview Markdown in Real Time",

  // === Image Tools ===
  "image-compressor": "Free Image Compressor — Compress JPEG, PNG & WebP Online",
  "image-converter": "Free Image Converter — Convert Between Image Formats Online",
  "image-cropper": "Free Image Cropper — Crop Images Online in Your Browser",
  "image-resizer": "Free Image Resizer — Resize Images to Exact Dimensions",
  "image-to-base64": "Free Image to Base64 Converter — Convert Images to Base64 Data URIs",
  "image-watermark": "Free Image Watermark Tool — Add Watermarks to Your Photos",
  "photo-effects": "Free Photo Effects — Apply Filters & Effects to Your Photos",
  "youtube-thumbnail": "Free YouTube Thumbnail Downloader — Download Thumbnails in HD",
  "meme-generator": "Free Meme Generator — Create Custom Memes Online",

  // === CSS & Design Tools ===
  "css-gradient": "Free CSS Gradient Generator — Create Beautiful CSS Gradients",
  "css-shadow": "Free CSS Box Shadow Generator — Create Custom Shadows",
  "color-picker": "Free Color Picker — Pick, Convert & Copy Hex Colors",
  "color-palette": "Free Color Palette Generator — Generate Beautiful Color Schemes",
  "color-converter": "Free Color Converter — Convert Hex, RGB, HSL & CMYK Colors",
  "glassmorphism": "Free Glassmorphism Generator — Create Frosted Glass UI Effects",

  // === Developer Tools ===
  "regex-tester": "Free Regex Tester — Test Regular Expressions Online",
  "jwt-decoder": "Free JWT Decoder — Decode JSON Web Tokens Online",
  "cron-parser": "Free Cron Expression Parser — Parse & Explain Cron Schedules",
  "css-minifier": "Free CSS Minifier — Minify CSS Code Online",
  "js-minifier": "Free JavaScript Minifier — Minify & Compress JS Code",
  "json-diff": "Free JSON Diff Checker — Compare JSON Files Online",
  "http-status": "Free HTTP Status Code Reference — All HTTP Codes Explained",
  "ip-lookup": "Free IP Lookup — Find Your IP Address & Location",
  "screen-info": "Free Screen Info — Check Your Screen Resolution & DPR",

  // === Audio & Speech Tools ===
  "tts": "Free Text to Speech — Convert Text to Natural Voice Online",
  "speech-to-text": "Free Speech to Text — Convert Voice to Text Online",

  // === Fun & Games Tools ===
  "emoji-picker": "Free Emoji Picker — Browse, Search & Copy Emojis",
  "dice-roller": "Free Dice Roller — Roll Virtual Dice Online",
  "coin-flip": "Free Coin Flip — Flip a Coin Online Instantly",
  "what-to-eat": "What Should I Eat? — Free Food Decision Generator",
  "random-joke": "Free Random Joke Generator — Get Funny Jokes Instantly",
  "truth-or-dare": "Free Truth or Dare Generator — Spice Up Your Party",
  "fortune-cookie": "Free Fortune Cookie — Get Your Daily Fortune Online",
  "password-strength": "Free Password Strength Checker — Test How Strong Your Password Is",
  "fathers-day-gift-matchmaker": "Free Father's Day Gift Matchmaker — Find the Perfect Gift for Dad in 60 Seconds",
  "world-cup-watch-party-calculator": "Free World Cup Watch Party Cost Calculator — Plan Your 2026 FIFA Game Day Budget",
  "world-cup-2026-bet-generator": "World Cup 2026 Bet Generator — Random Soccer Picks, Parlays & Lucky Numbers",
  "summer-cooling-gadget-finder": "Free Summer Cooling Gadget Finder 2026 — Beat the Heatwave Quiz",
  "summer-gadget-deal-calculator": "Free Summer 2026 Gadget Deal Value Calculator — Find the Best Tech Bargains",
  "summer-gadget-showdown-2026": "Free Summer 2026 Gadget Showdown — Compare Trending Tech Head-to-Head",
}

export const staticH1Map: Record<string, string> = {
  "/": "Free Online Tools — No Sign-Up, No Uploads, Right in Your Browser",
  "/about": "About LootNestX — Our Mission to Make the Web's Best Tools Free for Everyone",
  "/guides": "Free Tool Guides & Tutorials — Learn to Use Online Tools Like a Pro",
  "/privacy": "Privacy Policy — How LootNestX Protects Your Data",
  "/terms": "Terms of Service — LootNestX",
  "/contact": "Contact LootNestX — We'd Love to Hear From You",
}

export const guideH1Map: Record<string, string> = {
  "compress-images-guide": "How to Compress Images for the Web — The Complete Guide",
  "json-formatter-guide": "How to Format and Validate JSON — A Developer's Guide",
  "base64-encoding-guide": "Base64 Encoding & Decoding — The Complete Guide",
}

/**
 * Get the SEO-optimized H1 text for a tool slug.
 * Falls back to a generated default if the slug isn't in the map.
 */
export function getToolH1(slug: string, fallbackName: string): string {
  return toolH1Map[slug] || `${fallbackName} — Free Online Tool | LootNestX`
}

/**
 * Get the H1 text for a static or guide page by path.
 */
export function getStaticH1(path: string): string | undefined {
  return staticH1Map[path]
}

export function getGuideH1(slug: string): string | undefined {
  return guideH1Map[slug]
}
