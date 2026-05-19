'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import type { NewsItem } from '@/lib/newsApi'
import { encodeNewsSlug } from '@/lib/newsSlug'

const EMOJIS   = ['🔥', '😮', '😂', '👏', '😢']
const SOURCES  = ['전체', 'Autosport', 'Motorsport', 'BBC Sport', 'RaceFans', 'The Race', 'Crash.net']
const DATE_TABS = ['오늘', '어제', '그저께', '3일 전', '4일 전'] as const
type DateTab = typeof DATE_TABS[number]

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? ''

const SOURCE_BG: Record<string, string> = {
  'Autosport':  'linear-gradient(135deg, #7f1d1d, #b91c1c)',
  'Motorsport': 'linear-gradient(135deg, #1e3a5f, #2563eb)',
  'BBC Sport':  'linear-gradient(135deg, #7f1d1d, #374151)',
  'RaceFans':   'linear-gradient(135deg, #14532d, #16a34a)',
  'The Race':   'linear-gradient(135deg, #111827, #374151)',
  'Crash.net':  'linear-gradient(135deg, #7c2d12, #ea580c)',
}

type ReactionMap = Record<string, Record<string, number>>

async function fetchReactions(newsIds: string[]): Promise<ReactionMap> {
  if (newsIds.length === 0) return {}
  const res = await fetch(`/api/news/reactions?newsIds=${encodeURIComponent(newsIds.join(','))}`)
  return res.ok ? res.json() : {}
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function getTargetDate(tab: DateTab): Date {
  const daysAgo = DATE_TABS.indexOf(tab)
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

interface EditState {
  titleKr: string
  summaryKr: string
}

interface Props {
  news: NewsItem[]
}

export default function NewsClient({ news }: Props) {
  const { data: session } = useSession()
  const isAdmin = !!ADMIN_EMAIL && session?.user?.email === ADMIN_EMAIL

  const [source,  setSource]  = useState('전체')
  const [dateTab, setDateTab] = useState<DateTab>('오늘')
  const [myReactions, setMyReactions] = useState<Record<string, string>>({})

  // 어드민 편집 상태
  const [editingId,  setEditingId]  = useState<string | null>(null)
  const [editValues, setEditValues] = useState<EditState>({ titleKr: '', summaryKr: '' })
  const [saving,     setSaving]     = useState(false)
  // 저장 후 즉시 반영용 로컬 오버라이드
  const [overrides, setOverrides] = useState<Record<string, { title: string; summary: string }>>({})

  const qc = useQueryClient()

  useEffect(() => {
    try {
      const saved = localStorage.getItem('f1_my_reactions')
      if (saved) setMyReactions(JSON.parse(saved))
    } catch { /* ignore */ }
  }, [])

  const filtered = useMemo(() => {
    const target = getTargetDate(dateTab)
    return news
      .filter(n => isSameDay(new Date(n.pubDate), target))
      .filter(n => source === '전체' || n.source === source)
  }, [news, dateTab, source])

  const newsIds = filtered.map(n => n.id)

  const { data: reactions = {} } = useQuery<ReactionMap>({
    queryKey:  ['news-reactions', newsIds.join(',')],
    queryFn:   () => fetchReactions(newsIds),
    enabled:   newsIds.length > 0,
    staleTime: 30_000,
  })

  const reactionMutation = useMutation({
    mutationFn: async ({ newsId, emoji }: { newsId: string; emoji: string }) => {
      const res = await fetch('/api/news/react', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ newsId, emoji }),
      })
      return res.json() as Promise<{ action: 'added' | 'removed' }>
    },
    onMutate: async ({ newsId, emoji }) => {
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
        next[newsId][emoji] = Math.max(0, (next[newsId][emoji] ?? 0) + (isToggleOff ? -1 : 1))
        return next
      })

      const next = { ...myReactions }
      if (isToggleOff) delete next[newsId]
      else next[newsId] = emoji
      setMyReactions(next)
      localStorage.setItem('f1_my_reactions', JSON.stringify(next))
      return { prev }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(['news-reactions', newsIds.join(',')], ctx.prev)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['news-reactions'] }),
  })

  const handleReact = useCallback((newsId: string, emoji: string) => {
    reactionMutation.mutate({ newsId, emoji })
  }, [reactionMutation])

  const openEdit = (item: NewsItem) => {
    setEditingId(item.id)
    setEditValues({
      titleKr:   overrides[item.id]?.title   ?? (item.title !== item.titleEn ? item.title : ''),
      summaryKr: overrides[item.id]?.summary ?? (item.summary !== item.summaryEn ? item.summary : ''),
    })
  }

  const handleSave = async (articleUrl: string) => {
    setSaving(true)
    try {
      const res = await fetch('/api/news/translate', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          articleUrl,
          titleKr:   editValues.titleKr   || null,
          summaryKr: editValues.summaryKr || null,
        }),
      })
      if (res.ok) {
        setOverrides(prev => ({
          ...prev,
          [articleUrl]: {
            title:   editValues.titleKr   || '',
            summary: editValues.summaryKr || '',
          },
        }))
        setEditingId(null)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-[720px] mx-auto flex flex-col gap-4">

      {/* 헤더 */}
      <div className="bg-[var(--card)] rounded-xl shadow-sm px-6 py-5 flex flex-col gap-3">
        {/* 타이틀 */}
        <div>
          <h1 className="text-xl font-bold text-[var(--text)]">F1 뉴스</h1>
          <p className="text-xs text-[var(--muted)] mt-0.5">주요 F1 미디어 최신 소식</p>
        </div>
        {/* 소스 필터 */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {SOURCES.map(s => (
            <button
              key={s}
              onClick={() => setSource(s)}
              className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                source === s
                  ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                  : 'text-[var(--muted)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {/* 날짜 탭 */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {DATE_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setDateTab(tab)}
              className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                dateTab === tab
                  ? 'bg-[var(--bg-2)] text-[var(--text)] border-[var(--text)]'
                  : 'text-[var(--muted)] border-[var(--border)] hover:border-[var(--muted)]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 뉴스 목록 */}
      {filtered.length === 0 ? (
        <div className="bg-[var(--card)] rounded-xl shadow-sm px-6 py-12 text-center">
          <p className="text-sm text-[var(--muted)]">{dateTab} 기사가 없습니다.</p>
        </div>
      ) : (
        filtered.map(item => {
          const itemReactions = reactions[item.id] ?? {}
          const myEmoji  = myReactions[item.id]
          const slug     = encodeNewsSlug(item.id)
          const isEditing = editingId === item.id

          const displayTitle   = overrides[item.id]?.title   || item.title
          const displaySummary = overrides[item.id]?.summary || item.summary
          const isTranslated   = displayTitle !== item.titleEn

          return (
            <article
              key={item.id}
              className="bg-[var(--card)] rounded-xl shadow-sm overflow-hidden"
            >
              {/* 썸네일 */}
              {!isEditing && (
                item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt=""
                    className="w-full aspect-video object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="w-full aspect-video flex items-center justify-center"
                    style={{ background: SOURCE_BG[item.source] ?? 'linear-gradient(135deg, #1a1a1a, #333)' }}
                  >
                    <span className="text-white/50 text-xs font-semibold tracking-wide uppercase">{item.source}</span>
                  </div>
                )
              )}

              <div className="px-5 py-4 flex flex-col gap-2.5">
                {/* 소스 + 시간 + 번역여부 */}
                <div className="flex items-center gap-2 text-[10px] font-semibold">
                  <span className="text-[var(--accent)]">{item.source}</span>
                  <span className="text-[var(--muted)]">·</span>
                  <span className="text-[var(--muted)]">{formatTime(item.pubDate)}</span>
                  {!isTranslated && (
                    <span className="text-yellow-500 border border-yellow-500/40 rounded px-1 py-px">EN</span>
                  )}
                </div>

                {/* ─── 편집 모드 ─── */}
                {isEditing ? (
                  <div className="flex flex-col gap-3">
                    {/* 원문 참고 */}
                    <p className="text-[11px] text-[var(--muted)] bg-[var(--bg-2)] rounded p-2 leading-snug">
                      <span className="font-semibold">원문: </span>{item.titleEn}
                    </p>
                    {item.summaryEn && (
                      <p className="text-[11px] text-[var(--muted)] bg-[var(--bg-2)] rounded p-2 leading-snug">
                        <span className="font-semibold">원문 요약: </span>{item.summaryEn}
                      </p>
                    )}

                    {/* 한국어 제목 입력 */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-[var(--muted)]">한국어 제목</label>
                      <input
                        type="text"
                        value={editValues.titleKr}
                        onChange={e => setEditValues(v => ({ ...v, titleKr: e.target.value }))}
                        placeholder="한국어 제목 입력..."
                        className="text-sm bg-[var(--bg-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors"
                      />
                    </div>

                    {/* 한국어 요약 입력 */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-[var(--muted)]">한국어 요약</label>
                      <textarea
                        value={editValues.summaryKr}
                        onChange={e => setEditValues(v => ({ ...v, summaryKr: e.target.value }))}
                        placeholder="한국어 요약 입력..."
                        rows={3}
                        className="text-sm bg-[var(--bg-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors resize-none"
                      />
                    </div>

                    {/* 저장 / 취소 */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave(item.id)}
                        disabled={saving}
                        className="text-xs font-semibold bg-[var(--accent)] text-white rounded-lg px-4 py-1.5 disabled:opacity-50"
                      >
                        {saving ? '저장 중...' : '저장'}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs font-semibold text-[var(--muted)] border border-[var(--border)] rounded-lg px-4 py-1.5 hover:border-[var(--muted)] transition-colors"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* 제목 */}
                    <div className="flex items-start gap-2">
                      <Link
                        href={`/news/${slug}`}
                        className="flex-1 text-sm font-bold text-[var(--text)] hover:text-[var(--accent)] transition-colors leading-snug"
                      >
                        {displayTitle}
                      </Link>
                      {isAdmin && (
                        <button
                          onClick={() => openEdit(item)}
                          className="flex-shrink-0 text-[10px] font-semibold text-[var(--muted)] border border-[var(--border)] rounded px-1.5 py-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors mt-0.5"
                        >
                          번역
                        </button>
                      )}
                    </div>

                    {/* 요약 */}
                    {displaySummary && (
                      <p className="text-xs text-[var(--muted)] leading-relaxed line-clamp-2">
                        {displaySummary}
                      </p>
                    )}
                  </>
                )}

                {/* 이모지 반응 */}
                {!isEditing && (
                  <div className="flex flex-col gap-1.5 pt-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {EMOJIS.map(emoji => {
                        const count = itemReactions[emoji] ?? 0
                        const isMe  = myEmoji === emoji
                        return (
                          <button
                            key={emoji}
                            onClick={() => session ? handleReact(item.id, emoji) : undefined}
                            disabled={!session}
                            className={`flex items-center gap-1 text-xs rounded-full px-2.5 py-1 border transition-colors ${
                              !session
                                ? 'border-[var(--border)] text-[var(--muted)] opacity-40 cursor-not-allowed'
                                : isMe
                                  ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                                  : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                            }`}
                          >
                            <span>{emoji}</span>
                            <span className="tabular-nums">{count}</span>
                          </button>
                        )
                      })}
                    </div>
                    {!session && (
                      <p className="text-[10px] text-[var(--muted)]">
                        <a href="/login" className="text-[var(--accent)] hover:underline font-semibold">지금 로그인</a>
                        하고 감정을 표현하세요
                      </p>
                    )}
                  </div>
                )}
              </div>
            </article>
          )
        })
      )}
    </div>
  )
}
