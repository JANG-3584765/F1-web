import { getAllHighlightVideos, type ChannelConfig } from '@/lib/youtubeApi'
import { fetchLastRacePodium, type LastRaceMini } from '@/lib/f1ResultsApi'
import { fetchDriverStandings, fetchConstructorStandings } from '@/lib/f1StandingsApi'
import { GP_NAMES, COUNTRY_CODES } from '@/lib/f1Api'
import HighlightsClient from './HighlightsClient'

export const revalidate = 3600

// 플레이리스트 ID 찾는 법: youtube.com/@Formula1/playlists → 원하는 재생목록 클릭 → URL의 list=PL... 복사
const CHANNELS: ChannelConfig[] = [
  // ── F1 공식 2026 ─────────────────────────────────────────────
  { playlistId: 'PLfoNZDHitwjVo5NISHAaA2jKRdTHhAMDq', source: 'official', season: 2026, type: 'f1'     }, // 프리시즌
  { playlistId: 'PLfoNZDHitwjX8Mu-P_XGdkTyQ7-fohUwB', source: 'official', season: 2026, type: 'f1'     }, // 호주 GP
  { playlistId: 'PLfoNZDHitwjVUgc0VemLNA-21SzaGolYK', source: 'official', season: 2026, type: 'f1'     }, // 중국 GP
  { playlistId: 'PLfoNZDHitwjXbELZ-aWNVTBXwDQFo6CUs', source: 'official', season: 2026, type: 'f1'     }, // 일본 GP
  { playlistId: 'PLfoNZDHitwjXPl6fAm6fhin3_aiX54FmB', source: 'official', season: 2026, type: 'f1'     }, // 마이애미 GP
  { playlistId: 'PLfoNZDHitwjVjPf0I_WIabs3DOSz59ol5', source: 'official', season: 2026, type: 'f2'     }, // F2 챔피언십
  { playlistId: 'PLfoNZDHitwjXxX2GDkQCQAafRUt0-e0nC', source: 'official', season: 2026, type: 'f3'     }, // F3 챔피언십
  { playlistId: 'PLfoNZDHitwjXtQvJy5Zj7dWQxdYnJbzUs', source: 'official', season: 2026, type: 'f3'     }, // F3 하이라이트
  { playlistId: 'PLfoNZDHitwjXYi_9_PkWXU_7Xh2sg2rqf', source: 'official', season: 2026, type: 'f2'     }, // F2 하이라이트
  { playlistId: 'PLfoNZDHitwjVniR1_CjG3Ok4st5QMCfiE', source: 'official', season: 2026, type: 'f1'     }, // Chasing the Dream
  { playlistId: 'PLfoNZDHitwjVbWmC_Mujg2CqzmU2mKoWi', source: 'official', season: 2026, type: 'f1'     }, // 라디오 리와인드
  { playlistId: 'PLfoNZDHitwjW7Rmf6JhWvL0-nnIhS1hYf', source: 'official', season: 2026, type: 'esports' }, // 심 레이싱

  // ── 쿠팡 ─────────────────────────────────────────────────────
  { playlistId: 'PLWTZYHe9YKAKE-coWfbasV22V7-YNTmAv', source: 'coupang', type: 'f1', inferType: true, inferSeason: true, maxVideos: 600 }, // season·type 제목 키워드로 자동 감지

  // ── 인플루언서 ────────────────────────────────────────────────
  { playlistId: 'PLFVYzSwyd-dFrhob1xpUfBxTawMOBP7ms', source: 'influencer', season: 2026, type: 'f1' }, // 원투피니시 2026시즌 리뷰
  { playlistId: 'PLFVYzSwyd-dF5_9cY9N82WYXkOubAV8Q2', source: 'influencer', season: 2026, type: 'f1' }, // 원투피니시 2026시즌 분석
  { playlistId: 'PLJ20G4cPlX-dsu_TX4XvLXQ6egNKJTDXg', source: 'influencer', type: 'f1' },               // Box to Pass F1 그랑프리 프리뷰·리뷰
  { playlistId: 'PLJ20G4cPlX-eGmu68jwLma0SeKRdU_13I', source: 'influencer', type: 'f1' },               // Box to Pass F1 NEWS
  { playlistId: 'PLJ20G4cPlX-dDdwukEMxrv3k251nOZLYl', source: 'influencer', type: 'f1' },               // Box to Pass F1 명승부 시리즈

  // ── 케로군 (Jesus Yoon) ───────────────────────────────────────
  { playlistId: 'PLJ1ZJ2o57OB1x3R9n0mNVyf5IPz-W2qPu', source: 'influencer', season: 2026, type: 'f1' }, // 2026 F1 주간리뷰
  { playlistId: 'PLJ1ZJ2o57OB2zlLthaJWhrgQFZvxivbJx', source: 'influencer', season: 2025, type: 'f1' }, // 2025 F1 주간리뷰
  { playlistId: 'PLJ1ZJ2o57OB25z9zuj-6wLqJ5HBycOBYc', source: 'influencer', season: 2024, type: 'f1' }, // 2024 F1 주간리뷰
  { playlistId: 'PLJ1ZJ2o57OB1awIptKq7Vwr0h_6chrRF_', source: 'influencer', season: 2023, type: 'f1' }, // 2023 F1 주간리뷰
  { playlistId: 'PLJ1ZJ2o57OB2eFvBaBR-rlgV7dh7BER85', source: 'influencer', season: 2022, type: 'f1' }, // 2022 F1 주간리뷰
  { playlistId: 'PLJ1ZJ2o57OB2ffl_dgsdf8MIz4ef29Xng', source: 'influencer', type: 'f1', inferSeason: true }, // F1 그랑프리 리뷰 (멀티시즌)
  { playlistId: 'PLJ1ZJ2o57OB0E4vJe5Epd_fDOUPjhbnED', source: 'influencer', type: 'f1', inferSeason: true }, // 퍼플섹터 (프리뷰)

  // ── 결승선그랑프리 ───────────────────────────────────────────────
  { playlistId: 'PLByKVKRnkd-CAHna4kAf-9zuzuBOsIefX', source: 'influencer', season: 2026, type: 'f1' }, // 2026년 F1 모든 GP
  { playlistId: 'PLByKVKRnkd-DbS91B0Pym84H7IfCoIvX7', source: 'influencer', season: 2025, type: 'f1' }, // F1 2025의 모든 GP
  { playlistId: 'PLByKVKRnkd-B02ofx6LEUew7T01tDdal1', source: 'influencer', type: 'f1', inferSeason: true }, // 포뮬러1 최신 뉴스
  { playlistId: 'PLByKVKRnkd-DGfdwF8mwMo78pSbyyiK47', source: 'influencer', type: 'f1', inferSeason: true }, // 빠른 포뮬러1 뉴스

  // ── 크레이지 포뮬러 ──────────────────────────────────────────
  { playlistId: 'PLXEVhVsZwEjaHR11yp4FCTd8NBpRh-GDm', source: 'influencer', season: 2026, type: 'f1' }, // 2026시즌 그랑프리
  { playlistId: 'PLXEVhVsZwEjZQRWMZiZ4PjV93RvFuZHej', source: 'influencer', season: 2025, type: 'f1' }, // 2025시즌 매치 리뷰/프리뷰
  { playlistId: 'PLXEVhVsZwEjbDNNO4nh7RE4zIRD6mxusY', source: 'influencer', season: 2024, type: 'f1' }, // 2024시즌 그랑프리 프리뷰&리뷰
  { playlistId: 'PLXEVhVsZwEjZYEpXgDSG93ev6xngNjiAO', source: 'influencer', type: 'f1', inferSeason: true }, // F1의 모든 유망주들
  { playlistId: 'PLXEVhVsZwEjYYcH1r0kJCYB9tArpf_3ea', source: 'influencer', type: 'f1', inferSeason: true }, // 크고 작은 뉴스 및 비시즌 소식들

  // ── 퍼플섹터 (채널) ──────────────────────────────────────────
  { playlistId: 'PLw8ExlQ65p11tMHXSVqufGOpPOFL266Rj', source: 'influencer', season: 2026, type: 'f1' }, // F1 2026 서킷 프리뷰
  { playlistId: 'PLw8ExlQ65p138SWp2TtU6qaoEbwaRV6JC', source: 'influencer', season: 2026, type: 'f1' }, // F1 2026 그랑프리 리뷰
  { playlistId: 'PLw8ExlQ65p137w6-_Syq5dkH4EKk7eBHa', source: 'influencer', season: 2026, type: 'f1' }, // F1 2026 뉴스/이슈

  // ── 시케인 ────────────────────────────────────────────────────
  { playlistId: 'PL_xxLl39V_HZPjoaPfQZmwmvLFXrPgSb2', source: 'influencer', type: 'f1',    inferSeason: true }, // F1 그랑프리 프리뷰 및 서킷 소개
  { playlistId: 'PL_xxLl39V_HZPWi-u91GOD9dMFAkz2zh_', source: 'influencer', type: 'f1',    inferSeason: true }, // F1 그랑프리 리뷰
  { playlistId: 'PL_xxLl39V_HbHsiuBeiDql170-_mb2nNA', source: 'influencer', type: 'other', inferSeason: true }, // 기타 레이스
]

