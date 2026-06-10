import { GP_NAMES, CIRCUIT_NAMES, COUNTRY_CODES } from './f1Api'

export interface CircuitInfo {
  laps: number | null
  lengthKm: number
  image: string
  lapRecord?: {
    time: string
    driver: string
    year: number
  }
}

export const CIRCUIT_INFO: Record<string, CircuitInfo> = {
  'Albert Park Grand Prix Circuit':  { laps: 58, lengthKm: 5.278, image: '앨버트 파크 서킷.png', lapRecord: { time: '1:19.813', driver: '샤를 르클레르', year: 2024 } },
  'Shanghai International Circuit':  { laps: 56, lengthKm: 5.451, image: '상하이 인터내셔널 서킷.png', lapRecord: { time: '1:32.238', driver: '미하엘 슈마허', year: 2004 } },
  'Suzuka Circuit':                  { laps: 53, lengthKm: 5.807, image: '스즈카 서킷.png', lapRecord: { time: '1:30.965', driver: '키미 안토넬리', year: 2025 } },
  'Bahrain International Circuit':   { laps: 57, lengthKm: 5.412, image: '바레인 인터내셔널 서킷.png', lapRecord: { time: '1:31.447', driver: '페드로 데 라 로사', year: 2005 } },
  'Jeddah Corniche Circuit':         { laps: 50, lengthKm: 6.174, image: '제다 코니쉬 서킷.png', lapRecord: { time: '1:30.734', driver: '루이스 해밀턴', year: 2021 } },
  'Miami International Autodrome':   { laps: 57, lengthKm: 5.412, image: '마이애미 인터내셔널 오토드롬.png', lapRecord: { time: '1:29.708', driver: '막스 베르스타펜', year: 2023 } },
  'Autodromo Enzo e Dino Ferrari':   { laps: 63, lengthKm: 4.909, image: '이몰라 서킷.jpg', lapRecord: { time: '1:15.484', driver: '루이스 해밀턴', year: 2020 } },
  'Circuit de Monaco':               { laps: 78, lengthKm: 3.337, image: '시르퀴 드 모나코.png', lapRecord: { time: '1:12.909', driver: '루이스 해밀턴', year: 2021 } },
  'Circuit de Barcelona-Catalunya':  { laps: 66, lengthKm: 4.657, image: '시르쿠이트 데 바르셀로나.png', lapRecord: { time: '1:16.330', driver: '막스 베르스타펜', year: 2023 } },
  'Circuit Gilles Villeneuve':       { laps: 70, lengthKm: 4.361, image: '시르퀴 질 빌뇌브.png', lapRecord: { time: '1:13.078', driver: '발테리 보타스', year: 2019 } },
  'Red Bull Ring':                   { laps: 71, lengthKm: 4.326, image: '레드불링.png', lapRecord: { time: '1:05.619', driver: '카를로스 사인츠', year: 2020 } },
  'Silverstone Circuit':             { laps: 52, lengthKm: 5.891, image: '실버스톤 서킷.png', lapRecord: { time: '1:27.097', driver: '막스 베르스타펜', year: 2020 } },
  'Circuit de Spa-Francorchamps':    { laps: 44, lengthKm: 7.004, image: '스파 프랑코샹 서킷.png', lapRecord: { time: '1:46.286', driver: '발테리 보타스', year: 2018 } },
  'Hungaroring':                     { laps: 70, lengthKm: 4.381, image: '헝가로링.png', lapRecord: { time: '1:16.627', driver: '루이스 해밀턴', year: 2020 } },
  'Circuit Park Zandvoort':          { laps: 72, lengthKm: 4.259, image: '잔드보르트 서킷.png', lapRecord: { time: '1:11.097', driver: '루이스 해밀턴', year: 2021 } },
  'Autodromo Nazionale di Monza':    { laps: 53, lengthKm: 5.793, image: '몬자서킷.png', lapRecord: { time: '1:21.046', driver: '루벤스 바리첼로', year: 2004 } },
  'Baku City Circuit':               { laps: 51, lengthKm: 6.003, image: '바쿠 시티 서킷.png', lapRecord: { time: '1:43.009', driver: '샤를 르클레르', year: 2019 } },
  'Marina Bay Street Circuit':       { laps: 62, lengthKm: 4.927, image: '마리나베이 서킷.png', lapRecord: { time: '1:34.486', driver: '다니엘 리카르도', year: 2024 } },
  'Circuit of the Americas':         { laps: 56, lengthKm: 5.513, image: '서킷 오브 디 아메리카스.png', lapRecord: { time: '1:36.169', driver: '샤를 르클레르', year: 2019 } },
  'Autódromo Hermanos Rodríguez':    { laps: 71, lengthKm: 4.304, image: '아우토드로모 에르마노스 로드리게스.png', lapRecord: { time: '1:17.774', driver: '발테리 보타스', year: 2021 } },
  'Autódromo José Carlos Pace':      { laps: 71, lengthKm: 4.309, image: '인터라고스 서킷.png', lapRecord: { time: '1:10.540', driver: '발테리 보타스', year: 2018 } },
  'Las Vegas Strip Street Circuit':  { laps: 50, lengthKm: 6.201, image: '라스베가스 스트립 서킷.png', lapRecord: { time: '1:34.876', driver: '랜도 노리스', year: 2024 } },
  'Losail International Circuit':    { laps: 57, lengthKm: 5.419, image: '루사일 인터내셔널 서킷.png', lapRecord: { time: '1:22.384', driver: '랜도 노리스', year: 2024 } },
  'Yas Marina Circuit':              { laps: 58, lengthKm: 5.281, image: '야스 마리나 서킷.png', lapRecord: { time: '1:26.103', driver: '막스 베르스타펜', year: 2021 } },
  'Madring':                         { laps: null, lengthKm: 5.474, image: '마드링.png' },
}

