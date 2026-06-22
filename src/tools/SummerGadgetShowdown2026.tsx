'use client';

import { useState, useCallback } from 'react';

interface Gadget {
  id: string;
  name: string;
  emoji: string;
  price: number;
  scores: {
    priceValue: number;
    innovation: number;
    coolFactor: number;
    practicality: number;
    hype: number;
  };
  tagline: string;
}

interface BattleResult {
  winnerName: string;
  winnerReason: string;
  isTie: boolean;
  g1: Gadget;
  g2: Gadget;
  total1: number;
  total2: number;
}

const gadgets: Gadget[] = [
  {
    id: 'galaxy-s26-ultra',
    name: 'Samsung Galaxy S26 Ultra',
    emoji: '📱',
    price: 1299,
    scores: { priceValue: 7, innovation: 9, coolFactor: 8, practicality: 9, hype: 9 },
    tagline: 'The Android king of 2026'
  },
  {
    id: 'galaxy-z-flip-7',
    name: 'Samsung Galaxy Z Flip 7',
    emoji: '📞',
    price: 1099,
    scores: { priceValue: 8, innovation: 9, coolFactor: 10, practicality: 7, hype: 8 },
    tagline: 'Flip the script — literally'
  },
  {
    id: 'galaxy-z-fold-7',
    name: 'Samsung Galaxy Z Fold 7',
    emoji: '📖',
    price: 1899,
    scores: { priceValue: 5, innovation: 9, coolFactor: 9, practicality: 8, hype: 8 },
    tagline: 'Tablet in your pocket'
  },
  {
    id: 'ai-chess-board',
    name: 'AI Chess Technology Board',
    emoji: '♟️',
    price: 1374,
    scores: { priceValue: 6, innovation: 10, coolFactor: 9, practicality: 6, hype: 7 },
    tagline: 'AI-powered chess — checkmate redefined'
  },
  {
    id: 'ai-voice-recorder',
    name: 'Smart AI Voice Recorder',
    emoji: '🎙️',
    price: 199,
    scores: { priceValue: 9, innovation: 8, coolFactor: 7, practicality: 10, hype: 6 },
    tagline: 'Your AI note-taking sidekick'
  },
  {
    id: 'aqara-smart-home',
    name: 'Aqara Smart Home Kit',
    emoji: '🏠',
    price: 249,
    scores: { priceValue: 8, innovation: 7, coolFactor: 7, practicality: 10, hype: 6 },
    tagline: 'Smart home, smarter living'
  },
  {
    id: 'galaxy-earbuds-2026',
    name: 'Samsung Galaxy Earbuds 2026',
    emoji: '🎧',
    price: 199,
    scores: { priceValue: 8, innovation: 7, coolFactor: 7, practicality: 9, hype: 7 },
    tagline: 'Premium sound, wireless freedom'
  },
  {
    id: 'paddle-board',
    name: 'Inflatable Paddle Board',
    emoji: '🏄',
    price: 599,
    scores: { priceValue: 7, innovation: 6, coolFactor: 8, practicality: 7, hype: 6 },
    tagline: 'Summer adventure on water'
  },
  {
    id: 'meta-threads',
    name: 'Meta Threads 500M+ Users',
    emoji: '🧵',
    price: 0,
    scores: { priceValue: 10, innovation: 7, coolFactor: 8, practicality: 8, hype: 9 },
    tagline: "The social app everyone's on"
  },
  {
    id: 'samsung-microled-tv',
    name: 'Samsung R95H Micro RGB TV',
    emoji: '📺',
    price: 5999,
    scores: { priceValue: 4, innovation: 10, coolFactor: 9, practicality: 7, hype: 8 },
    tagline: 'Next-gen display technology'
  }
];

const metricLabels: Record<string, string> = {
  priceValue: '💰 Price Value',
  innovation: '💡 Innovation',
  coolFactor: '😎 Cool Factor',
  practicality: '🔧 Practicality',
  hype: '🔥 Real Hype'
};

