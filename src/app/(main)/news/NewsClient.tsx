'use client'

import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { NewsItem } from '@/lib/newsApi'

const EMOJIS = ['🔥', '😮', '😂', '👏', '😢']
const SOURCES = ['전체', 'Autosport', 'Motorsport', 'BBC Sport']

function getSessionId(): string {
  let id = localStorage.getItem('f1_session_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('f1_session_id', id)
  }
  return id
}

type ReactionMap = Record<string, Record<string, number>>

async function fetchReactions(newsIds: string[]): Promise<ReactionMap> {
  if (newsIds.length === 0) return {}
  const res = await fetch(`/api/news/reactions?newsIds=${encodeURIComponent(newsIds.join(','))}`)
  if (!res.ok) return {}
  return res.json()
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

interface Props {
  news: NewsItem[]
}

export default function NewsClient({ news }: Props) {
  const [source, setSource] = useState('전체')
  const [myReactions, setMyReactions] = useState<Record<string, string>>({}) // newsId → emoji
  const qc = useQueryClient()

  useEffect(() => {
    // localStorage에서 내 반응 기록 복원
    try {
      const saved = localStorage.getItem('f1_my_reactions')
      if (saved) setMyReactions(JSON.parse(saved))
    } catch { /* ignore */ }
  }, [])

  const filtered = source === '전체' ? news : news.filter(n => n.source === source)

  const newsIds = filtered.map(n => n.id)

  const { data: reactions = {} } = useQuery<ReactionMap>({
    queryKey: ['news-reactions', newsIds.join(',')],
    queryFn:  () => fetchReactions(newsIds),
    enabled:  newsIds.length > 0,
    staleTime: 30_000,
  })

  const mutation = useMutation({
    mutationFn: async ({ newsId, emoji }: { newsId: string; emoji: string }) => {
      const sessionId = getSessionId()
      const res = await fetch('/api/news/react', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ newsId, emoji, sessionId }),
      })
      return res.json() as Promise<{ action: 'added' | 'removed' }>
    },
    onMutate: async ({ newsId, emoji }) => {
      // 낙관적 업데이트
      await qc.cancelQueries({ queryKey: ['news-reactions'] })
      const prev = qc.getQueryData<ReactionMap>(['news-reactions', newsIds.join(',')])

      const isToggleOff = myReactions[newsId] === emoji

      qc.setQueryData<ReactionMap>(['news-reactions', newsIds.join(',')], old => {
        const next = JSON.parse(JSON.stringify(old ?? {})) as ReactionMap
        if (!next[newsId]) next[newsId] = {}
        const prevEmoji = myReactions[newsId]
        if (prevEmoji && prevEmoji !== emoji) {
          next[newsId][prevEmoji] = Math.max(0, (next[newsId][prevEmoji] ?? 0) - 1)
        }
        if (isToggleOff) {
          next[newsId][emoji] = Math.max(0, (next[newsId][emoji] ?? 0) - 1)
        } else {
          next[newsId][emoji] = (next[newsId][emoji] ?? 0) + 1
        }
        return next
      })

      const nextMyReactions = { ...myReactions }
      if (isToggleOff) {
        delete nextMyReactions[newsId]
      } else {
        nextMyReactions[newsId] = emoji
      }
      setMyReactions(nextMyReactions)
      localStorage.setItem('f1_my_reactions', JSON.stringify(nextMyReactions))

      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(['news-reactions', newsIds.join(',')], ctx.prev)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['news-reactions'] })
    },
  })

  const handleReact = useCallback((newsId: string, emoji: string) => {
    mutation.mutate({ newsId, emoji })
  }, [mutation])

  return (
    <div className="max-w-[720px] mx-auto flex flex-col gap-4">
      {/* 헤더 */}
      <div className="bg-[var(--card)] rounded-xl shadow-sm px-6 py-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[var(--text)]">F1 뉴스</h1>
          <p className="text-xs text-[var(--muted)] mt-0.5">주요 F1 미디어 최신 소식</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          {SOURCES.map(s => (
            <button
              key={s}
              onClick={() => setSource(s)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                source === s
                  ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                  : 'text-[var(--muted)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* 뉴스 목록 */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-[var(--muted)] text-sm">
          뉴스를 불러오는 중...
        </div>
      ) : (
        filtered.map(item => {
          const itemReactions = reactions[item.id] ?? {}
          const myEmoji = myReactions[item.id]

          return (
            <article
              key={item.id}
              className="bg-[var(--card)] rounded-xl shadow-sm px-5 py-4 flex flex-col gap-3"
            >
              {/* 소스 + 날짜 */}
              <div className="flex items-center gap-2 text-[10px] text-[var(--muted)] font-semibold">
                <span className="text-[var(--accent)]">{item.source}</span>
                <span>·</span>
                <span>{formatDate(item.pubDate)}</span>
              </div>

              {/* 제목 (클릭 → 원문) */}
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-[var(--text)] hover:text-[var(--accent)] transition-colors leading-snug"
              >
                {item.title}
              </a>

              {/* 요약 */}
              {item.summary && (
                <p className="text-xs text-[var(--muted)] leading-relaxed line-clamp-2">
                  {item.summary}
                </p>
              )}

              {/* 이모지 반응 */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                {EMOJIS.map(emoji => {
                  const count = itemReactions[emoji] ?? 0
                  const isMe  = myEmoji === emoji
                  return (
                    <button
                      key={emoji}
                      onClick={() => handleReact(item.id, emoji)}
                      className={`flex items-center gap-1 text-xs rounded-full px-2.5 py-1 border transition-colors ${
                        isMe
                          ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                          : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                      }`}
                    >
                      <span>{emoji}</span>
                      {count > 0 && <span className="tabular-nums">{count}</span>}
                    </button>
                  )
                })}
              </div>
            </article>
          )
        })
      )}
    </div>
  )
}
