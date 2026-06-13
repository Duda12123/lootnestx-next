"use client"

import { useState, useCallback } from "react"
import { RefreshCw, Copy, Check, Sparkles } from "lucide-react"

// ─── Story data pools ──────────────────────────────────────────────

const genres = [
  { id: "fantasy", label: "Fantasy", emoji: "🧙" },
  { id: "scifi", label: "Sci-Fi", emoji: "🚀" },
  { id: "mystery", label: "Mystery", emoji: "🔍" },
  { id: "romance", label: "Romance", emoji: "💕" },
  { id: "horror", label: "Horror", emoji: "👻" },
  { id: "comedy", label: "Comedy", emoji: "😂" },
  { id: "adventure", label: "Adventure", emoji: "🗺️" },
  { id: "drama", label: "Drama", emoji: "🎭" },
]

const characters: Record<string, string[]> = {
  fantasy: ["a reluctant hero", "a banished noble", "a young apprentice mage", "a shapeshifter in hiding", "a disgraced knight", "an elf outcast", "a dragon in human form", "a prophecy-marked child", "a wandering bard", "a fallen god seeking redemption"],
  scifi: ["a starship engineer", "an AI with emotions", "the last human biologist", "a space miner on the edge", "a quantum hacker", "a terraformer on Mars", "a time-displaced astronaut", "a cybernetically enhanced soldier", "a galactic diplomat", "an android who dreams"],
  mystery: ["a retired detective", "a skeptical journalist", "a librarian with secrets", "a small-town sheriff", "an amateur sleuth", "a forensic accountant", "a locked-room survivor", "a true crime podcaster", "a security guard who sees too much", "an insurance fraud investigator"],
  romance: ["a baker who doesn't believe in love", "a wedding planner falling for the best man", "two rivals forced to share an office", "a travel blogger and the local guide", "a musician and the one who got away", "a coffee shop owner and the regular customer", "an arranged marriage to save a kingdom", "two exes stuck in an airport lounge", "a fake dating scheme gone too real", "a firefighter and the artist next door"],
  horror: ["a night shift security guard", "a paranormal investigator on their last case", "a camper in the wrong woods", "a family moving into a house with history", "a deep sea diver at the Marianas Trench", "a babysitter on a stormy night", "a hiker who wandered off the trail", "a researcher at an Antarctic station", "a passenger on a derelict spaceship", "a person who answers a cursed message"],
  comedy: ["a slacker who accidentally becomes CEO", "a competitive pancake chef", "a ghost who refuses to haunt properly", "a dog that can suddenly talk (but only sarcasm)", "a medieval knight time-traveling to a mall", "a suburban dad starting a boy band", "a computer virus that develops anxiety", "a weatherman who can't predict anything right", "a professional nap tester", "an alien learning Earth customs from reality TV"],
  adventure: ["a treasure hunter with a broken compass", "a cartographer mapping uncharted lands", "a smuggler in the Amazon rainforest", "a deep cave explorer running out of rope", "a desert nomad tracking a lost city", "a smuggler in the Andes", "a pirate with a moral compass", "a wildlife photographer on the wrong safari", "a solo sailor circumnavigating the globe", "a mountain climber during an avalanche"],
  drama: ["a prodigy pianist losing their hearing", "a CEO who lost everything in one day", "a foster child aging out of the system", "a war photographer returning home", "an Olympic athlete's final season", "a teacher at an underfunded school", "a refugee starting over in a new country", "a boxer's last fight", "a mother fighting for custody", "an artist with one exhibition left"],
}

