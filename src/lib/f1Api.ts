export const GP_NAMES: Record<string, string> = {
  'Australian Grand Prix':    '호주 GP',
  'Chinese Grand Prix':       '중국 GP',
  'Japanese Grand Prix':      '일본 GP',
  'Bahrain Grand Prix':       '바레인 GP',
  'Saudi Arabian Grand Prix': '사우디아라비아 GP',
  'Miami Grand Prix':         '마이애미 GP',
  'Emilia Romagna Grand Prix':'에밀리아 로마냐 GP',
  'Monaco Grand Prix':        '모나코 GP',
  'Spanish Grand Prix':       '스페인 GP',
  'Canadian Grand Prix':      '캐나다 GP',
  'Austrian Grand Prix':      '오스트리아 GP',
  'British Grand Prix':       '영국 GP',
  'Belgian Grand Prix':       '벨기에 GP',
  'Hungarian Grand Prix':     '헝가리 GP',
  'Dutch Grand Prix':         '네덜란드 GP',
  'Italian Grand Prix':       '이탈리아 GP',
  'Azerbaijan Grand Prix':    '아제르바이잔 GP',
  'Singapore Grand Prix':     '싱가포르 GP',
  'United States Grand Prix': '미국 GP',
  'Mexico City Grand Prix':   '멕시코 GP',
  'São Paulo Grand Prix':     '브라질 GP',
  'Brazilian Grand Prix':     '브라질 GP',
  'Barcelona Grand Prix':     '바르셀로나 GP',
  'Las Vegas Grand Prix':     '라스베이거스 GP',
  'Qatar Grand Prix':         '카타르 GP',
  'Abu Dhabi Grand Prix':     '아부다비 GP',
  'Madrid Grand Prix':        '마드리드 GP',
}

export const CIRCUIT_NAMES: Record<string, string> = {
  'Albert Park Grand Prix Circuit':  '알버트 파크 서킷',
  'Shanghai International Circuit':  '상하이 인터내셔널 서킷',
  'Suzuka Circuit':                  '스즈카 서킷',
  'Bahrain International Circuit':   '바레인 인터내셔널 서킷',
  'Jeddah Corniche Circuit':         '제다 코니체 서킷',
  'Miami International Autodrome':   '마이애미 인터내셔널 오토드롬',
  'Autodromo Enzo e Dino Ferrari':   '아우토드로모 엔초 에 디노 페라리',
  'Circuit de Monaco':               '서킷 드 모나코',
  'Circuit de Barcelona-Catalunya':  '서킷 드 바르셀로나-카탈루냐',
  'Circuit Gilles Villeneuve':       '서킷 질 빌뇌브',
  'Red Bull Ring':                   '레드불 링',
  'Silverstone Circuit':             '실버스톤 서킷',
  'Circuit de Spa-Francorchamps':    '서킷 드 스파-프랑코샹',
  'Hungaroring':                     '헝가로링',
  'Circuit Park Zandvoort':          '잔트포르트 서킷',
  'Autodromo Nazionale di Monza':    '아우토드로모 나치오날레 몬차',
  'Baku City Circuit':               '바쿠 시티 서킷',
  'Marina Bay Street Circuit':       '마리나 베이 스트리트 서킷',
  'Circuit of the Americas':         '서킷 오브 더 아메리카스',
  'Autódromo Hermanos Rodríguez':    '아우토드로모 에르마노스 로드리게스',
  'Autódromo José Carlos Pace':      '아우토드로모 호세 카를로스 파세',
  'Las Vegas Strip Street Circuit':  '라스베이거스 스트립 서킷',
  'Losail International Circuit':    '루사일 인터내셔널 서킷',
  'Yas Marina Circuit':              '야스 마리나 서킷',
  'Madring':                         '마드링',
}

export const COUNTRY_CODES: Record<string, string> = {
  'Australia':    'au',
  'China':        'cn',
  'Japan':        'jp',
  'Bahrain':      'bh',
  'Saudi Arabia': 'sa',
  'USA':          'us',
  'Italy':        'it',
  'Monaco':       'mc',
  'Spain':        'es',
  'Canada':       'ca',
  'Austria':      'at',
  'UK':           'gb',
  'Belgium':      'be',
  'Hungary':      'hu',
  'Netherlands':  'nl',
  'Azerbaijan':   'az',
  'Singapore':    'sg',
  'Mexico':       'mx',
  'Brazil':       'br',
  'Qatar':        'qa',
  'UAE':          'ae',
}

export interface RaceSession {
  date: string
  time?: string
}

export interface Race {
  round: number
  name: string
  circuit: string
  flag: string
  city: string
  raceDate: string
  raceTime?: string
  sprint: boolean
  sessions: {
    fp1?: RaceSession
    fp2?: RaceSession
    fp3?: RaceSession
    qualifying?: RaceSession
    sprintShootout?: RaceSession
    sprint?: RaceSession
  }
}

export async function fetchSeasonRaces(year: number): Promise<Race[]> {
  const [racesRes, sprintRes] = await Promise.all([
    fetch(`https://api.jolpi.ca/ergast/f1/${year}/races.json`, {
      next: { revalidate: 86400 },
    }),
    fetch(`https://api.jolpi.ca/ergast/f1/${year}/sprint.json`, {
      next: { revalidate: 86400 },
    }),
  ])

  if (!racesRes.ok) throw new Error(`Failed to fetch ${year} F1 schedule`)

  const racesData = await racesRes.json()
  const sprintData = sprintRes.ok ? await sprintRes.json() : { MRData: { RaceTable: { Races: [] } } }

  const sprintRounds = new Set<string>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sprintData.MRData.RaceTable.Races.map((r: any) => r.round),
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (s: any): RaceSession | undefined =>
    s ? { date: s.date, time: s.time } : undefined

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return racesData.MRData.RaceTable.Races.map((r: any): Race => ({
    round:    Number(r.round),
    name:     GP_NAMES[r.raceName] ?? r.raceName,
    circuit:  CIRCUIT_NAMES[r.Circuit.circuitName] ?? r.Circuit.circuitName,
    flag:     COUNTRY_CODES[r.Circuit.Location.country] ?? '',
    city:     r.Circuit.Location.locality ?? '',
    raceDate: r.date,
    raceTime: r.time,
    sprint:   sprintRounds.has(r.round),
    sessions: {
      fp1:            session(r.FirstPractice),
      fp2:            session(r.SecondPractice),
      fp3:            session(r.ThirdPractice),
      qualifying:     session(r.Qualifying),
      sprintShootout: session(r.SprintShootout ?? r.SprintQualifying),
      sprint:         session(r.Sprint),
    },
  }))
}
