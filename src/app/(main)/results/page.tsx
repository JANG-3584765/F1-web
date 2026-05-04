import Link from 'next/link'
import Image from 'next/image'
import 'flag-icons/css/flag-icons.min.css'
import { fetchSeasonRaces, type Race } from '@/lib/f1Api'
import { fetchRaceResult, getCircuitInfo, getCityName, type ResultRow } from '@/lib/f1ResultsApi'
import ResultsControls from './ResultsControls'

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

function formatRecord(row: ResultRow) {
  if (row.timeOrGap) return row.timeOrGap
  return row.classified ? '완주' : '-'
}

function ResultTable({ rows }: { rows: ResultRow[] }) {
  return (
    <div className="overflow-x-auto border border-[var(--border)] rounded-lg">
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
          {rows.map(row => (
            <tr key={`${row.code}-${row.position ?? row.laps}`} className="border-t border-[var(--border)]">
              <td className="px-3 py-3 text-center text-sm font-black text-[var(--text)]">
                {row.position ?? '-'}
              </td>
              <td className="px-3 py-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm font-black text-[var(--text)]">
                    <span className="truncate">{row.name}</span>
                    {row.fastestLap && (
                      <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-black text-purple-700">
                        FL
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-[var(--muted)]">
                    <span
                      className="h-2 w-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: row.teamColor }}
                    />
                    <span className="truncate">{row.team}</span>
                  </div>
                </div>
              </td>
              <td className="px-3 py-3 text-left text-sm font-bold text-[var(--text)]">{formatRecord(row)}</td>
              <td className="px-3 py-3 text-center text-sm font-bold text-[var(--text)]">{row.laps}</td>
              <td className="px-3 py-3 text-center text-sm font-black text-[var(--text)]">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ season?: string; round?: string }>
}) {
  const params = await searchParams
  const selectedSeason = SEASONS.includes(Number(params.season)) ? Number(params.season) : SEASONS[0]
  const races = await fetchSeasonRaces(selectedSeason)
  const selectedRound = races.some(race => race.round === Number(params.round))
    ? Number(params.round)
    : defaultRound(races)

  const raceMeta = races.find(race => race.round === selectedRound)
  const result = await fetchRaceResult(selectedSeason, selectedRound)
  const circuitInfo = result?.circuitInfo
    ?? (raceMeta ? getCircuitInfo(raceMeta.circuit) : null)
    ?? null

  const topRows = result?.results.filter(row => row.position != null).slice(0, 5) ?? []
  const restRows = result?.results.filter(row => row.position == null || row.position >= 6) ?? []
  const city = result?.city ?? (raceMeta?.city ? getCityName(raceMeta.city) : '')

  return (
    <main className="min-h-screen bg-[var(--bg-2)] px-4 py-10">
      <div className="mx-auto flex max-w-[980px] flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black text-[var(--text)]">레이스 결과</h1>
          </div>
          <Link
            href={`/schedules?season=${selectedSeason}`}
            className="rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs font-black text-[var(--text)] hover:border-[var(--accent)]"
          >
            일정 보기
          </Link>
        </div>

        <ResultsControls
          seasons={SEASONS}
          races={races}
          selectedSeason={selectedSeason}
          selectedRound={selectedRound}
        />

        <section className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
          <div className="flex flex-col gap-4">
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

            {result ? (
              <>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-black text-[var(--text)]">Top 5</h3>
                  </div>
                  <ResultTable rows={topRows} />
                </div>

                <details className="group">
                  <summary className="mx-auto flex w-fit cursor-pointer list-none rounded-md border border-[var(--border)] px-4 py-2 text-sm font-black text-[var(--text)] hover:border-[var(--accent)]">
                    전체 결과 보기
                  </summary>
                  <div className="mt-3">
                    <ResultTable rows={restRows} />
                  </div>
                </details>
              </>
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