const settings: Record<string, string[]> = {
  fantasy: ["a floating city held by magic chains", "a forest where trees whisper prophecies", "the court of the Winter King", "a desert of glass and memory", "a crumbling lighthouse at the edge of the world", "a kingdom without shadows", "a mountain that bleeds moonlight", "the library of unwritten books", "a river that flows backward through time", "a market where memories are currency"],
  scifi: ["a generation ship at its breaking point", "a mining colony on a dying planet", "a space station orbiting a black hole", "an underwater city on Europa", "a virtual reality that's become reality", "a terraformed Mars colony in revolt", "a derelict alien megastructure", "a laboratory at the edge of known physics", "a world where time runs backward", "a data haven in near-Earth orbit"],
  mystery: ["a mansion sealed after the murder", "a small town where everyone has secrets", "an abandoned amusement park", "a silent monastery in the mountains", "a theater company's cursed production", "a cruise ship with a vanishing passenger", "a hotel room that shouldn't exist", "a museum after dark", "a retirement home with suspiciously high mortality", "a book club where members keep dying"],
  romance: ["a small town bookshop at Christmas", "a crumbling Tuscan villa needing restoration", "a secluded mountain cabin during a blizzard", "a wedding in a Scottish castle gone wrong", "a Parisian rooftop at sunset", "a summer music festival in the countryside", "a cruise through the Greek islands", "a farmers' market in a cozy small town", "a world-famous museum's gala night", "a sleepy coastal town off-season"],
  horror: ["an abandoned asylum with fresh footprints", "a corn maze that changes at night", "a fog-bound lighthouse with no crew", "a basement that's one room larger inside", "a forgotten subway station on the last train", "a remote island with no ferry schedule", "a hospital ward that doesn't appear on floor plans", "a boarded-up house with lights inside", "a forest where people go to forget", "an escape room that becomes real"],
  comedy: ["a theme park with broken animatronics", "a retirement village with a wild nightlife", "a reality show set in a medieval reenactment", "an IKEA after closing hours", "a space station with a faulty gravity generator", "a cruise ship comedy competition gone rogue", "a suburban homeowners association from hell", "a virtual meeting where glitches are sentient", "a very confused DMV office", "a wedding that's perfectly planned except everything goes wrong"],
  adventure: ["the lost city of gold hidden in the Andes", "a chain of volcanic islands with no maps", "the depths of the Borneo jungle", "a frozen wasteland with ancient ruins", "the Great Barrier Reef with a secret tunnel", "the Sahara desert following a star map", "a forbidden valley in the Himalayas", "the Amazon river during flood season", "a labyrinth of caves beneath Cappadocia", "the Mongolian steppe chasing a legend"],
  drama: ["a recording studio in 1970s New York", "a New York City ballet company in crisis", "a courtroom with everything at stake", "the dugout of a championship baseball team", "a family farm about to be foreclosed", "a publishing house on its last book", "a hospital's emergency room on New Year's Eve", "a theater on opening night when the lead quits", "a law office representing an impossible case", "a fire station during the worst wildfire season"],
}

const conflicts: Record<string, string[]> = {
  fantasy: ["must find a cure before the moon turns red", "discovers the royal line is built on a lie", "is hunted for a power they never asked for", "must unite impossible enemies before the eternal night", "finds the source of magic is dying", "must escape a labyrinth that rewrites itself", "carries a curse that's spreading to those they love", "discovers their greatest ally is their greatest enemy", "must win a tournament where losing means death", "finds a door to a world that's already dead"],
  scifi: ["discovers the mission was a lie", "is running out of oxygen with no rescue in sight", "detects a signal that shouldn't exist", "realizes the AI has been hiding the truth for decades", "finds a stowaway from a dead civilization", "must reboot the life support system blindfolded", "discovers everyone has been in cryo too long", "receives a distress call from a ship that vanished centuries ago", "calculates the probability of survival is zero", "finds Earth has gone silent"],
  mystery: ["finds a clue that points to themselves", "the only witness refuses to talk", "every suspect has an airtight alibi — except one", "the crime scene has been staged to mislead", "the victim left a final message in code", "the detective's own past is connected to the case", "the evidence keeps disappearing", "a serial confession: someone keeps confessing to the crime", "the murder weapon is impossible to find", "the case was closed 20 years ago — and that's the problem"],
  romance: ["their ex is the wedding officiant", "they promised to marry someone else tomorrow", "they're moving to another continent next week", "their families have a generations-old feud", "they're secretly competing for the same job", "one of them doesn't believe in marriage", "they're pen pals who've never met — and one is hiding their identity", "they're stuck in a contract marriage with a 1-year clause", "they fell in love with a hologram", "they can only communicate through a dating app profile"],
  horror: ["it's been watching the house for three days", "the mirror shows a reflection that doesn't follow", "a voice on the baby monitor whispers in a dead language", "the thing in the basement is getting closer", "every photo from the trip has one extra person", "the door that was nailed shut is now open", "the previous tenant never actually left", "a pattern appears under UV light — it's a message", "the nightmares are happening while they're awake", "something is writing their name in dust"],
  comedy: ["must win a cooking competition with no culinary skills", "accidentally becomes mayor of a very confused town", "their AI assistant starts giving terrible life advice", "tries to impress a date by pretending to be an expert — in the wrong field", "inherits a mansion that's literally falling apart", "joins a cult by accident and becomes the leader", "their pet becomes an internet celebrity against all odds", "tries to quit their job but keeps getting promoted", "a misunderstanding spirals into an international incident", "their new neighbor is way too friendly — and way too organized"],
  adventure: ["the map is a forgery — but the treasure is real", "a rival expedition is three days ahead with better gear", "the only guide just disappeared into the jungle", "the artifact is real, but it's cursed", "a storm destroyed the camp and half the supplies", "a stranger joins the expedition with their own agenda", "they must cross a border warzone to reach the site", "the locals warn it's sacred ground — the team goes anyway", "the treasure has been found — by someone else", "the prize isn't gold. It's something far more dangerous"],
  drama: ["discovers a betrayal that changes everything", "must make an impossible choice by midnight", "the truth will destroy someone they love", "they have one chance to fix a 20-year mistake", "a secret from their past walks through the door", "they earned the promotion — but at what cost", "the person they trusted most just lied under oath", "they find a letter that should have been burned", "everyone is counting on them, and they're about to break", "they get a second chance — but there are strings attached"],
}

