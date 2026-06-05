"use client";
import { useState, useRef, useCallback } from "react";
import { Video, Square, Download, Play, StopCircle, Monitor } from "lucide-react";

export default function ScreenRecorder() {
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };

      recorder.start();
      setRecording(true);
    } catch (err: any) {
      setError(err.message || "Screen recording is not supported or was denied.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const download = () => {
    if (!videoUrl) return;
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = `screen-recording-${Date.now()}.webm`;
    a.click();
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-1">Screen Recorder</h1>
      <p className="text-muted mb-6">Record your screen directly in the browser. No downloads, no extensions. Saves as WebM.</p>

      <div className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <p className="text-sm text-red-400">{error}</p>
            <p className="text-xs text-muted-soft mt-1">Make sure you&apos;re using Chrome, Edge, or Firefox and allow screen sharing when prompted.</p>
          </div>
        )}

        {!recording && !videoUrl && (
          <button onClick={startRecording} className="w-full py-16 rounded-xl border-2 border-dashed border-card-border hover:border-accent/30 transition-all flex flex-col items-center gap-4 group">
            <Monitor size={48} className="text-muted-soft group-hover:text-accent transition-colors" />
            <span className="text-muted group-hover:text-foreground transition-colors font-medium">Click to Start Recording</span>
            <span className="text-xs text-muted-soft">Choose a window, tab, or entire screen</span>
          </button>
        )}

        {recording && (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 font-medium">Recording...</span>
            </div>
            <button onClick={stopRecording} className="px-8 py-3 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors font-medium flex items-center gap-2 mx-auto">
              <Square size={18} /> Stop Recording
            </button>
          </div>
        )}

        {videoUrl && (
          <>
            <div className="bg-surface border border-card-border rounded-xl overflow-hidden">
              <video src={videoUrl} controls className="w-full" />
            </div>
            <div className="flex gap-2">
              <button onClick={download} className="flex-1 py-3 rounded-xl bg-accent text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <Download size={18} /> Download Video
              </button>
              <button onClick={() => { URL.revokeObjectURL(videoUrl!); setVideoUrl(null); }} className="px-6 py-3 rounded-xl bg-card-bg border border-card-border text-muted hover:text-foreground transition-colors">
                Record Again
              </button>
            </div>
            <p className="text-xs text-muted-soft text-center">Saved as WebM format. Convert to MP4 with our Image Format Converter or use a video editor.</p>
          </>
        )}
      </div>
    </div>
  );
}
