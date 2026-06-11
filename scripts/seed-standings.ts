import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'
import { fetchDriverStandings, fetchConstructorStandings } from '../src/lib/f1StandingsApi'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const FIRST_DRIVER_SEASON = 1950
const FIRST_CONSTRUCTOR_SEASON = 1958
const CURRENT_YEAR = new Date().getFullYear()
const BATCH_SIZE = 1
const DELAY_MS = 600

type SeedRow = {
  type: string
  entity_id: string
  name: string | null
  original_name: string | null
  year: number
  position: number | null
  points: number
  wins: number
  team: string | null
  team_color: string
}

async function fetchWithRetry<T>(fn: () => Promise<T | null>, retries = 3): Promise<T | null> {
  for (let i = 0; i <= retries; i++) {
    const result = await fn()
    if (result) return result
    if (i < retries) await new Promise(r => setTimeout(r, 1000 * (i + 1)))
  }
  return null
}

async function seedYear(year: number) {
  const [drivers, constructors] = await Promise.all([
    fetchWithRetry(() => fetchDriverStandings(year)),
    year >= FIRST_CONSTRUCTOR_SEASON
      ? fetchWithRetry(() => fetchConstructorStandings(year))
      : Promise.resolve(null),
  ])

  const rows: SeedRow[] = []

  if (drivers) {
    for (const d of drivers) {
      rows.push({
        type: 'driver',
        entity_id: d.driverId,
        name: d.name,
        original_name: d.originalName,
        year,
        position: d.position,
        points: d.points,
        wins: d.wins,
        team: d.team,
        team_color: d.teamColor,
      })
    }
  }

  if (constructors) {
    for (const c of constructors) {
      rows.push({
        type: 'constructor',
        entity_id: c.constructorId,
        name: c.name,
        original_name: c.originalName,
        year,
        position: c.position,
        points: c.points,
        wins: c.wins,
        team: null,
        team_color: c.teamColor,
      })
    }
  }

  if (rows.length > 0) {
    const { error } = await supabase
      .from('f1_standings')
      .upsert(rows, { onConflict: 'type,entity_id,year' })

    if (error) {
      console.error(`  ✗ ${year}: ${error.message}`)
      return { year, ok: false, drivers: 0, constructors: 0 }
    }
  }

  return {
    year,
    ok: true,
    drivers: drivers?.length ?? 0,
    constructors: constructors?.length ?? 0,
  }
}

async function main() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('.env.local에 SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY가 없습니다.')
    process.exit(1)
  }

  console.log('F1 standings 시딩 시작...\n')

  const seasons = Array.from(
    { length: CURRENT_YEAR - FIRST_DRIVER_SEASON + 1 },
    (_, i) => FIRST_DRIVER_SEASON + i,
  )

  let completed = 0
  let failed = 0

  for (let i = 0; i < seasons.length; i += BATCH_SIZE) {
    const batch = seasons.slice(i, i + BATCH_SIZE)
    const results = await Promise.all(batch.map(seedYear))
    await new Promise(r => setTimeout(r, DELAY_MS))

    for (const r of results) {
      if (r.ok) {
        console.log(`  ✓ ${r.year}: 드라이버 ${r.drivers}명, 컨스트럭터 ${r.constructors}팀`)
        completed++
      } else {
        failed++
      }
    }

    const total = completed + failed
    const pct = Math.round((total / seasons.length) * 100)
    console.log(`  → 진행: ${total}/${seasons.length} (${pct}%)\n`)
  }

  console.log(`완료! 성공: ${completed}시즌, 실패: ${failed}시즌`)
}

main().catch(console.error)
