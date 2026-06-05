"use client";
import { useState, useRef, useCallback } from "react";
import { Upload, Download, Image as ImageIcon } from "lucide-react";

const effects: { id: string; label: string; filter: string; icon: string }[] = [
  { id: "original", label: "Original", filter: "none", icon: "📷" },
  { id: "cartoon", label: "Cartoon", filter: "saturate(1.8) contrast(1.2) brightness(1.1)", icon: "🎨" },
  { id: "vintage", label: "Vintage", filter: "sepia(0.8) contrast(0.8) brightness(0.9)", icon: "📸" },
  { id: "dramatic", label: "Dramatic", filter: "contrast(1.5) saturate(0.5) brightness(0.8)", icon: "🎭" },
  { id: "cool", label: "Cool Tone", filter: "hue-rotate(30deg) saturate(1.2)", icon: "❄️" },
  { id: "warm", label: "Warm Tone", filter: "hue-rotate(-30deg) saturate(1.3)", icon: "☀️" },
  { id: "grayscale", label: "B&W", filter: "grayscale(1) contrast(1.1)", icon: "🖤" },
  { id: "vivid", label: "Vivid Pop", filter: "saturate(2) contrast(1.1) brightness(1.05)", icon: "🌈" },
  { id: "fade", label: "Faded Film", filter: "brightness(1.1) contrast(0.85) saturate(0.7)", icon: "🎞️" },
  { id: "noir", label: "Noir", filter: "grayscale(1) contrast(1.4) brightness(0.8)", icon: "🕵️" },
];

export default function PhotoEffects() {
  const [image, setImage] = useState<string | null>(null);
  const [effect, setEffect] = useState("original");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const baseFilter = effects.find((e) => e.id === effect)?.filter || "none";
  const fullFilter = `${baseFilter} brightness(${brightness / 100}) contrast(${contrast / 100}) saturate(${saturation / 100})`;

  const download = useCallback(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.filter = fullFilter;
    ctx.drawImage(img, 0, 0);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `photo-${effect}.png`;
    a.click();
  }, [effect, fullFilter]);

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Photo Effects & Filters</h1>
      <p className="text-muted mb-6">Apply filters to your photos — cartoon, vintage, dramatic, and more. All in your browser.</p>

      <div className="space-y-4">
        {!image ? (
          <div className="border-2 border-dashed border-card-border rounded-xl p-12 text-center hover:border-accent/30 transition-colors">
            <label className="cursor-pointer">
              <Upload size={40} className="mx-auto text-muted-soft mb-4" />
              <p className="text-muted mb-1 font-medium">Drop an image or click to upload</p>
              <p className="text-xs text-muted-soft">JPG, PNG, WebP — any image format</p>
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label>
          </div>
        ) : (
          <>
            <div className="flex gap-2 items-center">
              <label className="px-3 py-1.5 rounded-lg bg-card-bg border border-card-border text-xs text-muted hover:text-foreground transition-colors cursor-pointer flex items-center gap-1">
                <Upload size={12} /> Change
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
              <button onClick={download} className="px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1">
                <Download size={12} /> Download
              </button>
            </div>

            <div className="flex gap-2 flex-wrap">
              {effects.map((e) => (
                <button key={e.id} onClick={() => setEffect(e.id)} className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${effect === e.id ? "bg-accent text-white border-accent" : "bg-card-bg border-card-border text-muted hover:text-foreground"}`}>
                  <span>{e.icon}</span> {e.label}
                </button>
              ))}
            </div>

            <div className="space-y-3 bg-card-bg border border-card-border rounded-xl p-4">
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-soft w-20">Brightness</span>
                <input type="range" min={0} max={200} value={brightness} onChange={(e) => setBrightness(+e.target.value)} className="flex-1 accent-accent" />
                <span className="text-xs text-muted-soft w-10 text-right">{brightness}%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-soft w-20">Contrast</span>
                <input type="range" min={0} max={200} value={contrast} onChange={(e) => setContrast(+e.target.value)} className="flex-1 accent-accent" />
                <span className="text-xs text-muted-soft w-10 text-right">{contrast}%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-soft w-20">Saturation</span>
                <input type="range" min={0} max={200} value={saturation} onChange={(e) => setSaturation(+e.target.value)} className="flex-1 accent-accent" />
                <span className="text-xs text-muted-soft w-10 text-right">{saturation}%</span>
              </div>
            </div>

            <div className="bg-surface border border-card-border rounded-xl p-4 flex justify-center overflow-hidden">
              <img ref={imgRef} src={image} alt="Preview" className="max-w-full max-h-96 rounded-lg object-contain" style={{ filter: fullFilter }} />
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
