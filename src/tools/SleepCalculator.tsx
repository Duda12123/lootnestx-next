"use client";
import { useState, useMemo } from "react";
import { Moon, Sun, Clock } from "lucide-react";

export default function SleepCalculator() {
  const [mode, setMode] = useState<"wake" | "bed">("wake");
  const [hour, setHour] = useState(mode === "wake" ? "10" : "7");
  const [minute, setMinute] = useState("00");
  const [ampm, setAmpm] = useState(mode === "wake" ? "PM" : "AM");

  const times = useMemo(() => {
    const h = parseInt(hour) || 0;
    const m = parseInt(minute) || 0;
    let baseMin = h * 60 + m + (ampm === "PM" && h !== 12 ? 720 : 0) + (ampm === "AM" && h === 12 ? -720 : 0);
    const cycle = 90; // minutes per sleep cycle
    const results: { cycles: number; time: string; label: string }[] = [];

    if (mode === "wake") {
      // Going to bed now, when to wake up
      const now = new Date();
      const currentMin = now.getHours() * 60 + now.getMinutes();
      const fallAsleep = currentMin + 15; // minutes to fall asleep
      for (let i = 3; i <= 6; i++) {
        const wakeMin = fallAsleep + i * cycle;
        const wh = Math.floor(wakeMin / 60) % 24;
        const wm = wakeMin % 60;
        const wampm = wh >= 12 ? "PM" : "AM";
        const w12 = wh % 12 === 0 ? 12 : wh % 12;
        results.push({
          cycles: i,
          time: `${w12}:${wm.toString().padStart(2, "0")} ${wampm}`,
          label: i === 5 || i === 6 ? "✔️ Recommended" : "",
        });
      }
    } else {
      // Wake up target, when to go to bed
      for (let i = 3; i <= 6; i++) {
        const bedMin = baseMin - 15 - i * cycle;
        const bh = Math.floor(((bedMin % 1440) + 1440) % 1440 / 60);
        const bm = ((bedMin % 1440) + 1440) % 1440 % 60;
        const bampm = bh >= 12 ? "PM" : "AM";
        const b12 = bh % 12 === 0 ? 12 : bh % 12;
        results.push({
          cycles: i,
          time: `${b12}:${bm.toString().padStart(2, "0")} ${bampm}`,
          label: i === 5 || i === 6 ? "✔️ Recommended" : "",
        });
      }
    }

    return results;
  }, [mode, hour, minute, ampm]);

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-1">Sleep Calculator</h1>
      <p className="text-muted mb-6">Find the best times to sleep or wake up based on 90-minute sleep cycles. Wake up feeling refreshed!</p>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setMode("wake")} className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-colors flex items-center justify-center gap-2 ${mode === "wake" ? "bg-accent text-white border-accent" : "bg-card-bg border-card-border text-muted hover:text-foreground"}`}>
          <Moon size={16} /> I&apos;m going to bed now
        </button>
        <button onClick={() => setMode("bed")} className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-colors flex items-center justify-center gap-2 ${mode === "bed" ? "bg-accent text-white border-accent" : "bg-card-bg border-card-border text-muted hover:text-foreground"}`}>
          <Sun size={16} /> I need to wake up at
        </button>
      </div>

      {mode === "bed" && (
        <div className="flex gap-2 items-center justify-center mb-6">
          <select value={hour} onChange={(e) => setHour(e.target.value)} className="bg-card-bg border border-card-border rounded-lg px-3 py-2 text-lg text-center focus:outline-none focus:border-accent">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => <option key={h} value={h}>{h}</option>)}
          </select>
          <span className="text-xl font-bold">:</span>
          <select value={minute} onChange={(e) => setMinute(e.target.value)} className="bg-card-bg border border-card-border rounded-lg px-3 py-2 text-lg text-center focus:outline-none focus:border-accent">
            {["00", "15", "30", "45"].map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={ampm} onChange={(e) => setAmpm(e.target.value)} className="bg-card-bg border border-card-border rounded-lg px-3 py-2 text-lg text-center focus:outline-none focus:border-accent">
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      )}

      <div className="space-y-2">
        {times.map((t, i) => (
          <div key={i} className={`flex items-center justify-between bg-card-bg border rounded-xl px-4 py-3 ${t.label ? "border-accent/30" : "border-card-border"}`}>
            <div>
              <span className="text-sm text-muted-soft">{t.cycles} cycles · {t.cycles * 1.5}h</span>
            </div>
            <div className="flex items-center gap-2">
              {t.label && <span className="text-xs text-accent font-medium">{t.label}</span>}
              <span className="font-mono font-bold text-lg">{t.time}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-soft mt-4 text-center">Based on 90-minute sleep cycles + 15 min to fall asleep. Aim for 5–6 cycles (7.5–9 hours).</p>
    </div>
  );
}
