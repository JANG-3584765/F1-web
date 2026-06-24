import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { fetchSeasonRaces, type Race } from '@/lib/f1Api'
import { MANUAL_RACE_DATA } from '@/lib/manualRaceData'
import type { ManualPitStop, ManualDriverOfTheDay } from '@/lib/manualRaceData'
import {
  fetchRaceResult,
  fetchPitStops,
  fetchTireStrategy,
  fetchQualifyingResult,
  fetchSprintResult,
  fetchPracticeResult,
  fetchRaceWeather,
  fetchCircuitLapRecord,
  getCircuitInfo,
  type ResultRow,
  type PitStopMap,
  type RaceWeather,
} from '@/lib/f1ResultsApi'
import { fetchDriverStandings, fetchConstructorStandings } from '@/lib/f1StandingsApi'
import ResultsControls from './ResultsControls'
import ResultTabs, { type StandingChange, type ConstructorChange } from './ResultTabs'

export const revalidate = 300

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


function WinnerCard({ row }: { row: ResultRow }) {
  return (
    <div
      className="rounded-lg p-4"
      style={{
        background: `linear-gradient(135deg, ${row.teamColor}22 0%, transparent 70%)`,
        borderLeft: `3px solid ${row.teamColor}`,
      }}
    >
      <p className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">레이스 우승</p>
      <p className="mt-0.5 text-2xl font-black text-[var(--text)]">{row.name}</p>
      <div className="mt-1 flex items-center gap-2">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: row.teamColor }} />
        <span className="text-sm font-bold text-[var(--muted)]">{row.team}</span>
        {row.fastestLap && (
          <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-black text-purple-700">FL</span>
        )}
      </div>
      <div className="mt-2 flex gap-4 text-xs font-bold text-[var(--muted)]">
        {row.timeOrGap && row.timeOrGap !== '완주' && <span>{row.timeOrGap}</span>}
        <span>+{row.points} pts</span>
      </div>
    </div>
  )
}

function WeatherCard({ weather }: { weather: RaceWeather }) {
  const subtitle =
    weather.source === 'openf1'
      ? '레이스 당일 날씨 (OpenF1 공식 타이밍 데이터 · 세션 평균)'
      : '레이스 당일 날씨 · Open-Meteo 기상 모델 · 레이스 시작 시간 기준'

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
      <p className="mb-3 text-xs font-black text-[var(--muted)]">{subtitle}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <div className="rounded-md bg-[var(--bg-2)] px-3 py-2">
          <p className="text-[10px] font-bold text-[var(--muted)]">기온</p>
          <p className="text-sm font-black text-[var(--text)]">{weather.tempC}°C</p>
        </div>
        {weather.trackTempC != null && (
          <div className="rounded-md bg-[var(--bg-2)] px-3 py-2">
            <p className="text-[10px] font-bold text-[var(--muted)]">트랙 온도</p>
            <p className="text-sm font-black text-[var(--text)]">{weather.trackTempC}°C</p>
          </div>
        )}
        <div className="rounded-md bg-[var(--bg-2)] px-3 py-2">
          <p className="text-[10px] font-bold text-[var(--muted)]">습도</p>
          <p className="text-sm font-black text-[var(--text)]">{weather.humidity}%</p>
        </div>
        <div className="rounded-md bg-[var(--bg-2)] px-3 py-2">
          <p className="text-[10px] font-bold text-[var(--muted)]">풍속</p>
          <p className="text-sm font-black text-[var(--text)]">{weather.windKph} km/h</p>
        </div>
        {weather.rainfall != null && (
          <div className="rounded-md bg-[var(--bg-2)] px-3 py-2">
            <p className="text-[10px] font-bold text-[var(--muted)]">강수</p>
            <p className="text-sm font-black text-[var(--text)]">{weather.rainfall ? '비' : '없음'}</p>
          </div>
        )}
        {weather.precipMm != null && (
          <div className="rounded-md bg-[var(--bg-2)] px-3 py-2">
            <p className="text-[10px] font-bold text-[var(--muted)]">강수량</p>
            <p className="text-sm font-black text-[var(--text)]">{weather.precipMm} mm</p>
          </div>
        )}
        {weather.precipProb != null && (
          <div className="rounded-md bg-[var(--bg-2)] px-3 py-2">
            <p className="text-[10px] font-bold text-[var(--muted)]">강수 확률</p>
            <p className="text-sm font-black text-[var(--text)]">{weather.precipProb}%</p>
          </div>
        )}
      </div>
    </div>
  )
}

