"use client"

import { useState, useEffect, useCallback } from "react"
import { ThumbsUp, ThumbsDown, Heart, Star, Send, Trash2, Link2, X, MessageCircle, Share2, Check } from "lucide-react"

interface ToolReactionsProps {
  toolId: string
  toolName?: string
}

interface Comment {
  id: string
  text: string
  timestamp: number
}

const COMMENT_MAX = 10

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch { return fallback }
}

function save(key: string, value: unknown) {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}

export function ToolReactions({ toolId, toolName }: ToolReactionsProps) {
  const [likes, setLikes] = useState(0)
  const [dislikes, setDislikes] = useState(0)
  const [userVote, setUserVote] = useState<"like" | "dislike" | null>(null)
  const [favorited, setFavorited] = useState(false)
  const [rating, setRating] = useState(0)
  const [avgRating, setAvgRating] = useState(0)
  const [totalRatings, setTotalRatings] = useState(0)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setLikes(load(`rn-like-${toolId}`, 0))
    setDislikes(load(`rn-dislike-${toolId}`, 0))
    setUserVote(load(`rn-vote-${toolId}`, null))
    setFavorited(load(`rn-fav-${toolId}`, false))
    setRating(load(`rn-myrate-${toolId}`, 0))
    const allRatings: number[] = load(`rn-allrates-${toolId}`, [])
    setTotalRatings(allRatings.length)
    setAvgRating(allRatings.length ? allRatings.reduce((a,b) => a + b, 0) / allRatings.length : 0)
    setComments(load(`rn-comments-${toolId}`, []))
  }, [toolId])

  const vote = useCallback((type: "like" | "dislike") => {
    if (userVote === type) {
      // undo
      setUserVote(null)
      if (type === "like") { setLikes(l => { const v = l - 1; save(`rn-like-${toolId}`, v); return v }) }
      else { setDislikes(d => { const v = d - 1; save(`rn-dislike-${toolId}`, v); return v }) }
      save(`rn-vote-${toolId}`, null)
    } else {
      // switch or new
      if (userVote === "like") setLikes(l => { const v = l - 1; save(`rn-like-${toolId}`, v); return v })
      if (userVote === "dislike") setDislikes(d => { const v = d - 1; save(`rn-dislike-${toolId}`, v); return v })
      setUserVote(type)
      if (type === "like") setLikes(l => { const v = l + 1; save(`rn-like-${toolId}`, v); return v })
      else setDislikes(d => { const v = d + 1; save(`rn-dislike-${toolId}`, v); return v })
      save(`rn-vote-${toolId}`, type)
    }
  }, [userVote, toolId])

  const toggleFav = useCallback(() => {
    setFavorited(f => {
      const next = !f; save(`rn-fav-${toolId}`, next); return next
    })
  }, [toolId])

  const rate = useCallback((r: number) => {
    setRating(r)
    save(`rn-myrate-${toolId}`, r)
    const allRatings: number[] = load(`rn-allrates-${toolId}`, [])
    const existing = load(`rn-myrate-${toolId}`, 0)
    if (existing) {
      const idx = allRatings.lastIndexOf(existing)
      if (idx !== -1) { allRatings.splice(idx, 1); allRatings.push(r) }
      else allRatings.push(r)
    } else {
      allRatings.push(r)
    }
    save(`rn-allrates-${toolId}`, allRatings)
    setTotalRatings(allRatings.length)
    setAvgRating(allRatings.reduce((a,b) => a + b, 0) / allRatings.length)
  }, [toolId])

  const submitComment = useCallback(() => {
    const text = commentText.trim()
    if (!text) return
    setComments(prev => {
      const next = [{ id: Date.now().toString(), text, timestamp: Date.now() }, ...prev].slice(0, COMMENT_MAX)
      save(`rn-comments-${toolId}`, next)
      return next
    })
    setCommentText("")
  }, [commentText, toolId])

  const deleteComment = useCallback((id: string) => {
    setComments(prev => {
      const next = prev.filter(c => c.id !== id)
      save(`rn-comments-${toolId}`, next)
      return next
    })
  }, [toolId])

  if (!mounted) return null

  return (
    <div className="mt-16 border-t border-card-border pt-12">
      <h2 className="text-xl font-bold mb-8">Community Feedback</h2>

      <div className="grid gap-8 sm:grid-cols-3">
        {/* Vote */}
        <div className="rounded-xl border border-card-border bg-card-bg p-5">
          <p className="text-sm font-semibold text-muted mb-4">Was this tool helpful?</p>
          <div className="flex items-center gap-4">
            <button onClick={() => vote("like")} className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              userVote === "like" ? "bg-success/10 text-success ring-1 ring-success/20" : "bg-card-hover text-muted hover:text-success border border-card-border"
            }`}>
              <ThumbsUp size={16} /> {likes}
            </button>
            <button onClick={() => vote("dislike")} className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              userVote === "dislike" ? "bg-danger/10 text-danger ring-1 ring-danger/20" : "bg-card-hover text-muted hover:text-danger border border-card-border"
            }`}>
              <ThumbsDown size={16} /> {dislikes}
            </button>
            <button onClick={toggleFav} className={`flex items-center gap-1 rounded-lg px-3 py-2.5 text-sm font-medium transition-all border ${
              favorited ? "bg-danger/10 text-danger border-danger/20" : "bg-card-hover text-muted hover:text-danger border-card-border"
            }`}>
              <Heart size={16} fill={favorited ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {/* Rating */}
        <div className="rounded-xl border border-card-border bg-card-bg p-5">
          <p className="text-sm font-semibold text-muted mb-4">Rate this tool</p>
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(s => (
              <button key={s} onClick={() => rate(s)} className="transition-transform hover:scale-110">
                <Star size={22} fill={s <= rating ? "currentColor" : "none"} className={s <= rating ? "text-warning" : "text-muted-soft"} />
              </button>
            ))}
            <span className="ml-2 text-sm text-muted-soft">
              {avgRating > 0 ? `${avgRating.toFixed(1)} (${totalRatings})` : "No ratings yet"}
            </span>
          </div>
        </div>

        {/* Social share */}
        <ShareBox toolId={toolId} toolName={toolName} />
      </div>

      {/* Comments */}
      <div className="mt-8 rounded-xl border border-card-border bg-card-bg p-5">
        <p className="text-sm font-semibold text-muted mb-4">Comments ({comments.length})</p>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submitComment()}
            placeholder="Leave a comment..."
            maxLength={500}
            className="flex-1 rounded-lg border border-card-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-soft focus:border-accent/40 focus:outline-none transition-colors"
          />
          <button onClick={submitComment} disabled={!commentText.trim()} className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <Send size={16} />
          </button>
        </div>

        {comments.length > 0 ? (
          <ul className="space-y-3 max-h-80 overflow-y-auto">
            {comments.map(c => (
              <li key={c.id} className="flex items-start justify-between gap-3 rounded-lg bg-surface p-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground break-words">{c.text}</p>
                  <span className="text-[11px] text-muted-soft mt-1 block">{new Date(c.timestamp).toLocaleDateString()}</span>
                </div>
                <button onClick={() => deleteComment(c.id)} className="shrink-0 text-muted-soft hover:text-danger transition-colors mt-1">
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-soft text-center py-4">No comments yet. Be the first!</p>
        )}
      </div>
    </div>
  )
}

// ─── Share box ────────────────────────────────────────────────

function ShareBox({ toolId, toolName }: { toolId: string; toolName?: string }) {
  const [copied, setCopied] = useState(false)
  const baseUrl = typeof window !== "undefined" ? window.location.origin : ""

  const shareUrl = `${baseUrl}/tool/${toolId}`
  const shareText = toolName
    ? `Check out "${toolName}" on LootNestX — free online tool!`
    : `Check out this free online tool on LootNestX!`
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedText = encodeURIComponent(shareText)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const input = document.createElement("textarea")
      input.value = shareUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand("copy")
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [shareUrl])

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: toolName || "LootNestX Tool", text: shareText, url: shareUrl })
      } catch { /* user cancelled */ }
    }
  }, [shareUrl, shareText, toolName])

  return (
    <div className="rounded-xl border border-card-border bg-card-bg p-5">
      <p className="text-sm font-semibold text-muted mb-4">Share this tool</p>
      <div className="flex flex-wrap items-center gap-2">
        {/* Twitter / X */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium bg-card-hover text-muted hover:bg-accent/10 hover:text-accent border border-card-border hover:border-accent/20 transition-all"
        >
          <X size={15} /> <span translate="no">X</span> (Twitter)
        </a>

        {/* Reddit */}
        <a
          href={`https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium bg-card-hover text-muted hover:bg-accent/10 hover:text-accent border border-card-border hover:border-accent/20 transition-all"
        >
          <MessageCircle size={15} /> Reddit
        </a>

        {/* Copy link */}
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium border transition-all ${
            copied
              ? "bg-success/10 text-success border-success/20"
              : "bg-card-hover text-muted hover:bg-accent/10 hover:text-accent border-card-border hover:border-accent/20"
          }`}
        >
          {copied ? <Check size={15} /> : <Link2 size={15} />}
          {copied ? "Copied!" : "Copy Link"}
        </button>

        {/* Native share (mobile) */}
        {typeof navigator !== "undefined" && (navigator as Navigator).share && (
          <button
            onClick={handleNativeShare}
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium bg-card-hover text-muted hover:bg-accent/10 hover:text-accent border border-card-border hover:border-accent/20 transition-all"
          >
            <Share2 size={15} /> Share
          </button>
        )}
      </div>
    </div>
  )
}
