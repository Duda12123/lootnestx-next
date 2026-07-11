"use client";

import { useState, useCallback, useMemo, useEffect } from "react";

// ── Product Database ────────────────────────────────────────
interface DealItem {
  id: number;
  name: string;
  cat: string;
  origPrice: number;
  salePrice: number;
  rating: number;
  reviews: number;
  store: string;
  hotness: number;
  desc: string;
}

const DEALS_DB: DealItem[] = [
  { id: 1, name: "SteelSeries Arctis Nova 7", cat: "gaming", origPrice: 179.99, salePrice: 119.99, rating: 4.7, reviews: 3840, store: "Amazon", hotness: 95, desc: "Top-tier wireless gaming headset with spatial audio." },
  { id: 2, name: "Razer DeathAdder V3 Pro", cat: "gaming", origPrice: 149.99, salePrice: 99.99, rating: 4.8, reviews: 6200, store: "Amazon", hotness: 90, desc: "Ultra-lightweight wireless gaming mouse." },
  { id: 3, name: "Logitech G Pro X Superlight 2", cat: "gaming", origPrice: 159.99, salePrice: 129.99, rating: 4.9, reviews: 5100, store: "Best Buy", hotness: 88, desc: "Pro-grade esports mouse. 60g weight." },
  { id: 4, name: "Steam Deck OLED 1TB", cat: "gaming", origPrice: 649.0, salePrice: 549.0, rating: 4.8, reviews: 15000, store: "Steam", hotness: 98, desc: "Portable PC gaming powerhouse with OLED screen." },
  { id: 5, name: "JBL Clip 5 Portable Speaker", cat: "audio", origPrice: 79.99, salePrice: 49.99, rating: 4.6, reviews: 9600, store: "Amazon", hotness: 85, desc: "Ultra-portable waterproof Bluetooth speaker." },
  { id: 6, name: "Sony WH-1000XM6", cat: "audio", origPrice: 399.99, salePrice: 278.0, rating: 4.9, reviews: 12000, store: "Amazon", hotness: 92, desc: "Industry-leading ANC headphones, just released." },
  { id: 7, name: "AirPods Pro (3rd Gen)", cat: "audio", origPrice: 249.0, salePrice: 199.0, rating: 4.7, reviews: 28000, store: "Apple", hotness: 96, desc: "New H3 chip, adaptive audio, USB-C." },
  { id: 8, name: "Toro Portable AC 8000 BTU", cat: "cooling", origPrice: 349.99, salePrice: 239.99, rating: 4.3, reviews: 2200, store: "Walmart", hotness: 88, desc: "Compact portable AC for rooms up to 350 sq ft." },
  { id: 9, name: "Honeywell TurboForce Fan", cat: "cooling", origPrice: 49.99, salePrice: 29.99, rating: 4.5, reviews: 15000, store: "Amazon", hotness: 78, desc: "Best-selling personal fan with turbo cooling." },
  { id: 10, name: "Embr Wave 2 Thermal Bracelet", cat: "cooling", origPrice: 299.0, salePrice: 249.0, rating: 4.1, reviews: 890, store: "Embr Labs", hotness: 72, desc: "Wearable thermostat. Cool down or warm up instantly." },
  { id: 11, name: "REEBOK Portable Neck Fan", cat: "cooling", origPrice: 39.99, salePrice: 22.99, rating: 4.4, reviews: 6800, store: "Amazon", hotness: 82, desc: "Hands-free bladeless neck fan. 4000mAh battery." },
  { id: 12, name: "Coleman Sundome 4P Tent", cat: "outdoor", origPrice: 119.99, salePrice: 74.99, rating: 4.5, reviews: 12000, store: "REI", hotness: 80, desc: "Classic 4-person dome tent. Easy setup." },
  { id: 13, name: "Garmin Instinct 3 Solar", cat: "outdoor", origPrice: 449.99, salePrice: 349.99, rating: 4.6, reviews: 3400, store: "REI", hotness: 75, desc: "Rugged GPS watch with solar charging." },
  { id: 14, name: "GoPro HERO13 Black", cat: "outdoor", origPrice: 399.99, salePrice: 299.99, rating: 4.7, reviews: 5600, store: "Best Buy", hotness: 86, desc: "Latest GoPro with 8K video & HyperSmooth 7.0." },
  { id: 15, name: "DJI Mini 4 Pro Drone", cat: "outdoor", origPrice: 759.0, salePrice: 649.0, rating: 4.8, reviews: 4300, store: "DJI", hotness: 91, desc: "Sub-250g drone with 4K/100fps & obstacle avoidance." },
  { id: 16, name: "Anker SOLIX C1000 Power Station", cat: "outdoor", origPrice: 999.0, salePrice: 649.0, rating: 4.6, reviews: 2100, store: "Amazon", hotness: 84, desc: "1056Wh portable power station. Camping & backup." },
  { id: 17, name: "Amazon Echo Show 15", cat: "smarthome", origPrice: 279.99, salePrice: 199.99, rating: 4.4, reviews: 8900, store: "Amazon", hotness: 76, desc: "15.6\" smart display. Family hub & Fire TV built-in." },
  { id: 18, name: "Philips Hue Starter Kit", cat: "smarthome", origPrice: 199.99, salePrice: 129.99, rating: 4.7, reviews: 25000, store: "Best Buy", hotness: 70, desc: "4 color bulbs + bridge. Best smart lighting entry." },
  { id: 19, name: "ecobee Smart Thermostat Premium", cat: "smarthome", origPrice: 249.99, salePrice: 199.99, rating: 4.5, reviews: 7800, store: "Amazon", hotness: 68, desc: "AI-powered thermostat. Saves 26% on energy bills." },
  { id: 20, name: "Xbox Series X 2TB Galaxy Edition", cat: "gaming", origPrice: 599.99, salePrice: 499.99, rating: 4.8, reviews: 9200, store: "Microsoft", hotness: 93, desc: "Limited edition with 2TB storage & custom design." },
  { id: 21, name: "Meta Quest 4 (256GB)", cat: "gaming", origPrice: 499.99, salePrice: 429.99, rating: 4.6, reviews: 6700, store: "Meta", hotness: 87, desc: "Next-gen mixed reality. Pancake lenses, eye tracking." },
  { id: 22, name: "Nintendo Switch OLED Bundle", cat: "gaming", origPrice: 399.99, salePrice: 329.99, rating: 4.8, reviews: 32000, store: "Amazon", hotness: 89, desc: "OLED screen + Mario Kart 8 Deluxe included." },
  { id: 23, name: "Soundcore Motion X600", cat: "audio", origPrice: 199.99, salePrice: 149.99, rating: 4.6, reviews: 4500, store: "Amazon", hotness: 74, desc: "Spatial audio speaker. 50W output, IPX7 waterproof." },
  { id: 24, name: "Arlo Pro 6 Security Cam 3-Pack", cat: "smarthome", origPrice: 499.99, salePrice: 349.99, rating: 4.4, reviews: 6400, store: "Best Buy", hotness: 66, desc: "4K wire-free security cameras. AI detection included." },
];

