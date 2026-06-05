"use client";
import { useState, useRef, useCallback } from "react";
import { Upload, Download, Type, Image as ImageIcon, Trash2 } from "lucide-react";

export default function ImageWatermark() {
  const [image, setImage] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState("© Your Brand");
  const [fontSize, setFontSize] = useState(32);
  const [opacity, setOpacity] = useState(30);
  const [position, setPosition] = useState("center");
  const [rotation, setRotation] = useState(-20);
  const [tile, setTile] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const positions: Record<string, (w: number, h: number, fw: number, fh: number) => { x: number; y: number }> = {
    "top-left": (w, h, fw, fh) => ({ x: fw / 2 + 20, y: fh + 20 }),
    "top-right": (w, h, fw, fh) => ({ x: w - fw / 2 - 20, y: fh + 20 }),
    "center": (w, h, fw, fh) => ({ x: w / 2, y: h / 2 }),
    "bottom-left": (w, h, fw, fh) => ({ x: fw / 2 + 20, y: h - 20 }),
    "bottom-right": (w, h, fw, fh) => ({ x: w - fw / 2 - 20, y: h - 20 }),
  };

  const applyWatermark = useCallback(() => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas || !watermarkText) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);

    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity / 100})`;
    ctx.strokeStyle = `rgba(0, 0, 0, ${opacity / 200})`;
    ctx.lineWidth = Math.max(1, fontSize / 16);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const w = canvas.width;
    const h = canvas.height;

    if (tile) {
      const spacingX = canvas.width / 5;
      const spacingY = canvas.height / 4;
      ctx.save();
      for (let x = spacingX / 2; x < w; x += spacingX) {
        for (let y = spacingY / 2; y < h; y += spacingY) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate((rotation * Math.PI) / 180);
          ctx.globalAlpha = opacity / 100;
          ctx.fillStyle = "rgba(255,255,255,0.7)";
          ctx.strokeStyle = "rgba(0,0,0,0.3)";
          ctx.strokeText(watermarkText, 0, 0);
          ctx.fillText(watermarkText, 0, 0);
          ctx.restore();
        }
      }
      ctx.restore();
    } else {
      const metrics = ctx.measureText(watermarkText);
      const fw = metrics.width;
      const fh = fontSize;
      const pos = positions[position] || positions.center;
      const { x, y } = pos(w, h, fw, fh);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.strokeText(watermarkText, 0, 0);
      ctx.fillText(watermarkText, 0, 0);
      ctx.restore();
    }
  }, [watermarkText, fontSize, opacity, position, rotation, tile]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "watermarked-image.png";
    a.click();
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Image Watermark Tool</h1>
      <p className="text-muted mb-6">Add text watermarks to your images. Protect your photos and brand assets with custom overlays.</p>

      <div className="space-y-4">
        {!image ? (
          <div className="border-2 border-dashed border-card-border rounded-xl p-12 text-center hover:border-accent/30 transition-colors">
            <label className="cursor-pointer">
              <ImageIcon size={40} className="mx-auto text-muted-soft mb-4" />
              <p className="text-muted mb-1 font-medium">Upload an image to watermark</p>
              <p className="text-xs text-muted-soft">JPG, PNG, WebP</p>
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label>
          </div>
        ) : (
          <>
            <div className="flex gap-2 items-center">
              <label className="px-3 py-1.5 rounded-lg bg-card-bg border border-card-border text-xs text-muted hover:text-foreground transition-colors cursor-pointer flex items-center gap-1">
                <Upload size={12} /> Change Image
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
            </div>

            <div>
              <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">Watermark Text</label>
              <div className="relative">
                <Type size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-soft" />
                <input value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} className="w-full bg-card-bg border border-card-border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-soft block mb-1">Font Size: {fontSize}px</label>
                <input type="range" min={12} max={80} value={fontSize} onChange={(e) => setFontSize(+e.target.value)} className="w-full accent-accent" />
              </div>
              <div>
                <label className="text-xs text-muted-soft block mb-1">Opacity: {opacity}%</label>
                <input type="range" min={5} max={100} value={opacity} onChange={(e) => setOpacity(+e.target.value)} className="w-full accent-accent" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-soft block mb-1">Rotation: {rotation}°</label>
                <input type="range" min={-90} max={90} value={rotation} onChange={(e) => setRotation(+e.target.value)} className="w-full accent-accent" />
              </div>
              <div>
                <label className="text-xs text-muted-soft block mb-1">Position</label>
                <select value={position} onChange={(e) => { setPosition(e.target.value); setTile(false); }} className="w-full bg-card-bg border border-card-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent">
                  {Object.keys(positions).map((p) => <option key={p} value={p}>{p.replace("-", " ")}</option>)}
                </select>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={tile} onChange={(e) => setTile(e.target.checked)} className="accent-accent" />
              <span className="text-sm text-muted">Tile watermark across image</span>
            </label>

            <div className="flex gap-2">
              <button onClick={applyWatermark} className="flex-1 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity">Apply Watermark</button>
              <button onClick={download} className="px-6 py-2 rounded-xl bg-card-bg border border-card-border text-muted hover:text-foreground transition-colors text-sm flex items-center gap-2">
                <Download size={16} /> Download
              </button>
            </div>

            <div className="bg-surface border border-card-border rounded-xl p-4 flex justify-center overflow-hidden">
              <img ref={imgRef} src={image} alt="Preview" className="max-w-full max-h-80 rounded-lg object-contain" />
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
