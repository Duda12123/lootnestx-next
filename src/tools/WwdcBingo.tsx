"use client";

import { useState, useCallback, useEffect, useRef } from "react";

const BINGO_ITEMS = [
  "\"One More Thing…\"",
  "Tim Cook's Final Walkout",
  "iOS 27 Announced",
  "iPadOS 27 Unveiled",
  "macOS 27 Revealed",
  "watchOS 13 Shown",
  "visionOS 3 Preview",
  "Siri AI Rebuilt",
  "Siri Standalone App",
  "Apple Intelligence 2.0",
  "AI Health Coach Feature",
  "New MacBook Neo",
  "M5 / M6 Chip Tease",
  "Foldable iPhone Mention",
  "Craig Federighi Hair Joke",
  "Standing Ovation for Cook",
  "Environmental Progress Video",
  "New Privacy Feature",
  "CarPlay 3.0 Demo",
  "HomeKit Major Update",
  "AirPods Firmware News",
  "Apple Music Spatial Audio",
  "Messages App Redesign",
  "Photos AI Editing",
  "Xcode Cloud Update",
  "Swift 7 Announcement",
  "Record Attendance Number",
  "Apple Park Drone Shot",
  "Accessibility Feature",
  "Gaming on Mac Demo",
  "Apple Pay / Wallet Update",
  "Freeform Collaboration",
  "Safari WebGPU Boost",
  "Shortcuts App Revamp",
  "Notes App AI Features",
  "Journal App Expansion",
  "New Emoji Preview",
  "Apple Arcade Exclusive",
  "Fitness+ New Workouts",
  "Apple Card Expansion",
  "Developer Tools Surprise",
  "\"We Think You're Gonna Love It\"",
  "Tim Cook Tears Up",
  "John Ternus Spotlight",
  "Black Unity Band / Watch Face",
];

type Cell = { text: string; isFree: boolean };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateCard(): Cell[][] {
  const items = shuffle(BINGO_ITEMS).slice(0, 24);
  const card: Cell[][] = [];
  let idx = 0;
  for (let r = 0; r < 5; r++) {
    card[r] = [];
    for (let c = 0; c < 5; c++) {
      if (r === 2 && c === 2) {
        card[r][c] = { text: "FREE SPACE", isFree: true };
      } else {
        card[r][c] = { text: items[idx++], isFree: false };
      }
    }
  }
  return card;
}

function detectWins(marked: Set<string>): Set<string> {
  const lines: string[][] = [
    // rows
    ...Array.from({ length: 5 }, (_, r) => Array.from({ length: 5 }, (_, c) => `${r}-${c}`)),
    // cols
    ...Array.from({ length: 5 }, (_, c) => Array.from({ length: 5 }, (_, r) => `${r}-${c}`)),
    // diag TL-BR
    Array.from({ length: 5 }, (_, i) => `${i}-${i}`),
    // diag TR-BL
    Array.from({ length: 5 }, (_, i) => `${i}-${4 - i}`),
  ];
  const winCells = new Set<string>();
  for (const line of lines) {
    if (line.every((k) => marked.has(k))) {
      line.forEach((k) => winCells.add(k));
    }
  }
  return winCells;
}