const CATEGORIES = [
  { id: "gaming", emoji: "🎮", label: "Gaming Gear" },
  { id: "cooling", emoji: "❄️", label: "Cooling Tech" },
  { id: "outdoor", emoji: "🏕️", label: "Outdoor" },
  { id: "smarthome", emoji: "🏠", label: "Smart Home" },
  { id: "audio", emoji: "🎧", label: "Audio" },
];

// ── Utilities ───────────────────────────────────────────────
function calcDealScore(item: DealItem): number {
  const savingsPct = (1 - item.salePrice / item.origPrice) * 100;
  const ratingFactor = (item.rating / 5) * 50;
  const hotnessFactor = (item.hotness / 100) * 30;
  const savingsFactor = Math.min(savingsPct / 50, 1) * 20;
  const reviewBoost = Math.min(Math.log10(item.reviews + 1) / 5, 1) * 10;
  return Math.min(100, Math.round(savingsFactor + ratingFactor + hotnessFactor + reviewBoost));
}

function getEffectiveScore(item: DealItem, budget: number): number {
  const base = calcDealScore(item);
  if (item.salePrice > budget * 0.8) return Math.round(base * 0.7);
  if (item.salePrice > budget * 0.5) return Math.round(base * 0.85);
  return base;
}

type ScoreTier = "great" | "good" | "okay";
function getScoreTier(score: number): { tier: ScoreTier; label: string } {
  if (score >= 80) return { tier: "great", label: "🔥 Great" };
  if (score >= 60) return { tier: "good", label: "👍 Good" };
  return { tier: "okay", label: "💸 Okay" };
}

