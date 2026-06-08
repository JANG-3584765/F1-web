'use client'

import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const EMOJIS = ['🔥', '😮', '😂', '👏', '😢']

type ReactionMap = Record<string, Record<string, number>>

interface Props {
  articleUrl:  string
  isAdmin:     boolean
  isPublished: boolean
  titleEn:     string | null
  summaryEn:   string | null
  titleKr:     string | null
  summaryKr:   string | null
  contentKr:   string | null
  source:      string
  pubDate:     string
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`
}

export default function NewsDetailClient({
  articleUrl, isAdmin, isPublished: initialPublished, titleEn, summaryEn, titleKr, summaryKr, contentKr, source, pubDate,
}: Props) {
  const { data: session } = useSession()
  const router = useRouter()
  const [myEmoji, setMyEmoji] = useState<string | null>(null)
  const qc = useQueryClient()

  const [isEditing, setIsEditing] = useState(false)
  const [editValues, setEditValues] = useState({
    titleKr:   titleKr   ?? '',
    summaryKr: summaryKr ?? '',
    contentKr: contentKr ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(false)

  const [published, setPublished] = useState(initialPublished)
  const [publishing, setPublishing] = useState(false)

  const callPublishApi = async (isPublished: boolean) => {
    setPublishing(true)
    try {
      const res = await fetch('/api/news/publish', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ articleUrl, isPublished }),
      })
      if (res.ok) {
        setPublished(isPublished)
        router.refresh()
      }
    } finally {
      setPublishing(false)
    }
  }

  const handlePublish   = () => callPublishApi(true)
  const handleUnpublish = () => callPublishApi(false)

  const [savedData, setSavedData] = useState<{
    titleKr:   string | null
    summaryKr: string | null
    contentKr: string | null
  } | null>(null)

  const displayTitleKr   = savedData !== null ? savedData.titleKr   : titleKr
  const displaySummaryKr = savedData !== null ? savedData.summaryKr : summaryKr
  const displayContent   = savedData !== null ? savedData.contentKr : contentKr

  const displayTitle   = displayTitleKr   ?? titleEn
  const displaySummary = displaySummaryKr ?? summaryEn
  const isEnTitle      = !displayTitleKr   && !!titleEn
  const isEnSummary    = !displaySummaryKr && !!summaryEn

  useEffect(() => {
    try {
      const saved = localStorage.getItem('f1_my_reactions')
      if (saved) {
        const parsed = JSON.parse(saved) as Record<string, string>
        setMyEmoji(parsed[articleUrl] ?? null)
      }
    } catch { /* ignore */ }
  }, [articleUrl])

  const { data: reactions = {} } = useQuery<ReactionMap>({
    queryKey: ['news-reactions', articleUrl],
    queryFn:  async () => {
      const res = await fetch(`/api/news/reactions?newsIds=${encodeURIComponent(articleUrl)}`)
      return res.ok ? res.json() : {}
    },
    staleTime: 30_000,
  })

  const itemReactions = reactions[articleUrl] ?? {}

  const mutation = useMutation({
    mutationFn: async (emoji: string) => {
      const res = await fetch('/api/news/react', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ newsId: articleUrl, emoji }),
      })
      if (!res.ok) throw new Error(await res.text())
      return res.json() as Promise<{ action: 'added' | 'removed' }>
    },
    onMutate: async (emoji: string) => {
      await qc.cancelQueries({ queryKey: ['news-reactions', articleUrl] })
      const prev = qc.getQueryData<ReactionMap>(['news-reactions', articleUrl])
      const isToggleOff = myEmoji === emoji

      qc.setQueryData<ReactionMap>(['news-reactions', articleUrl], old => {
        const next = JSON.parse(JSON.stringify(old ?? {})) as ReactionMap
        if (!next[articleUrl]) next[articleUrl] = {}
        if (myEmoji && myEmoji !== emoji) {
          next[articleUrl][myEmoji] = Math.max(0, (next[articleUrl][myEmoji] ?? 0) - 1)
        }
        next[articleUrl][emoji] = Math.max(0, (next[articleUrl][emoji] ?? 0) + (isToggleOff ? -1 : 1))
        return next
      })

      const prevMyEmoji = myEmoji
      const newEmoji = isToggleOff ? null : emoji
      setMyEmoji(newEmoji)
      try {
        const saved = JSON.parse(localStorage.getItem('f1_my_reactions') ?? '{}') as Record<string, string>
        if (newEmoji) saved[articleUrl] = newEmoji
        else delete saved[articleUrl]
        localStorage.setItem('f1_my_reactions', JSON.stringify(saved))
      } catch { /* ignore */ }

      return { prev, prevMyEmoji }
    },
    onError: (e, _v, ctx) => {
      console.error('[reactions] 서버 오류:', e)
      if (ctx?.prev) qc.setQueryData(['news-reactions', articleUrl], ctx.prev)
      if (ctx?.prevMyEmoji !== undefined) {
        setMyEmoji(ctx.prevMyEmoji)
        try {
          const saved = JSON.parse(localStorage.getItem('f1_my_reactions') ?? '{}') as Record<string, string>
          if (ctx.prevMyEmoji) saved[articleUrl] = ctx.prevMyEmoji
          else delete saved[articleUrl]
          localStorage.setItem('f1_my_reactions', JSON.stringify(saved))
        } catch { /* ignore */ }
      }
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['news-reactions', articleUrl] }),
  })

  const handleReact = useCallback((emoji: string) => {
    mutation.mutate(emoji)
  }, [mutation])

  const openEdit = () => {
    setSaveError(false)
    setEditValues({
      titleKr:   (savedData !== null ? savedData.titleKr   : titleKr)   ?? '',
      summaryKr: (savedData !== null ? savedData.summaryKr : summaryKr) ?? '',
      contentKr: (savedData !== null ? savedData.contentKr : contentKr) ?? '',
    })
    setIsEditing(true)
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveError(false)
    try {
      const res = await fetch('/api/news/translate', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          articleUrl,
          titleKr:   editValues.titleKr   || null,
          summaryKr: editValues.summaryKr || null,
          contentKr: editValues.contentKr || null,
        }),
      })
      if (res.ok) {
        setSavedData({
          titleKr:   editValues.titleKr   || null,
          summaryKr: editValues.summaryKr || null,
          contentKr: editValues.contentKr || null,
        })
        setIsEditing(false)
      } else {
        setSaveError(true)
      }
    } catch {
      setSaveError(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-[var(--card)] rounded-xl shadow-sm px-6 py-6 flex flex-col gap-5">

      {/* 소스 + 날짜 + 어드민 버튼 */}
      <div className="flex items-center gap-2 text-xs font-semibold flex-wrap">
        <span className="text-[var(--accent)]">{source}</span>
        <span className="text-[var(--muted)]">·</span>
        <span className="text-[var(--muted)]">{formatDate(pubDate)}</span>
        {isAdmin && !isEditing && (
          <div className="ml-auto flex items-center gap-1.5">
            {!published && (
              <span className="text-[10px] font-semibold text-orange-500 border border-orange-500/40 rounded px-2 py-0.5">
                미승인
              </span>
            )}
            <button
              onClick={openEdit}
              className="text-[10px] font-semibold text-[var(--muted)] border border-[var(--border)] rounded px-2 py-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              편집
            </button>
            {published ? (
              <button
                onClick={handleUnpublish}
                disabled={publishing}
                className="text-[10px] font-semibold text-[var(--muted)] border border-[var(--border)] rounded px-2 py-0.5 hover:border-orange-500 hover:text-orange-500 transition-colors disabled:opacity-50"
              >
                {publishing ? '처리 중...' : '미승인 처리'}
              </button>
            ) : (
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="text-[10px] font-semibold text-green-600 border border-green-600/40 rounded px-2 py-0.5 hover:border-green-600 transition-colors disabled:opacity-50"
              >
                {publishing ? '공개 중...' : '공개하기'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── 편집 모드 ── */}
      {isEditing ? (
        <div className="flex flex-col gap-4">
          {/* 원문 참고 */}
          {titleEn && (
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-semibold text-[var(--muted)]">원문 제목</p>
              <p className="text-xs text-[var(--muted)] bg-[var(--bg-2)] rounded-lg px-3 py-2 leading-snug">{titleEn}</p>
            </div>
          )}
          {summaryEn && (
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-semibold text-[var(--muted)]">원문 요약</p>
              <p className="text-xs text-[var(--muted)] bg-[var(--bg-2)] rounded-lg px-3 py-2 leading-snug">{summaryEn}</p>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-[var(--muted)]">한국어 제목</label>
            <input
              type="text"
              value={editValues.titleKr}
              onChange={e => setEditValues(v => ({ ...v, titleKr: e.target.value }))}
              placeholder="한국어 제목..."
              className="text-sm bg-[var(--bg-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-[var(--muted)]">한국어 요약</label>
            <textarea
              value={editValues.summaryKr}
              onChange={e => setEditValues(v => ({ ...v, summaryKr: e.target.value }))}
              placeholder="한국어 요약..."
              rows={3}
              className="text-sm bg-[var(--bg-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold text-[var(--muted)]">
              한국어 본문
              <span className="ml-1.5 font-normal opacity-60">(단락 구분은 빈 줄)</span>
            </label>
            <textarea
              value={editValues.contentKr}
              onChange={e => setEditValues(v => ({ ...v, contentKr: e.target.value }))}
              placeholder="한국어 기사 본문을 작성하세요..."
              rows={14}
              className="text-sm bg-[var(--bg-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors resize-y leading-relaxed"
            />
          </div>

          {saveError && (
            <p className="text-xs text-red-500">저장에 실패했습니다. 다시 시도해 주세요.</p>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-xs font-semibold bg-[var(--accent)] text-white rounded-lg px-4 py-1.5 disabled:opacity-50"
            >
              {saving ? '저장 중...' : '저장'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="text-xs font-semibold text-[var(--muted)] border border-[var(--border)] rounded-lg px-4 py-1.5 hover:border-[var(--muted)] transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 제목 */}
          {displayTitle ? (
            <div className="flex items-start gap-2">
              <h1 className="flex-1 text-xl font-bold text-[var(--text)] leading-snug">
                {displayTitle}
              </h1>
              {isEnTitle && (
                <span className="flex-shrink-0 mt-1 text-[10px] font-semibold text-yellow-500 border border-yellow-500/40 rounded px-1.5 py-0.5">EN</span>
              )}
            </div>
          ) : null}

          {/* 요약 */}
          {displaySummary && (
            <div className="flex items-start gap-2">
              <p className="flex-1 text-sm text-[var(--muted)] leading-relaxed border-l-2 border-[var(--border)] pl-4">
                {displaySummary}
              </p>
              {isEnSummary && (
                <span className="flex-shrink-0 mt-0.5 text-[10px] font-semibold text-yellow-500 border border-yellow-500/40 rounded px-1.5 py-0.5">EN</span>
              )}
            </div>
          )}

          {/* 한국어 본문 */}
          {displayContent && (
            <>
              <hr className="border-[var(--border)]" />
              <div className="text-sm text-[var(--text)] leading-relaxed whitespace-pre-line">
                {displayContent}
              </div>
            </>
          )}

          {/* 원문 보기 안내 (번역 본문 없을 때) */}
          {!displayContent && (
            <p className="text-xs text-[var(--muted)]">
              전체 기사는 아래 원문 링크에서 확인하세요.
            </p>
          )}
        </>
      )}

      <hr className="border-[var(--border)]" />

      {/* 이모지 반응 */}
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

      <hr className="border-[var(--border)]" />

      {/* 원문 보기 */}
      <a
        href={articleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[var(--accent)] border border-[var(--accent)] rounded-lg px-4 py-2.5 hover:bg-[var(--accent)] hover:text-white transition-colors"
      >
        원문 보기 ({source}) →
      </a>
    </div>
  )
}
