import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

// Read tools.ts as text and extract the tools array
const toolsTs = fs.readFileSync(
  path.join(projectRoot, "src", "data", "tools.ts"),
  "utf8"
);

// Extract tools array by bracket counting (regex can't handle nested [][])
const lines = toolsTs.split("\n");
const startIdx = lines.findIndex((l) => l.trim().startsWith("export const tools"));
if (startIdx === -1) {
  console.error("Could not find tools array start");
  process.exit(1);
}

let depth = 0;
let arrayLines = [];
let started = false;
for (let i = startIdx; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes("export const tools")) {
    const afterAssign = line.substring(line.indexOf("=") + 1).trim();
    arrayLines.push(afterAssign);
    depth += (afterAssign.match(/\[/g) || []).length;
    depth -= (afterAssign.match(/\]/g) || []).length;
    started = true;
    continue;
  }
  arrayLines.push(line);
  depth += (line.match(/\[/g) || []).length;
  depth -= (line.match(/\]/g) || []).length;
  if (depth === 0 && arrayLines.length > 1) break;
}

const arrayCode = arrayLines.join("\n");

let toolList;
try {
  toolList = new Function("return " + arrayCode)();
} catch (e) {
  console.error("Failed to parse tool list:", e.message);
  // Debug: show first 200 chars
  console.error("First 200 chars of array:", arrayCode.slice(0, 200));
  process.exit(1);
}

const tools = toolList.filter((t) => !t.comingSoon);
console.log(`Found ${tools.length} tools to generate OG images for.\n`);

// Category → emoji mapping
const catEmojis = {
  utilities: "🛠️",
  encode: "🔐",
  formatters: "📋",
  generators: "🎲",
  css: "🎨",
  image: "🖼️",
  text: "📝",
  dev: "💻",
  audio: "🎙️",
  fun: "🎮",
};

const catLabels = {
  utilities: "Everyday Utilities",
  encode: "Encode & Decode",
  formatters: "Formatter",
  generators: "Generator",
  css: "CSS Tool",
  image: "Image Tool",
  text: "Text Tool",
  dev: "Developer Tool",
  audio: "Audio Tool",
  fun: "Fun & Games",
};

function wrapText(text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let current = "";
  for (const w of words) {
    if ((current + " " + w).length <= maxWidth) {
      current = current ? current + " " + w : w;
    } else {
      lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function escXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function generateSvg(tool) {
  const emoji = catEmojis[tool.category] || "🔧";
  const catLabel = escXml(catLabels[tool.category] || tool.category);
  const name = escXml(tool.name || tool.slug);
  const tagline = escXml((tool.description || "").slice(0, 80));

  // Text wrapping for name (max ~22 chars per line for 56px font)
  const nameLines = wrapText(name, 28);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a0f"/>
      <stop offset="40%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#0a1628"/>
    </linearGradient>
    <radialGradient id="glow1" cx="0" cy="0" r="1">
      <stop offset="0%" stop-color="rgba(59,130,246,0.15)"/>
      <stop offset="70%" stop-color="transparent"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0" cy="0" r="1">
      <stop offset="0%" stop-color="rgba(59,130,246,0.08)"/>
      <stop offset="70%" stop-color="transparent"/>
    </radialGradient>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="16" cy="16" r="1" fill="rgba(59,130,246,0.08)"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#grid)"/>

  <circle cx="1120" cy="50" r="280" fill="url(#glow1)"/>
  <circle cx="80" cy="580" r="300" fill="url(#glow2)"/>

  <!-- Category badge -->
  <rect x="54" y="54" rx="20" height="36" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.2)" stroke-width="1"/>
  <text x="86" y="78" text-anchor="start" fill="#60a5fa" font-family="system-ui,sans-serif" font-size="15" font-weight="600">${emoji} ${catLabel}</text>

  <!-- Logo / brand -->
  <rect x="1050" y="50" width="96" height="44" rx="10" fill="#3b82f6"/>
  <text x="1082" y="78" text-anchor="middle" fill="#ffffff" font-family="system-ui,sans-serif" font-size="18" font-weight="800" letter-spacing="-1">TX</text>

  <!-- Tool name -->
${nameLines
  .map(
    (line, i) =>
      `  <text x="600" y="${250 + i * 72}" text-anchor="middle" fill="#ffffff" font-family="system-ui,sans-serif" font-size="56" font-weight="800" letter-spacing="-1.5">${line}</text>`
  )
  .join("\n")}

  <!-- Tagline -->
  <text x="600" y="${250 + nameLines.length * 72 + 40}" text-anchor="middle" fill="#94a3b8" font-family="system-ui,sans-serif" font-size="22">${tagline}</text>

  <!-- Bottom bar -->
  <rect x="0" y="570" width="1200" height="60" fill="rgba(59,130,246,0.06)"/>
  <text x="600" y="608" text-anchor="middle" fill="#475569" font-family="system-ui,sans-serif" font-size="16" font-weight="500" letter-spacing="1">Free tool · Runs in your browser · lootnestx.com</text>
</svg>`;
}

const ogDir = path.join(projectRoot, "public", "og");
if (!fs.existsSync(ogDir)) fs.mkdirSync(ogDir, { recursive: true });

async function main() {
  let count = 0;
  for (const tool of tools) {
    const svg = generateSvg(tool);
    const pngPath = path.join(ogDir, `${tool.slug}.png`);

    try {
      await sharp(Buffer.from(svg)).resize(1200, 630).png().toFile(pngPath);
      count++;
    } catch (e) {
      console.error(`  ✗ ${tool.slug}: ${e.message}`);
    }
  }

  console.log(`\nDone! Generated ${count}/${tools.length} OG images in public/og/`);
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