export default function SummerGadgetShowdown2026() {
  const [index1, setIndex1] = useState(0);
  const [index2, setIndex2] = useState(2);
  const [result, setResult] = useState<BattleResult | null>(null);
  const [error, setError] = useState('');

  const g1 = gadgets[index1];
  const g2 = gadgets[index2];

  const handleBattle = useCallback(() => {
    if (index1 === index2) {
      setError('⚠️ Pick two different gadgets for a showdown!');
      setResult(null);
      return;
    }
    setError('');
    const gadget1 = gadgets[index1];
    const gadget2 = gadgets[index2];
    const metrics = Object.keys(metricLabels);
    let total1 = 0;
    let total2 = 0;
    metrics.forEach((m) => {
      total1 += gadget1.scores[m as keyof typeof gadget1.scores];
      total2 += gadget2.scores[m as keyof typeof gadget2.scores];
    });

    let winnerName: string;
    let winnerReason: string;
    let isTie = false;
    if (total1 > total2) {
      winnerName = `${gadget1.emoji} ${gadget1.name}`;
      winnerReason = `${gadget1.tagline} — wins by ${total1 - total2} points!`;
    } else if (total2 > total1) {
      winnerName = `${gadget2.emoji} ${gadget2.name}`;
      winnerReason = `${gadget2.tagline} — wins by ${total2 - total1} points!`;
    } else {
      winnerName = '🤝 TIE!';
      winnerReason = `Both gadgets score ${total1} points — it's a dead heat!`;
      isTie = true;
    }

    setResult({ winnerName, winnerReason, isTie, g1: gadget1, g2: gadget2, total1, total2 });
  }, [index1, index2]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="text-xs tracking-[4px] uppercase font-bold bg-gradient-to-r from-accent to-rose-500 bg-clip-text text-transparent">
          ⚡ LootNestX Tools
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-foreground to-success bg-clip-text text-transparent">
          Summer 2026 Gadget Showdown
        </h1>
        <p className="text-muted max-w-lg mx-auto">
          Pit the hottest gadgets of the season head-to-head. Real scores, real comparisons — no fluff.
        </p>
      </div>

      {/* Arena */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_80px_1fr] gap-4 sm:gap-0 items-start">
        {/* Card 1 */}
        <div className="bg-card-bg border border-card-border rounded-xl p-6 space-y-4">
          <div className="text-xs uppercase tracking-[3px] text-muted">🥊 Challenger 1</div>
          <select
            value={index1}
            onChange={(e) => setIndex1(Number(e.target.value))}
            className="w-full bg-background border border-card-border rounded-lg text-foreground px-4 py-3 outline-none focus:border-accent focus:ring-1 focus:ring-accent appearance-none cursor-pointer"
          >
            {gadgets.map((g, i) => (
              <option key={g.id} value={i}>{g.emoji} {g.name}</option>
            ))}
          </select>
          <div className="text-center text-5xl">{g1.emoji}</div>
          <div className="text-center text-lg font-bold text-foreground">{g1.name}</div>
          <div className="text-center text-xl font-extrabold text-success">
            {g1.price === 0 ? 'FREE' : `$${g1.price.toLocaleString()}`}
          </div>
        </div>

        {/* VS Column */}
        <div className="flex sm:flex-col items-center justify-center gap-3 py-2">
          <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center font-black text-lg text-white shadow-lg shadow-accent/30">
            VS
          </div>
          <button
            onClick={handleBattle}
            className="px-8 py-3.5 bg-accent hover:bg-accent/90 text-white font-bold rounded-full uppercase tracking-wider text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-accent/30 w-full sm:w-auto"
          >
            Battle!
          </button>
        </div>

        {/* Card 2 */}
        <div className="bg-card-bg border border-card-border rounded-xl p-6 space-y-4">
          <div className="text-xs uppercase tracking-[3px] text-muted">🥊 Challenger 2</div>
          <select
            value={index2}
            onChange={(e) => setIndex2(Number(e.target.value))}
            className="w-full bg-background border border-card-border rounded-lg text-foreground px-4 py-3 outline-none focus:border-accent focus:ring-1 focus:ring-accent appearance-none cursor-pointer"
          >
            {gadgets.map((g, i) => (
              <option key={g.id} value={i}>{g.emoji} {g.name}</option>
            ))}
          </select>
          <div className="text-center text-5xl">{g2.emoji}</div>
          <div className="text-center text-lg font-bold text-foreground">{g2.name}</div>
          <div className="text-center text-xl font-extrabold text-success">
            {g2.price === 0 ? 'FREE' : `$${g2.price.toLocaleString()}`}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-center p-4 bg-warning/10 border border-warning/30 rounded-xl">
          <p className="text-warning font-semibold">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Winner Banner */}
          <div className="text-center p-6 bg-card-bg border border-card-border rounded-xl space-y-2">
            <div className="text-4xl">{result.isTie ? '🤝' : '👑'}</div>
            <div className="text-2xl font-extrabold bg-gradient-to-r from-warning to-accent bg-clip-text text-transparent">
              {result.winnerName}
            </div>
            <div className="text-muted text-sm">{result.winnerReason}</div>
          </div>

          {/* Score Bars */}
          <div className="space-y-4">
            {Object.entries(metricLabels).map(([key, label]) => {
              const s1 = result.g1.scores[key as keyof typeof result.g1.scores];
              const s2 = result.g2.scores[key as keyof typeof result.g2.scores];
              const leftPct = (s1 / 10 * 50).toFixed(1);
              const rightPct = (s2 / 10 * 50).toFixed(1);
              return (
                <div key={key}>
                  <div className="grid grid-cols-[60px_1fr_60px] sm:grid-cols-[100px_1fr_100px] gap-3 items-center">
                    <span className="text-sm font-bold text-accent text-right">{s1}/10</span>
                    <div className="h-3 bg-background rounded-lg overflow-hidden flex">
                      <div
                        className="h-full bg-accent rounded-l-lg transition-all duration-700 ease-out"
                        style={{ width: `${leftPct}%` }}
                      />
                      <div
                        className="h-full bg-success rounded-r-lg transition-all duration-700 ease-out"
                        style={{ width: `${rightPct}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-success">{s2}/10</span>
                  </div>
                  <div className="grid grid-cols-[60px_1fr_60px] sm:grid-cols-[100px_1fr_100px] gap-3 items-center -mt-1">
                    <span className="text-[10px] uppercase tracking-wide text-muted text-right font-semibold truncate">
                      {result.g1.name.split(' ').slice(0, 2).join(' ')}
                    </span>
                    <span className="text-[10px] text-muted text-center">{label}</span>
                    <span className="text-[10px] uppercase tracking-wide text-muted font-semibold truncate">
                      {result.g2.name.split(' ').slice(0, 2).join(' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Table */}
          <div className="overflow-x-auto bg-card-bg border border-card-border rounded-xl">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-xs uppercase tracking-wider text-muted text-center border-b border-card-border">Metric</th>
                  <th className="p-3 text-xs uppercase tracking-wider text-muted text-center border-b border-card-border">
                    {result.g1.emoji} {result.g1.name}
                  </th>
                  <th className="p-3 text-xs uppercase tracking-wider text-muted text-center border-b border-card-border">
                    {result.g2.emoji} {result.g2.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(metricLabels).map(([key, label]) => (
                  <tr key={key}>
                    <td className="p-3 text-muted border-b border-card-border">{label}</td>
                    <td className={`p-3 text-center font-semibold border-b border-card-border ${result.g1.scores[key as keyof typeof result.g1.scores] >= result.g2.scores[key as keyof typeof result.g2.scores] ? 'text-accent' : 'text-muted'}`}>
                      {result.g1.scores[key as keyof typeof result.g1.scores]}/10
                    </td>
                    <td className={`p-3 text-center font-semibold border-b border-card-border ${result.g2.scores[key as keyof typeof result.g2.scores] >= result.g1.scores[key as keyof typeof result.g1.scores] ? 'text-success' : 'text-muted'}`}>
                      {result.g2.scores[key as keyof typeof result.g2.scores]}/10
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="p-4 font-bold text-foreground border-t-2 border-card-border">🏆 TOTAL</td>
                  <td className={`p-4 text-center text-2xl font-extrabold border-t-2 border-card-border ${result.total1 > result.total2 ? 'text-accent' : result.total1 === result.total2 ? 'text-warning' : 'text-muted'}`}>
                    {result.total1}
                  </td>
                  <td className={`p-4 text-center text-2xl font-extrabold border-t-2 border-card-border ${result.total2 > result.total1 ? 'text-success' : result.total2 === result.total1 ? 'text-warning' : 'text-muted'}`}>
                    {result.total2}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-card-bg border border-card-border rounded-xl p-6 space-y-3">
        <h2 className="text-lg font-bold text-success">🛒 Why This Tool?</h2>
        <p className="text-muted text-sm leading-relaxed">
          Summer 2026 is packed with must-have gadgets — from the Galaxy S26 Ultra to AI-powered chess boards. Our showdown tool helps you cut through the noise. Each gadget is scored on{' '}
          <strong className="text-foreground">Price Value, Innovation, Cool Factor, Practicality,</strong> and{' '}
          <strong className="text-foreground">Real-World Hype</strong> based on expert reviews and community feedback. Use it to decide which gadget deserves your cash.
        </p>
        <a href="https://lootnestx.com" className="inline-block mt-2 text-accent font-semibold text-sm hover:text-accent/80 transition-colors">
          🔗 Explore More Gadget Reviews on LootNestX →
        </a>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-muted text-xs">
        <p>© 2026 <a href="https://lootnestx.com" className="text-success hover:underline">LootNestX</a> — Novelty Item Reviews &amp; Gadget Comparisons. Not affiliated with any product brands.</p>
      </div>
    </div>
  );
}
