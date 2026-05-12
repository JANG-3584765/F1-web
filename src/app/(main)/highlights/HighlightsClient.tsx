'use client'

import { useState, useMemo } from 'react'
import type { FetchedVideo, VideoSource, VideoType } from '@/lib/youtubeApi'

type SourceFilter = 'all' | VideoSource
type TypeFilter   = 'all' | VideoType

const SOURCE_TABS: { value: SourceFilter; label: string }[] = [
  { value: 'all',        label: '전체' },
  { value: 'official',   label: '공식' },
  { value: 'coupang',    label: '쿠팡' },
  { value: 'influencer', label: '인플루언서' },
]

const TYPE_TABS: { value: TypeFilter; label: string }[] = [
  { value: 'all',     label: '전체' },
  { value: 'f1',      label: 'F1' },
  { value: 'f2',      label: 'F2' },
  { value: 'f3',      label: 'F3' },
  { value: 'esports', label: 'e스포츠' },
  { value: 'other',   label: '기타' },
]

const BADGE_LABEL: Record<string, string> = {
  official:   '공식',
  coupang:    '쿠팡',
  influencer: '인플루언서',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

const TAB_BASE   = 'px-3 py-1.5 rounded-full text-sm font-bold border transition-colors cursor-pointer'
const TAB_ACTIVE = 'border-[rgba(225,6,0,0.35)] bg-[rgba(225,6,0,0.08)] text-[#9b0d08]'
const TAB_IDLE   = 'border-[var(--border)] bg-[var(--card)] text-[var(--text)] hover:bg-[var(--bg-2)]'

interface Props { videos: FetchedVideo[] }

export default function HighlightsClient({ videos }: Props) {
  const seasons = useMemo(() => {
    const s = [...new Set(videos.map(v => v.season))].sort((a, b) => b - a)
    return s
  }, [videos])

  const [selectedSeason, setSelectedSeason] = useState<number | 'all'>('all')
  const [selectedType,   setSelectedType]   = useState<TypeFilter>('all')
  const [selectedSource, setSelectedSource] = useState<SourceFilter>('all')
  const [shortsView,     setShortsView]     = useState<'slider' | 'grid'>('slider')

  const filtered = useMemo(() => {
    return videos.filter(v => {
      if (selectedSeason !== 'all' && v.season !== selectedSeason) return false
      if (selectedType   !== 'all' && v.type   !== selectedType)   return false
      if (selectedSource !== 'all' && v.source  !== selectedSource) return false
      return true
    })
  }, [videos, selectedSeason, selectedType, selectedSource])

  const regularVideos = useMemo(() => filtered.filter(v => !v.isShort), [filtered])
  const shortVideos   = useMemo(() => filtered.filter(v => v.isShort),  [filtered])

  return (
    <main className="max-w-5xl mx-auto px-4 pb-12 pt-6">
      <h1 className="text-2xl font-black mb-5">하이라이트</h1>

      {/* 필터 바 */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-3 flex flex-col gap-3 mb-5">

        {/* 시즌 */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-black text-[var(--muted)] w-12 shrink-0">시즌</span>
          <button
            onClick={() => setSelectedSeason('all')}
            className={`${TAB_BASE} ${selectedSeason === 'all' ? TAB_ACTIVE : TAB_IDLE}`}
          >
            전체
          </button>
          {seasons.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSeason(s)}
              className={`${TAB_BASE} ${selectedSeason === s ? TAB_ACTIVE : TAB_IDLE}`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* 콘텐츠 타입 */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-black text-[var(--muted)] w-12 shrink-0">종류</span>
          {TYPE_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setSelectedType(tab.value)}
              className={`${TAB_BASE} ${selectedType === tab.value ? TAB_ACTIVE : TAB_IDLE}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 소스 */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-black text-[var(--muted)] w-12 shrink-0">채널</span>
          {SOURCE_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setSelectedSource(tab.value)}
              className={`${TAB_BASE} ${selectedSource === tab.value ? TAB_ACTIVE : TAB_IDLE}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* 결과 수 */}
      <p className="text-xs font-bold text-[var(--muted)] mb-3">{filtered.length}개의 영상</p>

      {filtered.length === 0 ? (
        <p className="text-center text-[var(--muted)] py-16 font-bold">
          선택된 조건의 영상이 없습니다.
        </p>
      ) : (
        <>
          {/* 일반 영상 그리드 */}
          {regularVideos.length > 0 && (
            <>
              {shortVideos.length > 0 && (
                <p className="text-sm font-black mb-3">일반 영상 <span className="text-[var(--muted)] font-bold">({regularVideos.length}개)</span></p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {regularVideos.map(v => (
                  <a
                    key={v.id}
                    href={v.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-[var(--shadow)] hover:-translate-y-0.5 hover:shadow-lg transition-all block"
                  >
                    <div className="aspect-video bg-[var(--bg-2)]">
                      {v.thumbnailUrl ? (
                        <img src={v.thumbnailUrl} alt={v.title} loading="lazy" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--muted)] text-sm font-bold">썸네일 없음</div>
                      )}
                    </div>
                    <div className="p-3">
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-black border border-[rgba(225,6,0,0.22)] bg-[rgba(225,6,0,0.08)] text-[#9b0d08]">
                        {BADGE_LABEL[v.source] ?? v.source}
                      </span>
                      <h3 className="mt-2 mb-1.5 text-sm font-black leading-snug">{v.title}</h3>
                      <p className="text-xs font-bold text-[var(--muted)]">{v.channelTitle}</p>
                      <p className="mt-0.5 text-xs font-bold text-[var(--muted)]">{formatDate(v.publishedAt)}</p>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}

          {/* 쇼츠 섹션 */}
          {shortVideos.length > 0 && (
            <div className={regularVideos.length > 0 ? 'mt-10' : ''}>
              {/* 헤더 + 뷰 토글 */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-black">쇼츠 <span className="text-[var(--muted)] font-bold">({shortVideos.length}개)</span></p>
                <div className="flex rounded-lg border border-[var(--border)] overflow-hidden text-xs font-bold">
                  <button
                    onClick={() => setShortsView('slider')}
                    className={`px-3 py-1.5 transition-colors ${shortsView === 'slider' ? 'bg-[rgba(225,6,0,0.08)] text-[#9b0d08]' : 'bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--bg-2)]'}`}
                  >
                    슬라이더
                  </button>
                  <button
                    onClick={() => setShortsView('grid')}
                    className={`px-3 py-1.5 border-l border-[var(--border)] transition-colors ${shortsView === 'grid' ? 'bg-[rgba(225,6,0,0.08)] text-[#9b0d08]' : 'bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--bg-2)]'}`}
                  >
                    그리드
                  </button>
                </div>
              </div>

              {/* 슬라이더 모드 */}
              {shortsView === 'slider' && (
                <div className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory">
                  {shortVideos.map(v => (
                    <a
                      key={v.id}
                      href={v.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 w-36 sm:w-44 snap-start bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden hover:-translate-y-0.5 hover:shadow-lg transition-all block"
                    >
                      <div className="aspect-[9/16] bg-[var(--bg-2)]">
                        {v.thumbnailUrl ? (
                          <img src={v.thumbnailUrl} alt={v.title} loading="lazy" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[var(--muted)] text-xs font-bold">썸네일 없음</div>
                        )}
                      </div>
                      <div className="p-2">
                        <span className="inline-block px-1.5 py-0.5 rounded-full text-[10px] font-black border border-[rgba(225,6,0,0.22)] bg-[rgba(225,6,0,0.08)] text-[#9b0d08]">
                          {BADGE_LABEL[v.source] ?? v.source}
                        </span>
                        <h3 className="mt-1.5 text-xs font-black leading-snug line-clamp-3">{v.title}</h3>
                        <p className="mt-1 text-[10px] font-bold text-[var(--muted)]">{formatDate(v.publishedAt)}</p>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {/* 그리드 모드 */}
              {shortsView === 'grid' && (
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  {shortVideos.map(v => (
                    <a
                      key={v.id}
                      href={v.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden hover:-translate-y-0.5 hover:shadow-lg transition-all block"
                    >
                      <div className="aspect-[9/16] bg-[var(--bg-2)]">
                        {v.thumbnailUrl ? (
                          <img src={v.thumbnailUrl} alt={v.title} loading="lazy" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[var(--muted)] text-[10px] font-bold">썸네일 없음</div>
                        )}
                      </div>
                      <div className="p-1.5">
                        <span className="inline-block px-1.5 py-0.5 rounded-full text-[10px] font-black border border-[rgba(225,6,0,0.22)] bg-[rgba(225,6,0,0.08)] text-[#9b0d08]">
                          {BADGE_LABEL[v.source] ?? v.source}
                        </span>
                        <h3 className="mt-1 text-[10px] font-black leading-snug line-clamp-2">{v.title}</h3>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </main>
  )
}
