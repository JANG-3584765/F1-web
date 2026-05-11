'use client'

import { useState, useMemo } from 'react'
import { HIGHLIGHTS_DATA, type VideoSource } from '@/lib/highlightsData'

type SourceFilter = 'all' | VideoSource

const SOURCE_TABS: { value: SourceFilter; label: string }[] = [
  { value: 'all',        label: '전체' },
  { value: 'official',   label: '공식' },
  { value: 'coupang',    label: '쿠팡 쇼츠' },
  { value: 'influencer', label: '인플루언서' },
]

const BADGE_LABEL: Record<string, string> = {
  official:   '공식',
  coupang:    '쿠팡',
  influencer: '인플루언서',
}

function getYoutubeId(url: string): string {
  let m = url.match(/youtu\.be\/([0-9A-Za-z_-]{11})/)
  if (m?.[1]) return m[1]
  m = url.match(/[?&]v=([0-9A-Za-z_-]{11})/)
  if (m?.[1]) return m[1]
  m = url.match(/youtube\.com\/shorts\/([0-9A-Za-z_-]{11})/)
  return m?.[1] ?? ''
}

export default function HighlightsClient() {
  const seasons = HIGHLIGHTS_DATA.map(s => s.season)
  const [selectedSeason, setSelectedSeason] = useState(seasons[seasons.length - 1])
  const [selectedRound, setSelectedRound] = useState<'all' | number>('all')
  const [selectedSource, setSelectedSource] = useState<SourceFilter>('all')

  const seasonData = HIGHLIGHTS_DATA.find(s => s.season === selectedSeason)!
  const rounds = seasonData.rounds
  const roundKeys = Object.keys(rounds).sort((a, b) => Number(a) - Number(b))

  const videos = useMemo(() => {
    const targetKeys = selectedRound === 'all'
      ? roundKeys
      : roundKeys.filter(k => Number(k) === selectedRound)

    let list = targetKeys.flatMap(rk =>
      (rounds[rk].videos ?? [])
        .filter(v => v.videoUrl)
        .map(v => ({ ...v, round: Number(rk), city: rounds[rk].city }))
    )

    if (selectedSource !== 'all') {
      list = list.filter(v => v.source === selectedSource)
    }

    return list
  }, [rounds, roundKeys, selectedRound, selectedSource])

  return (
    <main className="max-w-5xl mx-auto px-4 pb-12 pt-6">
      <h1 className="text-2xl font-black mb-5">하이라이트</h1>

      {/* 필터 바 */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-3 flex flex-wrap gap-3 items-center mb-5">

        {/* 시즌 */}
        <select
          value={selectedSeason}
          onChange={e => {
            setSelectedSeason(Number(e.target.value))
            setSelectedRound('all')
          }}
          className="bg-[var(--input-bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm font-bold outline-none focus:border-[var(--accent)] cursor-pointer"
        >
          {seasons.map(s => (
            <option key={s} value={s}>{s} 시즌</option>
          ))}
        </select>

        {/* 라운드 */}
        <select
          value={selectedRound}
          onChange={e => setSelectedRound(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="bg-[var(--input-bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm font-bold outline-none focus:border-[var(--accent)] cursor-pointer"
        >
          <option value="all">전체 라운드</option>
          {roundKeys.map(rk => (
            <option key={rk} value={rk}>Round {rk} · {rounds[rk].city}</option>
          ))}
        </select>

        {/* 소스 탭 */}
        <div className="ml-auto flex flex-wrap gap-2">
          {SOURCE_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setSelectedSource(tab.value)}
              className={`px-3 py-2 rounded-full text-sm font-bold border transition-colors cursor-pointer ${
                selectedSource === tab.value
                  ? 'border-[rgba(225,6,0,0.35)] bg-[rgba(225,6,0,0.08)] text-[#9b0d08]'
                  : 'border-[var(--border)] bg-[var(--card)] text-[var(--text)] hover:bg-[var(--bg-2)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 그리드 */}
      {videos.length === 0 ? (
        <p className="text-center text-[var(--muted)] py-16 font-bold">
          선택된 조건의 영상이 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map(v => {
            const ytId = getYoutubeId(v.videoUrl)
            const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : ''

            return (
              <a
                key={v.id}
                href={v.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-[var(--shadow)] hover:-translate-y-0.5 hover:shadow-lg transition-all block"
              >
                <div className="aspect-video bg-[var(--bg-2)]">
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={v.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--muted)] text-sm font-bold">
                      썸네일 없음
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-black border border-[rgba(225,6,0,0.22)] bg-[rgba(225,6,0,0.08)] text-[#9b0d08]">
                    {BADGE_LABEL[v.source] ?? v.source}
                  </span>
                  <h3 className="mt-2 mb-1.5 text-sm font-black leading-snug">{v.title}</h3>
                  <p className="text-xs font-bold text-[var(--muted)]">Round {v.round} · {v.city}</p>
                  <p className="mt-0.5 text-xs font-bold text-[var(--muted)]">{v.provider}</p>
                </div>
              </a>
            )
          })}
        </div>
      )}
    </main>
  )
}
