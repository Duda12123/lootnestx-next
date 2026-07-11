'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

// ===== Constants =====
const MATCHES = [
  'Jun 17 — BRA vs CAN 5:00PM ET',
  'Jun 17 — GER vs JPN 2:00PM ET',
  'Jun 18 — FRA vs USA 8:00PM ET',
  'Jun 19 — ARG vs MEX 8:00PM ET',
  'Jun 20 — ESP vs KOR 5:00PM ET',
];

const ROOM_OPTIONS: Record<string, string> = {
  'living-room': 'Living Room',
  'basement': 'Basement / Man Cave',
  'backyard': 'Backyard / Outdoor',
  'garage': 'Garage',
  'apartment': 'Apartment',
};

const HOUR_OPTIONS = [
  { value: 2, label: '2 hours — Single match' },
  { value: 4, label: '4 hours — Double header' },
  { value: 6, label: '6 hours — Full afternoon' },
  { value: 8, label: '8+ hours — All day marathon' },
];

interface TvResult {
  tv: string;
  screen: string;
  sound: string;
  gearMin: number;
  gearMax: number;
}

interface FoodResult {
  pizzas: number;
  wings: number;
  chips: number;
  beer: number;
  soda: number;
  water: number;
  foodCost: number;
  drinkCost: number;
  decorCost: number;
}

interface AllResults {
  tv: TvResult;
  food: FoodResult;
  gearPerParty: number;
  total: number;
}

// ===== Calculation Logic =====
function calcTV(guests: number, distance: number, room: string): TvResult {
  const distInches = distance * 12;
  const minSize = Math.round(distInches * 0.625);
  const guestBonus = Math.floor((guests - 1) / 2) * 5;
  const recommended = Math.min(Math.max(minSize + guestBonus, 32), 100);

  if (room === 'backyard' && guests >= 6) {
    return { tv: 'Projector', screen: '120" Outdoor', sound: 'PA Speakers', gearMin: 600, gearMax: 2500 };
  }
  if (room === 'backyard') {
    return { tv: `${recommended}"`, screen: 'QLED Outdoor TV', sound: 'Soundbar + Sub', gearMin: 1200, gearMax: 3000 };
  }
  if (guests >= 10) {
    return { tv: `${Math.max(recommended, 75)}"`, screen: '4K QLED / OLED', sound: 'Dolby Atmos System', gearMin: 1500, gearMax: 4000 };
  }
  if (guests >= 6) {
    return { tv: `${Math.max(recommended, 65)}"`, screen: '4K QLED', sound: 'Soundbar + Sub', gearMin: 800, gearMax: 2000 };
  }
  return { tv: `${Math.max(recommended, 55)}"`, screen: '4K LED / QLED', sound: 'Soundbar', gearMin: 500, gearMax: 1500 };
}

function calcFood(guests: number, hours: number): FoodResult {
  const pizzas = Math.ceil((guests * 3) / 8);
  const wings = guests * 6;
  const chips = Math.ceil(guests / 3);
  const beer = Math.ceil(guests * 1.5 * hours);
  const soda = Math.ceil(guests * 0.5 * hours);
  const water = Math.ceil(guests * 0.5 * hours);

  const foodCost = pizzas * 16 + (wings / 10) * 12 + chips * 5;
  const drinkCost = beer * 1.5 + soda * 0.75 + water * 0.5;
  const decorCost = Math.max(guests * 3, 20);

  return { pizzas, wings, chips, beer, soda, water, foodCost: Math.round(foodCost), drinkCost: Math.round(drinkCost), decorCost: Math.round(decorCost) };
}

function computeAll(guests: number, hours: number, room: string, distance: number): AllResults {
  const g = Math.min(Math.max(guests, 1), 100);
  const tv = calcTV(g, distance, room);
  const food = calcFood(g, hours);
  const gearPerParty = Math.round((tv.gearMin + tv.gearMax) / 2 * 0.05);
  const total = food.foodCost + food.drinkCost + gearPerParty + food.decorCost;
  return { tv, food, gearPerParty, total };
}

