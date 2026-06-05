"use client"

import { useState, useCallback } from "react"
import { RefreshCw } from "lucide-react"

const cuisines = ["🥡 中餐", "🍜 日料", "🍝 意面", "🌮 墨西哥卷", "🍔 汉堡", "🥗 沙拉", "🍕 披萨", "🥘 韩料", "🍲 火锅", "🍗 炸鸡", "🥟 饺子", "🍱 便当", "🥩 牛排", "🍤 海鲜", "🥪 三明治", "🍛 咖喱", "🥙 烤肉", "🧆 中东菜", "🍚 炒饭", "🥞 煎饼"]
const meals = ["🍳 早餐", "🌞 午餐", "🌙 晚餐", "🍰 甜点", "🥤 奶茶", "🍺 小酌一杯"]

const fullMenu = [
  ...cuisines,
  ...meals,
  "🍜 兰州拉面", "🥟 小笼包", "🍝 意式千层面", "🌯 卷饼", "🍲 麻辣烫",
  "🍖 烤串", "🦐 小龙虾", "🥘 石锅拌饭", "🍣 寿司拼盘", "🥡 炒河粉",
  "🍛 黄焖鸡", "🥗 凯撒沙拉", "🍔 双层芝士堡", "🥩 和牛烧烤", "🦞 龙虾卷",
]

export default function WhatToEat() {
  const [result, setResult] = useState<string | null>(null)
  const [spinning, setSpinning] = useState(false)

  const roll = useCallback(() => {
    setSpinning(true)
    let count = 0
    const max = 15
    const interval = setInterval(() => {
      setResult(fullMenu[Math.floor(Math.random() * fullMenu.length)])
      count++
      if (count >= max) {
        clearInterval(interval)
        setSpinning(false)
      }
    }, 80)
  }, [])

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-soft">Can&apos;t decide what to eat? Let fate choose for you!</p>
      <button
        onClick={roll}
        disabled={spinning}
        className="w-full rounded-xl border-2 border-accent/30 bg-accent/5 py-10 text-center hover:bg-accent/10 transition-colors disabled:opacity-60"
      >
        {result ? (
          <span className="text-3xl font-bold">{result}</span>
        ) : (
          <span className="text-4xl">🍽️</span>
        )}
      </button>
      {result && !spinning && (
        <button onClick={roll} className="mx-auto flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-accent hover:bg-accent/5 transition-colors">
          <RefreshCw size={14} /> Try Again
        </button>
      )}
    </div>
  )
}
