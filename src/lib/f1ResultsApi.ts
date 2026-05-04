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
  'Marina Bay Street Circuit':       { laps: 62, lengthKm: 4.927, image: '마리나베이 서킷.png', lapRecord: { time: '1:34.486', driver: '다니엘 리카도', year: 2024 } },
  'Circuit of the Americas':         { laps: 56, lengthKm: 5.513, image: '서킷 오브 디 아메리카스.png', lapRecord: { time: '1:36.169', driver: '샤를 르클레르', year: 2019 } },
  'Autódromo Hermanos Rodríguez':    { laps: 71, lengthKm: 4.304, image: '아우토드로모 에르마노스 로드리게스.png', lapRecord: { time: '1:17.774', driver: '발테리 보타스', year: 2021 } },
  'Autódromo José Carlos Pace':      { laps: 71, lengthKm: 4.309, image: '인터라고스 서킷.png', lapRecord: { time: '1:10.540', driver: '발테리 보타스', year: 2018 } },
  'Las Vegas Strip Street Circuit':  { laps: 50, lengthKm: 6.201, image: '라스베가스 스트립 서킷.png', lapRecord: { time: '1:34.876', driver: '란도 노리스', year: 2024 } },
  'Losail International Circuit':    { laps: 57, lengthKm: 5.419, image: '루사일 인터내셔널 서킷.png', lapRecord: { time: '1:22.384', driver: '란도 노리스', year: 2024 } },
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

const DRIVER_NAMES: Record<string, string> = {
  'max_verstappen': '막스 베르스타펜',
  'verstappen':     '막스 베르스타펜',
  'lawson':         '리암 로슨',
  'norris':         '란도 노리스',
  'piastri':        '오스카 피아스트리',
  'leclerc':        '샤를 르클레르',
  'hamilton':       '루이스 해밀턴',
  'russell':        '조지 러셀',
  'antonelli':      '키미 안토넬리',
  'alonso':         '페르난도 알론소',
  'stroll':         '랜스 스트롤',
  'gasly':          '피에르 가슬리',
  'doohan':         '잭 두한',
  'albon':          '알렉스 알본',
  'sainz':          '카를로스 사인츠',
  'tsunoda':        '유키 츠노다',
  'hadjar':         '이삭 하자르',
  'ocon':           '에스테반 오콘',
  'bearman':        '올리버 베어만',
  'hulkenberg':     '니코 휠켄베르크',
  'bortoleto':      '가브리엘 보르톨레토',
  'colapinto':      '프랑코 콜라핀토',
  'lindblad':       '아비드 린드블라드',
  'perez':          '세르히오 페레스',
  'bottas':         '발테리 보타스',
  'zhou':           '저우관위',
  'herta':          '콜튼 허타',
}

const DRIVER_CODE_NAMES: Record<string, string> = {
  VER: '막스 베르스타펜',
  LAW: '리암 로슨',
  NOR: '란도 노리스',
  PIA: '오스카 피아스트리',
  LEC: '샤를 르클레르',
  HAM: '루이스 해밀턴',
  RUS: '조지 러셀',
  ANT: '키미 안토넬리',
  ALO: '페르난도 알론소',
  STR: '랜스 스트롤',
  GAS: '피에르 가슬리',
  DOO: '잭 두한',
  ALB: '알렉스 알본',
  SAI: '카를로스 사인츠',
  TSU: '유키 츠노다',
  HAD: '이삭 하자르',
  OCO: '에스테반 오콘',
  BEA: '올리버 베어만',
  HUL: '니코 휠켄베르크',
  BOR: '가브리엘 보르톨레토',
  COL: '프랑코 콜라핀토',
  LIN: '아비드 린드블라드',
  PER: '세르히오 페레스',
  BOT: '발테리 보타스',
  ZHO: '저우관위',
  HER: '콜튼 허타',
}

