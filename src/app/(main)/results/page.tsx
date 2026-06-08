import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { fetchSeasonRaces, type Race } from '@/lib/f1Api'
import {
  fetchRaceResult,
  fetchPitStops,
  fetchTireStrategy,
  fetchQualifyingResult,
  fetchSprintResult,
  fetchPracticeResult,
  getCircuitInfo,
  type ResultRow,
} from '@/lib/f1ResultsApi'
import { fetchDriverStandings } from '@/lib/f1StandingsApi'
import ResultsControls from './ResultsControls'
import ResultTabs, { type StandingChange } from './ResultTabs'

const SEASONS = [2026, 2025]

function todayString() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function defaultRound(races: Race[]) {
  const today = todayString()
  const completed = races.filter(race => race.raceDate < today)
  return completed.at(-1)?.round ?? races[0]?.round ?? 1
}

function formatRaceDate(date: string) {
  const [y, m, d] = date.split('-').map(Number)
  return `${y}. ${m}. ${d}.`
}

function Top5({ rows }: { rows: ResultRow[] }) {
  const top5 = rows.filter(r => r.position != null).slice(0, 5)
  if (!top5.length) return null
  return (
    <div>
      <p className="mb-2 text-xs font-black text-[var(--muted)]">TOP 5</p>
      <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
        <table className="w-full min-w-[560px] table-fixed border-collapse">
          <thead>
            <tr className="bg-[var(--bg-2)] text-xs text-[var(--muted)]">
              <th className="w-14 px-3 py-3 text-center font-bold">순위</th>
              <th className="px-3 py-3 text-left font-bold">드라이버</th>
              <th className="w-28 px-3 py-3 text-left font-bold">기록</th>
              <th className="w-16 px-3 py-3 text-center font-bold">랩</th>
              <th className="w-16 px-3 py-3 text-center font-bold">PTS</th>
            </tr>
          </thead>
          <tbody>
            {top5.map(row => (
              <tr key={row.driverId} className="border-t border-[var(--border)]">
                <td className="px-3 py-3 text-center text-sm font-black text-[var(--text)]">{row.position}</td>
                <td className="px-3 py-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-sm font-black text-[var(--text)]">
                      <span className="truncate">{row.name}</span>
                      {row.fastestLap && (
                        <span className="shrink-0 rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-black text-purple-700">FL</span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-[var(--muted)]">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: row.teamColor }} />
                      <span className="truncate">{row.team}</span>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-left text-sm font-bold text-[var(--text)]">
                  {row.timeOrGap || (row.classified ? '완주' : '-')}
                </td>
                <td className="px-3 py-3 text-center text-sm font-bold text-[var(--text)]">{row.laps}</td>
                <td className="px-3 py-3 text-center text-sm font-black text-[var(--text)]">{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TabsSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-10 rounded-lg bg-[var(--bg-2)] border border-[var(--border)]" />
      <div className="h-64 rounded-lg border border-[var(--border)] bg-[var(--bg-2)]" />
    </div>
  )
}

async function SessionDataSection({
  season,
  round,
  allRows,
}: {
  season: number
  round: number
  allRows: ResultRow[]
}) {
  const [pitStopMap, tireMap, qualifying, sprint, fp1, fp2, fp3, standingsBefore, standingsAfter] = await Promise.all([
    fetchPitStops(season, round),
    fetchTireStrategy(season, round),
    fetchQualifyingResult(season, round),
    fetchSprintResult(season, round),
    fetchPracticeResult(season, round, 1),
    fetchPracticeResult(season, round, 2),
    fetchPracticeResult(season, round, 3),
    fetchDriverStandings(season, round - 1),
    fetchDriverStandings(season, round),
  ])

  let standingChanges: StandingChange[] | null = null
  if (standingsAfter?.length) {
    const beforeMap = new Map(standingsBefore?.map(s => [s.driverId, s]) ?? [])
    const pointsGainedMap = new Map(allRows.map(r => [r.driverId, r.points]))
    standingChanges = standingsAfter.map(after => ({
      driverId: after.driverId,
      name: after.name,
      team: after.team,
      teamColor: after.teamColor,
      currentPosition: after.position,
      previousPosition: beforeMap.get(after.driverId)?.position ?? null,
      currentPoints: after.points,
      pointsGained: pointsGainedMap.get(after.driverId) ?? 0,
    }))
  }

  return (
    <ResultTabs
      allRows={allRows}
      pitStopMap={pitStopMap}
      tireMap={tireMap}
      qualifying={qualifying}
      sprint={sprint}
      fp1={fp1}
      fp2={fp2}
      fp3={fp3}
      standingChanges={standingChanges}
    />
  )
}

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ season?: string; round?: string }>
}) {
  const params = await searchParams
  const selectedSeason = SEASONS.includes(Number(params.season)) ? Number(params.season) : SEASONS[0]
  const allRaces = Object.fromEntries(
    await Promise.all(SEASONS.map(async s => [s, await fetchSeasonRaces(s)]))
  ) as Record<number, Race[]>
  const races = allRaces[selectedSeason]
  const selectedRound = races.some(race => race.round === Number(params.round))
    ? Number(params.round)
    : defaultRound(races)

  const raceMeta = races.find(race => race.round === selectedRound)
  const result = await fetchRaceResult(selectedSeason, selectedRound)
  const circuitInfo = result?.circuitInfo
    ?? (raceMeta ? getCircuitInfo(raceMeta.circuit) : null)
    ?? null

  const allRows = result?.results ?? []
  const city = result?.city ?? ''

  return (
    <main className="min-h-screen bg-[var(--bg-2)] px-4 py-10">
      <div className="mx-auto flex max-w-[980px] flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl font-black text-[var(--text)]">레이스 결과</h1>
          <Link
            href={`/schedules?season=${selectedSeason}`}
            className="rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs font-black text-[var(--text)] hover:border-[var(--accent)]"
          >
            일정 보기
          </Link>
        </div>

        <ResultsControls
          seasons={SEASONS}
          allRaces={allRaces}
          selectedSeason={selectedSeason}
          selectedRound={selectedRound}
        />

        <section className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
          <div className="flex flex-col gap-4">
            {/* 레이스 헤더 */}
            <div className="flex flex-col items-center gap-1 text-center">
              {result?.flag || raceMeta?.flag ? (
                <span className={`fi fi-${result?.flag ?? raceMeta?.flag} rounded-sm text-3xl`} />
              ) : null}
              <h2 className="text-lg font-black text-[var(--text)]">
                {result?.raceName ?? raceMeta?.name ?? `${selectedRound}라운드`}
              </h2>
              <p className="text-sm font-bold text-[var(--muted)]">
                R{String(selectedRound).padStart(2, '0')}
                {raceMeta?.raceDate ? ` · ${formatRaceDate(raceMeta.raceDate)}` : ''}
              </p>
            </div>

            {/* 서킷 정보 */}
            <div className="grid gap-4 md:grid-cols-[1.25fr_1fr]">
              {circuitInfo?.image ? (
                <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg-2)]">
                  <Image
                    src={`/images/circuits/${circuitInfo.image}`}
                    alt={`${result?.circuitName ?? raceMeta?.circuit ?? '서킷'} 이미지`}
                    width={1200}
                    height={720}
                    className="block w-full"
                  />
                </div>
              ) : null}

              <div className="rounded-lg border border-[var(--border)] p-4">
                <p className="text-base font-black text-[var(--text)]">
                  {result?.circuitName ?? raceMeta?.circuit ?? '서킷 정보 없음'}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-black text-[var(--muted)]">
                  {city && (
                    <span className="rounded bg-[var(--bg-2)] px-2 py-1">{city}</span>
                  )}
                  {circuitInfo?.laps != null && (
                    <span className="rounded bg-[var(--bg-2)] px-2 py-1">랩 {circuitInfo.laps}</span>
                  )}
                  {circuitInfo?.lengthKm != null && (
                    <span className="rounded bg-[var(--bg-2)] px-2 py-1">{circuitInfo.lengthKm}km</span>
                  )}
                  {result?.fastestLapDriver && (
                    <span className="rounded bg-purple-100 px-2 py-1 text-purple-700">
                      패스티스트랩: {result.fastestLapDriver}
                      {result.fastestLapTime ? ` · ${result.fastestLapTime}` : ''}
                    </span>
                  )}
                  {circuitInfo?.lapRecord && (
                    <span className="rounded bg-[var(--bg-2)] px-2 py-1">
                      랩 레코드: {circuitInfo.lapRecord.time} · {circuitInfo.lapRecord.driver} ({circuitInfo.lapRecord.year})
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* TOP 5 + 탭 영역 */}
            {result ? (
              <div className="flex flex-col gap-4">
                <Top5 rows={allRows} />
                <Suspense fallback={<TabsSkeleton />}>
                  <SessionDataSection season={selectedSeason} round={selectedRound} allRows={allRows} />
                </Suspense>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-2)] px-4 py-8 text-center">
                <p className="text-sm font-black text-[var(--text)]">아직 등록된 레이스 결과가 없습니다.</p>
                <p className="mt-1 text-xs font-semibold text-[var(--muted)]">
                  경기 종료 후 결과 API에 데이터가 올라오면 이 화면에 자동으로 표시됩니다.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
