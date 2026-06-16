import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

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
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

function compactSearch(value: string) {
  return normalizeSearch(value).replace(/[\s()[\]{}._-]/g, '')
}

export async function GET(request: NextRequest) {
  const rawQuery = request.nextUrl.searchParams.get('q') ?? ''
  const compactQuery = compactSearch(rawQuery)

  if (compactQuery.length < 2) {
    return NextResponse.json(
      { message: '두 글자 이상 입력해 주세요.' },
      { status: 400 },
    )
  }

  const term = rawQuery.replace(/[%_\\]/g, '\\$&').replace(/[,()]/g, '')

  const { data, error } = await supabaseAdmin
    .from('f1_standings')
    .select('*')
    .or(`name.ilike.%${term}%,original_name.ilike.%${term}%,entity_id.ilike.%${term}%`)
    .order('year', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const groupMap = new Map<string, StandingTrendGroup>()

  for (const row of data ?? []) {
    const key = `${row.type}:${row.entity_id}`
    const point: StandingTrendPoint = {
      year: row.year,
      position: row.position,
      points: Number(row.points),
      wins: row.wins,
      team: row.team ?? undefined,
      teamColor: row.team_color,
    }

    const existing = groupMap.get(key)
    if (existing) {
      existing.points.push(point)
    } else {
      groupMap.set(key, {
        type: row.type as 'driver' | 'constructor',
        id: row.entity_id,
        name: row.name ?? row.original_name ?? row.entity_id,
        originalName: row.original_name ?? row.entity_id,
        points: [point],
      })
    }
  }

  const results = Array.from(groupMap.values()).sort((a, b) => {
    const latestA = a.points.at(-1)?.year ?? 0
    const latestB = b.points.at(-1)?.year ?? 0
    return latestB - latestA || b.points.length - a.points.length
  })

  return NextResponse.json({ query: rawQuery, results })
}