const tones = ["Dark & Gritty", "Light & Whimsical", "Suspenseful & Tense", "Heartwarming", "Bittersweet", "Epic & Grand", "Witty & Sharp", "Moody & Atmospheric", "Fast-paced & Thrilling", "Slow-burn & Reflective"]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

interface StoryPremise {
  genre: string
  genreEmoji: string
  character: string
  setting: string
  conflict: string
  tone: string
}

function generatePremise(genreId?: string): StoryPremise {
  const g = genreId ? genres.find(g => g.id === genreId) ?? pick(genres) : pick(genres)
  return {
    genre: g.label,
    genreEmoji: g.emoji,
    character: pick(characters[g.id]),
    setting: pick(settings[g.id]),
    conflict: pick(conflicts[g.id]),
    tone: pick(tones),
  }
}

const titlePrefixes = [
  "The Tale of", "Chronicles of the", "The Secret of", "The Last", "The Legend of",
  "Beyond the", "Return to", "The Curse of", "The Shadow of", "The Heart of",
  "Echoes of", "The Price of", "Children of the", "The Silence of", "The Song of",
  "The Fall of", "The Rise of the", "Daughter of", "Son of", "The Spirit of",
]

const titleSuffixes = [
  "Storm", "Lost Kingdom", "Forgotten Shore", "Eternal Flame", "Crimson Tide",
  "Shattered Crown", "Hollow Crown", "Silent World", "Burning Sky", "Iron Gate",
  "Frozen Heart", "Broken Oath", "Golden Compass", "Silver River", "Darkened Star",
  "Last Refuge", "Ancient City", "Hidden Truth", "Final Hour", "Quiet War",
]

function generateTitle(premise: StoryPremise): string {
  const prefix = pick(titlePrefixes)
  const suffix = pick(titleSuffixes)
  return `${prefix} the ${suffix}`
}

// ─── Component ─────────────────────────────────────────────────────