const DRIVER_FULL_NAMES: Record<string, string> = {
  'Max Verstappen': '막스 베르스타펜',
  'Liam Lawson': '리암 로슨',
  'Lando Norris': '란도 노리스',
  'Oscar Piastri': '오스카 피아스트리',
  'Charles Leclerc': '샤를 르클레르',
  'Lewis Hamilton': '루이스 해밀턴',
  'George Russell': '조지 러셀',
  'Kimi Antonelli': '키미 안토넬리',
  'Fernando Alonso': '페르난도 알론소',
  'Lance Stroll': '랜스 스트롤',
  'Pierre Gasly': '피에르 가슬리',
  'Jack Doohan': '잭 두한',
  'Alexander Albon': '알렉스 알본',
  'Alex Albon': '알렉스 알본',
  'Carlos Sainz': '카를로스 사인츠',
  'Yuki Tsunoda': '유키 츠노다',
  'Isack Hadjar': '이삭 하자르',
  'Esteban Ocon': '에스테반 오콘',
  'Oliver Bearman': '올리버 베어만',
  'Nico Hulkenberg': '니코 휠켄베르크',
  'Nico Hülkenberg': '니코 휠켄베르크',
  'Gabriel Bortoleto': '가브리엘 보르톨레토',
  'Franco Colapinto': '프랑코 콜라핀토',
  'Arvid Lindblad': '아비드 린드블라드',
  'Sergio Perez': '세르히오 페레스',
  'Sergio Pérez': '세르히오 페레스',
  'Valtteri Bottas': '발테리 보타스',
  'Guanyu Zhou': '저우관위',
  'Zhou Guanyu': '저우관위',
  'Colton Herta': '콜튼 허타',
}

const CONSTRUCTOR_NAMES: Record<string, string> = {
  'red_bull':     '레드불',
  'mclaren':      '맥라렌',
  'ferrari':      '페라리',
  'mercedes':     '메르세데스',
  'aston_martin': '애스턴 마틴',
  'alpine':       '알핀',
  'williams':     '윌리엄스',
  'rb':           '레이싱 불스',
  'racing_bulls': '레이싱 불스',
  'haas':         '하스',
  'kick_sauber':  '킥 자우버',
  'sauber':       '킥 자우버',
  'audi':         '아우디',
  'cadillac':     '캐딜락',
}

const CONSTRUCTOR_DISPLAY_NAMES: Record<string, string> = {
  'Red Bull Racing': '레드불',
  'Oracle Red Bull Racing': '레드불',
  'Red Bull': '레드불',
  'McLaren': '맥라렌',
  'Ferrari': '페라리',
  'Mercedes': '메르세데스',
  'Aston Martin': '애스턴 마틴',
  'Aston Martin Aramco': '애스턴 마틴',
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
  '메르세데스':  '#27F4D2',
  '애스턴 마틴': '#229971',
  '알핀':        '#0093CC',
  '윌리엄스':    '#64C4FF',
  '레이싱 불스': '#5E8FAA',
  '하스':        '#B6BABD',
  '킥 자우버':   '#00E701',
  '아우디':      '#00E701',
  '캐딜락':      '#B9975B',
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

export interface ResultRow {
  position: number | null
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

function getDriverName(driver: {
  driverId?: string
  code?: string
  givenName?: string
  familyName?: string
}) {
  const idName = driver.driverId ? DRIVER_NAMES[driver.driverId] : undefined
  const codeName = driver.code ? DRIVER_CODE_NAMES[driver.code] : undefined
  const fullName = `${driver.givenName ?? ''} ${driver.familyName ?? ''}`.trim()
  return idName ?? codeName ?? DRIVER_FULL_NAMES[fullName] ?? fullName
}

function getConstructorName(constructor: { constructorId?: string; name?: string }) {
  const idName = constructor.constructorId ? CONSTRUCTOR_NAMES[constructor.constructorId] : undefined
  const displayName = constructor.name ? CONSTRUCTOR_DISPLAY_NAMES[constructor.name] : undefined
  return idName ?? displayName ?? constructor.name ?? ''
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results: ResultRow[] = race.Results.map((r: any): ResultRow => {
      const driverName = getDriverName(r.Driver)
      const teamKr = getConstructorName(r.Constructor)

      const classified = !['R', 'D', 'W', 'N', 'E', 'F'].includes(r.positionText)

      let timeOrGap: string
      if (r.status === 'Finished') {
        timeOrGap = r.Time?.time ?? '완주'
      } else if (/^\+\d+ Laps?$/.test(r.status)) {
        timeOrGap = r.status.replace(/Laps?$/, '랩')
      } else {
        timeOrGap = STATUS_KR[r.status] ?? r.status
      }

      const isFastest = r.FastestLap?.rank === '1'
      if (isFastest) {
        fastestLapDriver = driverName
        fastestLapTime = r.FastestLap?.Time?.time ?? null
      }

      return {
        position: classified ? Number(r.position) : null,
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
