'use client'

import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const EMOJIS = ['🔥', '😮', '😂', '👏', '😢']

function getSessionId(): string {
  let id = localStorage.getItem('f1_session_id')
  if (!id) { id = crypto.randomUUID(); localStorage.setItem('f1_session_id', id) }
  return id
}

type ReactionMap = Record<string, Record<string, number>>

interface Props {
  newsId: string  // article URL (원문 링크)
}

export default function NewsDetailClient({ newsId }: Props) {
  const [myEmoji, setMyEmoji] = useState<string | null>(null)
  const qc = useQueryClient()

  useEffect(() => {
    try {
      const saved = localStorage.getItem('f1_my_reactions')
      if (saved) {
        const parsed = JSON.parse(saved) as Record<string, string>
        setMyEmoji(parsed[newsId] ?? null)
      }
    } catch { /* ignore */ }
  }, [newsId])

  const { data: reactions = {} } = useQuery<ReactionMap>({
    queryKey: ['news-reactions', newsId],
    queryFn:  async () => {
      const res = await fetch(`/api/news/reactions?newsIds=${encodeURIComponent(newsId)}`)
      return res.ok ? res.json() : {}
    },
    staleTime: 30_000,
  })

  const itemReactions = reactions[newsId] ?? {}

  const mutation = useMutation({
    mutationFn: async (emoji: string) => {
      const res = await fetch('/api/news/react', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ newsId, emoji, sessionId: getSessionId() }),
      })
      return res.json() as Promise<{ action: 'added' | 'removed' }>
    },
    onMutate: async (emoji: string) => {
      await qc.cancelQueries({ queryKey: ['news-reactions', newsId] })
      const prev = qc.getQueryData<ReactionMap>(['news-reactions', newsId])
      const isToggleOff = myEmoji === emoji

      qc.setQueryData<ReactionMap>(['news-reactions', newsId], old => {
        const next = JSON.parse(JSON.stringify(old ?? {})) as ReactionMap
        if (!next[newsId]) next[newsId] = {}
        if (myEmoji && myEmoji !== emoji) {
          next[newsId][myEmoji] = Math.max(0, (next[newsId][myEmoji] ?? 0) - 1)
        }
        next[newsId][emoji] = Math.max(0, (next[newsId][emoji] ?? 0) + (isToggleOff ? -1 : 1))
        return next
      })

      const newEmoji = isToggleOff ? null : emoji
      setMyEmoji(newEmoji)
      try {
        const saved = JSON.parse(localStorage.getItem('f1_my_reactions') ?? '{}') as Record<string, string>
        if (newEmoji) saved[newsId] = newEmoji
        else delete saved[newsId]
        localStorage.setItem('f1_my_reactions', JSON.stringify(saved))
      } catch { /* ignore */ }

      return { prev }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(['news-reactions', newsId], ctx.prev)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['news-reactions', newsId] }),
  })

  const handleReact = useCallback((emoji: string) => {
    mutation.mutate(emoji)
  }, [mutation])

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-[var(--muted)] font-semibold">이 기사에 반응하기</p>
      <div className="flex items-center gap-2 flex-wrap">
        {EMOJIS.map(emoji => {
          const count = itemReactions[emoji] ?? 0
          const isMe  = myEmoji === emoji
          return (
            <button
              key={emoji}
              onClick={() => handleReact(emoji)}
              className={`flex items-center gap-1.5 text-sm rounded-full px-3 py-1.5 border transition-colors ${
                isMe
                  ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                  : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
              }`}
            >
              <span>{emoji}</span>
              {count > 0 && <span className="tabular-nums text-xs font-semibold">{count}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
