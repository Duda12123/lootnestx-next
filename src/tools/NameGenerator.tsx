"use client";
import { useState, useCallback } from "react";
import { Shuffle, Copy, Check, RefreshCw } from "lucide-react";

const categories: Record<string, { prefixes: string[]; suffixes: string[]; adjectives: string[]; nouns: string[] }> = {
  "Baby Names": {
    prefixes: [],
    suffixes: [],
    adjectives: [],
    nouns: ["Liam", "Noah", "Oliver", "Emma", "Ava", "Sophia", "James", "Lucas", "Mia", "Isabella", "Ethan", "Mason", "Amelia", "Harper", "Evelyn", "Benjamin", "Alexander", "Charlotte", "Henry", "Ella"],
  },
  "Brand Names": {
    prefixes: ["Neo", "Zen", "Aero", "Vibe", "Flux", "Nova", "Echo", "Pixel", "Luna", "Solar"],
    suffixes: ["ly", "io", "ify", "ica", "ist", "ora", "ux", "ia", "eo", "ium"],
    adjectives: [],
    nouns: ["Peak", "Wave", "Core", "Grid", "Dots", "Mind", "Spark", "Beam", "Hive", "Root"],
  },
  "Pet Names": {
    prefixes: [],
    suffixes: [],
    adjectives: ["Fluffy", "Shadow", "Buddy", "Lucky", "Coco", "Max", "Daisy", "Rocky", "Luna", "Bella", "Charlie", "Milo", "Zoe", "Bailey", "Sadie", "Teddy", "Ollie", "Winston", "Nala", "Duke"],
    nouns: [],
  },
  "Usernames": {
    prefixes: ["x", "its", "real", "the", "im", "just", "hey", "official", "super", "mr"],
    suffixes: ["x", "xo", "ly", "_", "123", "456", "tv", "gaming", "irl", "dev"],
    adjectives: ["Cool", "Wild", "Epic", "Chill", "Lazy", "Crazy", "Happy", "Lucky", "Dark", "Fire"],
    nouns: ["Panda", "Wolf", "Tiger", "Bear", "Fox", "Eagle", "Shark", "Hawk", "Lion", "Dragon"],
  },
  "WiFi & Network Names": {
    prefixes: [],
    suffixes: [],
    adjectives: ["Pretty", "Fast", "5G", "FBI", "NSA", "Skynet", "Matrix", "Batcave", "Area51", "Avengers"],
    nouns: ["Fly", "Surveillance", "Van", "WiFi", "Network", "Tower", "Hub", "Router", "LAN", "Server"],
  },
};

function capitalize(w: string) { return w.charAt(0).toUpperCase() + w.slice(1); }

export default function NameGenerator() {
  const [category, setCategory] = useState("Brand Names");
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState("");

  const generate = useCallback(() => {
    const cat = categories[category];
    const names: string[] = [];
    for (let i = 0; i < 12; i++) {
      let name = "";
      if (category === "Baby Names" || category === "Pet Names") {
        const pool = category === "Baby Names" ? cat.nouns : cat.adjectives;
        name = pool[Math.floor(Math.random() * pool.length)];
      } else if (category === "WiFi & Network Names") {
        const adj = cat.adjectives[Math.floor(Math.random() * cat.adjectives.length)];
        const noun = cat.nouns[Math.floor(Math.random() * cat.nouns.length)];
        name = `${adj} ${noun}`;
      } else if (category === "Brand Names") {
        const styles = [
          () => cat.nouns[Math.floor(Math.random() * cat.nouns.length)] + cat.suffixes[Math.floor(Math.random() * cat.suffixes.length)],
          () => cat.prefixes[Math.floor(Math.random() * cat.prefixes.length)] + cat.nouns[Math.floor(Math.random() * cat.nouns.length)],
          () => cat.adjectives[Math.floor(Math.random() * cat.adjectives.length)] + cat.nouns[Math.floor(Math.random() * cat.nouns.length)],
        ];
        name = styles[Math.floor(Math.random() * styles.length)]();
        name = capitalize(name);
      } else {
        const styles = [
          () => cat.adjectives[Math.floor(Math.random() * cat.adjectives.length)] + cat.nouns[Math.floor(Math.random() * cat.nouns.length)],
          () => cat.prefixes[Math.floor(Math.random() * cat.prefixes.length)] + cat.adjectives[Math.floor(Math.random() * cat.adjectives.length)].toLowerCase() + cat.suffixes[Math.floor(Math.random() * cat.suffixes.length)],
          () => cat.nouns[Math.floor(Math.random() * cat.nouns.length)] + cat.suffixes[Math.floor(Math.random() * cat.suffixes.length)],
        ];
        name = styles[Math.floor(Math.random() * styles.length)]();
      }
      names.push(name);
    }
    setResults(names);
  }, [category]);

  const copy = async (name: string) => {
    await navigator.clipboard.writeText(name);
    setCopied(name);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-1">Name Generator</h1>
      <p className="text-muted mb-6">Generate names for babies, brands, pets, usernames, and WiFi networks. Click to copy!</p>

      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {Object.keys(categories).map((c) => (
            <button key={c} onClick={() => { setCategory(c); setResults([]); }} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${category === c ? "bg-accent text-white border-accent" : "bg-card-bg border-card-border text-muted hover:text-foreground"}`}>
              {c}
            </button>
          ))}
        </div>

        <button onClick={generate} className="w-full py-3 bg-card-bg border border-card-border rounded-xl text-muted hover:text-foreground hover:border-accent/30 transition-all text-sm font-medium flex items-center justify-center gap-2">
          <RefreshCw size={16} /> Generate {category}
        </button>

        {results.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {results.map((name, i) => (
              <button key={i} onClick={() => copy(name)} className="bg-card-bg border border-card-border rounded-xl px-4 py-3 text-left hover:border-accent/30 transition-all group flex items-center justify-between">
                <span className="font-medium">{name}</span>
                {copied === name ? <Check size={14} className="text-accent" /> : <Copy size={14} className="text-muted-soft opacity-0 group-hover:opacity-100 transition-opacity" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