export default function WwdcBingo() {
  const [card, setCard] = useState<Cell[][]>(generateCard);
  const [marked, setMarked] = useState<Set<string>>(() => new Set(["2-2"]));
  const [winCells, setWinCells] = useState<Set<string>>(new Set());
  const [confetti, setConfetti] = useState<{ id: number; left: string; color: string; duration: string; delay: string; size: string; round: boolean }[]>([]);
  const [toast, setToast] = useState("");
  const confettiId = useRef(0);

  const markedCount = marked.size - 1; // subtract free space
  const hasBingo = winCells.size > 0;

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }, []);

  const spawnConfetti = useCallback(() => {
    const colors = ["#3b82f6", "#60a5fa", "#22c55e", "#f59e0b", "#ef4444", "#a855f7", "#ec4899"];
    const pieces = Array.from({ length: 60 }, (_, i) => ({
      id: confettiId.current++,
      left: `${Math.random() * 100}%`,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: `${2 + Math.random() * 3}s`,
      delay: `${Math.random() * 1.5}s`,
      size: `${6 + Math.random() * 8}px`,
      round: Math.random() > 0.5,
    }));
    setConfetti((prev) => [...prev, ...pieces]);
    setTimeout(() => setConfetti((prev) => prev.filter((p) => !pieces.find((x) => x.id === p.id))), 5000);
  }, []);

  const updateWins = useCallback(
    (m: Set<string>) => {
      const wins = detectWins(m);
      setWinCells(wins);
      return wins;
    },
    [],
  );

  const newCard = useCallback(() => {
    const c = generateCard();
    setCard(c);
    const m = new Set<string>(["2-2"]);
    setMarked(m);
    setWinCells(new Set());
    updateWins(m);
  }, [updateWins]);

  const resetMarks = useCallback(() => {
    const m = new Set<string>(["2-2"]);
    setMarked(m);
    setWinCells(new Set());
    updateWins(m);
  }, [updateWins]);

  const toggleCell = useCallback(
    (row: number, col: number) => {
      if (row === 2 && col === 2) return;
      const key = `${row}-${col}`;
      setMarked((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        const wins = detectWins(next);
        setWinCells(wins);
        if (wins.size > 0 && !hasBingo) {
          setTimeout(spawnConfetti, 50);
        }
        return next;
      });
    },
    [hasBingo, spawnConfetti],
  );

  const shareCard = useCallback(() => {
    const url = "https://lootnestx.com/tool/wwdc-bingo";
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: "WWDC 2026 Keynote Bingo", text: "Play WWDC 2026 Keynote Bingo! Track Apple's biggest announcements live.", url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => showToast("🔗 Link copied! Share with friends.")).catch(() => showToast("📋 Copy this link: " + url));
    }
  }, [showToast]);

  const tweetShare = useCallback(() => {
    const text = encodeURIComponent("I'm playing WWDC 2026 Keynote Bingo! 🎯 Track Apple's biggest announcements live. Generate your card:");
    const url = encodeURIComponent("https://lootnestx.com/tool/wwdc-bingo");
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=WWDC26Bingo,WWDC2026,AppleEvent`, "_blank");
  }, []);

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText("https://lootnestx.com/tool/wwdc-bingo").then(() => showToast("🔗 Link copied!")).catch(() => showToast("Copy this: https://lootnestx.com/tool/wwdc-bingo"));
  }, [showToast]);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-xs tracking-[0.15em] uppercase text-accent/70 mb-3 font-mono">
          LootNest<span className="text-accent">X</span> · Interactive Tool
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-accent via-blue-400 to-purple-500 bg-clip-text text-transparent">
          WWDC 2026<br />Keynote Bingo
        </h1>
        <p className="text-muted mb-3">Generate your card. Watch the keynote. Mark &apos;em off.</p>
        <div className="inline-flex items-center gap-1.5 bg-warning/10 border border-warning/30 rounded-full px-3.5 py-1 text-xs text-warning font-medium">
          <span className="w-1.5 h-1.5 bg-warning rounded-full animate-pulse" />
          📅 June 9, 2026 · 10:00 AM PT
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-center gap-2.5 mb-6">
        <button onClick={newCard} className="px-5 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-semibold transition-colors">
          🎲 New Card
        </button>
        <button onClick={resetMarks} className="px-5 py-2.5 bg-card-bg border border-card-border hover:border-accent rounded-lg text-sm font-semibold text-foreground transition-colors">
          🔄 Clear Marks
        </button>
        <button onClick={shareCard} className="px-5 py-2.5 bg-transparent border border-accent/40 text-accent hover:bg-accent/10 rounded-lg text-sm font-semibold transition-colors">
          📤 Share Card
        </button>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-5 mb-6 text-sm font-mono text-muted">
        <span>✅ <span className="text-success font-bold text-base">{markedCount}</span>/24 marked</span>
        <span>🎯 {hasBingo ? <span className="text-warning font-semibold">🎉 BINGO!</span> : "No bingo yet"}</span>
      </div>

      {/* Bingo Card */}
      <div className="w-full max-w-[480px] mx-auto mb-6">
        <div className="grid grid-cols-5 gap-0.5 bg-card-border rounded-xl overflow-hidden shadow-xl shadow-black/30">
          {/* Header row */}
          {["W", "W", "D", "C", "26"].map((h, i) => (
            <div key={`h-${i}`} className="bg-accent text-white flex items-center justify-center py-2 font-bold text-sm sm:text-base uppercase tracking-wider">
              {h}
            </div>
          ))}
          {/* Grid cells */}
          {card.flat().map((cell, idx) => {
            const r = Math.floor(idx / 5);
            const c = idx % 5;
            const key = `${r}-${c}`;
            const isMarked = marked.has(key);
            const isWin = winCells.has(key);

            let cellClass = "flex items-center justify-center text-center py-2.5 px-1 text-[0.65rem] sm:text-xs leading-tight font-medium transition-all duration-200 cursor-pointer select-none relative overflow-hidden break-words hyphens-auto ";
            if (cell.isFree) {
              cellClass += "bg-accent/15 text-accent font-bold cursor-default";
            } else if (isWin) {
              cellClass += "bg-warning/10 text-warning border border-warning/40 shadow-[0_0_12px_rgba(245,158,11,0.3)] animate-pulse";
            } else if (isMarked) {
              cellClass += "bg-success/10 text-success";
            } else {
              cellClass += "bg-card-bg text-muted hover:bg-surface hover:text-foreground hover:border-card-border hover:scale-[1.02] hover:z-10 border border-transparent";
            }
            // pulse once on win
            if (isWin) {
              cellClass += " [animation-iteration-count:3] [animation-duration:0.4s]";
            }

            return (
              <div key={key} className={cellClass} onClick={() => toggleCell(r, c)}>
                {cell.isFree && <span className="mr-0.5">⭐</span>}
                {cell.text}
                {cell.isFree && <span className="ml-0.5">⭐</span>}
                {isMarked && !cell.isFree && (
                  <span className="absolute top-1 right-1.5 text-[0.5rem] text-success/70 font-mono">✓</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Win Banner */}
      {hasBingo && (
        <div className="text-center mb-6 py-3.5 px-6 bg-warning/10 border border-warning/50 rounded-lg text-warning font-bold text-base animate-[fade-in-up_0.4s_ease]">
          🎉 BINGO! Share your card with #WWDC26Bingo!
        </div>
      )}

      {/* Share */}
      <div className="text-center">
        <p className="text-xs text-muted-soft mb-2.5">
          Playing along? Tag <strong className="text-muted">#WWDC26Bingo</strong>
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <button onClick={copyLink} className="px-4 py-2 bg-transparent border border-card-border text-muted hover:text-foreground hover:border-accent rounded-lg text-sm transition-colors">
            🔗 Copy Link
          </button>
          <button onClick={tweetShare} className="px-4 py-2 bg-transparent border border-card-border text-muted hover:text-foreground hover:border-accent rounded-lg text-sm transition-colors">
            𝕏 Tweet
          </button>
        </div>
      </div>

      {/* Confetti */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden>
        {confetti.map((p) => (
          <div
            key={p.id}
            className="absolute animate-[confetti-fall_linear_forwards]"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              background: p.color,
              borderRadius: p.round ? "50%" : "2px",
              animationDuration: p.duration,
              animationDelay: p.delay,
              top: "-5vh",
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-surface border border-success/40 text-success px-6 py-3 rounded-lg text-sm font-medium z-50 animate-[fade-in-up_0.3s_ease]">
          {toast}
        </div>
      )}

      {/* Confetti keyframes */}
      <style jsx>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-5vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