export function getCircuitInfo(circuitName: string): CircuitInfo | null {
  if (CIRCUIT_INFO[circuitName]) return CIRCUIT_INFO[circuitName]

  const apiName = Object.entries(CIRCUIT_NAMES).find(([, displayName]) => displayName === circuitName)?.[0]
  return apiName ? CIRCUIT_INFO[apiName] ?? null : null
}

const CITY_NAMES: Record<string, string> = {
  Melbourne: '멜버른',
  Shanghai: '상하이',
  Suzuka: '스즈카',
  Sakhir: '사키르',
  Jeddah: '제다',
  Miami: '마이애미',
  Imola: '이몰라',
  'Monte-Carlo': '몬테카를로',
  Barcelona: '바르셀로나',
  Montreal: '몬트리올',
  'Spielberg bei Knittelfeld': '슈필베르크',
  Spielberg: '슈필베르크',
  Silverstone: '실버스톤',
  Spa: '스파',
  Budapest: '부다페스트',
  Zandvoort: '잔드보르트',
  Monza: '몬차',
  Baku: '바쿠',
  Singapore: '싱가포르',
  Austin: '오스틴',
  'Mexico City': '멕시코시티',
  'São Paulo': '상파울루',
  'Sao Paulo': '상파울루',
  'Las Vegas': '라스베이거스',
  Lusail: '루사일',
  'Abu Dhabi': '아부다비',
  Madrid: '마드리드',
}

export function getCityName(city: string): string {
  return CITY_NAMES[city] ?? city
}

