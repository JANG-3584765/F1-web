'use client'

import { useRouter } from 'next/navigation'
import type { Race } from '@/lib/f1Api'

interface Props {
  seasons: number[]
  races: Race[]
  selectedSeason: number
  selectedRound: number
}

export default function ResultsControls({
  seasons,
  races,
  selectedSeason,
  selectedRound,
}: Props) {
  const router = useRouter()

  function moveTo(season: number, round: number) {
    router.push(`/results?season=${season}&round=${round}`)
  }

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg px-4 py-3 flex flex-col sm:flex-row gap-3">
      <label className="flex-1 flex items-center gap-2 text-sm font-bold text-[var(--text)]">
        <span className="whitespace-nowrap">시즌</span>
        <select
          value={selectedSeason}
          onChange={e => moveTo(Number(e.target.value), 1)}
          className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-md px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
        >
          {seasons.map(season => (
            <option key={season} value={season}>{season} 시즌</option>
          ))}
        </select>
      </label>

      <label className="flex-1 flex items-center gap-2 text-sm font-bold text-[var(--text)]">
        <span className="whitespace-nowrap">라운드</span>
        <select
          value={selectedRound}
          onChange={e => moveTo(selectedSeason, Number(e.target.value))}
          className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-md px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
        >
          {races.map(race => (
            <option key={race.round} value={race.round}>
              R{String(race.round).padStart(2, '0')} · {race.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
