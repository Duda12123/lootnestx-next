"use client";

import { useState, useCallback } from "react";

// ── Product Database ────────────────────────────────────────
interface Product {
  key: string;
  name: string;
  tagline: string;
  emoji: string;
  price: string;
  cooling: string;
  portability: string;
  noise: string;
  eco: string;
  pros: string[];
  cons: string[];
  ideal: string;
  trending: string;
}

const PRODUCTS: Record<string, Product> = {
  "portable-ac": {
    key: "portable-ac",
    name: "Portable Air Conditioner",
    tagline: "Full-room cooling powerhouse",
    emoji: "❄️",
    price: "$80–$200+",
    cooling: "9/10",
    portability: "5/10",
    noise: "6/10",
    eco: "5/10",
    pros: ["Cools entire rooms fast", "Multiple fan speeds & modes", "Remote control & timer", "Dehumidifier function"],
    cons: ["Bulky & heavy (30–60 lbs)", "High power consumption", "Needs window vent kit", "Noisy compressor cycles"],
    ideal: "Indoor use for extended periods. Best for bedrooms & home offices.",
    trending: "Aairzuma Portable AC, Froza AC — viral on TikTok Summer 2026",
  },
  "personal-fan": {
    key: "personal-fan",
    name: "Neck Fan / Personal Fan",
    tagline: "Hands-free breeze wherever you go",
    emoji: "🌬️",
    price: "$15–$50",
    cooling: "6/10",
    portability: "10/10",
    noise: "8/10",
    eco: "7/10",
    pros: ["Ultra-portable, wearable design", "USB-C rechargeable", "Bladeless options available", "Hands-free cooling"],
    cons: ["Limited cooling area", "Battery lasts 2–8 hours", "Not effective in extreme heat", "Can look a bit dorky"],
    ideal: "On-the-go cooling for commuting, walking, outdoor events, or desk use.",
    trending: "JISULIFE, TORRAS neck fans — TikTok top sellers 2026",
  },
  "cooling-towel": {
    key: "cooling-towel",
    name: "Cooling Towel / Wrap",
    tagline: "Instant chill with just water",
    emoji: "🧊",
    price: "$8–$25",
    cooling: "5/10",
    portability: "10/10",
    noise: "10/10",
    eco: "10/10",
    pros: ["No power needed — just water", "Super lightweight & packable", "Stays cool for hours", "Machine washable, reusable"],
    cons: ["Requires re-wetting periodically", "Cools skin only, not air", "Gets damp on clothes", "Less effective in humid climates"],
    ideal: "Runners, hikers, construction workers, sports fans — anyone active outdoors.",
    trending: "Mission, Sukeen, Chill Pal — Amazon best-sellers",
  },
  "pet-cooling-mat": {
    key: "pet-cooling-mat",
    name: "Pet Cooling Mat",
    tagline: "Keep your furry friend from overheating",
    emoji: "🐾",
    price: "$15–$50",
    cooling: "6/10",
    portability: "8/10",
    noise: "10/10",
    eco: "8/10",
    pros: ["No electricity or refrigeration needed", "Pressure-activated cooling gel", "Portable — use indoors & outdoors", "Easy to clean, foldable"],
    cons: ["Needs 15–30 min to recharge coolness", "Not effective on thick carpets", "Some pets may chew the mat", "Limited cooling in direct sun"],
    ideal: "Dogs and cats that overheat easily. Perfect for home, crate, or car travel.",
    trending: "TikTok viral pet cooling pad — $2.6M sales in Summer 2026",
  },
  "evaporative-cooler": {
    key: "evaporative-cooler",
    name: "Evaporative Air Cooler",
    tagline: "Eco-friendly cooling for dry climates",
    emoji: "💧",
    price: "$40–$120",
    cooling: "7/10",
    portability: "6/10",
    noise: "7/10",
    eco: "9/10",
    pros: ["Uses 80% less energy than AC", "Adds humidity — good for dry air", "No window vent needed", "Natural evaporative process"],
    cons: ["Ineffective in humid climates", "Needs regular water refills", "Less cooling than compressor AC", "Can feel damp/muggy"],
    ideal: "Indoor use in dry/hot regions (Southwest US). Great for eco-conscious users.",
    trending: "Hessaire, Honeywell evaporative coolers",
  },
};