// 악센트(Pérez→Perez 등)는 getDriverName()에서 정규화 처리하므로 제거
// API가 givenName+familyName 순서로 반환하므로 역순 중복 제거
// Alexander/Alex Albon은 API가 실제로 두 형태 모두 사용해 유지
const DRIVER_FULL_NAMES: Record<string, string> = {
  // ── 2025 그리드 ──
  'Max Verstappen':    '막스 베르스타펜',
  'Liam Lawson':       '리암 로슨',
  'Lando Norris':      '랜도 노리스',
  'Oscar Piastri':     '오스카 피아스트리',
  'Charles Leclerc':   '샤를 르클레르',
  'Lewis Hamilton':    '루이스 해밀턴',
  'George Russell':    '조지 러셀',
  'Kimi Antonelli':         '키미 안토넬리',
  'Andrea Kimi Antonelli':  '키미 안토넬리',
  'Fernando Alonso':   '페르난도 알론소',
  'Lance Stroll':      '랜스 스트롤',
  'Pierre Gasly':      '피에르 가슬리',
  'Jack Doohan':       '잭 두한',
  'Alexander Albon':   '알렉스 알본',
  'Alex Albon':        '알렉스 알본',
  'Carlos Sainz':      '카를로스 사인츠',
  'Yuki Tsunoda':      '유키 츠노다',
  'Isack Hadjar':      '아이작 하자르',
  'Esteban Ocon':      '에스테반 오콘',
  'Oliver Bearman':    '올리버 베어먼',
  'Nico Hulkenberg':   '니코 휠켄베르트',
  'Gabriel Bortoleto': '가브리에우 보르톨레투',
  'Franco Colapinto':  '프랑코 콜라핀토',
  'Arvid Lindblad':    '아비드 린드블라드',
  // ── 최근 전임자 (FP 대체 출전 가능) ──
  'Sergio Perez':      '세르히오 페레스',
  'Valtteri Bottas':   '발테리 보타스',
  'Guanyu Zhou':       '저우관위',
  'Colton Herta':      '콜튼 헤르타',
}

const CONSTRUCTOR_NAMES: Record<string, string> = {
  'Red Bull Racing': '레드불',
  'Oracle Red Bull Racing': '레드불',
  'Red Bull': '레드불',
  'McLaren': '맥라렌',
  'Ferrari': '페라리',
  'Mercedes': '메르세데스',
  'Aston Martin': '애스턴 마틴',
  'Aston Martin Aramco': '애스턴 마틴',
  'Alpine F1 Team': '알핀',
  'Alpine': '알핀',
  'Williams': '윌리엄스',
  'Racing Bulls': '레이싱 불스',
  'RB F1 Team': '레이싱 불스',
  'Haas F1 Team': '하스',
  'Haas': '하스',
  'Kick Sauber': '킥 자우버',
  'Sauber': '킥 자우버',
  'Audi': '아우디',
  'Cadillac': '캐딜락',
  'Cadillac F1 Team': '캐딜락',
}

export const TEAM_COLORS: Record<string, string> = {
  '레드불':      '#3671C6',
  '맥라렌':      '#FF8000',
  '페라리':      '#E8002D',
  '메르세데스':  '#00D2BE',
  '애스턴 마틴': '#229971',
  '알핀':        '#0090D4',
  '윌리엄스':    '#005AFF',
  '레이싱 불스': '#6692FF',
  '하스':        '#B91D1D',
  '킥 자우버':   '#00E701',
  '아우디':      '#9E9E9E',
  '캐딜락':      '#C41E3A',
}

const STATUS_KR: Record<string, string> = {
  'Accident':         '사고',
  'Collision':        '충돌',
  'Collision damage': '충돌 손상',
  'Engine':           '엔진',
  'Gearbox':          '기어박스',
  'Hydraulics':       '유압',
  'Brakes':           '브레이크',
  'Mechanical':       '기계 결함',
  'Electrical':       '전기 결함',
  'Suspension':       '서스펜션',
  'Tyres':            '타이어',
  'Puncture':         '펑크',
  'Power Unit':       '파워 유닛',
  'Turbo':            '터보',
  'Overheating':      '과열',
  'Oil pressure':     '오일 압력',
  'Fuel pressure':    '연료 압력',
  'Fuel system':      '연료 시스템',
  'Wheel':            '휠',
  'Differential':     '디퍼렌셜',
  'Drivetrain':       '드라이브트레인',
  'Debris':           '이물질',
  'Disqualified':     '실격',
  'Did not start':    '출발 불가',
  'Withdrew':         '기권',
  'Driver Seat':      '드라이버 시트',
}

export interface PitStop {
  stop: number
  lap: number
  duration: string
}

export interface DriverPitData {
  count: number
  stops: PitStop[]
}

export type PitStopMap = Record<string, DriverPitData>

