"use client";
import { useState, useRef, useCallback } from "react";
import { Download, Upload, Trash2 } from "lucide-react";

const templates = [
  "Drake Hotline Bling",
  "Distracted Boyfriend",
  "Two Buttons",
  "Change My Mind",
  "One Does Not Simply",
  "Roll Safe Think About It",
  "This Is Fine",
  "Epic Handshake",
];

export default function MemeGenerator() {
  const [image, setImage] = useState<string | null>(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [fontSize, setFontSize] = useState(40);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const drawMeme = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const maxW = 600;
      const scale = Math.min(maxW / img.width, 1);
      const w = img.width * scale;
      const h = img.height * scale;
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);

      ctx.font = `bold ${fontSize}px Impact, sans-serif`;
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = Math.max(2, fontSize / 10);
      ctx.textAlign = "center";

      if (topText) {
        const lines = wrapText(ctx, topText.toUpperCase(), w - 20);
        lines.forEach((line, i) => {
          const y = fontSize * 1.2 + i * fontSize * 1.2;
          ctx.strokeText(line, w / 2, y);
          ctx.fillText(line, w / 2, y);
        });
      }

      if (bottomText) {
        const lines = wrapText(ctx, bottomText.toUpperCase(), w - 20);
        lines.reverse().forEach((line, i) => {
          const y = h - 10 - i * fontSize * 1.2;
          ctx.strokeText(line, w / 2, y);
          ctx.fillText(line, w / 2, y);
        });
      }
    };
    img.src = image;
  }, [image, topText, bottomText, fontSize]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "meme.png";
    a.click();
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Meme Generator</h1>
      <p className="text-muted mb-6">Upload an image, add top and bottom text, and create your own meme. Classic Impact font style.</p>

      <div className="space-y-4">
        {!image ? (
          <div className="border-2 border-dashed border-card-border rounded-xl p-8 text-center hover:border-accent/30 transition-colors">
            <label className="cursor-pointer">
              <Upload size={32} className="mx-auto text-muted-soft mb-3" />
              <p className="text-muted mb-1">Click to upload an image</p>
              <p className="text-xs text-muted-soft">PNG, JPG, GIF — any format works</p>
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label>
            <p className="text-xs text-muted-soft mt-4">Or start with a blank canvas</p>
            <button onClick={() => setImage("blank")} className="mt-2 px-4 py-2 rounded-lg bg-card-bg border border-card-border text-sm text-muted hover:text-foreground transition-colors">Blank Canvas</button>
          </div>
        ) : (
          <>
            <div className="flex gap-2 flex-wrap">
              <label className="px-3 py-1.5 rounded-lg bg-card-bg border border-card-border text-xs text-muted hover:text-foreground transition-colors cursor-pointer">
                <Upload size={12} className="inline mr-1" /> Change Image
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
              <button onClick={() => setImage(null)} className="px-3 py-1.5 rounded-lg bg-card-bg border border-card-border text-xs text-muted hover:text-foreground transition-colors flex items-center gap-1">
                <Trash2 size={12} /> Remove
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">Top Text</label>
                <input value={topText} onChange={(e) => setTopText(e.target.value)} placeholder="TOP TEXT" className="w-full bg-card-bg border border-card-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">Bottom Text</label>
                <input value={bottomText} onChange={(e) => setBottomText(e.target.value)} placeholder="BOTTOM TEXT" className="w-full bg-card-bg border border-card-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-accent" />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">Font Size: {fontSize}px</label>
              <input type="range" min={20} max={80} value={fontSize} onChange={(e) => setFontSize(+e.target.value)} className="w-full accent-accent" />
            </div>

            <div className="flex gap-2">
              <button onClick={drawMeme} className="flex-1 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity">Generate Meme</button>
              <button onClick={download} className="px-6 py-2 rounded-xl bg-card-bg border border-card-border text-muted hover:text-foreground transition-colors text-sm flex items-center gap-2">
                <Download size={16} /> Save
              </button>
            </div>

            <div className="bg-surface border border-card-border rounded-xl p-4 flex justify-center">
              <canvas ref={canvasRef} className="max-w-full rounded-lg border border-card-border" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [text];
}
