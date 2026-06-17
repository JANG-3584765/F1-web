'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Race } from '@/lib/f1Api'

interface Props {
  seasons: number[]
  allRaces: Record<number, Race[]>
  selectedSeason: number
  selectedRound: number
}

function getDefaultRound(races: Race[]): number {
  const today = new Date().toISOString().slice(0, 10)
  const completed = races.filter(r => r.raceDate < today)
  return completed.at(-1)?.round ?? races[0]?.round ?? 1
}

export default function ResultsControls({
  seasons,
  allRaces,
  selectedSeason,
  selectedRound,
}: Props) {
  const router = useRouter()
  const [localSeason, setLocalSeason] = useState(selectedSeason)

  useEffect(() => {
    setLocalSeason(selectedSeason)
  }, [selectedSeason])

  const currentRaces = allRaces[localSeason] ?? []

  function handleSeasonChange(season: number) {
    const defaultRound = getDefaultRound(allRaces[season] ?? [])
    setLocalSeason(season)
    router.push(`/results?season=${season}&round=${defaultRound}`)
  }

  function handleRoundChange(round: number) {
    router.push(`/results?season=${localSeason}&round=${round}`)
  }

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg px-4 py-3 flex flex-col sm:flex-row gap-3">
      <label className="flex-1 flex items-center gap-2 text-sm font-bold text-[var(--text)]">
        <span className="whitespace-nowrap">시즌</span>
        <select
          value={localSeason}
          onChange={e => handleSeasonChange(Number(e.target.value))}
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
          onChange={e => handleRoundChange(Number(e.target.value))}
          className="w-full bg-[var(--input-bg)] border border-[var(--border)] rounded-md px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
        >
          {currentRaces.map(race => (
            <option key={race.round} value={race.round}>
              R{String(race.round).padStart(2, '0')} · {race.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
