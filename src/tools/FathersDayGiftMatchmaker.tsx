"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { ChevronRight, ChevronLeft, Share2, Copy, Check, Gift, Clock } from "lucide-react"

// ─── Questions ───

const questions = [
  {
    id: "personality",
    emoji: "🧔",
    question: "How would you describe your dad's personality?",
    hint: "Pick the one that fits best.",
    options: [
      { emoji: "🔧", label: "The DIY Master", value: "diy", desc: "Always fixing, building, or tinkering" },
      { emoji: "💻", label: "The Tech Geek", value: "tech", desc: "First in line for new gadgets and smart home stuff" },
      { emoji: "🏈", label: "The Sports Fanatic", value: "sports", desc: "Never misses a game, knows every stat" },
      { emoji: "🍖", label: "The Grill King", value: "grill", desc: "Weekends = grilling, smoking, perfecting BBQ" },
      { emoji: "🎸", label: "The Cool Dad", value: "cool", desc: "Into music, style, and stays young at heart" },
      { emoji: "📚", label: "The Intellectual", value: "intellectual", desc: "Loves reading, learning, deep conversations" },
    ],
  },
  {
    id: "budget",
    emoji: "💰",
    question: "What's your budget for Father's Day?",
    hint: "We'll tailor recommendations to your range.",
    options: [
      { emoji: "💵", label: "Under $25", value: "budget", desc: "Thoughtful but affordable" },
      { emoji: "💵💵", label: "$25 – $50", value: "mid", desc: "Quality without breaking the bank" },
      { emoji: "💵💵💵", label: "$50 – $100", value: "premium", desc: "Something really special" },
      { emoji: "💎", label: "$100+", value: "luxury", desc: "Go big or go home" },
    ],
  },
  {
    id: "activity",
    emoji: "🎯",
    question: "What does your dad love to do in his free time?",
    hint: "His favorite weekend activity says a lot.",
    options: [
      { emoji: "🏕️", label: "Outdoor Adventures", value: "outdoor", desc: "Hiking, camping, fishing, exploring" },
      { emoji: "🎮", label: "Gaming & Entertainment", value: "gaming", desc: "Video games, movies, streaming" },
      { emoji: "🍳", label: "Cooking & Food", value: "cooking", desc: "Trying recipes, foodie adventures" },
      { emoji: "🚗", label: "Cars & Garage Projects", value: "auto", desc: "Working on the car, detailing" },
      { emoji: "🛋️", label: "Relaxing at Home", value: "relax", desc: "Comfort first — lounging, reading, napping" },
    ],
  },
  {
    id: "gift_style",
    emoji: "🎨",
    question: "What kind of gift would your dad appreciate most?",
    hint: "Think about what would make him smile.",
    options: [
      { emoji: "⚡", label: "Something practical he'll use daily", value: "practical", desc: "Function over form" },
      { emoji: "✨", label: "Something unique and novel", value: "novel", desc: "Weird, wonderful, conversation-starting" },
      { emoji: "🎭", label: "An experience or activity", value: "experience", desc: "Tickets, subscriptions, memories" },
      { emoji: "🖐️", label: "Something handmade or personalized", value: "personalized", desc: "Custom engraved, photo gifts" },
    ],
  },
  {
    id: "worldcup",
    emoji: "⚽",
    question: "Is your dad into the FIFA World Cup 2026?",
    hint: "The biggest sporting event is happening right now!",
    options: [
      { emoji: "🏆", label: "Absolutely obsessed!", value: "wcup_huge", desc: "Counting down days, watching every match" },
      { emoji: "👍", label: "Casually interested", value: "wcup_casual", desc: "Catches games but not rearranging schedule" },
      { emoji: "🤷", label: "Not really his thing", value: "wcup_no", desc: "Sports aren't his main interest" },
    ],
  },
]

// ─── Gift Database ───

interface Gift {
  icon: string; name: string; desc: string; tags: string[]; budget: string
}

