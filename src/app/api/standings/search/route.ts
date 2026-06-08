import { NextRequest, NextResponse } from 'next/server'
import {
  fetchConstructorStandings,
  fetchDriverStandings,
  type ConstructorStandingRow,
  type DriverStandingRow,
} from '@/lib/f1StandingsApi'

const FIRST_DRIVER_SEASON = 1950
const FIRST_CONSTRUCTOR_SEASON = 1958
const CURRENT_YEAR = new Date().getFullYear()
const BATCH_SIZE = 2

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

function normalizeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function compactSearch(value: string) {
  return normalizeSearch(value).replace(/[\s()[\]{}._-]/g, '')
}

function includesQuery(value: string | undefined, query: string, compactQuery: string) {
  if (!value) return false
  const normalized = normalizeSearch(value)
  return normalized.includes(query) || compactSearch(value).includes(compactQuery)
}

function driverMatches(row: DriverStandingRow, query: string, compactQuery: string) {
  return [
    row.name,
    row.originalName,
    row.driverId,
    row.code,
  ].some(value => includesQuery(value, query, compactQuery))
}

function constructorMatches(row: ConstructorStandingRow, query: string, compactQuery: string) {
  return [
    row.name,
    row.originalName,
    row.constructorId,
  ].some(value => includesQuery(value, query, compactQuery))
}

function upsertGroup(
  groups: Map<string, StandingTrendGroup>,
  group: Omit<StandingTrendGroup, 'points'>,
  point: StandingTrendPoint,
) {
  const key = `${group.type}:${group.id}`
  const current = groups.get(key)

  if (current) {
    const sameYearPoint = current.points.find(existingPoint => existingPoint.year === point.year)

    if (sameYearPoint) {
      sameYearPoint.points += point.points
      sameYearPoint.wins += point.wins
      sameYearPoint.position =
        sameYearPoint.position === null || point.position === null
          ? sameYearPoint.position ?? point.position
          : Math.min(sameYearPoint.position, point.position)
      return
    }

    current.points.push(point)
    return
  }

  groups.set(key, {
    ...group,
    points: [point],
  })
}

async function fetchWithRetry<T>(fetcher: () => Promise<T | null>, retries = 2): Promise<T | null> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const data = await fetcher()
    if (data) return data
    if (attempt < retries) {
      await new Promise(resolve => setTimeout(resolve, 250 * (attempt + 1)))
    }
  }

  return null
}

async function processYear(
  year: number,
  query: string,
  compactQuery: string,
  groups: Map<string, StandingTrendGroup>,
) {
  const [drivers, constructors] = await Promise.all([
    fetchWithRetry(() => fetchDriverStandings(year)),
    year >= FIRST_CONSTRUCTOR_SEASON
      ? fetchWithRetry(() => fetchConstructorStandings(year))
      : Promise.resolve(null),
  ])

  drivers
    ?.filter(row => driverMatches(row, query, compactQuery))
    .forEach(row => {
      upsertGroup(
        groups,
        {
          type: 'driver',
          id: row.driverId,
          name: row.name,
          originalName: row.originalName,
        },
        {
          year,
          position: row.position,
          points: row.points,
          wins: row.wins,
          team: row.team,
          teamColor: row.teamColor,
        },
      )
    })

  constructors
    ?.filter(row => constructorMatches(row, query, compactQuery))
    .forEach(row => {
      upsertGroup(
        groups,
        {
          type: 'constructor',
          id: compactSearch(row.name || row.originalName || row.constructorId),
          name: row.name,
          originalName: row.name === row.originalName ? row.originalName : row.name,
        },
        {
          year,
          position: row.position,
          points: row.points,
          wins: row.wins,
          teamColor: row.teamColor,
        },
      )
    })
}

export async function GET(request: NextRequest) {
  const rawQuery = request.nextUrl.searchParams.get('q') ?? ''
  const query = normalizeSearch(rawQuery)
  const compactQuery = compactSearch(rawQuery)

  if (compactQuery.length < 2) {
    return NextResponse.json(
      { message: '두 글자 이상 입력해 주세요.' },
      { status: 400 },
    )
  }

  const groups = new Map<string, StandingTrendGroup>()
  const seasons = Array.from(
    { length: CURRENT_YEAR - FIRST_DRIVER_SEASON + 1 },
    (_, i) => FIRST_DRIVER_SEASON + i,
  )

  for (let i = 0; i < seasons.length; i += BATCH_SIZE) {
    const batch = seasons.slice(i, i + BATCH_SIZE)
    await Promise.all(batch.map(year => processYear(year, query, compactQuery, groups)))
  }

  const results = Array.from(groups.values())
    .map(group => ({
      ...group,
      points: group.points.sort((a, b) => a.year - b.year),
    }))
    .sort((a, b) => {
      const latestA = a.points.at(-1)?.year ?? 0
      const latestB = b.points.at(-1)?.year ?? 0
      return latestB - latestA || b.points.length - a.points.length
    })

  return NextResponse.json({
    query: rawQuery,
    results,
  })
}
