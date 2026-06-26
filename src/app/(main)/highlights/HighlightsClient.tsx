'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
import Image from 'next/image'
import type { FetchedVideo, VideoSource, VideoType } from '@/lib/youtubeApi'
import type { LastRaceMini, PodiumEntry } from '@/lib/f1ResultsApi'
import type { StandingMini, ConstructorMini, NextRaceMini } from './page'

type SourceFilter = 'all' | VideoSource
type TypeFilter   = 'all' | VideoType
type MonthFilter  = 'all' | string

const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32']

const REGULAR_PAGE_SIZE = 12
const SHORTS_PAGE_SIZE  = 20

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

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-label="YouTube" role="img">
      <path fill="#FF0000" d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088C19.535 3.6 12 3.6 12 3.6s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205 31.247 31.247 0 0 0 0 12.01a31.247 31.247 0 0 0 .527 5.783 3.007 3.007 0 0 0 2.088 2.088C4.493 20.4 12 20.4 12 20.4s7.507 0 9.407-.518a3.007 3.007 0 0 0 2.088-2.088A31.247 31.247 0 0 0 24 12.01a31.247 31.247 0 0 0-.505-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
    </svg>
  )
}

// KST(UTC+9) 기준 월 키 — 서버·브라우저 타임존 무관
function getMonthKey(iso: string): string {
  const d = new Date(new Date(iso).getTime() + 9 * 3_600_000)
  return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
    timeZone: 'Asia/Seoul',
  })
}

const TAB_BASE   = 'shrink-0 px-3 py-1.5 rounded-full text-sm font-bold border transition-colors cursor-pointer'
const TAB_ACTIVE = 'border-[rgba(225,6,0,0.35)] bg-[rgba(225,6,0,0.08)] text-[#9b0d08]'
const TAB_IDLE   = 'border-[var(--border)] bg-[var(--card)] text-[var(--text)] hover:bg-[var(--bg-2)]'
const SEL_BASE   = 'bg-[var(--card)] border rounded-lg px-3 py-1.5 text-sm font-bold cursor-pointer focus:outline-none transition-colors'
const SEL_ACTIVE = 'border-[rgba(225,6,0,0.35)] text-[#9b0d08] bg-[rgba(225,6,0,0.06)]'
const SEL_IDLE   = 'border-[var(--border)] text-[var(--text)]'

interface Props {
  videos: FetchedVideo[]
  lastRace: LastRaceMini | null
  topStandings: StandingMini[] | null
  topConstructors: ConstructorMini[] | null
  nextRace: NextRaceMini | null
}

