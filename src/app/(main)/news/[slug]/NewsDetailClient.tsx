'use client'

import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

const EMOJIS = ['🔥', '😮', '😂', '👏', '😢']

type ReactionMap = Record<string, Record<string, number>>

interface Props {
  newsId: string  // article URL (원문 링크)
}

export default function NewsDetailClient({ newsId }: Props) {
  const { data: session } = useSession()
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
        body:    JSON.stringify({ newsId, emoji }),
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
              onClick={() => session ? handleReact(emoji) : undefined}
              disabled={!session}
              className={`flex items-center gap-1.5 text-sm rounded-full px-3 py-1.5 border transition-colors ${
                !session
                  ? 'border-[var(--border)] text-[var(--muted)] opacity-40 cursor-not-allowed'
                  : isMe
                    ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                    : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
              }`}
            >
              <span>{emoji}</span>
              <span className="tabular-nums text-xs font-semibold">{count}</span>
            </button>
          )
        })}
      </div>
      {!session && (
        <p className="text-xs text-[var(--muted)]">
          <a href="/login" className="text-[var(--accent)] hover:underline font-semibold">지금 로그인</a>
          하고 감정을 표현하세요
        </p>
      )}
    </div>
  )
}