// ── Questions ───────────────────────────────────────────────
interface Question {
  id: number;
  emoji: string;
  text: string;
  options: { value: string; icon: string; label: string; desc: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    emoji: "🌍",
    text: "Where do you need cooling most?",
    options: [
      { value: "indoor", icon: "🏠", label: "Indoor / Home", desc: "Living room, bedroom, home office" },
      { value: "outdoor", icon: "🏕️", label: "Outdoor / On-the-Go", desc: "Camping, beach, sports, walking" },
      { value: "office", icon: "💼", label: "Office / Desk", desc: "Personal workspace, cubicle" },
      { value: "pet", icon: "🐾", label: "For My Pet", desc: "Keep my dog/cat cool this summer" },
    ],
  },
  {
    id: 2,
    emoji: "💰",
    text: "What's your budget?",
    options: [
      { value: "budget", icon: "💵", label: "Budget ($10–$30)", desc: "Affordable, simple solutions" },
      { value: "mid", icon: "💲", label: "Mid-Range ($30–$80)", desc: "Best value for money" },
      { value: "premium", icon: "💎", label: "Premium ($80+)", desc: "Top performance, all the features" },
    ],
  },
  {
    id: 3,
    emoji: "🎯",
    text: "What matters most to you?",
    options: [
      { value: "power", icon: "❄️", label: "Maximum Cooling Power", desc: "I want ice-cold air, fast" },
      { value: "portable", icon: "🎒", label: "Portability & Convenience", desc: "Lightweight, easy to carry everywhere" },
      { value: "quiet", icon: "🤫", label: "Quiet Operation", desc: "I need silence for work or sleep" },
      { value: "eco", icon: "🌱", label: "Eco-Friendly / Energy Saving", desc: "Low power, sustainable materials" },
    ],
  },
  {
    id: 4,
    emoji: "⚡",
    text: "How long do you need cooling per session?",
    options: [
      { value: "short", icon: "⏱️", label: "Quick bursts (< 1 hour)", desc: "Short cooling sessions throughout the day" },
      { value: "medium", icon: "🕐", label: "Medium (1–4 hours)", desc: "A full work session or afternoon" },
      { value: "long", icon: "🕓", label: "All day (4+ hours)", desc: "Continuous cooling from morning to night" },
    ],
  },
];

// ── Scoring Algorithm ───────────────────────────────────────
function calculateResult(answers: Record<string, string>): Product {
  const scores: Record<string, number> = { "portable-ac": 0, "personal-fan": 0, "cooling-towel": 0, "pet-cooling-mat": 0, "evaporative-cooler": 0 };
  const q1 = answers.q1, q2 = answers.q2, q3 = answers.q3, q4 = answers.q4;
  const S = scores;

  // Q1: Location
  if (q1 === "indoor") { S["portable-ac"] += 3; S["evaporative-cooler"] += 3; }
  if (q1 === "outdoor") { S["personal-fan"] += 3; S["cooling-towel"] += 3; }
  if (q1 === "office") { S["personal-fan"] += 3; S["evaporative-cooler"] += 2; }
  if (q1 === "pet") { S["pet-cooling-mat"] += 5; S["cooling-towel"] += 1; }

  // Q2: Budget
  if (q2 === "budget") { S["cooling-towel"] += 3; S["personal-fan"] += 2; S["pet-cooling-mat"] += 2; }
  if (q2 === "mid") { S["personal-fan"] += 3; S["evaporative-cooler"] += 2; S["pet-cooling-mat"] += 2; }
  if (q2 === "premium") { S["portable-ac"] += 3; S["evaporative-cooler"] += 2; }

  // Q3: Priority
  if (q3 === "power") { S["portable-ac"] += 4; S["evaporative-cooler"] += 2; }
  if (q3 === "portable") { S["personal-fan"] += 4; S["cooling-towel"] += 3; }
  if (q3 === "quiet") { S["cooling-towel"] += 4; S["pet-cooling-mat"] += 3; S["personal-fan"] += 2; }
  if (q3 === "eco") { S["cooling-towel"] += 4; S["evaporative-cooler"] += 3; }

  // Q4: Duration
  if (q4 === "short") { S["cooling-towel"] += 2; S["personal-fan"] += 2; }
  if (q4 === "medium") { S["personal-fan"] += 2; S["evaporative-cooler"] += 2; S["pet-cooling-mat"] += 2; }
  if (q4 === "long") { S["portable-ac"] += 4; S["evaporative-cooler"] += 2; }

  let best: Product = PRODUCTS["personal-fan"];
  let bestScore = -1;
  for (const [k, score] of Object.entries(scores)) {
    if (score > bestScore) { bestScore = score; best = PRODUCTS[k]; }
  }
  return best;
}