export default function HighlightsClient({ videos, lastRace, topStandings, topConstructors, nextRace }: Props) {
  const sliderRef = useRef<HTMLDivElement>(null)

  const seasons = useMemo(
    () => [...new Set(videos.map(v => v.season))].sort((a, b) => b - a),
    [videos]
  )

  const [selectedSeason, setSelectedSeason] = useState<number | 'all'>(() => seasons[0] ?? 'all')
  const [selectedType,   setSelectedType]   = useState<TypeFilter>('all')
  const [selectedSource, setSelectedSource] = useState<SourceFilter>('all')
  const [selectedMonth,  setSelectedMonth]  = useState<MonthFilter>('all')
  const [shortsView,     setShortsView]     = useState<'slider' | 'grid'>('slider')
  const [regularLimit,   setRegularLimit]   = useState(REGULAR_PAGE_SIZE)
  const [shortsLimit,    setShortsLimit]    = useState(SHORTS_PAGE_SIZE)
  const [playingVideo,   setPlayingVideo]   = useState<FetchedVideo | null>(null)
  const [subGuideOpen,     setSubGuideOpen]     = useState(false)
  const [selectedChannel,  setSelectedChannel]  = useState<string>('all')

  // 시즌·종류·채널 변경 → 월·인플루언서채널 초기화 + limit 동시 초기화 (이중 실행 방지)
  useEffect(() => {
    setSelectedMonth('all')
    setSelectedChannel('all')
    setRegularLimit(REGULAR_PAGE_SIZE)
    setShortsLimit(SHORTS_PAGE_SIZE)
  }, [selectedSeason, selectedType, selectedSource])

  // 월 변경 → limit만 초기화
  useEffect(() => {
    setRegularLimit(REGULAR_PAGE_SIZE)
    setShortsLimit(SHORTS_PAGE_SIZE)
  }, [selectedMonth])

  // 모달 열림 → 스크롤 잠금 + ESC 닫기
  useEffect(() => {
    if (!playingVideo) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setPlayingVideo(null) }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [playingVideo])

  // 시즌·종류·채널로 1차 필터링
  const preFiltered = useMemo(() => videos.filter(v => {
    if (selectedSeason !== 'all' && v.season !== selectedSeason) return false
    if (selectedType   !== 'all' && v.type   !== selectedType)   return false
    if (selectedSource !== 'all' && v.source  !== selectedSource) return false
    return true
  }), [videos, selectedSeason, selectedType, selectedSource])

  // 현재 풀에 실제로 존재하는 타입만 추출 → 빈 결과 탭 노출 방지
  const availableTypes = useMemo(
    () => new Set(preFiltered.map(v => v.type)),
    [preFiltered]
  )

  // 선택 가능한 월 목록 (KST 최신순)
  const availableMonths = useMemo(() => {
    const keys = [...new Set(preFiltered.map(v => getMonthKey(v.publishedAt)))]
    return keys.sort((a, b) => {
      const [ay, am] = a.split('-').map(Number)
      const [by, bm] = b.split('-').map(Number)
      return ay !== by ? by - ay : bm - am
    })
  }, [preFiltered])

  // 2개월 이상 & publishedAt 연도가 선택 시즌과 일치할 때만 월 필터 표시
  const showMonthFilter = useMemo(() => {
    if (availableMonths.length <= 1 || selectedSeason === 'all') return false
    return availableMonths.every(key => key.startsWith(`${selectedSeason}-`))
  }, [availableMonths, selectedSeason])

  // 인플루언서 탭일 때 노출할 채널 목록
  const availableInfluencerChannels = useMemo(() => {
    if (selectedSource !== 'influencer') return []
    return [...new Set(preFiltered.map(v => v.channelTitle))].sort()
  }, [preFiltered, selectedSource])

  // 월·채널까지 적용한 최종 결과
  const filtered = useMemo(() => {
    let result = preFiltered
    if (selectedMonth !== 'all') result = result.filter(v => getMonthKey(v.publishedAt) === selectedMonth)
    if (selectedSource === 'influencer' && selectedChannel !== 'all') {
      result = result.filter(v => v.channelTitle === selectedChannel)
    }
    return result
  }, [preFiltered, selectedMonth, selectedSource, selectedChannel])

  const regularVideos = useMemo(() => filtered.filter(v => !v.isShort), [filtered])
  const shortVideos   = useMemo(() => filtered.filter(v => v.isShort),  [filtered])

  const visibleRegular = useMemo(
    () => regularVideos.slice(0, regularLimit),
    [regularVideos, regularLimit]
  )
  const visibleShorts = useMemo(
    () => shortVideos.slice(0, shortsLimit),
    [shortVideos, shortsLimit]
  )

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 pb-12 pt-6 overflow-x-hidden">
      <h1 className="text-2xl font-black mb-5">하이라이트</h1>

      {/* 독자 콘텐츠 위젯 — 2×2 그리드 */}
      {(lastRace || topStandings || topConstructors || nextRace) && (
        <div className="grid grid-cols-2 gap-3 mb-5">

          {/* A: 최근 레이스 */}
          {lastRace && (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden flex flex-col">
              <div className="h-0.5 bg-[var(--accent)]" />
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-wider mb-2">최근 레이스</p>
                  <div className="flex items-center gap-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://flagcdn.com/w20/${lastRace.flag}.png`} alt="" className="h-3.5 rounded-[2px] shrink-0" />
                    <p className="text-sm font-black leading-tight">{lastRace.raceName}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-3">
                  {lastRace.podium.map((p: PodiumEntry, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[11px] font-black w-5 shrink-0 tabular-nums" style={{ color: MEDAL_COLORS[i] }}>P{i + 1}</span>
                      <div className="w-0.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: p.teamColor }} />
                      <span className="text-xs font-bold truncate">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* C: 다음 레이스 */}
          {nextRace && (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden flex flex-col">
              <div className="h-0.5 bg-[var(--accent)]" />
              <div className="p-4 flex flex-col flex-1 justify-between">
                {/* 상단: 레이블 + 레이스명 */}
                <div>
                  <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-wider mb-2">다음 레이스</p>
                  <div className="flex items-center gap-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://flagcdn.com/w20/${nextRace.flag}.png`} alt="" className="h-3.5 rounded-[2px] shrink-0" />
                    <p className="text-sm font-black leading-tight">{nextRace.raceName}</p>
                  </div>
                </div>
                {/* 하단: 라운드·날짜·시간(좌) + D-X(우) */}
                <div className="border-t border-[var(--border)] mt-3 pt-3 flex items-end justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-bold text-[var(--muted)]">Round {nextRace.round}</p>
                    <p className="text-xs font-black">{nextRace.date}</p>
                    {nextRace.timeKST && (
                      <p className="text-[11px] font-bold text-[var(--muted)]">결승 {nextRace.timeKST} KST</p>
                    )}
                  </div>
                  <p className="text-3xl font-black text-[var(--accent)] shrink-0">
                    {nextRace.daysUntil === 0 ? 'TODAY' : `D-${nextRace.daysUntil}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* B: 드라이버 챔피언십 */}
          {topStandings && topStandings.length > 0 && (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden flex flex-col">
              <div className="h-0.5 bg-[var(--accent)]" />
              <div className="p-4 flex flex-col flex-1 justify-between">
                <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-wider mb-3">드라이버 챔피언십</p>
                <div className="flex flex-col gap-2 flex-1 justify-between">
                  {topStandings.map((s, i) => (
                    <div key={s.position} className="flex items-center gap-2">
                      <span className="text-[11px] font-black w-5 shrink-0 tabular-nums" style={{ color: MEDAL_COLORS[i] }}>P{s.position}</span>
                      <div className="w-0.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: s.teamColor }} />
                      <span className="text-xs font-bold flex-1 truncate">{s.name}</span>
                      <span className="text-xs font-black tabular-nums text-[var(--muted)]">{s.points}pt</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* D: 컨스트럭터 챔피언십 */}
          {topConstructors && topConstructors.length > 0 && (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden flex flex-col">
              <div className="h-0.5 bg-[var(--accent)]" />
              <div className="p-4 flex flex-col flex-1 justify-between">
                <p className="text-[10px] font-black text-[var(--muted)] uppercase tracking-wider mb-3">컨스트럭터 챔피언십</p>
                <div className="flex flex-col gap-2 flex-1 justify-between">
                  {topConstructors.map((c, i) => (
                    <div key={c.position} className="flex items-center gap-2">
                      <span className="text-[11px] font-black w-5 shrink-0 tabular-nums" style={{ color: MEDAL_COLORS[i] }}>P{c.position}</span>
                      <div className="w-0.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: c.teamColor }} />
                      <span className="text-xs font-bold flex-1 truncate">{c.name}</span>
                      <span className="text-xs font-black tabular-nums text-[var(--muted)]">{c.points}pt</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 필터 바 */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden mb-5 divide-y divide-[var(--border)]">

        {/* 시즌 */}
        <div className="flex items-center gap-3 px-4 py-2.5">
          <span className="shrink-0 text-[10px] font-black text-[var(--muted)] uppercase">시즌</span>
          <div className="shrink-0 w-px h-3 bg-[var(--border)]" />
          <select
            value={selectedSeason}
            onChange={e => setSelectedSeason(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className={`${SEL_BASE} ${selectedSeason !== 'all' ? SEL_ACTIVE : SEL_IDLE}`}
          >
            <option value="all">전체 시즌</option>
            {seasons.map(s => <option key={s} value={s}>{s}시즌</option>)}
          </select>
        </div>

        {/* 종류 — 현재 풀에 있는 타입만 표시 */}
        <div className="flex items-center gap-2 px-4 py-2.5 overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
          <span className="shrink-0 text-[10px] font-black text-[var(--muted)] uppercase">종류</span>
          <div className="shrink-0 w-px h-3 bg-[var(--border)]" />
          {TYPE_TABS.filter(tab => tab.value === 'all' || availableTypes.has(tab.value as VideoType)).map(tab => (
            <button type="button" key={tab.value} onClick={() => setSelectedType(tab.value)} className={`${TAB_BASE} ${selectedType === tab.value ? TAB_ACTIVE : TAB_IDLE}`}>{tab.label}</button>
          ))}
        </div>

        {/* 채널 */}
        <div className="flex items-center gap-2 px-4 py-2.5 overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
          <span className="shrink-0 text-[10px] font-black text-[var(--muted)] uppercase">채널</span>
          <div className="shrink-0 w-px h-3 bg-[var(--border)]" />
          {SOURCE_TABS.map(tab => (
            <button type="button" key={tab.value} onClick={() => setSelectedSource(tab.value)} className={`${TAB_BASE} ${selectedSource === tab.value ? TAB_ACTIVE : TAB_IDLE}`}>{tab.label}</button>
          ))}
        </div>

        {/* 유튜버 서브필터 — 인플루언서 탭 선택 시만 표시 */}
        {availableInfluencerChannels.length > 1 && (
          <div className="flex items-center gap-3 px-4 py-2.5 bg-[var(--bg-2)]">
            <span className="shrink-0 text-[10px] font-black text-[var(--muted)] uppercase">유튜버</span>
            <div className="shrink-0 w-px h-3 bg-[var(--border)]" />
            <select
              value={selectedChannel}
              onChange={e => setSelectedChannel(e.target.value)}
              className={`${SEL_BASE} ${selectedChannel !== 'all' ? SEL_ACTIVE : SEL_IDLE}`}
            >
              <option value="all">전체 채널</option>
              {availableInfluencerChannels.map(ch => <option key={ch} value={ch}>{ch}</option>)}
            </select>
          </div>
        )}

        {/* 월 — 2개월 이상이고 발행연도가 시즌과 일치할 때만 표시 */}
        {showMonthFilter && (
          <div className="flex items-center gap-2 px-4 py-2.5 overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            <span className="shrink-0 text-[10px] font-black text-[var(--muted)] uppercase">월</span>
            <div className="shrink-0 w-px h-3 bg-[var(--border)]" />
            <button type="button" onClick={() => setSelectedMonth('all')} className={`${TAB_BASE} ${selectedMonth === 'all' ? TAB_ACTIVE : TAB_IDLE}`}>전체</button>
            {availableMonths.map(key => (
              <button type="button" key={key} onClick={() => setSelectedMonth(key)} className={`${TAB_BASE} ${selectedMonth === key ? TAB_ACTIVE : TAB_IDLE}`}>{key.split('-')[1]}월</button>
            ))}
          </div>
        )}

      </div>

      {/* 자막 가이드 아코디언 */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden mb-5">
        <button
          type="button"
          onClick={() => setSubGuideOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-3 text-left"
        >
          <span className="text-xs font-black">영어 영상 한국어 자막 켜는 법</span>
          <svg
            className={`w-4 h-4 text-[var(--muted)] transition-transform duration-200 ${subGuideOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {subGuideOpen && (
          <div className="px-4 pb-4 border-t border-[var(--border)]">
            <div className="flex flex-wrap gap-x-5 gap-y-1 pt-3">
              <p className="text-xs font-bold text-[var(--muted)]">
                <span className="text-[var(--text)]">① 영상 하단 ⚙ 설정</span> 클릭
              </p>
              <p className="text-xs font-bold text-[var(--muted)]">
                ② <span className="text-[var(--text)]">자막</span> 선택
              </p>
              <p className="text-xs font-bold text-[var(--muted)]">
                ③ <span className="text-[var(--text)]">자동 번역 → 한국어</span> 선택
              </p>
            </div>
            <p className="mt-2 text-[10px] text-[var(--muted)]">자동 생성 자막이라 완벽하지 않지만 영어 F1 콘텐츠 이해에 도움이 됩니다.</p>
          </div>
        )}
      </div>

      {/* 결과 수 */}
      <p className="text-xs font-bold text-[var(--muted)] mb-3">{filtered.length}개의 영상</p>

      {filtered.length === 0 ? (
        <p className="text-center text-[var(--muted)] py-16 font-bold">
          선택된 조건의 영상이 없습니다.
        </p>
      ) : (
        <>
          {/* 쇼츠 섹션 — 일반 영상보다 먼저 노출 */}
          {shortVideos.length > 0 && (
            <div className={regularVideos.length > 0 ? 'mb-8' : ''}>
              {/* 헤더 + 뷰 토글 */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-black">
                  쇼츠 <span className="text-[var(--muted)] font-bold">({shortVideos.length}개)</span>
                </p>
                <div className="flex rounded-lg border border-[var(--border)] overflow-hidden text-xs font-bold">
                  <button type="button"
                    onClick={() => setShortsView('slider')}
                    className={`px-3 py-1.5 transition-colors ${shortsView === 'slider' ? 'bg-[rgba(225,6,0,0.08)] text-[#9b0d08]' : 'bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--bg-2)]'}`}
                  >
                    슬라이더
                  </button>
                  <button type="button"
                    onClick={() => setShortsView('grid')}
                    className={`px-3 py-1.5 border-l border-[var(--border)] transition-colors ${shortsView === 'grid' ? 'bg-[rgba(225,6,0,0.08)] text-[#9b0d08]' : 'bg-[var(--card)] text-[var(--muted)] hover:bg-[var(--bg-2)]'}`}
                  >
                    그리드
                  </button>
                </div>
              </div>

              {/* 슬라이더 모드 */}
              {shortsView === 'slider' && (
                <div ref={sliderRef} className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory">
                  {visibleShorts.map(v => (
                    <div
                      key={v.id}
                      onClick={() => setPlayingVideo(v)}
                      className="shrink-0 w-28 sm:w-36 snap-start bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden hover:-translate-y-0.5 hover:shadow-lg transition-[transform,box-shadow] duration-200 block cursor-pointer"
                    >
                      <div className="aspect-[9/16] bg-[var(--bg-2)] relative overflow-hidden group/thumb">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg`}
                          alt={v.title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={e => {
                            const img = e.currentTarget as HTMLImageElement
                            const steps = [
                              `https://i.ytimg.com/vi/${v.id}/oardefault.jpg`,
                              `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
                              '',
                            ]
                            const step = Number(img.dataset.fallback ?? '0')
                            if (step >= steps.length) {
                              img.style.display = 'none'
                              const ph = img.parentElement?.querySelector<HTMLElement>('.short-placeholder')
                              if (ph) ph.style.display = 'flex'
                              return
                            }
                            img.dataset.fallback = String(step + 1)
                            img.src = steps[step] || v.thumbnailUrl
                          }}
                        />
                        <div className="short-placeholder absolute inset-0 hidden items-center justify-center bg-gradient-to-b from-neutral-800 to-neutral-900">
                          <div className="w-10 h-10 rounded-full bg-[rgba(225,6,0,0.15)] border border-[rgba(225,6,0,0.3)] flex items-center justify-center">
                            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[10px] border-l-[#e10600] ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <span className="inline-block px-1.5 py-0.5 rounded-full text-[10px] font-black border border-[rgba(225,6,0,0.22)] bg-[rgba(225,6,0,0.08)] text-[#9b0d08]">
                          {BADGE_LABEL[v.source] ?? v.source}
                        </span>
                        <h3 className="mt-1.5 text-xs font-black leading-snug line-clamp-3">{v.title}</h3>
                        <p className="mt-1 text-[10px] font-bold text-[var(--muted)] flex items-center gap-0.5">
                          <YouTubeIcon className="w-3 h-2 shrink-0" />
                          {formatDate(v.publishedAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 그리드 모드 */}
              {shortsView === 'grid' && (
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  {visibleShorts.map(v => (
                    <div
                      key={v.id}
                      onClick={() => setPlayingVideo(v)}
                      className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden hover:-translate-y-0.5 hover:shadow-lg transition-[transform,box-shadow] duration-200 block cursor-pointer"
                    >
                      <div className="aspect-[9/16] bg-[var(--bg-2)] relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://i.ytimg.com/vi/${v.id}/oardefault.jpg`}
                          alt={v.title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={e => {
                            const img = e.currentTarget as HTMLImageElement
                            const steps = [
                              `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
                              v.thumbnailUrl,
                            ]
                            const step = Number(img.dataset.fallback ?? '0')
                            if (step >= steps.length || !steps[step]) { img.style.display = 'none'; return }
                            img.dataset.fallback = String(step + 1)
                            img.src = steps[step]
                          }}
                        />
                      </div>
                      <div className="p-1.5">
                        <span className="inline-block px-1.5 py-0.5 rounded-full text-[10px] font-black border border-[rgba(225,6,0,0.22)] bg-[rgba(225,6,0,0.08)] text-[#9b0d08]">
                          {BADGE_LABEL[v.source] ?? v.source}
                        </span>
                        <h3 className="mt-1 text-[10px] font-black leading-snug line-clamp-2">{v.title}</h3>
                        <YouTubeIcon className="mt-1 w-3 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {shortVideos.length > shortsLimit && (
                <div className="flex justify-center mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      flushSync(() => setShortsLimit(prev => prev + SHORTS_PAGE_SIZE))
                      sliderRef.current?.scrollTo({ left: sliderRef.current.scrollWidth, behavior: 'smooth' })
                    }}
                    className="px-6 py-2.5 rounded-full border border-[var(--border)] bg-[var(--card)] text-sm font-bold text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                  >
                    더보기 ({shortVideos.length - shortsLimit}개 남음)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 일반 영상 그리드 */}
          {regularVideos.length > 0 && (
            <>
              {shortVideos.length > 0 && (
                <p className="text-sm font-black mb-3">
                  일반 영상 <span className="text-[var(--muted)] font-bold">({regularVideos.length}개)</span>
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleRegular.map((v, i) => (
                  <div
                    key={v.id}
                    onClick={() => setPlayingVideo(v)}
                    className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-[var(--shadow)] hover:-translate-y-0.5 hover:shadow-lg transition-[transform,box-shadow] duration-200 block cursor-pointer"
                  >
                    <div className="aspect-video bg-[var(--bg-2)] relative overflow-hidden group">
                      {v.thumbnailUrl ? (
                        <Image
                          src={v.thumbnailUrl}
                          alt={v.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1023px) calc(50vw - 2rem), 320px"
                          priority={i < 4}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[var(--muted)] text-sm font-bold">썸네일 없음</div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                          <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[14px] border-l-gray-900 ml-1" />
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-black border border-[rgba(225,6,0,0.22)] bg-[rgba(225,6,0,0.08)] text-[#9b0d08]">
                        {BADGE_LABEL[v.source] ?? v.source}
                      </span>
                      <h3 className="mt-2 mb-1.5 text-sm font-black leading-snug break-words">{v.title}</h3>
                      <p className="text-xs font-bold text-[var(--muted)] flex items-center gap-1">
                        <YouTubeIcon className="w-3.5 h-2.5 shrink-0" />
                        {v.channelTitle}
                      </p>
                      <p className="mt-0.5 text-xs font-bold text-[var(--muted)]">{formatDate(v.publishedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
              {regularVideos.length > regularLimit && (
                <div className="flex justify-center mt-6">
                  <button
                    type="button"
                    onClick={() => setRegularLimit(prev => prev + REGULAR_PAGE_SIZE)}
                    className="px-6 py-2.5 rounded-full border border-[var(--border)] bg-[var(--card)] text-sm font-bold text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                  >
                    더보기 ({regularVideos.length - regularLimit}개 남음)
                  </button>
                </div>
              )}
            </>
          )}

        </>
      )}
      {/* 영상 플레이어 모달 */}
      {playingVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setPlayingVideo(null)}
        >
          <div
            className={`relative w-full ${playingVideo.isShort ? 'max-w-xs' : 'max-w-3xl'}`}
            onClick={e => e.stopPropagation()}
          >
            <div className={`${playingVideo.isShort ? 'aspect-[9/16]' : 'aspect-video'} bg-black rounded-t-xl overflow-hidden`}>
              <iframe
                src={`https://www.youtube.com/embed/${playingVideo.id}?autoplay=1`}
                title={playingVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="bg-[var(--card)] rounded-b-xl px-4 py-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-black leading-snug line-clamp-2">{playingVideo.title}</p>
                <p className="mt-1 text-xs font-bold text-[var(--muted)] flex items-center gap-1">
                  <YouTubeIcon className="w-3.5 h-2.5 shrink-0" />
                  {playingVideo.channelTitle}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={playingVideo.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                >
                  YouTube ↗
                </a>
                <button
                  type="button"
                  onClick={() => setPlayingVideo(null)}
                  className="text-xs font-bold text-[var(--muted)] hover:text-[var(--text)] transition-colors px-2 py-1 rounded border border-[var(--border)]"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
