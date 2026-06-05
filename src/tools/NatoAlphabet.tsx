"use client";
import { useState } from "react";
import { Clipboard, Mic, Check } from "lucide-react";

const alphabet: Record<string, string> = {
  A: "Alpha", B: "Bravo", C: "Charlie", D: "Delta", E: "Echo",
  F: "Foxtrot", G: "Golf", H: "Hotel", I: "India", J: "Juliett",
  K: "Kilo", L: "Lima", M: "Mike", N: "November", O: "Oscar",
  P: "Papa", Q: "Quebec", R: "Romeo", S: "Sierra", T: "Tango",
  U: "Uniform", V: "Victor", W: "Whiskey", X: "X-ray", Y: "Yankee",
  Z: "Zulu",
  "0": "Zero", "1": "One", "2": "Two", "3": "Three", "4": "Four",
  "5": "Five", "6": "Six", "7": "Seven", "8": "Eight", "9": "Nine",
};

export default function NatoAlphabet() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const phonetic = text
    .toUpperCase()
    .split("")
    .filter((c) => alphabet[c])
    .map((c) => ({ letter: c, word: alphabet[c] }));

  const spellOut = phonetic.map((p) => `${p.letter} as in ${p.word}`).join(", ");

  const copy = async () => {
    await navigator.clipboard.writeText(spellOut || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-1">NATO Phonetic Alphabet</h1>
      <p className="text-muted mb-6">Spell words clearly over the phone. Type any text to see the phonetic spelling.</p>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-soft block mb-1 uppercase tracking-wider">Enter Text</label>
          <div className="relative">
            <Mic size={16} className="absolute left-3 top-3 text-muted-soft" />
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. your name or confirmation code"
              className="w-full bg-card-bg border border-card-border rounded-xl pl-10 pr-4 py-3 text-lg focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {phonetic.length > 0 && (
          <>
            <div className="bg-surface border border-card-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-soft uppercase tracking-wider">Phonetic Spelling</span>
                <button onClick={copy} className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors">
                  {copied ? <Check size={14} /> : <Clipboard size={14} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-foreground leading-relaxed">{spellOut}</p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {phonetic.map((p, i) => (
                <div key={i} className="bg-card-bg border border-card-border rounded-lg px-3 py-2 text-center min-w-[60px]">
                  <div className="text-lg font-bold text-accent">{p.letter}</div>
                  <div className="text-xs text-muted">{p.word}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {!text && (
          <div className="bg-card-bg border border-card-border rounded-xl p-4">
            <p className="text-xs text-muted-soft mb-3 uppercase tracking-wider">Full Alphabet Reference</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
              {Object.entries(alphabet).filter(([k]) => /[A-Z]/.test(k)).map(([letter, word]) => (
                <div key={letter} className="flex items-center gap-2 px-2 py-1.5 text-sm">
                  <span className="font-bold text-accent w-5">{letter}</span>
                  <span className="text-muted">{word}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
