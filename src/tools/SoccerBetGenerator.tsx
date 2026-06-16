"use client";

import { useState, useCallback } from "react";

// ── Team Pools ──────────────────────────────────────────────
const MLS_TEAMS = [
  "Inter Miami", "LA Galaxy", "LAFC", "NYC FC", "Atlanta United",
  "Seattle Sounders", "Portland Timbers", "Austin FC", "FC Dallas",
  "Houston Dynamo", "Sporting KC", "Real Salt Lake", "Colorado Rapids",
  "Minnesota United", "Chicago Fire", "Columbus Crew", "FC Cincinnati",
  "Nashville SC", "Orlando City", "Philadelphia Union", "NE Revolution",
  "NY Red Bulls", "Charlotte FC", "St. Louis CITY", "San Diego FC",
  "San Jose Earthquakes", "Vancouver Whitecaps", "CF Montréal", "Toronto FC", "D.C. United",
];

const WC_TEAMS = [
  "USA 🇺🇸", "Mexico 🇲🇽", "Canada 🇨🇦", "Argentina 🇦🇷", "Brazil 🇧🇷",
  "England 🏴󠁧󠁢󠁥󠁮󠁧󠁿", "France 🇫🇷", "Germany 🇩🇪", "Spain 🇪🇸", "Italy 🇮🇹",
  "Portugal 🇵🇹", "Netherlands 🇳🇱", "Japan 🇯🇵", "South Korea 🇰🇷", "Uruguay 🇺🇾",
  "Colombia 🇨🇴", "Morocco 🇲🇦", "Senegal 🇸🇳", "Croatia 🇭🇷", "Belgium 🇧🇪",
];

const SCORE_OPTIONS = ["0-0", "1-0", "0-1", "2-0", "0-2", "2-1", "1-2", "1-1",
  "3-0", "0-3", "3-1", "1-3", "2-2", "3-2", "2-3", "3-3"];

type PlayMode = "match-winner" | "correct-score" | "over-under" | "parlay" | "btts" | "lucky-numbers";

type MatchPick = { home: string; away: string; pick: string; odds: string };
type ScorePick = { home: string; away: string; score: string; odds: string };
type OverUnderPick = { home: string; away: string; pick: string; line: string; odds: string };
type ParlayLeg = { home: string; away: string; pick: string; odds: string };
type ParlayResult = { legs: ParlayLeg[]; totalOdds: string };
type BttsPick = { home: string; away: string; pick: string; odds: string };

