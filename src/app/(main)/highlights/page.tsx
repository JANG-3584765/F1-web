import { getAllHighlightVideos, type ChannelConfig } from '@/lib/youtubeApi'
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
  // { channelId: 'INFLUENCER_CHANNEL_ID', source: 'influencer', season: 2026, type: 'other' },
]

// 제목 수동 수정: 영상 ID(watch?v= 뒤 11자리)를 키로, 원하는 제목을 값으로 추가
const TITLE_OVERRIDES: Record<string, string> = {
  // 예시) 'dQw4w9WgXcQ': '2025 바레인 그랑프리 레이스 하이라이트',
}

// 시즌 수동 지정: 제목에 연도가 없어 자동 감지가 안 되는 재중계 영상용
// (inferSeason으로 해결 안 되는 경우에만 영상 ID로 직접 지정)
const SEASON_OVERRIDES: Record<string, number> = {
  // 예시) 'dQw4w9WgXcQ': 2021,
}

export default async function HighlightsPage() {
  const videos = await getAllHighlightVideos(CHANNELS)
  const patched = videos.map(v => ({
    ...v,
    title:  TITLE_OVERRIDES[v.id]  ?? v.title,
    season: SEASON_OVERRIDES[v.id] ?? v.season,
  }))
  return <HighlightsClient videos={patched} />
}
