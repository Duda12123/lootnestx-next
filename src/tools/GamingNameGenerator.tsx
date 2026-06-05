"use client";
import { useState, useCallback } from "react";
import { Gamepad2, Copy, Check, RefreshCw, Sword, Zap, Skull, Star } from "lucide-react";

const styles = [
  { id: "cool", label: "Cool", icon: Star },
  { id: "aggressive", label: "Aggressive", icon: Skull },
  { id: "funny", label: "Funny", icon: Zap },
  { id: "fantasy", label: "Fantasy", icon: Sword },
];

const wordPools: Record<string, { adjectives: string[]; nouns: string[]; prefixes: string[]; suffixes: string[] }> = {
  cool: {
    adjectives: ["Shadow", "Ghost", "Phantom", "Blaze", "Storm", "Frost", "Venom", "Raven", "Onyx", "Crystal", "Neon", "Cyber", "Nitro", "Chaos", "Savage"],
    nouns: ["Walker", "Strike", "King", "Ace", "Hawk", "Wolf", "Slayer", "Hunter", "Master", "Lord", "Knight", "Elite", "Beast", "Demon", "Phoenix"],
    prefixes: ["xX", "Its", "OG"],
    suffixes: ["Xx", "TV", "YT", "_TTV", "FN"],
  },
  aggressive: {
    adjectives: ["Rage", "Brutal", "Savage", "Killer", "Bloody", "Wicked", "Vicious", "Fury", "Wrath", "Doom", "Toxic", "Rampage", "Maniac", "Fear", "Crush"],
    nouns: ["Destroyer", "Reaper", "Butcher", "Murder", "Executer", "Obliterator", "Punisher", "Annihilator", "Crusher", "Dominator", "Ravager", "Decimator", "Smasher", "Bane", "Breaker"],
    prefixes: [],
    suffixes: ["TTV", "TV", "YT", "live"],
  },
  funny: {
    adjectives: ["Salty", "Goofy", "Sweaty", "Clumsy", "Noob", "Derpy", "Chunky", "Wobbly", "Sloppy", "Dank", "Sussy", "Cringe", "Yeet", "Busted", "Laggy"],
    nouns: ["Potato", "Noodle", "Socks", "Burrito", "Pickle", "Turtle", "Ducky", "Waffle", "Bacon", "Nugget", "Panda", "Muffin", "Toast", "Donut", "Meatball"],
    prefixes: ["Not", "DefinitelyNot", "xX"],
    suffixes: ["Xx", "lol", "xD", "uwu"],
  },
  fantasy: {
    adjectives: ["Arcane", "Elder", "Dark", "Silver", "Iron", "Crimson", "Frost", "Shadow", "Mystic", "Ancient", "Dragon", "Eternal", "Celestial", "Forgotten", "Astral"],
    nouns: ["Mage", "Knight", "Paladin", "Sorcerer", "Rogue", "Warden", "Druid", "Warlock", "Sage", "Warrior", "Guardian", "Sentinel", "Titan", "Prophet", "Loremaster"],
    prefixes: ["Lord", "Sir", "Lady", "King"],
    suffixes: ["of Aethel", "the Wise", "the Brave", "of Eldoria"],
  },
};

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

export default function GamingNameGenerator() {
  const [style, setStyle] = useState("cool");
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState("");

  const generate = useCallback(() => {
    const pool = wordPools[style];
    const names: string[] = [];
    for (let i = 0; i < 15; i++) {
      const patterns = [
        () => pick(pool.adjectives) + pick(pool.nouns),
        () => pick(pool.adjectives) + "_" + pick(pool.nouns),
        () => pick(pool.adjectives) + pick(pool.adjectives),
        () => (pool.prefixes.length ? pick(pool.prefixes) + pick(pool.nouns) : pick(pool.adjectives) + pick(pool.nouns)),
        () => pick(pool.nouns) + (pool.suffixes.length ? pick(pool.suffixes) : ""),
        () => pick(pool.nouns) + Math.floor(Math.random() * 999),
      ];
      let name = pick(patterns)();
      while (names.includes(name)) name = pick(patterns)();
      names.push(name);
    }
    setResults(names);
  }, [style]);

  const copy = async (name: string) => {
    await navigator.clipboard.writeText(name);
    setCopied(name);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-1">Gaming Name Generator</h1>
      <p className="text-muted mb-6">Generate unique gamer tags for Xbox, PlayStation, Twitch, Steam, and Discord.</p>

      <div className="space-y-4">
        <div className="flex gap-2">
          {styles.map((s) => {
            const Icon = s.icon;
            return (
              <button key={s.id} onClick={() => { setStyle(s.id); setResults([]); }} className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-colors flex items-center justify-center gap-2 ${style === s.id ? "bg-accent text-white border-accent" : "bg-card-bg border-card-border text-muted hover:text-foreground"}`}>
                <Icon size={16} /> {s.label}
              </button>
            );
          })}
        </div>

        <button onClick={generate} className="w-full py-3 bg-card-bg border border-card-border rounded-xl text-muted hover:text-foreground hover:border-accent/30 transition-all text-sm font-medium flex items-center justify-center gap-2">
          <Gamepad2 size={18} /> Generate Gamertags
        </button>

        {results.length > 0 && (
          <div className="space-y-2">
            {results.map((name, i) => (
              <button key={i} onClick={() => copy(name)} className="w-full bg-card-bg border border-card-border rounded-xl px-4 py-3 text-left hover:border-accent/30 transition-all group flex items-center justify-between">
                <span className="font-mono font-bold text-lg">{name}</span>
                {copied === name ? <Check size={16} className="text-accent shrink-0" /> : <Copy size={16} className="text-muted-soft opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
