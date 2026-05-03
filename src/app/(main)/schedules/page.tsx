import { fetchSeasonRaces } from '@/lib/f1Api'
import RaceList from './RaceList'

export const SEASONS = [2026, 2025]

export default async function SchedulesPage({
  searchParams,
}: {
  searchParams: Promise<{ season?: string }>
}) {
  const { season } = await searchParams
  const year = SEASONS.includes(Number(season))
    ? Number(season)
    : 2026

  const races = await fetchSeasonRaces(year)

  return (
    <main className="min-h-screen bg-[var(--bg-2)] py-12 px-4">
      <RaceList races={races} year={year} seasons={SEASONS} />
    </main>
  )
}