const giftDatabase: Record<string, Gift[]> = {
  diy: [
    { icon: "🔩", name: "Smart Multi-Tool Pen Set", desc: "CNC-machined EDC pen with built-in screwdriver bits, level, ruler, and stylus tip. The ultimate dad tool.", tags: ["EDC", "Tools", "Gadget"], budget: "mid" },
    { icon: "🔦", name: "Magnetic Wristband Tool Holder", desc: "Strong neodymium magnets hold screws, bits, and small tools right on dad's wrist while he works.", tags: ["Workshop", "Practical", "Novelty"], budget: "budget" },
    { icon: "🏗️", name: "3D Printing Pen Pro", desc: "Let dad draw in 3D! Great for prototyping, repairs, and creative projects around the house.", tags: ["Creative", "Tech", "DIY"], budget: "premium" },
    { icon: "🪛", name: "Precision Electric Screwdriver Kit", desc: "142-in-1 magnetic bit set with USB-C rechargeable driver. Dad will wonder how he lived without it.", tags: ["Tools", "Best Seller", "Practical"], budget: "mid" },
  ],
  tech: [
    { icon: "🤖", name: "AI-Powered Smart Home Hub", desc: "Voice-controlled hub with ChatGPT integration — controls lights, plays music, and answers questions.", tags: ["Smart Home", "AI", "2026 Trend"], budget: "premium" },
    { icon: "⌚", name: "Health-Monitoring Smart Ring", desc: "Sleek titanium ring that tracks sleep, heart rate, stress, and activity. No screen, just insights.", tags: ["Wearable", "Health", "Sleek"], budget: "premium" },
    { icon: "🔋", name: "MagSafe 3-in-1 Charging Station", desc: "Floating magnetic charger for phone, watch, and earbuds. A clean desk aesthetic dad will appreciate.", tags: ["Desk", "Practical", "Apple"], budget: "mid" },
    { icon: "🖥️", name: "Portable Ultra-Short Throw Projector", desc: "Pocket-sized 4K projector for instant movie nights anywhere. Dad becomes the neighborhood hero.", tags: ["Entertainment", "Portable", "Novelty"], budget: "luxury" },
  ],
  sports: [
    { icon: "⚽", name: "World Cup 2026 Official Match Ball Replica", desc: "The exact OCEAUNZ match ball design used in FIFA World Cup 2026. A collector's piece.", tags: ["World Cup 2026", "Collectible", "Official"], budget: "premium" },
    { icon: "📺", name: "Portable Outdoor TV Projector", desc: "Watch the World Cup or Sunday football in the backyard. 200\" screen, weather-resistant.", tags: ["Outdoor", "Sports", "Entertainment"], budget: "luxury" },
    { icon: "🎽", name: "Smart Fitness Tracker Jersey", desc: "Moisture-wicking athletic shirt with embedded sensors that track performance metrics in real-time.", tags: ["Wearable", "Fitness", "Innovation"], budget: "mid" },
    { icon: "🏟️", name: "Stadium Seat Cushion with Cooler", desc: "Memory foam seat with built-in insulated cooler compartment. Game day essential.", tags: ["Tailgate", "Practical", "Novelty"], budget: "budget" },
  ],
  grill: [
    { icon: "🌡️", name: "Wireless Smart Meat Thermometer", desc: "Bluetooth 4-probe thermometer with AI doneness prediction. Never overcook a steak again.", tags: ["BBQ", "Smart", "Kitchen"], budget: "mid" },
    { icon: "🔥", name: "Infrared Smokeless Indoor Grill", desc: "Restaurant-grade searing at 1500°F with zero smoke. Year-round grilling, rain or shine.", tags: ["Indoor", "Premium", "Cooking"], budget: "luxury" },
    { icon: "🧤", name: "Heat-Resistant Grill Gloves with LED", desc: "Silicone gloves rated to 932°F with built-in LED lights for nighttime grilling.", tags: ["BBQ", "Practical", "Novelty"], budget: "budget" },
    { icon: "🧂", name: "Artisan Spice Rub Subscription Box", desc: "Monthly delivery of small-batch, globally-inspired spice rubs. Dad becomes a flavor wizard.", tags: ["Subscription", "Foodie", "Monthly"], budget: "mid" },
  ],
  cool: [
    { icon: "🎧", name: "Retro-Futuristic Vinyl Record Player", desc: "Bluetooth turntable with transparent platter and RGB edge lighting. Vintage meets cyberpunk.", tags: ["Music", "Aesthetic", "Novelty"], budget: "premium" },
    { icon: "🕶️", name: "AI Audio Sunglasses", desc: "Ray-Ban style frames with bone conduction audio, voice assistant, and open-ear design.", tags: ["Wearable", "Audio", "Style"], budget: "premium" },
    { icon: "🎸", name: "Pocket Digital Guitar Trainer", desc: "Clip-on device that teaches chords, scales, and songs via LED fretboard visualization.", tags: ["Music", "Learning", "Innovation"], budget: "mid" },
    { icon: "👟", name: "Self-Lacing Smart Sneakers", desc: "Auto-lacing shoes with app-controlled fit and color-changing LED soles. Dad walks into the future.", tags: ["Footwear", "Tech", "Showstopper"], budget: "luxury" },
  ],
  intellectual: [
    { icon: "📖", name: "E-Ink Digital Notebook Pro", desc: "Remarkable tablet with paper-like feel — notes, sketches, PDFs. Distraction-free thinking.", tags: ["Productivity", "Minimal", "Premium"], budget: "premium" },
    { icon: "🌍", name: "3D Antique Globe with Augmented Reality", desc: "Scan the globe with your phone to reveal historical maps, country facts, and travel stories.", tags: ["Decor", "Education", "Interactive"], budget: "mid" },
    { icon: "☕", name: "Precision Temperature Control Mug", desc: "App-controlled smart mug that keeps coffee at your exact preferred temperature for hours.", tags: ["Desk", "Practical", "Gadget"], budget: "mid" },
    { icon: "🎓", name: "MasterClass Annual Membership", desc: "Learn from world experts — cooking, writing, science, music. Feed dad's endless curiosity.", tags: ["Experience", "Learning", "Subscription"], budget: "premium" },
  ],
  outdoor: [
    { icon: "🏕️", name: "Solar-Powered Portable Power Station", desc: "Compact 500Wh battery with foldable solar panel. Keep everything charged off-grid.", tags: ["Camping", "Solar", "Practical"], budget: "premium" },
    { icon: "🔭", name: "Smartphone-Connected Telescope", desc: "Point at the sky and the app identifies stars, planets, and constellations in real-time.", tags: ["Stargazing", "Tech", "Experience"], budget: "mid" },
    { icon: "🦟", name: "Wearable Mosquito Repellent Band", desc: "Ultrasonic + ionic repellent wristband — no sprays, no smell, 100+ hours per charge.", tags: ["Outdoor", "Practical", "Innovation"], budget: "budget" },
  ],
  gaming: [
    { icon: "🎮", name: "Hall Effect Pro Controller", desc: "Zero stick drift with magnetic Hall Effect sensors. Pro-level gaming with back paddles.", tags: ["Gaming", "Pro Gear", "Controller"], budget: "mid" },
    { icon: "🪑", name: "Ergonomic Gaming Recliner", desc: "Built-in massage, heated seat, Bluetooth speakers, and USB ports. The ultimate gaming throne.", tags: ["Furniture", "Comfort", "Luxury"], budget: "luxury" },
    { icon: "💡", name: "AI-Powered RGB Room Lighting Kit", desc: "Lights that react to in-game action — explosions flash red, underwater scenes glow blue.", tags: ["Immersive", "Smart", "Gaming"], budget: "premium" },
  ],
  cooking: [
    { icon: "🔪", name: "Damascus Steel Chef Knife Set", desc: "Hand-forged 67-layer Japanese Damascus steel. A work of art that slices like a dream.", tags: ["Kitchen", "Premium", "Artisan"], budget: "luxury" },
    { icon: "🥘", name: "Smart Multi-Cooker with AI Recipes", desc: "One pot, 14 functions, AI-generated recipes based on what's in your fridge.", tags: ["Smart", "Kitchen", "Practical"], budget: "premium" },
    { icon: "🧊", name: "Whiskey Ice Ball Press Mold Set", desc: "Crystal-clear slow-melting ice spheres + premium mold. For the dad who enjoys a good pour.", tags: ["Barware", "Classy", "Gift Set"], budget: "budget" },
  ],
  auto: [
    { icon: "🚗", name: "Wireless CarPlay/Android Auto Adapter", desc: "Plug-in dongle that makes wired CarPlay wireless. 5-second connection, zero lag.", tags: ["Car Tech", "Practical", "Gadget"], budget: "mid" },
    { icon: "🧹", name: "Cordless Wet/Dry Car Vacuum Pro", desc: "12000Pa suction, LED crevice tool, HEPA filter. Detail the interior like a pro.", tags: ["Auto Care", "Practical", "Cleaning"], budget: "mid" },
    { icon: "📷", name: "4K Dash Cam with AI Alerts", desc: "Front + rear 4K with AI collision warning, parking mode, and cloud storage.", tags: ["Safety", "Tech", "Car"], budget: "premium" },
  ],
  relax: [
    { icon: "💆", name: "Shiatsu Neck & Back Massager", desc: "8 deep-kneading nodes with infrared heat. Dad's stress melts away in 15 minutes.", tags: ["Wellness", "Comfort", "Health"], budget: "mid" },
    { icon: "🦶", name: "Heated Foot Massager with Remote", desc: "Shiatsu rolling + air compression + heat. The gift dad never knew he needed.", tags: ["Relaxation", "Health", "Comfort"], budget: "premium" },
    { icon: "🕯️", name: "Smart Aromatherapy Diffuser", desc: "App-controlled essential oil diffuser with mood lighting and scheduling.", tags: ["Home", "Wellness", "Smart"], budget: "budget" },
  ],
}