export default function WorldCupWatchPartyCalculator() {
  const [guests, setGuests] = useState(6);
  const [hours, setHours] = useState(4);
  const [room, setRoom] = useState('living-room');
  const [distance, setDistance] = useState(10);
  const [results, setResults] = useState<AllResults | null>(null);
  const [activeStep, setActiveStep] = useState(1);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const recalculate = useCallback(() => {
    const r = computeAll(guests, hours, room, distance);
    setResults(r);
    setActiveStep(4);
  }, [guests, hours, room, distance]);

  // Auto-calculate on mount and when inputs change
  useEffect(() => {
    recalculate();
  }, [recalculate]);

  const handleShare = useCallback(() => {
    if (!results) return;
    const text = [
      '⚽ My World Cup 2026 Watch Party Plan ⚽',
      '',
      `TV: ${results.tv.tv} | Audio: ${results.tv.sound}`,
      `Food: ${results.food.pizzas} pizza${results.food.pizzas !== 1 ? 's' : ''}, ${results.food.wings} wings, ${results.food.beer} beers`,
      `Budget: $${results.total}`,
      '',
      'Plan yours: https://lootnestx.com/tools/world-cup-watch-party-calculator',
      '#WorldCup2026 #WatchParty #LootNestX',
    ].join('\n');

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setToastVisible(true);
        if (toastTimer.current) clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToastVisible(false), 2500);
      }).catch(() => {});
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setToastVisible(true);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToastVisible(false), 2500);
    }
  }, [results]);

  const stepClass = (n: number) => {
    if (n < activeStep) return 'bg-success';
    if (n === activeStep) return 'bg-accent shadow-[0_0_12px_rgba(34,197,94,0.4)]';
    return 'bg-foreground/10';
  };

  // Scroll to results on calculate
  const resultsRef = useRef<HTMLDivElement>(null);
  const handleCalculateClick = useCallback(() => {
    recalculate();
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [recalculate]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Live Ticker */}
      <div className="bg-card-bg border border-card-border rounded-xl p-4 flex items-center gap-3 overflow-hidden">
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-[0.7rem] font-bold text-success uppercase tracking-wider">LIVE</span>
        </div>
        <div className="flex gap-3 overflow-x-auto whitespace-nowrap scrollbar-none py-1">
          {MATCHES.map((m, i) => (
            <span
              key={i}
              className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-foreground/[0.04] text-muted font-medium"
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex gap-1.5 justify-center">
        {[1, 2, 3, 4].map(n => (
          <div
            key={n}
            className={`w-10 h-1 rounded-sm transition-all duration-300 ${stepClass(n)}`}
          />
        ))}
      </div>

      {/* Step 1: Party Basics */}
      <div className="bg-card-bg border border-card-border rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center text-xl">👥</div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Party Basics</h2>
            <p className="text-xs text-muted">Tell us about your watch party setup</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Guests */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider">Number of Guests</label>
            <input
              type="number"
              min={1}
              max={100}
              value={guests}
              onChange={e => setGuests(Number(e.target.value) || 1)}
              className="bg-background border border-card-border rounded-lg text-foreground placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent px-4 py-2 w-full"
              placeholder="How many people?"
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider">Party Duration</label>
            <select
              value={hours}
              onChange={e => setHours(Number(e.target.value))}
              className="bg-background border border-card-border rounded-lg text-foreground placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent px-4 py-2 w-full"
            >
              {HOUR_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Room Type */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider">Room Type</label>
            <select
              value={room}
              onChange={e => setRoom(e.target.value)}
              className="bg-background border border-card-border rounded-lg text-foreground placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent px-4 py-2 w-full"
            >
              {Object.entries(ROOM_OPTIONS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          {/* Viewing Distance */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider">Viewing Distance (feet)</label>
            <input
              type="number"
              min={3}
              max={50}
              value={distance}
              onChange={e => setDistance(Number(e.target.value) || 3)}
              className="bg-background border border-card-border rounded-lg text-foreground placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent px-4 py-2 w-full"
              placeholder="Distance from screen"
            />
          </div>
        </div>

        <button
          onClick={handleCalculateClick}
          className="bg-accent hover:bg-accent/90 text-white font-medium rounded-lg px-4 py-2 transition-colors w-full sm:w-auto"
        >
          Calculate My Party Plan →
        </button>
      </div>

      {results && (
        <div ref={resultsRef} className="space-y-5">
          {/* Step 2: Screen & Sound */}
          <div className="bg-card-bg border border-card-border rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center text-xl">📺</div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Screen & Sound Setup</h2>
                <p className="text-xs text-muted">Optimal gear for your viewing party</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-accent/[0.06] to-accent/[0.02] border border-accent/20 rounded-xl p-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-black/30 rounded-xl">
                  <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">{results.tv.tv}</div>
                  <div className="text-[0.65rem] text-muted uppercase tracking-wider mt-1">Recommended TV</div>
                </div>
                <div className="text-center p-3 bg-black/30 rounded-xl">
                  <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">{results.tv.sound}</div>
                  <div className="text-[0.65rem] text-muted uppercase tracking-wider mt-1">Audio Setup</div>
                </div>
                <div className="text-center p-3 bg-black/30 rounded-xl">
                  <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">{results.tv.screen}</div>
                  <div className="text-[0.65rem] text-muted uppercase tracking-wider mt-1">Screen Type</div>
                </div>
                <div className="text-center p-3 bg-black/30 rounded-xl">
                  <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">${results.tv.gearMin}–{results.tv.gearMax}</div>
                  <div className="text-[0.65rem] text-muted uppercase tracking-wider mt-1">Gear Budget</div>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted">
              💡 Pro tip: For backyard parties with 8+ guests, consider a <strong>4K projector + outdoor screen</strong> combo.
            </p>
          </div>

          {/* Step 3: Food & Drinks */}
          <div className="bg-card-bg border border-card-border rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-warning/10 flex items-center justify-center text-xl">🍕</div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Food & Drinks Calculator</h2>
                <p className="text-xs text-muted">Never run out of snacks during extra time</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-warning/[0.06] to-warning/[0.02] border border-warning/20 rounded-xl p-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-black/30 rounded-xl">
                  <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-warning to-orange-400 bg-clip-text text-transparent">{results.food.pizzas}</div>
                  <div className="text-[0.65rem] text-muted uppercase tracking-wider mt-1">Large Pizzas (8 slices)</div>
                </div>
                <div className="text-center p-3 bg-black/30 rounded-xl">
                  <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-warning to-orange-400 bg-clip-text text-transparent">{results.food.wings}</div>
                  <div className="text-[0.65rem] text-muted uppercase tracking-wider mt-1">Chicken Wings</div>
                </div>
                <div className="text-center p-3 bg-black/30 rounded-xl">
                  <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-warning to-orange-400 bg-clip-text text-transparent">{results.food.chips}</div>
                  <div className="text-[0.65rem] text-muted uppercase tracking-wider mt-1">Chips Bags</div>
                </div>
                <div className="text-center p-3 bg-black/30 rounded-xl">
                  <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-warning to-orange-400 bg-clip-text text-transparent">{results.food.beer}</div>
                  <div className="text-[0.65rem] text-muted uppercase tracking-wider mt-1">Beers (12oz)</div>
                </div>
                <div className="text-center p-3 bg-black/30 rounded-xl">
                  <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-warning to-orange-400 bg-clip-text text-transparent">{results.food.soda}</div>
                  <div className="text-[0.65rem] text-muted uppercase tracking-wider mt-1">Soda Cans</div>
                </div>
                <div className="text-center p-3 bg-black/30 rounded-xl">
                  <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-warning to-orange-400 bg-clip-text text-transparent">{results.food.water}</div>
                  <div className="text-[0.65rem] text-muted uppercase tracking-wider mt-1">Water Bottles</div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Budget Breakdown */}
          <div className="bg-card-bg border border-card-border rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-warning/10 flex items-center justify-center text-xl">💰</div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Party Budget Breakdown</h2>
                <p className="text-xs text-muted">Complete cost estimate for your watch party</p>
              </div>
            </div>

            <div className="divide-y divide-foreground/[0.06]">
              <div className="flex justify-between py-2.5">
                <span className="text-sm text-muted">🍕 Food & Snacks</span>
                <span className="text-sm font-semibold text-foreground">${results.food.foodCost}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-sm text-muted">🍺 Drinks & Beverages</span>
                <span className="text-sm font-semibold text-foreground">${results.food.drinkCost}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-sm text-muted">📺 TV / Projector (est./party)</span>
                <span className="text-sm font-semibold text-foreground">${results.gearPerParty}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-sm text-muted">🎉 Decorations & Supplies</span>
                <span className="text-sm font-semibold text-foreground">${results.food.decorCost}</span>
              </div>
              <div className="flex justify-between py-3 pt-4">
                <span className="text-sm font-bold text-warning">⚽ TOTAL ESTIMATE</span>
                <span className="text-lg font-extrabold text-warning">${results.total}</span>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleShare}
                className="bg-accent hover:bg-accent/90 text-white font-medium rounded-lg px-4 py-2 transition-colors inline-flex items-center gap-2"
              >
                📤 Share My Party Plan
              </button>
              <button
                onClick={() => window.print()}
                className="bg-surface hover:bg-card-bg border border-card-border text-foreground rounded-lg px-4 py-2 transition-colors inline-flex items-center gap-2"
              >
                🖨️ Print Shopping List
              </button>
            </div>
          </div>

          {/* Recommended Gear (static) */}
          <div className="bg-card-bg border border-card-border rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-success/10 flex items-center justify-center text-xl">🛒</div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Top-Rated Watch Party Gear</h2>
                <p className="text-xs text-muted">Curated by LootNestX editors — USA&apos;s best novelty & gadget reviews</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { emoji: '📺', name: 'Samsung 85" Neo QLED 8K', price: 'from $3,499', link: 'https://lootnestx.com/reviews/85-inch-tvs' },
                { emoji: '🔊', name: 'Sonos Arc Ultra Soundbar', price: 'from $999', link: 'https://lootnestx.com/reviews/soundbars' },
                { emoji: '🎬', name: 'Epson 4K PRO-UHD Projector', price: 'from $1,699', link: 'https://lootnestx.com/reviews/projectors' },
                { emoji: '🧊', name: 'YETI Tundra 65 Cooler', price: 'from $350', link: 'https://lootnestx.com/reviews/coolers' },
                { emoji: '🍖', name: 'Traeger Ironwood XL Grill', price: 'from $1,999', link: 'https://lootnestx.com/reviews/grills' },
                { emoji: '💡', name: 'Govee AI Sync Box + LED Strips', price: 'from $139', link: 'https://lootnestx.com/reviews/smart-lights' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-foreground/[0.02] border border-foreground/[0.06] rounded-xl p-5 text-center hover:bg-card-bg hover:border-card-border hover:-translate-y-0.5 transition-all"
                >
                  <div className="text-3xl mb-2">{item.emoji}</div>
                  <div className="text-sm font-bold text-foreground mb-1">{item.name}</div>
                  <div className="text-xs text-success font-semibold mb-2">{item.price}</div>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-accent underline font-semibold underline-offset-[3px] hover:text-foreground transition-colors"
                  >
                    Read Review →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-xs text-muted pt-4 pb-2 space-y-1 border-t border-card-border">
        <p>Built with ⚽ by <a href="https://lootnestx.com" className="text-accent hover:underline">LootNestX</a> — Your source for honest novelty & gadget reviews. &copy; 2026</p>
      </div>

      {/* Toast */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-card-bg border border-success text-success px-6 py-3 rounded-full text-sm font-semibold z-50 transition-opacity duration-300 pointer-events-none ${toastVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        📋 Party plan copied! Share it with your guests.
      </div>
    </div>
  );
}
