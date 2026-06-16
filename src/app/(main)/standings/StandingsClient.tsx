'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { DriverStandingRow, ConstructorStandingRow } from '@/lib/f1StandingsApi'

interface Props {
  seasons: number[]
  selectedSeason: number
  drivers: DriverStandingRow[] | null
  constructors: ConstructorStandingRow[] | null
}

type Tab = 'drivers' | 'constructors'

type StandingTrendPoint = {
  year: number
  position: number | null
  points: number
  wins: number
  team?: string
  teamColor: string
}

type StandingTrendGroup = {
  type: 'driver' | 'constructor'
  id: string
  name: string
  originalName: string
  points: StandingTrendPoint[]
}

type StandingSearchResponse = {
  query: string
  results: StandingTrendGroup[]
  message?: string
}

function PositionChange({ change }: { change?: number | null }) {
  if (change == null) return null
  if (change === 0) return <span className="block text-[10px] font-bold text-[var(--muted)]">—</span>
  if (change > 0) return <span className="block text-[10px] font-bold text-green-500">▲{change}</span>
  return <span className="block text-[10px] font-bold text-red-500">▼{Math.abs(change)}</span>
}

function positionClass(pos: number | null) {
  if (pos === 1) return 'text-yellow-500'
  if (pos === 2) return 'text-slate-400'
  if (pos === 3) return 'text-amber-600'
  return 'text-[var(--text)]'
}

function positionLabel(pos: number | null) {
  return pos ?? '-'
}

function bestPosition(points: StandingTrendPoint[]) {
  const positions = points
    .map(point => point.position)
    .filter((position): position is number => position !== null)

  return positions.length ? Math.min(...positions) : null
}