// ─── Personality map ───

const personalityMap: Record<string, { type: string; emoji: string }> = {
  diy: { type: "The DIY Master", emoji: "🔧" },
  tech: { type: "The Tech Geek", emoji: "💻" },
  sports: { type: "The Sports Fanatic", emoji: "🏈" },
  grill: { type: "The Grill King", emoji: "🍖" },
  cool: { type: "The Cool Dad", emoji: "🎸" },
  intellectual: { type: "The Intellectual", emoji: "📚" },
}

const giftStyleMap: Record<string, string> = { practical: "🎯", novel: "✨", experience: "🎭", personalized: "🖐️" }

// ─── Countdown hook ───

function useCountdown(targetDate: string) {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })
  useEffect(() => {
    const target = new Date(targetDate)
    function update() {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) return
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      })
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [targetDate])
  return time
}

// ─── Main Component ───

export default function FathersDayGiftMatchmaker() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [results, setResults] = useState<ReturnType<typeof generateResults> | null>(null)
  const [copied, setCopied] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)

  const countdown = useCountdown("2026-06-21T00:00:00-04:00")

  const handleSelect = useCallback((questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }, [])

  const handleNext = useCallback(() => {
    const q = questions[currentStep]
    if (!answers[q.id]) return // require selection
    if (currentStep < questions.length - 1) {
      setCurrentStep((s) => s + 1)
    } else {
      const r = generateResults(answers)
      setResults(r)
    }
  }, [currentStep, answers])

  const handlePrev = useCallback(() => {
    if (currentStep > 0) setCurrentStep((s) => s - 1)
  }, [currentStep])

  const handleRestart = useCallback(() => {
    setCurrentStep(0)
    setAnswers({})
    setResults(null)
    setCopied(false)
  }, [])

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText("https://lootnestx.com/tool/fathers-day-gift-matchmaker")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* noop */ }
  }, [])

  const handleShareX = useCallback(() => {
    const text = results
      ? `My dad is "${results.personality.type}"! 🎁 Find your dad's perfect Father's Day gift too →`
      : "I just found the perfect Father's Day gift with the LootNestX Gift Matchmaker! 🎁"
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent("https://lootnestx.com/tool/fathers-day-gift-matchmaker")}`, "_blank", "width=600,height=400")
  }, [results])

  const handleShareFB = useCallback(() => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://lootnestx.com/tool/fathers-day-gift-matchmaker")}`, "_blank", "width=600,height=400")
  }, [])

  const q = questions[currentStep]
  const progress = Math.round((currentStep / questions.length) * 100)

  if (results) {
    // ─── Results View ───
    return (
      <div className="w-full max-w-2xl mx-auto space-y-8" ref={resultRef}>
        {/* Copied toast */}
        {copied && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-success text-black font-semibold px-6 py-2.5 rounded-full text-sm shadow-lg">
            Link copied! 🎉
          </div>
        )}

        {/* Result Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-warning to-accent flex items-center justify-center text-4xl shadow-lg">
            {results.personality.emoji}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Your dad is{" "}
              <span className="text-warning">{results.personality.type}</span>!
            </h2>
            <p className="text-muted mt-2">Based on your answers, here are the perfect gifts he'll love.</p>
          </div>
        </div>

        {/* Dad Profile */}
        <div className="bg-card-bg border border-card-border rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center text-3xl flex-shrink-0">
            {results.personality.emoji}
          </div>
          <div>
            <div className="text-lg font-bold text-warning">{results.personality.type}</div>
            <div className="text-sm text-muted mt-1">
              Gift style: {giftStyleMap[answers.gift_style] || "🎁"}{" "}
              {(answers.gift_style || "Curated").charAt(0).toUpperCase() + (answers.gift_style || "Curated").slice(1)}{" "}
              · Budget: {(answers.budget || "mid").charAt(0).toUpperCase() + (answers.budget || "mid").slice(1)}{" "}
              {answers.worldcup === "wcup_huge" ? "· ⚽ World Cup Fan!" : answers.worldcup === "wcup_casual" ? "· ⚽ Casual Fan" : ""}
            </div>
          </div>
        </div>

        {/* Gift Recommendations */}
        <div>
          <h3 className="text-base font-bold text-muted mb-4">🎁 Top Gift Recommendations</h3>
          <div className="space-y-3">
            {results.gifts.map((gift, i) => (
              <div key={i} className="bg-card-bg border border-card-border rounded-lg p-5 hover:border-accent/30 transition-colors relative group">
                <span className="absolute top-3 right-4 text-xs font-bold text-warning bg-warning/10 px-2.5 py-1 rounded-full border border-warning/20">
                  #{i + 1} Pick
                </span>
                <div className="flex gap-4">
                  <span className="text-3xl flex-shrink-0">{gift.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-foreground">{gift.name}</div>
                    <div className="text-sm text-muted mt-1 leading-relaxed">{gift.desc}</div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {gift.tags.map((tag) => (
                        <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/15">
                          {tag}
                        </span>
                      ))}
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-warning/10 text-warning border border-warning/15">
                        {gift.budget === "budget" ? "💵 Under $25" : gift.budget === "mid" ? "💵💵 $25-50" : gift.budget === "premium" ? "💵💵💵 $50-100" : "💎 $100+"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-6 justify-center">
            <button onClick={handleRestart} className="px-5 py-2.5 rounded-lg border border-card-border bg-surface hover:bg-card-bg text-foreground font-medium transition-colors text-sm">
              🔄 Take Again
            </button>
          </div>
        </div>

        {/* Share Section */}
        <div className="bg-card-bg border border-card-border rounded-xl p-6 text-center space-y-4">
          <h3 className="font-bold text-foreground flex items-center justify-center gap-2">
            <Share2 className="w-4 h-4" /> Share Your Dad's Gift Profile
          </h3>
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={handleShareX} className="px-4 py-2 rounded-lg border border-card-border bg-surface hover:bg-[#1da1f2] hover:border-[#1da1f2] hover:text-white text-foreground font-medium text-sm transition-colors">
              𝕏 Share on X
            </button>
            <button onClick={handleShareFB} className="px-4 py-2 rounded-lg border border-card-border bg-surface hover:bg-[#1877f2] hover:border-[#1877f2] hover:text-white text-foreground font-medium text-sm transition-colors">
              📘 Share on Facebook
            </button>
            <button onClick={handleCopyLink} className="px-4 py-2 rounded-lg border border-card-border bg-surface hover:bg-success hover:border-success hover:text-black text-foreground font-medium text-sm transition-colors">
              {copied ? <Check className="w-4 h-4 inline" /> : <Copy className="w-4 h-4 inline" />} Copy Link
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── Quiz View ───
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Countdown */}
      <div className="flex justify-center gap-3 flex-wrap">
        {[
          { label: "Days", value: countdown.days },
          { label: "Hours", value: countdown.hours },
          { label: "Minutes", value: countdown.mins },
          { label: "Seconds", value: countdown.secs },
        ].map((item) => (
          <div key={item.label} className="bg-card-bg border border-card-border rounded-lg px-4 py-2.5 text-center min-w-[70px]">
            <div className="text-2xl font-extrabold text-warning leading-none">{item.value}</div>
            <div className="text-[11px] text-muted-soft uppercase mt-1 tracking-wide">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Quiz Card */}
      <div className="bg-card-bg border border-card-border rounded-xl p-6 sm:p-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted mb-1.5">
            <span>Question {currentStep + 1} of {questions.length}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-card-border rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question */}
        <div className="space-y-5">
          <div>
            <span className="block text-4xl mb-3">{q.emoji}</span>
            <div className="text-xl font-bold text-foreground">{q.question}</div>
            <div className="text-sm text-muted mt-1">{q.hint}</div>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {q.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(q.id, opt.value)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-lg border-2 text-left transition-all font-[inherit] ${
                  answers[q.id] === opt.value
                    ? "border-accent bg-accent/10 shadow-[0_0_16px_rgba(59,130,246,0.15)]"
                    : "border-card-border bg-surface hover:border-accent/50 hover:bg-card-hover"
                }`}
              >
                <span className="text-2xl flex-shrink-0">{opt.emoji}</span>
                <span className="font-semibold text-foreground">{opt.label}</span>
                <span className="text-xs text-muted-soft ml-auto hidden sm:inline">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6 gap-3">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-card-border text-sm font-medium transition-colors ${
              currentStep === 0 ? "opacity-30 cursor-not-allowed text-muted-soft" : "bg-surface hover:bg-card-hover text-foreground"
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={handleNext}
            disabled={!answers[q.id]}
            className={`inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${
              !answers[q.id]
                ? "bg-accent/40 text-white/50 cursor-not-allowed"
                : "bg-accent hover:bg-accent-dark text-white shadow-lg shadow-accent/20 hover:shadow-accent/30 hover:-translate-y-0.5"
            }`}
          >
            {currentStep === questions.length - 1 ? "🎁 Reveal My Gifts!" : "Continue"} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Results Generator ───

function generateResults(answers: Record<string, string>) {
  const personality = personalityMap[answers.personality] || personalityMap.tech

  const budgetRank: Record<string, number> = { budget: 0, mid: 1, premium: 2, luxury: 3 }
  const budgetScore = budgetRank[answers.budget] || 1

  const primaryCat = answers.personality
  const activityCat = answers.activity

  let allGifts: Gift[] = []
  if (giftDatabase[primaryCat]) {
    allGifts = allGifts.concat(giftDatabase[primaryCat])
  }
  if (activityCat && giftDatabase[activityCat] && activityCat !== primaryCat) {
    allGifts = allGifts.concat(giftDatabase[activityCat].slice(0, 2))
  }

  const scored = allGifts.map((g) => {
    const gScore = budgetRank[g.budget] || 1
    const budgetMatch = 1 - Math.abs(gScore - budgetScore) / 4
    const wcupBonus = answers.worldcup === "wcup_huge" && (primaryCat === "sports" || g.tags.some((t) => t.includes("World Cup")))
    return { ...g, score: budgetMatch + (wcupBonus ? 0.3 : 0) + Math.random() * 0.2 }
  })

  if (answers.worldcup === "wcup_huge") {
    scored.unshift({
      icon: "🏆",
      name: "FIFA World Cup 2026 Official Fan Kit",
      desc: "Includes official jersey, scarf, cap, and commemorative pin from the biggest World Cup ever. Hosted in USA!",
      tags: ["World Cup 2026", "Official", "USA 2026"],
      budget: "premium",
      score: 10,
    })
  }

  scored.sort((a, b) => b.score - a.score)
  const topGifts = scored.slice(0, 5)

  return { personality, gifts: topGifts }
}