function RaceStats({
  rows,
  pitStopMap,
  fastestPit,
  driverOfTheDay,
  pole,
}: {
  rows: ResultRow[]
  pitStopMap: PitStopMap | null
  fastestPit?: ManualPitStop | null
  driverOfTheDay?: ManualDriverOfTheDay | null
  pole?: string | null
}) {
  if (!rows.length) return null
  const finishers = rows.filter(r => r.classified).length
  const dnf = rows.filter(r => !r.classified).length
  const totalPits = pitStopMap
    ? Object.values(pitStopMap).reduce((sum, d) => sum + d.count, 0)
    : null

  return (
    <div className="flex flex-wrap gap-2">
      <span className="rounded border border-[var(--border)] bg-[var(--bg-2)] px-2.5 py-1 text-xs font-black text-[var(--text)]">
        완주 {finishers}명
      </span>
      {dnf > 0 && (
        <span className="rounded bg-red-100 px-2.5 py-1 text-xs font-black text-red-700">
          DNF {dnf}명
        </span>
      )}
      {totalPits != null && (
        <span className="rounded border border-[var(--border)] bg-[var(--bg-2)] px-2.5 py-1 text-xs font-black text-[var(--text)]">
          총 피트스탑 {totalPits}회
        </span>
      )}
      {fastestPit && (
        <span className="rounded border border-[var(--border)] bg-[var(--bg-2)] px-2.5 py-1 text-xs font-black text-[var(--text)]">
          <span className="inline-block h-2 w-2 rounded-full mr-1" style={{ backgroundColor: fastestPit.teamColor }} />
          패스티스트 피트: {fastestPit.team} · {fastestPit.driver} · {fastestPit.duration.toFixed(3)}s ({fastestPit.lap}랩)
        </span>
      )}
      {driverOfTheDay && (
        <span className="rounded border border-[var(--border)] bg-[var(--bg-2)] px-2.5 py-1 text-xs font-black text-[var(--text)]">
          <span className="inline-block h-2 w-2 rounded-full mr-1" style={{ backgroundColor: driverOfTheDay.teamColor }} />
          오늘의 드라이버: {driverOfTheDay.driver} · {driverOfTheDay.team}
        </span>
      )}
      {pole && (
        <span className="rounded border border-[var(--border)] bg-[var(--bg-2)] px-2.5 py-1 text-xs font-black text-[var(--text)]">
          폴: {pole}
        </span>
      )}
    </div>
  )
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
  pitStopMap,
  qualifying,
}: {
  season: number
  round: number
  allRows: ResultRow[]
  pitStopMap: PitStopMap | null
  qualifying: Awaited<ReturnType<typeof fetchQualifyingResult>>
}) {
  const [tireMap, sprint, fp1, fp2, fp3, standingsBefore, standingsAfter, constructorsBefore, constructorsAfter] = await Promise.all([
    fetchTireStrategy(season, round),
    fetchSprintResult(season, round),
    fetchPracticeResult(season, round, 1),
    fetchPracticeResult(season, round, 2),
    fetchPracticeResult(season, round, 3),
    fetchDriverStandings(season, round - 1),
    fetchDriverStandings(season, round),
    fetchConstructorStandings(season, round - 1),
    fetchConstructorStandings(season, round),
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

  let constructorChanges: ConstructorChange[] | null = null
  if (constructorsAfter?.length) {
    const beforeMap = new Map(constructorsBefore?.map(c => [c.constructorId, c]) ?? [])
    constructorChanges = constructorsAfter.map(after => ({
      constructorId: after.constructorId,
      name: after.name,
      teamColor: after.teamColor,
      currentPosition: after.position,
      previousPosition: beforeMap.get(after.constructorId)?.position ?? null,
      currentPoints: after.points,
      pointsGained: after.points - (beforeMap.get(after.constructorId)?.points ?? after.points),
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
      constructorChanges={constructorChanges}
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
  const nextRace = races.find(race => race.round > selectedRound) ?? null
  const circuitInfoEarly = getCircuitInfo(raceMeta?.circuit ?? '')

  const [result, pitStopMap, qualifying, weather, lapRecord] = await Promise.all([
    fetchRaceResult(selectedSeason, selectedRound),
    fetchPitStops(selectedSeason, selectedRound),
    fetchQualifyingResult(selectedSeason, selectedRound),
    circuitInfoEarly?.lat != null && circuitInfoEarly?.lon != null && raceMeta?.raceDate
      ? fetchRaceWeather(circuitInfoEarly.lat, circuitInfoEarly.lon, raceMeta.raceDate, raceMeta.raceTime, selectedSeason)
      : Promise.resolve(null),
    circuitInfoEarly?.circuitId
      ? fetchCircuitLapRecord(circuitInfoEarly.circuitId)
      : Promise.resolve(null),
  ])

  const circuitInfo = result?.circuitInfo ?? circuitInfoEarly ?? null
  const allRows = result?.results ?? []
  const city = result?.city ?? ''
  const actualRaceLaps = result?.raceLaps ?? null
  const manualData = MANUAL_RACE_DATA[`${selectedSeason}-${selectedRound}`] ?? null
  const fastestPit = manualData?.fastestPitStop ?? null
  const driverOfTheDay = manualData?.driverOfTheDay ?? null
  const pole = qualifying?.[0]?.name ?? null

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
                    loading="eager"
                    priority
                  />
                </div>
              ) : null}

              <div className="rounded-lg border border-[var(--border)] p-4 flex flex-col gap-3">
                <div>
                  <p className="text-base font-black text-[var(--text)]">
                    {result?.circuitName ?? raceMeta?.circuit ?? '서킷 정보 없음'}
                  </p>
                  {city && (
                    <p className="mt-0.5 text-xs font-bold text-[var(--muted)]">{city}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {circuitInfo?.lengthKm != null && (
                    <div>
                      <p className="text-[10px] font-bold text-[var(--muted)]">서킷 길이</p>
                      <p className="text-sm font-black text-[var(--text)]">{circuitInfo.lengthKm} km</p>
                    </div>
                  )}
                  {circuitInfo?.firstGrandPrix != null && (
                    <div>
                      <p className="text-[10px] font-bold text-[var(--muted)]">첫 그랑프리</p>
                      <p className="text-sm font-black text-[var(--text)]">{circuitInfo.firstGrandPrix}년</p>
                    </div>
                  )}
                  {(actualRaceLaps ?? circuitInfo?.laps) != null && (
                    <div>
                      <p className="text-[10px] font-bold text-[var(--muted)]">랩 수</p>
                      <p className="text-sm font-black text-[var(--text)]">{actualRaceLaps ?? circuitInfo!.laps} 랩</p>
                    </div>
                  )}
                  {circuitInfo?.raceDistanceKm != null && (
                    <div>
                      <p className="text-[10px] font-bold text-[var(--muted)]">레이스 거리</p>
                      <p className="text-sm font-black text-[var(--text)]">
                        {circuitInfo.raceDistanceKm.toFixed(3)} km
                      </p>
                    </div>
                  )}
                  {lapRecord && (
                    <div className="col-span-2">
                      <p className="text-[10px] font-bold text-[var(--muted)]">랩 레코드</p>
                      <p className="text-sm font-black text-[var(--text)]">
                        {lapRecord.time}
                        <span className="ml-1.5 font-bold text-[var(--muted)]">
                          {lapRecord.driver} · {lapRecord.year}년
                        </span>
                      </p>
                    </div>
                  )}
                  {result?.fastestLapDriver && (
                    <div className="col-span-2">
                      <p className="text-[10px] font-bold text-[var(--muted)]">이번 라운드 패스티스트 랩</p>
                      <p className="text-sm font-black text-purple-600">
                        {result.fastestLapDriver}
                        {result.fastestLapTime && (
                          <span className="font-bold text-purple-400"> · {result.fastestLapTime}</span>
                        )}
                        {result.fastestLapLap != null && (
                          <span className="font-bold text-purple-400"> ({result.fastestLapLap} Lap)</span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 날씨 */}
            {weather && <WeatherCard weather={weather} />}

            {/* 레이스 결과 */}
            {result ? (
              <div className="flex flex-col gap-4">
                <WinnerCard row={allRows[0]} />
                <RaceStats rows={allRows} pitStopMap={pitStopMap} fastestPit={fastestPit} driverOfTheDay={driverOfTheDay} pole={pole} />
                <Top5 rows={allRows} />
                <Suspense fallback={<TabsSkeleton />}>
                  <SessionDataSection
                    season={selectedSeason}
                    round={selectedRound}
                    allRows={allRows}
                    pitStopMap={pitStopMap}
                    qualifying={qualifying}
                  />
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

        {/* 다음 라운드 */}
        {nextRace && (
          <section className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
            <p className="mb-2 text-xs font-black text-[var(--muted)]">다음 라운드</p>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black text-[var(--text)]">
                  R{String(nextRace.round).padStart(2, '0')} · {nextRace.name}
                </p>
                <p className="mt-0.5 text-xs font-bold text-[var(--muted)]">{formatRaceDate(nextRace.raceDate)}</p>
              </div>
              <Link
                href={`/results?season=${selectedSeason}&round=${nextRace.round}`}
                className="shrink-0 rounded-md border border-[var(--border)] bg-[var(--bg-2)] px-3 py-2 text-xs font-black text-[var(--text)] hover:border-[var(--accent)]"
              >
                해당 라운드로
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