function DriverTable({ rows }: { rows: DriverStandingRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
      <table className="w-full min-w-[560px] table-fixed border-collapse">
        <thead>
          <tr className="bg-[var(--bg-2)] text-xs text-[var(--muted)]">
            <th className="w-14 px-3 py-3 text-center font-bold">순위</th>
            <th className="px-3 py-3 text-left font-bold">드라이버</th>
            <th className="w-32 px-3 py-3 text-left font-bold">팀</th>
            <th className="w-16 px-3 py-3 text-center font-bold">포디움</th>
            <th className="w-12 px-3 py-3 text-center font-bold">승</th>
            <th className="w-20 px-3 py-3 text-center font-bold">포인트</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.driverId} className="border-t border-[var(--border)] transition-colors hover:bg-[var(--bg-2)]">
              <td className="px-3 py-3 text-center">
                <span className={`block text-sm font-black ${positionClass(row.position)}`}>
                  {positionLabel(row.position)}
                </span>
                <PositionChange change={row.positionChange} />
              </td>
              <td className="px-3 py-3">
                <div className="flex min-w-0 items-center gap-2">
                  {row.flagCode && (
                    <span className={`fi fi-${row.flagCode} shrink-0 rounded-sm text-base`} />
                  )}
                  <div className="min-w-0">
                    <div className="text-sm font-black leading-tight text-[var(--text)]">
                      {row.name}
                    </div>
                    {row.code && (
                      <div className="text-xs font-bold text-[var(--muted)]">{row.code}</div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-3 py-3">
                <div className="flex min-w-0 items-center gap-1.5">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: row.teamColor }}
                  />
                  <span className="truncate text-xs font-bold text-[var(--muted)]">{row.team}</span>
                </div>
              </td>
              <td className="px-3 py-3 text-center text-sm font-bold text-[var(--text)]">{row.podiums ?? 0}</td>
              <td className="px-3 py-3 text-center text-sm font-bold text-[var(--text)]">{row.wins}</td>
              <td className="px-3 py-3 text-center text-sm font-black text-[var(--text)]">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ConstructorTable({ rows }: { rows: ConstructorStandingRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
      <table className="w-full min-w-[440px] table-fixed border-collapse">
        <thead>
          <tr className="bg-[var(--bg-2)] text-xs text-[var(--muted)]">
            <th className="w-14 px-3 py-3 text-center font-bold">순위</th>
            <th className="px-3 py-3 text-left font-bold">컨스트럭터</th>
            <th className="w-16 px-3 py-3 text-center font-bold">포디움</th>
            <th className="w-12 px-3 py-3 text-center font-bold">승</th>
            <th className="w-20 px-3 py-3 text-center font-bold">포인트</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.constructorId} className="border-t border-[var(--border)] transition-colors hover:bg-[var(--bg-2)]">
              <td className="px-3 py-3 text-center">
                <span className={`block text-sm font-black ${positionClass(row.position)}`}>
                  {positionLabel(row.position)}
                </span>
                <PositionChange change={row.positionChange} />
              </td>
              <td className="px-3 py-3">
                <div className="flex min-w-0 items-center gap-2">
                  {row.flagCode && (
                    <span className={`fi fi-${row.flagCode} shrink-0 rounded-sm text-base`} />
                  )}
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-3 w-1 shrink-0 rounded-full"
                      style={{ backgroundColor: row.teamColor }}
                    />
                    <span className="text-sm font-black leading-tight text-[var(--text)]">
                      {row.name}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-3 py-3 text-center text-sm font-bold text-[var(--text)]">{row.podiums ?? 0}</td>
              <td className="px-3 py-3 text-center text-sm font-bold text-[var(--text)]">{row.wins}</td>
              <td className="px-3 py-3 text-center text-sm font-black text-[var(--text)]">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TrendCard({ group }: { group: StandingTrendGroup }) {
  const best = bestPosition(group.points)
  const championships = group.points.filter(point => point.position === 1).length

  return (
    <article className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-1 text-[10px] font-black uppercase tracking-wide text-[var(--muted)]">
            {group.type === 'driver' ? '드라이버' : '컨스트럭터'}
          </div>
          <h3 className="text-base font-black text-[var(--text)]">
            {group.name}
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-md bg-[var(--bg-2)] px-3 py-2">
            <div className="text-[10px] font-bold text-[var(--muted)]">시즌</div>
            <div className="text-sm font-black text-[var(--text)]">{group.points.length}</div>
          </div>
          <div className="rounded-md bg-[var(--bg-2)] px-3 py-2">
            <div className="text-[10px] font-bold text-[var(--muted)]">최고</div>
            <div className={`text-sm font-black ${positionClass(best)}`}>{positionLabel(best)}</div>
          </div>
          <div className="rounded-md bg-[var(--bg-2)] px-3 py-2">
            <div className="text-[10px] font-bold text-[var(--muted)]">우승</div>
            <div className="text-sm font-black text-[var(--text)]">{championships}</div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-1 overflow-x-auto pb-1">
        {group.points.map(point => (
          <div
            key={`${group.id}-${point.year}`}
            className="flex min-w-12 flex-col items-center gap-1 rounded-md bg-[var(--bg-2)] px-2 py-2"
            title={`${point.year}: ${positionLabel(point.position)}위`}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: point.teamColor }}
            />
            <span className="text-[10px] font-bold text-[var(--muted)]">{point.year}</span>
            <span className={`text-xs font-black ${positionClass(point.position)}`}>
              {positionLabel(point.position)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto rounded-md border border-[var(--border)]">
        <table className={`w-full table-fixed border-collapse ${group.type === 'driver' ? 'min-w-[520px]' : 'min-w-[360px]'}`}>
          <thead>
            <tr className="bg-[var(--bg-2)] text-xs text-[var(--muted)]">
              <th className="w-20 px-3 py-2 text-center font-bold">시즌</th>
              <th className="w-16 px-3 py-2 text-center font-bold">순위</th>
              <th className="w-20 px-3 py-2 text-center font-bold">승</th>
              <th className="w-24 px-3 py-2 text-center font-bold">포인트</th>
              {group.type === 'driver' && (
                <th className="px-3 py-2 text-left font-bold">팀</th>
              )}
            </tr>
          </thead>
          <tbody>
            {group.points.map(point => (
              <tr key={`${group.id}-${point.year}-row`} className="border-t border-[var(--border)]">
                <td className="px-3 py-2 text-center text-xs font-black text-[var(--text)]">{point.year}</td>
                <td className={`px-3 py-2 text-center text-xs font-black ${positionClass(point.position)}`}>
                  {positionLabel(point.position)}
                </td>
                <td className="px-3 py-2 text-center text-xs font-bold text-[var(--text)]">{point.wins}</td>
                <td className="px-3 py-2 text-center text-xs font-black text-[var(--text)]">{point.points}</td>
                {group.type === 'driver' && (
                  <td className="px-3 py-2 text-xs font-bold text-[var(--muted)]">
                    {point.team ?? '-'}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--bg-2)] px-4 py-8 text-center">
      <p className="text-sm font-black text-[var(--text)]">{message}</p>
    </div>
  )
}

export default function StandingsClient({ seasons, selectedSeason, drivers, constructors }: Props) {
  const router = useRouter()
  const hasConstructors = !!constructors?.length
  const [tab, setTab] = useState<Tab>('drivers')
  const [trendQuery, setTrendQuery] = useState('')
  const [trendLoading, setTrendLoading] = useState(false)
  const [trendError, setTrendError] = useState('')
  const [trendResults, setTrendResults] = useState<StandingTrendGroup[]>([])

  function handleSeasonChange(season: number) {
    router.push(`/standings?season=${season}`)
  }

  async function handleTrendSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = trendQuery.trim()

    if (query.length < 2) {
      setTrendError('두 글자 이상 입력해 주세요.')
      setTrendResults([])
      return
    }

    setTrendLoading(true)
    setTrendError('')

    try {
      const res = await fetch(`/api/standings/search?q=${encodeURIComponent(query)}`)
      const data = (await res.json()) as StandingSearchResponse

      if (!res.ok) {
        setTrendError(data.message ?? '검색 중 문제가 생겼습니다.')
        setTrendResults([])
        return
      }

      setTrendResults(data.results)
      if (!data.results.length) {
        setTrendError('일치하는 드라이버나 컨스트럭터를 찾지 못했습니다.')
      }
    } catch {
      setTrendResults([])
      setTrendError('검색 중 문제가 생겼습니다.')
    } finally {
      setTrendLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3">
        <form onSubmit={handleTrendSearch} className="flex flex-col gap-3 sm:flex-row">
          <label className="flex flex-1 flex-col gap-1">
            <span className="text-xs font-black text-[var(--muted)]">시즌별 순위 검색</span>
            <input
              value={trendQuery}
              onChange={event => setTrendQuery(event.target.value)}
              placeholder="예: 베르스타펜, Verstappen, 맥라렌, McLaren"
              className="rounded-md border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm font-bold text-[var(--text)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
            />
          </label>
          <button
            type="submit"
            disabled={trendLoading}
            className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-black text-white transition-opacity disabled:cursor-wait disabled:opacity-60 sm:self-end"
          >
            {trendLoading ? '검색 중' : '검색'}
          </button>
        </form>

        {(trendError || trendResults.length > 0) && (
          <div className="mt-4 flex flex-col gap-3">
            {trendError && (
              <p className="rounded-md bg-[var(--bg-2)] px-3 py-2 text-xs font-bold text-[var(--muted)]">
                {trendError}
              </p>
            )}
            {trendResults.map(group => (
              <TrendCard key={`${group.type}-${group.id}`} group={group} />
            ))}
          </div>
        )}
      </section>

      <div className="flex flex-col items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3 sm:flex-row sm:items-center">
        <label className="flex items-center gap-2 text-sm font-bold text-[var(--text)]">
          <span className="whitespace-nowrap">시즌</span>
          <select
            value={selectedSeason}
            onChange={e => handleSeasonChange(Number(e.target.value))}
            className="rounded-md border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          >
            {seasons.map(s => (
              <option key={s} value={s}>{s} 시즌</option>
            ))}
          </select>
        </label>
        <p className="text-xs font-bold text-[var(--muted)]">
          {`1950-${new Date().getFullYear()} 시즌 지원`}
        </p>
      </div>

      <div className="flex gap-1 rounded-lg border border-[var(--border)] bg-[var(--bg-2)] p-1">
        <button
          onClick={() => setTab('drivers')}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-black transition-colors ${
            tab === 'drivers'
              ? 'bg-[var(--card)] text-[var(--text)] shadow-sm'
              : 'text-[var(--muted)] hover:text-[var(--text)]'
          }`}
        >
          드라이버 순위
        </button>
        <button
          onClick={() => setTab('constructors')}
          disabled={!hasConstructors}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-black transition-colors ${
            tab === 'constructors'
              ? 'bg-[var(--card)] text-[var(--text)] shadow-sm'
              : 'text-[var(--muted)] hover:text-[var(--text)]'
          } disabled:cursor-not-allowed disabled:opacity-40`}
        >
          컨스트럭터 순위
          {!hasConstructors && selectedSeason < 1958 && (
            <span className="ml-1.5 text-[10px] font-bold">(1958~)</span>
          )}
        </button>
      </div>

      {tab === 'drivers' && (
        drivers?.length ? (
          <DriverTable rows={drivers} />
        ) : (
          <EmptyState message="드라이버 순위 데이터가 없습니다." />
        )
      )}
      {tab === 'constructors' && (
        constructors?.length ? (
          <ConstructorTable rows={constructors} />
        ) : (
          <EmptyState message={selectedSeason < 1958 ? '컨스트럭터 챔피언십은 1958년부터 시작했습니다.' : '컨스트럭터 순위 데이터가 없습니다.'} />
        )
      )}
    </div>
  )
}
