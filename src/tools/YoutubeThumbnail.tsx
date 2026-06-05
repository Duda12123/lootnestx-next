"use client";
import { useState } from "react";
import { Film, Download, Image, ExternalLink } from "lucide-react";

function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:v=|\/)([\w-]{11})(?:[&?/]|$)/,
    /youtu\.be\/([\w-]{11})/,
    /embed\/([\w-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

const thumbSizes = [
  { label: "HD (1280×720)", key: "maxresdefault", w: 1280, h: 720 },
  { label: "SD (640×480)", key: "sddefault", w: 640, h: 480 },
  { label: "HQ (480×360)", key: "hqdefault", w: 480, h: 360 },
  { label: "MQ (320×180)", key: "mqdefault", w: 320, h: 180 },
  { label: "Default (120×90)", key: "default", w: 120, h: 90 },
];

export default function YoutubeThumbnail() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string>("");

  const extract = () => {
    const id = getYouTubeId(url);
    setVideoId(id);
  };

  const download = async (thumbUrl: string, key: string) => {
    setDownloading(key);
    try {
      const res = await fetch(thumbUrl);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `youtube-thumbnail-${videoId}-${key}.jpg`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      window.open(thumbUrl, "_blank");
    }
    setDownloading("");
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-1">YouTube Thumbnail Downloader</h1>
      <p className="text-muted mb-6">Download thumbnails from any YouTube video in all available resolutions. No login needed.</p>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">YouTube Video URL</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Film size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400" />
              <input value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && extract()} placeholder="https://www.youtube.com/watch?v=..." className="w-full bg-card-bg border border-card-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-accent" />
            </div>
            <button onClick={extract} className="px-6 py-3 bg-accent text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">Get Thumbnails</button>
          </div>
        </div>

        {videoId && (
          <>
            <div className="bg-surface border border-card-border rounded-xl overflow-hidden">
              <img src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} alt="Thumbnail" className="w-full" onError={(e) => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` }} />
            </div>

            <div className="space-y-2">
              {thumbSizes.map((t) => {
                const thumbUrl = `https://img.youtube.com/vi/${videoId}/${t.key}.jpg`;
                return (
                  <div key={t.key} className="flex items-center justify-between bg-card-bg border border-card-border rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Image size={18} className="text-muted-soft" />
                      <div>
                        <p className="font-medium text-sm">{t.label}</p>
                        <p className="text-xs text-muted-soft">{t.w}×{t.h}px</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a href={thumbUrl} target="_blank" className="px-3 py-1.5 rounded-lg bg-card-bg border border-card-border text-muted-soft hover:text-foreground transition-colors text-xs flex items-center gap-1">
                        <ExternalLink size={12} /> View
                      </a>
                      <button onClick={() => download(thumbUrl, t.key)} className="px-3 py-1.5 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition-colors text-xs flex items-center gap-1 font-medium">
                        {downloading === t.key ? "..." : <Download size={12} />}
                        Download
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