export interface ResultRow {
  driverId: string
  position: number | null
  grid: number
  code: string
  name: string
  team: string
  teamColor: string
  timeOrGap: string
  laps: number
  points: number
  fastestLap: boolean
  classified: boolean
}

export interface RaceResult {
  raceName: string
  circuitName: string
  circuitInfo: CircuitInfo | null
  date: string
  flag: string
  city: string
  fastestLapDriver: string | null
  fastestLapTime: string | null
  results: ResultRow[]
}

interface JolpicaDriver {
  driverId: string
  givenName?: string
  familyName?: string
  code?: string
}

interface JolpicaConstructor {
  name?: string
}

interface JolpicaResultItem {
  position: string
  positionText: string
  points: string
  laps: string
  status: string
  grid?: string
  Driver: JolpicaDriver
  Constructor: JolpicaConstructor
  Time?: { time: string }
  FastestLap?: { rank: string; Time?: { time: string } }
}

interface JolpicaQualifyingItem {
  position: string
  Driver: JolpicaDriver
  Constructor: JolpicaConstructor
  Q1?: string
  Q2?: string
  Q3?: string
}

interface JolpicaPracticeItem {
  position: string
  Driver: JolpicaDriver
  Constructor: JolpicaConstructor
  Time?: { time: string }
  laps: string
}

function stripAccents(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function getDriverName(driver: { givenName?: string; familyName?: string }) {
  const fullName = `${driver.givenName ?? ''} ${driver.familyName ?? ''}`.trim()
  return DRIVER_FULL_NAMES[fullName] ?? DRIVER_FULL_NAMES[stripAccents(fullName)] ?? fullName
}

function getConstructorName(constructor: { name?: string }) {
  return constructor.name ? (CONSTRUCTOR_NAMES[constructor.name] ?? constructor.name) : ''
}

function resolveTimeOrGap(status: string, time?: string): string {
  if (status === 'Finished') return time ?? '완주'
  if (/^\+\d+ Laps?$/.test(status)) return status.replace(/Laps?$/, '랩')
  return STATUS_KR[status] ?? status
}

export async function fetchRaceResult(year: number, round: number): Promise<RaceResult | null> {
  try {
    const res = await fetch(
      `https://api.jolpi.ca/ergast/f1/${year}/${round}/results.json`,
      { next: { revalidate: 3600 } },
    )
    if (!res.ok) return null

    const data = await res.json()
    const race = data.MRData.RaceTable.Races?.[0]
    if (!race || !race.Results?.length) return null

    const circuitApiName: string = race.Circuit.circuitName
    let fastestLapDriver: string | null = null
    let fastestLapTime: string | null = null

    const results: ResultRow[] = race.Results.map((r: JolpicaResultItem): ResultRow => {
      const driverName = getDriverName(r.Driver)
      const teamKr = getConstructorName(r.Constructor)

      const classified = !['R', 'D', 'W', 'N', 'E', 'F'].includes(r.positionText)
      const timeOrGap = resolveTimeOrGap(r.status, r.Time?.time)

      const isFastest = r.FastestLap?.rank === '1'
      if (isFastest) {
        fastestLapDriver = driverName
        fastestLapTime = r.FastestLap?.Time?.time ?? null
      }

      return {
        driverId: r.Driver.driverId ?? '',
        position: classified ? Number(r.position) : null,
        grid: Number(r.grid ?? 0),
        code: r.Driver.code ?? '',
        name: driverName,
        team: teamKr,
        teamColor: TEAM_COLORS[teamKr] ?? '#999',
        timeOrGap,
        laps: Number(r.laps),
        points: Number(r.points),
        fastestLap: isFastest,
        classified,
      }
    })

    return {
      raceName: GP_NAMES[race.raceName] ?? race.raceName,
      circuitName: CIRCUIT_NAMES[circuitApiName] ?? circuitApiName,
      circuitInfo: CIRCUIT_INFO[circuitApiName] ?? null,
      date: race.date,
      flag: COUNTRY_CODES[race.Circuit.Location.country] ?? '',
      city: getCityName(race.Circuit.Location.locality ?? ''),
      fastestLapDriver,
      fastestLapTime,
      results,
    }
  } catch {
    return null
  }
}

export interface Stint {
  stintNumber: number
  lapStart: number
  lapEnd: number
  compound: string
  tyreAge: number
}

export type TireStrategyMap = Record<string, Stint[]>

export async function fetchTireStrategy(year: number, round: number): Promise<TireStrategyMap | null> {
  try {
    const sessionsRes = await fetch(
      `https://api.openf1.org/v1/sessions?year=${year}&session_name=Race`,
      { next: { revalidate: 3600 } },
    )
    if (!sessionsRes.ok) return null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessions: any[] = await sessionsRes.json()
    if (!sessions.length) return null

    // meeting_number은 프리시즌 테스팅(meeting 1)으로 인해 Ergast round와 오프셋이 생김
    // date_start 기준 정렬 후 round-1 인덱스로 매칭
    sessions.sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime())
    const session = sessions[round - 1]
    if (!session) return null
    const sessionKey: number = session.session_key

    const [driversRes, stintsRes] = await Promise.all([
      fetch(`https://api.openf1.org/v1/drivers?session_key=${sessionKey}`, { next: { revalidate: 3600 } }),
      fetch(`https://api.openf1.org/v1/stints?session_key=${sessionKey}`, { next: { revalidate: 3600 } }),
    ])
    if (!driversRes.ok || !stintsRes.ok) return null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const drivers: any[] = await driversRes.json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stints: any[] = await stintsRes.json()

    const numberToCode: Record<number, string> = {}
    for (const d of drivers) {
      numberToCode[d.driver_number] = d.name_acronym
    }

    const map: TireStrategyMap = {}
    for (const s of stints) {
      const code = numberToCode[s.driver_number]
      if (!code) continue
      if (!map[code]) map[code] = []
      map[code].push({
        stintNumber: s.stint_number,
        lapStart: s.lap_start,
        lapEnd: s.lap_end ?? 0,
        compound: s.compound ?? 'UNKNOWN',
        tyreAge: s.tyre_age_at_start ?? 0,
      })
    }
    return Object.keys(map).length > 0 ? map : null
  } catch {
    return null
  }
}

