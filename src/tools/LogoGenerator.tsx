"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Download, RefreshCw } from "lucide-react";

const fonts = ["Inter", "Georgia", "Courier New", "Impact", "Verdana", "Trebuchet MS"];
const shapes = ["circle", "rounded-square", "hexagon", "diamond", "shield", "none"];
const colorPresets = [
  ["#3B82F6", "#1D4ED8"], ["#10B981", "#047857"], ["#F59E0B", "#B45309"],
  ["#EF4444", "#991B1B"], ["#8B5CF6", "#6D28D9"], ["#EC4899", "#BE185D"],
  ["#06B6D4", "#0E7490"], ["#84CC16", "#4D7C0F"], ["#F97316", "#C2410C"], ["#6366F1", "#4338CA"],
];

export default function LogoGenerator() {
  const [text, setText] = useState("YourLogo");
  const [tagline, setTagline] = useState("");
  const [font, setFont] = useState("Inter");
  const [colors, setColors] = useState(colorPresets[0]);
  const [shape, setShape] = useState("rounded-square");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = 500;
    const h = 500;
    canvas.width = w;
    canvas.height = h;

    // Background
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    // Shape
    const cx = w / 2;
    const cy = h / 2 - 30;
    const r = 120;

    if (shape !== "none") {
      ctx.fillStyle = colors.length > 1 ? colors[1] : colors[0];
      ctx.beginPath();
      switch (shape) {
        case "circle":
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          break;
        case "rounded-square":
          roundRect(ctx, cx - r, cy - r, r * 2, r * 2, 20);
          break;
        case "hexagon":
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const px = cx + r * Math.cos(angle);
            const py = cy + r * Math.sin(angle);
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.closePath();
          break;
        case "diamond":
          ctx.moveTo(cx, cy - r);
          ctx.lineTo(cx + r, cy);
          ctx.lineTo(cx, cy + r);
          ctx.lineTo(cx - r, cy);
          ctx.closePath();
          break;
        case "shield":
          ctx.moveTo(cx, cy - r);
          ctx.lineTo(cx + r, cy - r * 0.4);
          ctx.lineTo(cx + r, cy + r * 0.3);
          ctx.lineTo(cx, cy + r);
          ctx.lineTo(cx - r, cy + r * 0.3);
          ctx.lineTo(cx - r, cy - r * 0.4);
          ctx.closePath();
          break;
      }
      ctx.fill();
    }

    // Text
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const nameSize = Math.min(60, (w * 0.8) / text.length * 1.5);
    ctx.font = `bold ${nameSize}px "${font}", sans-serif`;
    ctx.fillText(text, cx, cy);

    if (tagline) {
      ctx.font = `${nameSize * 0.35}px "${font}", sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      ctx.fillText(tagline, cx, cy + r * 0.9);
    }
  }, [text, tagline, font, colors, shape]);

  useEffect(() => { draw(); }, [draw]);

  const randomize = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    setText(Array.from({ length: 5 + Math.floor(Math.random() * 4) }, () => chars[Math.floor(Math.random() * 26)]).join(""));
    setColors(colorPresets[Math.floor(Math.random() * colorPresets.length)]);
    setShape(shapes[Math.floor(Math.random() * shapes.length)]);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "logo.png";
    a.click();
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Logo Generator</h1>
      <p className="text-muted mb-6">Create a simple logo in seconds. Customize text, colors, shape, and font — then download as PNG.</p>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">Brand Name</label>
            <input value={text} onChange={(e) => setText(e.target.value)} className="w-full bg-card-bg border border-card-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">Tagline (optional)</label>
            <input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Slogan" className="w-full bg-card-bg border border-card-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-accent" />
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">Shape</label>
          <div className="flex gap-2 flex-wrap">
            {shapes.map((s) => (
              <button key={s} onClick={() => setShape(s)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors capitalize ${shape === s ? "bg-accent text-white border-accent" : "bg-card-bg border-card-border text-muted hover:text-foreground"}`}>{s.replace("-", " ")}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">Colors</label>
          <div className="flex gap-2 flex-wrap">
            {colorPresets.map((c, i) => (
              <button key={i} onClick={() => setColors(c)} className={`w-10 h-10 rounded-lg border-2 transition-all ${colors[0] === c[0] ? "border-white scale-110" : "border-transparent"}`} style={{ background: `linear-gradient(135deg, ${c[0]}, ${c[1]})` }} title={`${c[0]} → ${c[1]}`} />
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">Font</label>
          <select value={font} onChange={(e) => setFont(e.target.value)} className="w-full bg-card-bg border border-card-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-accent">
            {fonts.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div className="flex gap-2">
          <button onClick={randomize} className="flex-1 py-2 rounded-xl bg-card-bg border border-card-border text-muted hover:text-foreground transition-colors text-sm flex items-center justify-center gap-2">
            <RefreshCw size={14} /> Randomize
          </button>
          <button onClick={download} className="flex-1 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <Download size={14} /> Download PNG
          </button>
        </div>

        <div className="bg-surface border border-card-border rounded-xl p-4 flex justify-center">
          <canvas ref={canvasRef} className="max-w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