export default function StoryGenerator() {
  const [premise, setPremise] = useState<StoryPremise>(() => generatePremise())
  const [title, setTitle] = useState(() => generateTitle(premise))
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>()
  const [copied, setCopied] = useState(false)
  const [spinning, setSpinning] = useState(false)

  const regenerate = useCallback(() => {
    setSpinning(true)
    setTimeout(() => {
      const p = generatePremise(selectedGenre)
      setPremise(p)
      setTitle(generateTitle(p))
      setSpinning(false)
    }, 350)
  }, [selectedGenre])

  const regeneratePart = useCallback((part: keyof StoryPremise) => {
    const gId = genres.find(g => g.label === premise.genre)?.id ?? "fantasy"
    if (part === "genre") {
      const newG = pick(genres.filter(g => g.id !== gId))
      const p: StoryPremise = {
        genre: newG.label,
        genreEmoji: newG.emoji,
        character: pick(characters[newG.id]),
        setting: pick(settings[newG.id]),
        conflict: pick(conflicts[newG.id]),
        tone: premise.tone,
      }
      setPremise(p)
      setTitle(generateTitle(p))
      return
    }
    const pool = part === "character" ? characters[gId]
      : part === "setting" ? settings[gId]
      : part === "conflict" ? conflicts[gId]
      : tones
    const current = premise[part]
    const filtered = pool.filter(v => v !== current)
    if (filtered.length === 0) { regenerate(); return }
    setPremise(prev => ({ ...prev, [part]: pick(filtered) }))
  }, [premise, regenerate])

  const copyStory = useCallback(async () => {
    const text = `${title}\n\nGenre: ${premise.genre}\nTone: ${premise.tone}\n\nCharacter: ${premise.character}\nSetting: ${premise.setting}\nConflict: ${premise.conflict}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [premise, title])

  const selectGenre = useCallback((id: string) => {
    setSelectedGenre(prev => prev === id ? undefined : id)
    setSpinning(true)
    setTimeout(() => {
      const p = generatePremise(id)
      setPremise(p)
      setTitle(generateTitle(p))
      setSpinning(false)
    }, 350)
  }, [])

  return (
    <div className="space-y-6">
      {/* Genre selector */}
      <div className="flex flex-wrap gap-2">
        {genres.map(g => (
          <button
            key={g.id}
            onClick={() => selectGenre(g.id)}
            className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
              selectedGenre === g.id
                ? "bg-accent text-white"
                : "bg-card-bg/50 text-muted hover:bg-card-bg hover:text-foreground border border-card-border"
            }`}
          >
            {g.emoji} {g.label}
          </button>
        ))}
        {selectedGenre && (
          <button
            onClick={() => selectGenre(genres[0].id)}
            className="rounded-lg px-3 py-1.5 text-xs text-muted-soft hover:text-muted transition-colors"
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Title */}
      <div className={`rounded-xl border border-card-border bg-card-bg/30 p-6 text-center transition-opacity ${spinning ? "opacity-50" : "opacity-100"}`}>
        <div className="text-5xl mb-3">{premise.genreEmoji}</div>
        <h3 className="text-xl sm:text-2xl font-bold mb-2">{title}</h3>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-soft">
          <span>{premise.genre}</span>
          <span>·</span>
          <span>{premise.tone}</span>
        </div>
      </div>

      {/* Story premise cards */}
      <div className="grid gap-3">
        {[
          { label: "Character", key: "character" as const, value: premise.character },
          { label: "Setting", key: "setting" as const, value: premise.setting },
          { label: "Conflict", key: "conflict" as const, value: premise.conflict },
        ].map(item => (
          <div key={item.key} className="flex items-start gap-3 rounded-lg border border-card-border bg-card-bg/20 p-4 group hover:bg-card-bg/40 transition-colors">
            <div className="min-w-0 flex-1">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-soft">{item.label}</span>
              <p className="mt-0.5 text-sm sm:text-base">{item.value}</p>
            </div>
            <button
              onClick={() => regeneratePart(item.key)}
              className="shrink-0 rounded-md p-1.5 text-muted-soft opacity-0 group-hover:opacity-100 hover:text-accent hover:bg-accent/10 transition-all"
              title={`Regenerate ${item.label}`}
            >
              <RefreshCw size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 justify-center pt-2">
        <button
          onClick={regenerate}
          disabled={spinning}
          className="flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-all disabled:opacity-50"
        >
          <Sparkles size={16} className={spinning ? "animate-spin" : ""} />
          Generate New Story
        </button>
        <button
          onClick={copyStory}
          className="flex items-center gap-2 rounded-lg border border-card-border px-5 py-2.5 text-sm text-muted hover:bg-card-bg hover:text-foreground transition-colors"
        >
          {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          {copied ? "Copied!" : "Copy Story Idea"}
        </button>
      </div>

      {/* Writing prompts */}
      <details className="rounded-lg border border-card-border bg-card-bg/10 p-4 group open:bg-card-bg/20 transition-all">
        <summary className="cursor-pointer text-sm font-medium text-muted-soft hover:text-foreground transition-colors select-none">
          💡 Writing Prompts &amp; Follow-up Questions
        </summary>
        <div className="mt-3 space-y-2 text-sm text-muted">
          <p>• What does your {premise.character} want more than anything — and why can&apos;t they have it?</p>
          <p>• Who or what is standing in their way, and what&apos;s that antagonist&apos;s motivation?</p>
          <p>• What&apos;s the first scene? Drop us right into {premise.setting}.</p>
          <p>• What secret will your character discover by the midpoint of the story?</p>
          <p>• How does the ending reflect — or subvert — the {premise.tone.toLowerCase()} tone?</p>
        </div>
      </details>
    </div>
  )
}