// ===== QUALIFYING =====

export interface QualifyingRow {
  position: number
  driverId: string
  code: string
  name: string
  team: string
  teamColor: string
  q1: string | null
  q2: string | null
  q3: string | null
}

export async function fetchQualifyingResult(year: number, round: number): Promise<QualifyingRow[] | null> {
  try {
    const res = await fetch(
      `https://api.jolpi.ca/ergast/f1/${year}/${round}/qualifying.json`,
      { next: { revalidate: 3600 } },
    )
    if (!res.ok) return null
    const data = await res.json()
    const race = data.MRData.RaceTable.Races?.[0]
    if (!race?.QualifyingResults?.length) return null

    return (race.QualifyingResults as JolpicaQualifyingItem[]).map((r): QualifyingRow => {
      const name = getDriverName(r.Driver)
      const team = getConstructorName(r.Constructor)
      return {
        position: Number(r.position),
        driverId: r.Driver.driverId ?? '',
        code: r.Driver.code ?? '',
        name,
        team,
        teamColor: TEAM_COLORS[team] ?? '#999',
        q1: r.Q1 ?? null,
        q2: r.Q2 ?? null,
        q3: r.Q3 ?? null,
      }
    })
  } catch {
    return null
  }
}

// ===== SPRINT =====

export interface SprintRow {
  position: number | null
  driverId: string
  code: string
  name: string
  team: string
  teamColor: string
  timeOrGap: string
  laps: number
  points: number
  classified: boolean
}