function getAlternatives(primary: Product): Product[] {
  return Object.values(PRODUCTS).filter((p) => p.name !== primary.name).slice(0, 2);
}

// ── Main Component ──────────────────────────────────────────
export default function SummerCoolingGadgetFinder() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Product | null>(null);
  const [alternatives, setAlternatives] = useState<Product[]>([]);

  const handleSelect = useCallback(
    (qId: number, value: string) => {
      setAnswers((prev) => ({ ...prev, [`q${qId}`]: value }));
    },
    [],
  );

  const handleNext = useCallback(() => {
    if (currentQ < 3) {
      setCurrentQ((q) => q + 1);
    } else {
      const best = calculateResult(answers);
      setResult(best);
      setAlternatives(getAlternatives(best));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentQ, answers]);

  const handleRetry = useCallback(() => {
    setCurrentQ(0);
    setAnswers({});
    setResult(null);
    setAlternatives([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const filled = Object.keys(answers).length;
  const progress = (filled / 4) * 100;

  // ── Results View ────────────────────────────────────────────
  if (result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
        {/* Primary */}
        <div className="bg-[#12121a] border-2 border-cyan-400/60 rounded-2xl p-8 text-center shadow-[0_0_60px_rgba(0,240,255,0.12)]">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-cyan-400/15 text-cyan-400 mb-4">🏆 BEST MATCH</span>
          <div className="text-6xl mb-3">{result.emoji}</div>
          <h2 className="text-2xl font-extrabold text-primary mb-1">{result.name}</h2>
          <p className="text-subtle mb-6">{result.tagline}</p>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Price Range", val: result.price },
              { label: "Cooling Power", val: result.cooling },
              { label: "Portability", val: result.portability },
              { label: "Quietness", val: result.noise },
            ].map((s) => (
              <div key={s.label} className="bg-[#0a0a0f] border border-border rounded-xl p-3 text-center">
                <div className="text-xl font-extrabold text-cyan-400">{s.val}</div>
                <div className="text-xs text-subtle uppercase tracking-wider mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 text-left">
            <div className="bg-[#0a0a0f] border border-border rounded-xl p-4">
              <h4 className="text-green-400 text-xs font-bold uppercase tracking-wider mb-2">Pros</h4>
              <ul className="text-sm space-y-1">{result.pros.map((p) => <li key={p} className="text-primary">✓ {p}</li>)}</ul>
            </div>
            <div className="bg-[#0a0a0f] border border-border rounded-xl p-4">
              <h4 className="text-pink-400 text-xs font-bold uppercase tracking-wider mb-2">Cons</h4>
              <ul className="text-sm space-y-1">{result.cons.map((c) => <li key={c} className="text-primary">✗ {c}</li>)}</ul>
            </div>
          </div>

          {/* Best for / Trending */}
          <div className="bg-[#0a0a0f] border border-border rounded-xl p-4 text-left space-y-2">
            <p className="text-sm"><strong className="text-cyan-400">💡 Best for:</strong> <span className="text-primary">{result.ideal}</span></p>
            <p className="text-sm"><strong className="text-pink-400">🔥 Trending now:</strong> <span className="text-primary">{result.trending}</span></p>
          </div>
        </div>

        {/* Alternatives */}
        <div>
          <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">🔀 Also consider...</h3>
          {alternatives.map((a) => (
            <div key={a.key} className="bg-[#12121a] border border-border rounded-xl p-5 mb-3 hover:border-pink-400/30 transition-colors">
              <h4 className="text-lg font-bold text-primary">{a.emoji} {a.name}</h4>
              <p className="text-xs text-subtle mb-2">{a.price} · Cooling: {a.cooling} · Portability: {a.portability}</p>
              <p className="text-sm text-primary">{a.ideal}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-xs text-subtle mb-3">Looking for full reviews & buying guides?</p>
          <a href="https://lootnestx.com/reviews/cooling-gadgets" className="text-cyan-400 font-semibold border-b border-dashed border-cyan-400 hover:text-white hover:border-white transition-colors text-sm">
            LootNestX Cooling Gadget Reviews →
          </a>
        </div>

        <button
          onClick={handleRetry}
          className="w-full py-3.5 rounded-xl border-2 border-border text-primary font-semibold hover:border-cyan-400 hover:bg-cyan-400/5 transition-all"
        >
          🔄 Take the Quiz Again
        </button>

        {/* Disclaimer */}
        <p className="text-center text-xs text-subtle pt-4 border-t border-border">
          Cooling gadget picks based on trending TikTok & Amazon best-sellers. Prices approximate; check retailers for current deals.
        </p>
      </div>
    );
  }

  // ── Quiz View ──────────────────────────────────────────────
  const q = QUESTIONS[currentQ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
          <span className="bg-gradient-to-r from-white via-cyan-300 to-white bg-clip-text text-transparent">Summer Cooling</span>{" "}
          <span className="text-primary">Gadget Finder</span>
        </h1>
        <p className="text-subtle max-w-lg mx-auto">
          2026 is breaking heat records. Answer 4 quick questions to find the perfect cooling gadget for your lifestyle.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-1.5 bg-[#222233] rounded-full overflow-hidden mb-1">
          <div className="h-full bg-gradient-to-r from-cyan-400 to-pink-400 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-right text-xs text-subtle">Question {Math.min(filled + 1, 4)} / 4</p>
      </div>

      {/* Question Card */}
      <div className="bg-[#12121a] border border-border rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(0,240,255,0.06)] hover:border-cyan-400/20 transition-colors mb-4">
        <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
          <span className="text-2xl">{q.emoji}</span> {q.text}
        </h2>
        <div className="space-y-2.5">
          {q.options.map((opt) => {
            const isSelected = answers[`q${q.id}`] === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleSelect(q.id, opt.value)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? "border-cyan-400 bg-cyan-400/8 shadow-[0_0_20px_rgba(0,240,255,0.1)]"
                    : "border-[#222233] hover:border-cyan-400 hover:bg-[#1a1a26] hover:translate-x-1"
                }`}
              >
                <span className="text-2xl shrink-0">{opt.icon}</span>
                <div>
                  <span className="font-semibold text-primary block">{opt.label}</span>
                  <span className="text-xs text-subtle">{opt.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Next Button */}
      <button
        disabled={!answers[`q${q.id}`]}
        onClick={handleNext}
        className={`w-full py-3.5 rounded-xl font-bold text-base transition-all ${
          answers[`q${q.id}`]
            ? "bg-gradient-to-r from-cyan-400 to-pink-500 text-[#0a0a0f] hover:brightness-110 hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(0,240,255,0.25)] active:scale-[0.98]"
            : "bg-[#12121a] text-subtle cursor-not-allowed opacity-40"
        }`}
      >
        {currentQ === 3 ? "🔍 Find My Perfect Cooler" : "Next Question →"}
      </button>
    </div>
  );
}