// 제목 수동 수정: 영상 ID(watch?v= 뒤 11자리)를 키로, 원하는 제목을 값으로 추가
const TITLE_OVERRIDES: Record<string, string> = {
  // 예시) 'dQw4w9WgXcQ': '2025 바레인 그랑프리 레이스 하이라이트',
}

// 시즌 수동 지정: 제목에 연도가 없어 자동 감지가 안 되는 재중계 영상용
const SEASON_OVERRIDES: Record<string, number> = {
  // 예시) 'dQw4w9WgXcQ': 2021,
}

export interface StandingMini {
  position: number
  name: string
  team: string
  teamColor: string
  points: number
}

export interface ConstructorMini {
  position: number
  name: string
  teamColor: string
  points: number
}

export interface NextRaceMini {
  raceName: string
  flag: string
  daysUntil: number
  round: number
  date: string       // e.g. "6월 15일 (일)"
  timeKST: string | null  // e.g. "22:00"
}

const DAY_KR = ['일', '월', '화', '수', '목', '금', '토']

async function fetchNextRaceMini(): Promise<NextRaceMini | null> {
  try {
    const res = await fetch(
      'https://api.jolpi.ca/ergast/f1/current/next.json',
      { next: { revalidate: 3600 } },
    )
    if (!res.ok) return null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await res.json()
    const race = data.MRData?.RaceTable?.Races?.[0]
    if (!race) return null

    const raceUTC = new Date(`${race.date as string}T${(race.time as string | undefined) ?? '00:00:00Z'}`)
    // KST = UTC+9
    const kst = new Date(raceUTC.getTime() + 9 * 3_600_000)
    const daysUntil = Math.max(0, Math.ceil((raceUTC.getTime() - Date.now()) / 86_400_000))
    const date = `${kst.getUTCMonth() + 1}월 ${kst.getUTCDate()}일 (${DAY_KR[kst.getUTCDay()]})`
    const timeKST = race.time
      ? `${String(kst.getUTCHours()).padStart(2, '0')}:${String(kst.getUTCMinutes()).padStart(2, '0')}`
      : null

    return {
      raceName: GP_NAMES[race.raceName as string] ?? (race.raceName as string),
      flag: COUNTRY_CODES[race.Circuit.Location.country as string] ?? '',
      daysUntil,
      round: Number(race.round),
      date,
      timeKST,
    }
  } catch {
    return null
  }
}

