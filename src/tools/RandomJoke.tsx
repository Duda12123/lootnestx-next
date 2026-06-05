"use client"

import { useState, useCallback } from "react"
import { RefreshCw } from "lucide-react"

const jokes = [
  { setup: "Why do programmers prefer dark mode?", punchline: "Because light attracts bugs!" },
  { setup: "What's a computer's favorite snack?", punchline: "Microchips!" },
  { setup: "Why did the developer go broke?", punchline: "Because they used up all their cache." },
  { setup: "How many programmers does it take to change a light bulb?", punchline: "None, that's a hardware problem." },
  { setup: "Why do Java developers wear glasses?", punchline: "Because they don't C#" },
  { setup: "What do you call a programmer from Finland?", punchline: "Nerdic." },
  { setup: "Why was the JavaScript developer sad?", punchline: "Because he didn't know how to 'null' his feelings." },
  { setup: "What's the best thing about UDP jokes?", punchline: "I don't care if you get them." },
  { setup: "A SQL query walks into a bar, walks up to two tables and asks...", punchline: "Can I join you?" },
  { setup: "Why did the developer quit their job?", punchline: "They didn't get arrays." },
  { setup: "What's a pirate's favorite programming language?", punchline: "You'd think it's R, but his first love is the C." },
  { setup: "Why did the functional programmer get thrown out of school?", punchline: "They refused to take classes." },
  { setup: "How do you comfort a JavaScript bug?", punchline: "You console it." },
  { setup: "What did the CSS say to the HTML?", punchline: "You're my type!" },
  { setup: "Why did the programmer put their money in the freezer?", punchline: "They wanted cold hard cache." },
  { setup: "Why don't programmers like nature?", punchline: "Too many bugs." },
  { setup: "What's a programmer's favorite hangout spot?", punchline: "The Foo Bar." },
  { setup: "Why did the web developer storm out of the restaurant?", punchline: "The table layout was terrible." },
  { setup: "What's the object-oriented way to become wealthy?", punchline: "Inheritance." },
  { setup: "Why did the developer stay at the beach?", punchline: "They couldn't find the closing script tag." },
]

export default function RandomJoke() {
  const [index, setIndex] = useState(Math.floor(Math.random() * jokes.length))
  const [showPunchline, setShowPunchline] = useState(false)

  const nextJoke = useCallback(() => {
    setShowPunchline(false)
    const next = (index + 1 + Math.floor(Math.random() * (jokes.length - 1))) % jokes.length
    setIndex(next)
  }, [index])

  const joke = jokes[index]

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-card-border bg-card-bg/50 p-6 text-center">
        <p className="text-xl font-semibold mb-4">{joke.setup}</p>
        {showPunchline ? (
          <p className="text-lg text-accent animate-in fade-in">{joke.punchline} 😂</p>
        ) : (
          <button onClick={() => setShowPunchline(true)} className="rounded-lg bg-accent/10 px-4 py-2 text-sm text-accent hover:bg-accent/20 transition-colors">
            Show Punchline
          </button>
        )}
      </div>
      <div className="flex justify-center gap-3">
        <button onClick={nextJoke} className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-muted hover:bg-card-bg transition-colors">
          <RefreshCw size={14} /> Next Joke
        </button>
      </div>
    </div>
  )
}