function randPick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomOdds(min: number, max: number): string {
  const odds = randInt(min * 100, max * 100) / 100;
  return odds > 1 ? `+${Math.round((odds - 1) * 100)}` : `-${Math.round((1 / odds - 1) * 100)}`;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Mode Components ─────────────────────────────────────────

function MatchWinnerMode({ league }: { league: "mls" | "wc" }) {
  const teams = league === "mls" ? MLS_TEAMS : WC_TEAMS;
  const [picks, setPicks] = useState<MatchPick[]>([]);
  const [matchCount, setMatchCount] = useState(5);
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const pool = shuffle(teams);
    const results: MatchPick[] = [];
    for (let i = 0; i < matchCount * 2; i += 2) {
      const home = pool[i % pool.length];
      const away = pool[(i + 1) % pool.length];
      const outcomes = ["Home Win", "Draw", "Away Win"] as const;
      const pick = randPick(outcomes);
      const odds = pick === "Draw" ? `+${randInt(200, 350)}` : randomOdds(1.4, 3.5);
      results.push({ home, away, pick, odds });
    }
    setPicks(results);
  }, [matchCount, teams]);

  const copySlip = () => {
    const text = picks.map((p, i) =>
      `Match ${i + 1}: ${p.home} vs ${p.away} → ${p.pick} (${p.odds})`
    ).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-subtle">Matches:</label>
        <div className="flex gap-1">
          {[3, 5, 8, 10].map((n) => (
            <button
              key={n}
              onClick={() => setMatchCount(n)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                matchCount === n
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-card-bg text-subtle hover:text-primary hover:border-subtle"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={generate}
        className="w-full py-3 rounded-xl bg-accent text-white font-semibold hover:brightness-110 transition-all active:scale-[0.98]"
      >
        🎲 Generate Random Picks
      </button>

      {picks.length > 0 && (
        <div className="space-y-3">
          {picks.map((p, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-card-bg border border-border rounded-xl p-3"
            >
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium text-primary truncate block">
                  {p.home} <span className="text-subtle">vs</span> {p.away}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-3">
                <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${
                  p.pick === "Home Win" ? "bg-green-500/15 text-green-400" :
                  p.pick === "Draw" ? "bg-yellow-500/15 text-yellow-400" :
                  "bg-blue-500/15 text-blue-400"
                }`}>
                  {p.pick}
                </span>
                <span className="text-xs text-subtle tabular-nums w-12 text-right">{p.odds}</span>
              </div>
            </div>
          ))}

          <button
            onClick={copySlip}
            className="w-full py-2.5 rounded-lg border border-border bg-card-bg text-sm text-subtle hover:text-primary hover:border-subtle transition-colors"
          >
            {copied ? "✅ Copied!" : "📋 Copy Bet Slip"}
          </button>
        </div>
      )}
    </div>
  );
}

function CorrectScoreMode({ league }: { league: "mls" | "wc" }) {
  const teams = league === "mls" ? MLS_TEAMS : WC_TEAMS;
  const [picks, setPicks] = useState<ScorePick[]>([]);
  const [matchCount, setMatchCount] = useState(3);

  const generate = useCallback(() => {
    const pool = shuffle(teams);
    const results: ScorePick[] = [];
    for (let i = 0; i < matchCount * 2; i += 2) {
      const home = pool[i % pool.length];
      const away = pool[(i + 1) % pool.length];
      const score = randPick(SCORE_OPTIONS);
      const [h, a] = score.split("-").map(Number);
      const exactOdds = h === a ? `+${randInt(400, 700)}` : `+${randInt(500, 1200)}`;
      results.push({ home, away, score, odds: exactOdds });
    }
    setPicks(results);
  }, [matchCount, teams]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-subtle">Matches:</label>
        {[2, 3, 5].map((n) => (
          <button
            key={n}
            onClick={() => setMatchCount(n)}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              matchCount === n
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-card-bg text-subtle hover:text-primary hover:border-subtle"
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      <button
        onClick={generate}
        className="w-full py-3 rounded-xl bg-accent text-white font-semibold hover:brightness-110 transition-all active:scale-[0.98]"
      >
        🎯 Randomize Scores
      </button>

      {picks.length > 0 && (
        <div className="space-y-3">
          {picks.map((p, i) => (
            <div key={i} className="bg-card-bg border border-border rounded-xl p-3 flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <span className="text-sm text-primary truncate block">
                  {p.home} vs {p.away}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-3">
                <span className="text-lg font-mono font-bold text-accent tabular-nums">
                  {p.score}
                </span>
                <span className="text-xs text-subtle tabular-nums w-14 text-right">{p.odds}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function OverUnderMode({ league }: { league: "mls" | "wc" }) {
  const teams = league === "mls" ? MLS_TEAMS : WC_TEAMS;
  const [picks, setPicks] = useState<OverUnderPick[]>([]);
  const [matchCount, setMatchCount] = useState(5);

  const generate = useCallback(() => {
    const pool = shuffle(teams);
    const lines = ["0.5", "1.5", "2.5", "3.5"];
    const results: OverUnderPick[] = [];
    for (let i = 0; i < matchCount * 2; i += 2) {
      const home = pool[i % pool.length];
      const away = pool[(i + 1) % pool.length];
      const line = randPick(lines);
      const pick = randPick(["Over", "Under"]);
      results.push({ home, away, pick, line, odds: randomOdds(1.7, 2.2) });
    }
    setPicks(results);
  }, [matchCount, teams]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-subtle">Matches:</label>
        {[3, 5, 8].map((n) => (
          <button
            key={n}
            onClick={() => setMatchCount(n)}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              matchCount === n
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-card-bg text-subtle hover:text-primary hover:border-subtle"
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      <button
        onClick={generate}
        className="w-full py-3 rounded-xl bg-accent text-white font-semibold hover:brightness-110 transition-all active:scale-[0.98]"
      >
        📊 Randomize Over/Under
      </button>

      {picks.length > 0 && (
        <div className="space-y-3">
          {picks.map((p, i) => (
            <div key={i} className="bg-card-bg border border-border rounded-xl p-3 flex items-center justify-between">
              <span className="text-sm text-primary truncate flex-1 min-w-0">
                {p.home} vs {p.away}
              </span>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                <span className="text-xs text-subtle">O/U {p.line}</span>
                <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${
                  p.pick === "Over" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
                }`}>
                  {p.pick}
                </span>
                <span className="text-xs text-subtle tabular-nums w-10 text-right">{p.odds}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ParlayMode({ league }: { league: "mls" | "wc" }) {
  const teams = league === "mls" ? MLS_TEAMS : WC_TEAMS;
  const [result, setResult] = useState<ParlayResult | null>(null);
  const [legCount, setLegCount] = useState(4);

  const generate = useCallback(() => {
    const pool = shuffle(teams);
    const legs: ParlayLeg[] = [];
    let totalMultiplier = 1;
    for (let i = 0; i < legCount * 2 && legs.length < legCount; i += 2) {
      const home = pool[i % pool.length];
      const away = pool[(i + 1) % pool.length];
      const outcomes = ["Home Win", "Draw", "Away Win"] as const;
      const pick = randPick(outcomes);
      const rawOdds = pick === "Draw" ? randInt(300, 500) / 100 : randInt(130, 320) / 100;
      totalMultiplier *= rawOdds;
      const displayOdds = rawOdds > 1 ? `+${Math.round((rawOdds - 1) * 100)}` : `-${Math.round((1 / rawOdds - 1) * 100)}`;
      legs.push({ home, away, pick, odds: displayOdds });
    }
    const totalOdds = `+${Math.round((totalMultiplier - 1) * 100)}`;
    setResult({ legs, totalOdds });
  }, [legCount, teams]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-subtle">Legs:</label>
        {[2, 3, 4, 5, 6].map((n) => (
          <button
            key={n}
            onClick={() => setLegCount(n)}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              legCount === n
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-card-bg text-subtle hover:text-primary hover:border-subtle"
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      <button
        onClick={generate}
        className="w-full py-3 rounded-xl bg-accent text-white font-semibold hover:brightness-110 transition-all active:scale-[0.98]"
      >
        🎲 Build Random Parlay
      </button>

      {result && (
        <div className="space-y-3">
          {result.legs.map((leg, i) => (
            <div key={i} className="bg-card-bg border border-border rounded-xl p-3 flex items-center justify-between">
              <span className="text-sm text-primary truncate flex-1 min-w-0">
                Leg {i + 1}: {leg.home} vs {leg.away}
              </span>
              <div className="flex items-center gap-3 shrink-0 ml-3">
                <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${
                  leg.pick === "Home Win" ? "bg-green-500/15 text-green-400" :
                  leg.pick === "Draw" ? "bg-yellow-500/15 text-yellow-400" :
                  "bg-blue-500/15 text-blue-400"
                }`}>
                  {leg.pick}
                </span>
                <span className="text-xs text-subtle tabular-nums w-12 text-right">{leg.odds}</span>
              </div>
            </div>
          ))}
          <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 text-center">
            <span className="text-sm text-subtle">Total Odds: </span>
            <span className="text-xl font-bold text-accent">{result.totalOdds}</span>
            <p className="text-xs text-subtle mt-1">
              A $10 bet pays ${Math.round((parseInt(result.totalOdds.replace("+", "")) / 100 + 1) * 10)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function BTTSMode({ league }: { league: "mls" | "wc" }) {
  const teams = league === "mls" ? MLS_TEAMS : WC_TEAMS;
  const [picks, setPicks] = useState<BttsPick[]>([]);
  const [matchCount, setMatchCount] = useState(5);

  const generate = useCallback(() => {
    const pool = shuffle(teams);
    const results: BttsPick[] = [];
    for (let i = 0; i < matchCount * 2; i += 2) {
      const home = pool[i % pool.length];
      const away = pool[(i + 1) % pool.length];
      const pick = randPick(["Yes ✅", "No ❌"]);
      results.push({ home, away, pick, odds: randomOdds(1.5, 2.5) });
    }
    setPicks(results);
  }, [matchCount, teams]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-subtle">Matches:</label>
        {[3, 5, 8].map((n) => (
          <button
            key={n}
            onClick={() => setMatchCount(n)}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              matchCount === n
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-card-bg text-subtle hover:text-primary hover:border-subtle"
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      <button
        onClick={generate}
        className="w-full py-3 rounded-xl bg-accent text-white font-semibold hover:brightness-110 transition-all active:scale-[0.98]"
      >
        🟢 Randomize BTTS Picks
      </button>

      {picks.length > 0 && (
        <div className="space-y-3">
          {picks.map((p, i) => (
            <div key={i} className="bg-card-bg border border-border rounded-xl p-3 flex items-center justify-between">
              <span className="text-sm text-primary truncate flex-1 min-w-0">
                {p.home} vs {p.away}
              </span>
              <div className="flex items-center gap-3 shrink-0 ml-3">
                <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${
                  p.pick.startsWith("Yes") ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"
                }`}>
                  {p.pick}
                </span>
                <span className="text-xs text-subtle tabular-nums w-10 text-right">{p.odds}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LuckyNumbersMode() {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [count, setCount] = useState(6);
  const [max, setMax] = useState(49);

  const generate = useCallback(() => {
    const nums = new Set<number>();
    while (nums.size < count) {
      nums.add(randInt(1, max));
    }
    setNumbers([...nums].sort((a, b) => a - b));
  }, [count, max]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-subtle block mb-1">How many numbers?</label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full bg-card-bg border border-border rounded-lg px-3 py-2 text-sm text-primary"
          >
            {[3, 4, 5, 6, 7].map((n) => (
              <option key={n} value={n}>{n} numbers</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-subtle block mb-1">Max number</label>
          <select
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
            className="w-full bg-card-bg border border-border rounded-lg px-3 py-2 text-sm text-primary"
          >
            {[30, 39, 49, 59, 69].map((n) => (
              <option key={n} value={n}>1–{n}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={generate}
        className="w-full py-3 rounded-xl bg-accent text-white font-semibold hover:brightness-110 transition-all active:scale-[0.98]"
      >
        🎱 Generate Lucky Numbers
      </button>

      {numbers.length > 0 && (
        <div className="bg-card-bg border border-border rounded-xl p-5">
          <div className="flex flex-wrap justify-center gap-3">
            {numbers.map((n, i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-lg font-bold text-accent tabular-nums"
              >
                {n}
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-subtle mt-4">
            {count} numbers from 1–{max} — for lottery pool picks, fantasy drafts & more
          </p>
        </div>
      )}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────

type League = "mls" | "wc";

const MODES: { id: PlayMode; label: string; emoji: string; desc: string }[] = [
  { id: "match-winner", label: "Match Winner", emoji: "🎯", desc: "Random Home Win / Draw / Away Win picks" },
  { id: "correct-score", label: "Correct Score", emoji: "⚽", desc: "Random exact score predictions" },
  { id: "over-under", label: "Over / Under", emoji: "📊", desc: "Random Over/Under goal line picks" },
  { id: "parlay", label: "Parlay Builder", emoji: "🎲", desc: "Build a random multi-leg accumulator" },
  { id: "btts", label: "BTTS Picker", emoji: "🟢", desc: "Both Teams to Score — Yes or No" },
  { id: "lucky-numbers", label: "Lucky Numbers", emoji: "🎱", desc: "Random lottery-style number picks" },
];

export default function SoccerBetGenerator() {
  const [mode, setMode] = useState<PlayMode>("match-winner");
  const [league, setLeague] = useState<League>("wc");
  const [copiedPageLink, setCopiedPageLink] = useState(false);

  const activeMode = MODES.find((m) => m.id === mode)!;

  const copyPageLink = () => {
    navigator.clipboard.writeText("https://lootnestx.com/tool/world-cup-2026-bet-generator");
    setCopiedPageLink(true);
    setTimeout(() => setCopiedPageLink(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">
          ⚽ World Cup 2026 Bet Generator
        </h1>
        <p className="text-subtle max-w-lg mx-auto">
          Generate random soccer bets across 6 play modes — match winners, correct scores,
          parlays, BTTS picks, and lucky numbers. <strong>For entertainment only.</strong>
        </p>
      </div>

      {/* League Toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-card-bg border border-border rounded-xl p-1">
          <button
            onClick={() => setLeague("wc")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              league === "wc"
                ? "bg-accent text-white"
                : "text-subtle hover:text-primary"
            }`}
          >
            🏆 World Cup 2026
          </button>
          <button
            onClick={() => setLeague("mls")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              league === "mls"
                ? "bg-accent text-white"
                : "text-subtle hover:text-primary"
            }`}
          >
            🇺🇸 MLS
          </button>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`p-3 rounded-xl border text-left transition-all ${
              mode === m.id
                ? "border-accent bg-accent/10 ring-1 ring-accent/30"
                : "border-border bg-card-bg hover:border-subtle"
            }`}
          >
            <div className="text-lg mb-0.5">{m.emoji}</div>
            <div className="text-sm font-semibold text-primary">{m.label}</div>
            <div className="text-xs text-subtle line-clamp-1">{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Active Mode */}
      <div className="bg-card-bg border border-border rounded-2xl p-5">
        <h2 className="text-lg font-bold text-primary mb-4">
          {activeMode.emoji} {activeMode.label}
          <span className="text-xs text-subtle font-normal ml-2">
            — {league === "wc" ? "World Cup 2026" : "MLS"}
          </span>
        </h2>

        <div className="min-h-[120px]">
          {mode === "match-winner" && <MatchWinnerMode league={league} />}
          {mode === "correct-score" && <CorrectScoreMode league={league} />}
          {mode === "over-under" && <OverUnderMode league={league} />}
          {mode === "parlay" && <ParlayMode league={league} />}
          {mode === "btts" && <BTTSMode league={league} />}
          {mode === "lucky-numbers" && <LuckyNumbersMode />}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 bg-yellow-500/5 border border-yellow-500/15 rounded-xl p-4 text-center">
        <p className="text-xs text-subtle">
          ⚠️ <strong>For entertainment purposes only.</strong> This tool generates random picks
          and does not predict real match outcomes. All odds shown are simulated. Please bet
          responsibly. Must be 21+ in most US states.
        </p>
      </div>

      {/* Share */}
      <div className="mt-6 text-center">
        <button
          onClick={copyPageLink}
          className="text-sm text-subtle hover:text-primary transition-colors"
        >
          {copiedPageLink ? "✅ Link copied!" : "🔗 Copy tool link"}
        </button>
      </div>
    </div>
  );
}