export default async function HighlightsPage() {
  const [videos, lastRace, standingsRaw, constructorsRaw, nextRace] = await Promise.all([
    getAllHighlightVideos(CHANNELS),
    fetchLastRacePodium(),
    fetchDriverStandings(2026),
    fetchConstructorStandings(2026),
    fetchNextRaceMini(),
  ])

  const patched = videos.map(v => ({
    ...v,
    title:  TITLE_OVERRIDES[v.id]  ?? v.title,
    season: SEASON_OVERRIDES[v.id] ?? v.season,
  }))

  const topStandings: StandingMini[] | null = standingsRaw
    ?.slice(0, 3)
    .map(s => ({
      position:  s.position ?? 0,
      name:      s.name,
      team:      s.team,
      teamColor: s.teamColor,
      points:    s.points,
    })) ?? null

  const topConstructors: ConstructorMini[] | null = constructorsRaw
    ?.slice(0, 3)
    .map(c => ({
      position:  c.position ?? 0,
      name:      c.name,
      teamColor: c.teamColor,
      points:    c.points,
    })) ?? null

  return (
    <HighlightsClient
      videos={patched}
      lastRace={lastRace}
      topStandings={topStandings}
      topConstructors={topConstructors}
      nextRace={nextRace}
    />
  )
}