// ── Component ───────────────────────────────────────────────
export default function SummerGadgetDealCalculator() {
  const [budget, setBudget] = useState(500);
  const [minScore, setMinScore] = useState(40);
  const [selectedCats, setSelectedCats] = useState<Set<string>>(new Set(["gaming", "cooling"]));
  const [showResults, setShowResults] = useState(false);

  const toggleCat = useCallback((cat: string) => {
    setSelectedCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        if (next.size > 1) next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  }, []);

  const filteredDeals = useMemo(() => {
    return DEALS_DB
      .filter((d) => selectedCats.has(d.cat) && d.salePrice <= budget)
      .map((d) => ({ ...d, score: getEffectiveScore(d, budget) }))
      .filter((d) => d.score >= minScore)
      .sort((a, b) => b.score - a.score);
  }, [budget, minScore, selectedCats]);

  const stats = useMemo(() => {
    const deals = filteredDeals;
    if (deals.length === 0) return { count: 0, avgSavings: 0, bestScore: 0, totalSaved: 0, meterWidth: 0 };
    const avgSavings = deals.reduce((s, d) => s + (1 - d.salePrice / d.origPrice) * 100, 0) / deals.length;
    return {
      count: deals.length,
      avgSavings: Math.round(avgSavings),
      bestScore: Math.max(...deals.map((d) => d.score)),
      totalSaved: Math.round(deals.reduce((s, d) => s + (d.origPrice - d.salePrice), 0)),
      meterWidth: Math.min(100, Math.round(avgSavings * 1.5)),
    };
  }, [filteredDeals]);

  const handleCalculate = useCallback(() => {
    setShowResults(true);
  }, []);

  const topDeals = filteredDeals.slice(0, 6);
  const tableDeals = filteredDeals.slice(0, 10);
  const bestDeal = filteredDeals[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-block px-4 py-1.5 rounded-full border border-cyan-400/40 text-xs font-mono text-cyan-400 tracking-widest uppercase mb-4">
          🔥 Summer 2026 Hot Deals
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold mb-3">
          <span className="bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">Gadget Deal</span>{" "}
          <span className="text-primary">Value Calculator</span>
        </h1>
        <p className="text-subtle max-w-xl mx-auto">
          Steam Summer Sale meets Prime Day leftovers. Find which gadgets give you the <em>real</em> bang for your buck this summer.
        </p>
      </div>

      {/* Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {/* Controls Card */}
        <div className="bg-card-bg border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 text-lg font-semibold text-primary mb-5">
            <span>🎮</span> Your Deal Hunter Setup
          </div>

          {/* Budget */}
          <label className="block text-sm text-subtle mb-1">💰 Your Budget</label>
          <input
            type="range"
            min={50}
            max={2000}
            step={10}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full accent-cyan-400 mb-2"
          />
          <div className="flex items-center gap-2 mb-5">
            <span className="text-cyan-400 font-mono font-semibold text-lg">$</span>
            <input
              type="number"
              min={50}
              max={2000}
              step={10}
              value={budget}
              onChange={(e) => setBudget(Math.max(50, Math.min(2000, Number(e.target.value) || 500)))}
              className="w-24 bg-[#0a0a0f] border border-border rounded-lg px-3 py-2 text-primary font-mono text-center outline-none focus:border-cyan-400"
            />
            <span className="text-subtle text-sm">USD</span>
          </div>

          {/* Categories */}
          <label className="block text-sm text-subtle mb-2">📦 Gadget Categories</label>
          <div className="flex flex-wrap gap-2 mb-5">
            {CATEGORIES.map((cat) => {
              const active = selectedCats.has(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCat(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm border transition-all ${
                    active
                      ? "border-cyan-400 bg-cyan-400/10 text-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.15)]"
                      : "border-border text-subtle hover:text-primary hover:border-subtle"
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              );
            })}
          </div>

          {/* Min Score */}
          <label className="block text-sm text-subtle mb-1">⭐ Minimum Deal Score (0-100)</label>
          <input
            type="range"
            min={0}
            max={100}
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="w-full accent-cyan-400 mb-2"
          />
          <div className="flex items-center gap-2 mb-5">
            <input
              type="number"
              min={0}
              max={100}
              value={minScore}
              onChange={(e) => setMinScore(Math.max(0, Math.min(100, Number(e.target.value) || 40)))}
              className="w-24 bg-[#0a0a0f] border border-border rounded-lg px-3 py-2 text-primary font-mono text-center outline-none focus:border-cyan-400"
            />
            <span className="text-subtle text-sm">/ 100</span>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-cyan-400 to-pink-500 text-[#0a0a0f] font-semibold hover:brightness-110 transition-all active:scale-[0.98]"
          >
            🔍 Find Best Deals
          </button>
        </div>

        {/* Stats Card */}
        <div className="bg-card-bg border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 text-lg font-semibold text-primary mb-5">
            <span>📊</span> Deal Stats Overview
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-[#0a0a0f] border border-border rounded-xl p-4 text-center">
              <div className="text-2xl font-mono font-bold text-cyan-400">{stats.count}</div>
              <div className="text-xs text-subtle uppercase tracking-wider mt-1">Deals Found</div>
            </div>
            <div className="bg-[#0a0a0f] border border-border rounded-xl p-4 text-center">
              <div className="text-2xl font-mono font-bold text-green-400">{stats.avgSavings}%</div>
              <div className="text-xs text-subtle uppercase tracking-wider mt-1">Avg Savings</div>
            </div>
            <div className="bg-[#0a0a0f] border border-border rounded-xl p-4 text-center">
              <div className="text-2xl font-mono font-bold text-pink-400">{stats.bestScore}</div>
              <div className="text-xs text-subtle uppercase tracking-wider mt-1">Best Score</div>
            </div>
            <div className="bg-[#0a0a0f] border border-border rounded-xl p-4 text-center">
              <div className="text-2xl font-mono font-bold text-orange-400">${stats.totalSaved}</div>
              <div className="text-xs text-subtle uppercase tracking-wider mt-1">Potential Save</div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-subtle mb-2">Overall Value Index</label>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-green-400 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${stats.meterWidth}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {showResults && (
        <div className="space-y-6">
          {/* Deal Cards */}
          <div>
            <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">🏷️ Top Gadget Deals For You</h2>
            {topDeals.length === 0 ? (
              <div className="bg-card-bg border border-border rounded-2xl p-10 text-center">
                <p className="text-lg text-primary mb-2">🔍 No deals match your criteria</p>
                <p className="text-subtle">Try lowering the minimum score, increasing your budget, or selecting more categories.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topDeals.map((d) => <DealCard key={d.id} item={d} budget={budget} />)}
              </div>
            )}
          </div>

          {/* Summary */}
          {bestDeal && (
            <div className="bg-card-bg border border-cyan-400/50 rounded-2xl p-8 text-center shadow-[0_0_20px_rgba(0,240,255,0.15)]">
              <h3 className="text-lg font-semibold text-primary mb-2">✨ Your Best Value Pick</h3>
              <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                {bestDeal.name}
              </div>
              <p className="text-subtle">
                Score {bestDeal.score}/100 · Save {Math.round((1 - bestDeal.salePrice / bestDeal.origPrice) * 100)}% · ${bestDeal.salePrice.toFixed(2)} at {bestDeal.store}
              </p>
            </div>
          )}

          {/* Compare Table */}
          <div className="bg-card-bg border border-border rounded-2xl p-6 overflow-x-auto">
            <div className="flex items-center gap-2 text-lg font-semibold text-primary mb-4">
              <span>📋</span> Side-by-Side Comparison
            </div>
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b-2 border-border text-subtle text-xs uppercase tracking-wider text-left">
                  <th className="p-3">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Orig. Price</th>
                  <th className="p-3">Sale Price</th>
                  <th className="p-3">Savings</th>
                  <th className="p-3">Score</th>
                </tr>
              </thead>
              <tbody>
                {tableDeals.map((d) => {
                  const savings = Math.round((1 - d.salePrice / d.origPrice) * 100);
                  const tier = getScoreTier(d.score);
                  const catLookup: Record<string, string> = { gaming: "🎮 Gaming", cooling: "❄️ Cooling", outdoor: "🏕️ Outdoor", smarthome: "🏠 Smart Home", audio: "🎧 Audio" };
                  return (
                    <tr key={d.id} className="border-b border-border hover:bg-cyan-400/5 transition-colors">
                      <td className="p-3 font-medium text-primary">{d.name}</td>
                      <td className="p-3 text-subtle">{catLookup[d.cat] || d.cat}</td>
                      <td className="p-3 line-through text-subtle">${d.origPrice.toFixed(2)}</td>
                      <td className="p-3 text-green-400 font-semibold font-mono">${d.salePrice.toFixed(2)}</td>
                      <td className="p-3 text-rose-400">-{savings}%</td>
                      <td className="p-3">
                        <ScoreBadge tier={tier.tier} label={tier.label} score={d.score} compact />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-8 bg-yellow-500/5 border border-yellow-500/15 rounded-xl p-4 text-center">
        <p className="text-xs text-subtle">
          ⚠️ <strong>For informational purposes only.</strong> Prices estimated based on current market trends as of July 2026.
          Always verify deals before purchasing. LootNestX may earn commissions on some products.
        </p>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────

function ScoreBadge({ tier, label, score, compact = false }: { tier: ScoreTier; label: string; score: number; compact?: boolean }) {
  const colors: Record<ScoreTier, string> = {
    great: "bg-green-500/10 border-green-400/30 text-green-400",
    good: "bg-cyan-500/10 border-cyan-400/30 text-cyan-400",
    okay: "bg-yellow-500/10 border-yellow-400/30 text-yellow-400",
  };
  const meterColors: Record<ScoreTier, string> = {
    great: "bg-green-400",
    good: "bg-cyan-400",
    okay: "bg-yellow-400",
  };

  return (
    <div className={compact ? "" : "space-y-2"}>
      <span className={`inline-block px-3 py-1 rounded-full text-sm font-mono font-bold border ${colors[tier]}`}>
        {label}
      </span>
      {!compact && (
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${meterColors[tier]} transition-all duration-700 ease-out`} style={{ width: `${score}%` }} />
        </div>
      )}
      <span className={`text-xs text-subtle ${compact ? "ml-2" : "block mt-1"}`}>
        <span className="text-cyan-400 font-semibold">{score}</span>/100
      </span>
    </div>
  );
}

function DealCard({ item: d, budget }: { item: DealItem & { score: number }; budget: number }) {
  const savingsPct = Math.round((1 - d.salePrice / d.origPrice) * 100);
  const tier = getScoreTier(d.score);
  const meterColor = tier.tier === "great" ? "bg-green-400" : tier.tier === "good" ? "bg-cyan-400" : "bg-yellow-400";

  return (
    <div className="bg-card-bg border border-border rounded-2xl p-5 hover:border-purple-400/40 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(180,77,255,0.12)] transition-all duration-300 cursor-pointer group">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <span className="font-semibold text-primary pr-2 flex-1 min-w-0">{d.name}</span>
        <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
          tier.tier === "great" ? "bg-green-500/10 border-green-400/30 text-green-400" :
          tier.tier === "good" ? "bg-cyan-500/10 border-cyan-400/30 text-cyan-400" :
          "bg-yellow-500/10 border-yellow-400/30 text-yellow-400"
        }`}>
          {tier.label}
        </span>
      </div>

      {/* Price Row */}
      <div className="flex items-center gap-2 mb-2">
        <span className="line-through text-subtle text-sm">${d.origPrice.toFixed(2)}</span>
        <span className="font-mono font-bold text-lg text-green-400">${d.salePrice.toFixed(2)}</span>
        <span className="text-xs px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 font-semibold">-{savingsPct}%</span>
      </div>

      {/* Score Meter */}
      <div className="h-1.5 bg-border rounded-full overflow-hidden mb-2">
        <div className={`h-full ${meterColor} rounded-full transition-all duration-700 ease-out`} style={{ width: `${d.score}%` }} />
      </div>

      {/* Description */}
      <p className="text-sm text-subtle mb-3">{d.desc}</p>

      {/* Meta */}
      <div className="flex justify-between text-xs text-subtle">
        <span>⭐ {d.rating} ({(d.reviews).toLocaleString()})</span>
        <span>{d.store}</span>
      </div>

      <div className="text-right mt-2">
        <span className="text-xs text-subtle">
          Deal Score: <span className="text-cyan-400 font-semibold">{d.score}</span>/100
        </span>
      </div>
    </div>
  );
}
