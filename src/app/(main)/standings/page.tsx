import { fetchDriverStandings, fetchConstructorStandings } from '@/lib/f1StandingsApi'
import StandingsClient from './StandingsClient'

const CURRENT_YEAR = new Date().getFullYear()
const SEASONS = Array.from({ length: CURRENT_YEAR - 1950 + 1 }, (_, i) => CURRENT_YEAR - i)

export default async function StandingsPage({
  searchParams,
}: {
  searchParams: Promise<{ season?: string }>
}) {
  const params = await searchParams
  const selectedSeason = SEASONS.includes(Number(params.season))
    ? Number(params.season)
    : CURRENT_YEAR

  const [drivers, constructors] = await Promise.all([
    fetchDriverStandings(selectedSeason),
    selectedSeason >= 1958 ? fetchConstructorStandings(selectedSeason) : Promise.resolve(null),
  ])

  return (
    <main className="min-h-screen bg-[var(--bg-2)] px-4 py-10">
      <div className="mx-auto flex max-w-[980px] flex-col gap-4">
        <h1 className="text-xl font-black text-[var(--text)]">드라이버 / 컨스트럭터 순위</h1>

        <StandingsClient
          seasons={SEASONS}
          selectedSeason={selectedSeason}
          drivers={drivers}
          constructors={constructors}
        />
      </div>
    </main>
  )
}