export async function fetchSprintResult(year: number, round: number): Promise<SprintRow[] | null> {
  try {
    const res = await fetch(
      `https://api.jolpi.ca/ergast/f1/${year}/${round}/sprint.json`,
      { next: { revalidate: 3600 } },
    )
    if (!res.ok) return null
    const data = await res.json()
    const race = data.MRData.RaceTable.Races?.[0]
    if (!race?.SprintResults?.length) return null

    return (race.SprintResults as JolpicaResultItem[]).map((r): SprintRow => {
      const name = getDriverName(r.Driver)
      const team = getConstructorName(r.Constructor)
      const classified = !['R', 'D', 'W', 'N', 'E', 'F'].includes(r.positionText)
      const timeOrGap = resolveTimeOrGap(r.status, r.Time?.time)

      return {
        position: classified ? Number(r.position) : null,
        driverId: r.Driver.driverId ?? '',
        code: r.Driver.code ?? '',
        name,
        team,
        teamColor: TEAM_COLORS[team] ?? '#999',
        timeOrGap,
        laps: Number(r.laps),
        points: Number(r.points),
        classified,
      }
    })
  } catch {
    return null
  }
}

// ===== PRACTICE =====

export interface PracticeRow {
  position: number
  driverId: string
  code: string
  name: string
  team: string
  teamColor: string
  lapTime: string | null
  laps: number
}

export async function fetchPracticeResult(year: number, round: number, session: 1 | 2 | 3): Promise<PracticeRow[] | null> {
  try {
    const res = await fetch(
      `https://api.jolpi.ca/ergast/f1/${year}/${round}/practice/${session}.json`,
      { next: { revalidate: 3600 } },
    )
    if (!res.ok) return null
    const data = await res.json()
    const race = data.MRData.RaceTable.Races?.[0]
    if (!race?.PracticeResults?.length) return null

    return (race.PracticeResults as JolpicaPracticeItem[]).map((r): PracticeRow => {
      const name = getDriverName(r.Driver)
      const team = getConstructorName(r.Constructor)
      return {
        position: Number(r.position),
        driverId: r.Driver.driverId ?? '',
        code: r.Driver.code ?? '',
        name,
        team,
        teamColor: TEAM_COLORS[team] ?? '#999',
        lapTime: r.Time?.time ?? null,
        laps: Number(r.laps),
      }
    })
  } catch {
    return null
  }
}

export interface PodiumEntry {
  name: string
  team: string
  teamColor: string
}

export interface LastRaceMini {
  raceName: string
  flag: string
  podium: PodiumEntry[]
}

export async function fetchLastRacePodium(): Promise<LastRaceMini | null> {
  try {
    const res = await fetch(
      'https://api.jolpi.ca/ergast/f1/current/last/results.json',
      { next: { revalidate: 3600 } },
    )
    if (!res.ok) return null
    const data = await res.json()
    const race = data.MRData?.RaceTable?.Races?.[0]
    if (!race?.Results?.length) return null

    const podium: PodiumEntry[] = (race.Results as JolpicaResultItem[]).slice(0, 3).map(r => {
      const name = getDriverName(r.Driver)
      const team = getConstructorName(r.Constructor)
      return { name, team, teamColor: TEAM_COLORS[team] ?? '#999' }
    })

    return {
      raceName: GP_NAMES[race.raceName] ?? race.raceName,
      flag: COUNTRY_CODES[race.Circuit.Location.country] ?? '',
      podium,
    }
  } catch {
    return null
  }
}

export async function fetchPitStops(year: number, round: number): Promise<PitStopMap | null> {
  try {
    const res = await fetch(
      `https://api.jolpi.ca/ergast/f1/${year}/${round}/pitstops.json?limit=100`,
      { next: { revalidate: 3600 } },
    )
    if (!res.ok) return null

    const data = await res.json()
    const race = data.MRData.RaceTable.Races?.[0]
    if (!race?.PitStops?.length) return null

    const map: PitStopMap = {}
    interface JolpicaPitStop { driverId: string; stop: string; lap: string; duration: string }
    for (const ps of race.PitStops as JolpicaPitStop[]) {
      if (!map[ps.driverId]) map[ps.driverId] = { count: 0, stops: [] }
      map[ps.driverId].count++
      map[ps.driverId].stops.push({
        stop: Number(ps.stop),
        lap: Number(ps.lap),
        duration: ps.duration,
      })
    }
    return map
  } catch {
    return null
  }
}
