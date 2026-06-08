import { fetchDriverStandings, fetchConstructorStandings } from '@/lib/f1StandingsApi'
import { getRecentHighlights, type ChannelConfig } from '@/lib/youtubeApi'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import NextRaceSection from '@/components/home/NextRaceSection'
import NewsPreviewSection from '@/components/home/NewsPreviewSection'
import HighlightsPreviewSection from '@/components/home/HighlightsPreviewSection'
import StandingsPreviewSection from '@/components/home/StandingsPreviewSection'
import FanVoteCTA from '@/components/home/FanVoteCTA'
import BeginnerGuideCTA from '@/components/home/BeginnerGuideCTA'

export const revalidate = 1800

// 홈 미리보기용 — 최근 GP 플레이리스트만 (최신순). 새 GP 추가 시 맨 앞에 추가
const PREVIEW_CHANNELS: ChannelConfig[] = [
  { playlistId: 'PLfoNZDHitwjXPl6fAm6fhin3_aiX54FmB', source: 'official', season: 2026, type: 'f1' }, // 마이애미 GP
  { playlistId: 'PLfoNZDHitwjXbELZ-aWNVTBXwDQFo6CUs', source: 'official', season: 2026, type: 'f1' }, // 일본 GP
  { playlistId: 'PLfoNZDHitwjVUgc0VemLNA-21SzaGolYK', source: 'official', season: 2026, type: 'f1' }, // 중국 GP
]

export default async function HomePage() {
  const [drivers, constructors, { data: newsData }, highlights] = await Promise.all([
    fetchDriverStandings(2026),
    fetchConstructorStandings(2026),
    supabaseAdmin
      .from('news_translations')
      .select('article_url, title_kr, title_en, image_url, source, pub_date')
      .eq('is_published', true)
      .order('pub_date', { ascending: false })
      .limit(3),
    getRecentHighlights(PREVIEW_CHANNELS, 3),
  ])

  return (
    <main className="bg-[var(--bg-2)] min-h-screen">
      <div className="max-w-[980px] mx-auto px-4 py-8 flex flex-col gap-8">
        <NextRaceSection />
        <NewsPreviewSection news={newsData ?? []} />
        <HighlightsPreviewSection videos={highlights} />
        <StandingsPreviewSection
          drivers={drivers?.slice(0, 3) ?? null}
          constructors={constructors?.slice(0, 3) ?? null}
        />
        <BeginnerGuideCTA />
        <FanVoteCTA />
      </div>
    </main>
  )
}
