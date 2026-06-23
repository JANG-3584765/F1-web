import { TEAM_COLORS } from './teamColors'

export interface ManualPitStop {
  driver: string    // 드라이버 이름 (한국어, DRIVER_FULL_NAMES 참고)
  team: string      // 팀 이름 (한국어, CONSTRUCTOR_NAMES 참고)
  teamColor: string // TEAM_COLORS['팀명'] 사용
  duration: number  // 정차 서비스 타임 (초, 소수점 3자리 · 예: 2.456)
  lap: number       // 피트스탑 랩 번호
}

export interface ManualDriverOfTheDay {
  driver: string
  team: string
  teamColor: string
}

export interface ManualRaceData {
  fastestPitStop?: ManualPitStop
  driverOfTheDay?: ManualDriverOfTheDay
}

// ──────────────────────────────────────────────────────────────────
// 데이터 입력 가이드
//
// 키 형식: "{연도}-{라운드}" (예: "2025-8")
//
// [패스티스트 피트 · 정차 서비스 타임]
//   - F1 공식 방송/F1TV 화면에 표시되는 DHL Fastest Pit Stop 배너 수치
//   - FIA 공식 타이밍 문서 (Event Notes / Technical Regulations 섹션):
//     https://www.fia.com/documents/championships/fia-formula-one-world-championship-14
//   ※ formula1.com 피트스탑 요약 페이지의 수치는 총 피트레인 소요시간(약 20-30초)이므로
//     정차 서비스 타임(2-5초)과 다름. 사용 불가.
//     (참고용 URL: formula1.com/en/results/{year}/races/{raceId}/{circuit}/pit-stop-summary)
//
// [오늘의 드라이버 · DOTD]
//   - 레이스 종료 후 F1 공식 팬 투표 결과 확인:
//     https://www.formula1.com/en/latest/article.driver-of-the-day
//   - F1 공식 앱 또는 F1 소셜미디어 확인
// ──────────────────────────────────────────────────────────────────

export const MANUAL_RACE_DATA: Record<string, ManualRaceData> = {

  // ── 2025 시즌 ────────────────────────────────────────────────────

  '2025-1': {
    // 호주 그랑프리 · Albert Park Grand Prix Circuit
    // fastestPitStop: { driver: '', team: '', teamColor: TEAM_COLORS[''], duration: 0.000, lap: 0 },
    // driverOfTheDay: { driver: '', team: '', teamColor: TEAM_COLORS[''] },
  },

  '2025-2': {
    // 중국 그랑프리 · Shanghai International Circuit
    // fastestPitStop: { driver: '', team: '', teamColor: TEAM_COLORS[''], duration: 0.000, lap: 0 },
    // driverOfTheDay: { driver: '', team: '', teamColor: TEAM_COLORS[''] },
  },

  '2025-3': {
    // 일본 그랑프리 · Suzuka Circuit
    // fastestPitStop: { driver: '', team: '', teamColor: TEAM_COLORS[''], duration: 0.000, lap: 0 },
    // driverOfTheDay: { driver: '', team: '', teamColor: TEAM_COLORS[''] },
  },

  '2025-4': {
    // 바레인 그랑프리 · Bahrain International Circuit
    // fastestPitStop: { driver: '', team: '', teamColor: TEAM_COLORS[''], duration: 0.000, lap: 0 },
    // driverOfTheDay: { driver: '', team: '', teamColor: TEAM_COLORS[''] },
  },

  '2025-5': {
    // 사우디아라비아 그랑프리 · Jeddah Corniche Circuit
    // fastestPitStop: { driver: '', team: '', teamColor: TEAM_COLORS[''], duration: 0.000, lap: 0 },
    // driverOfTheDay: { driver: '', team: '', teamColor: TEAM_COLORS[''] },
  },

  '2025-6': {
    // 마이애미 그랑프리 · Miami International Autodrome
    // fastestPitStop: { driver: '', team: '', teamColor: TEAM_COLORS[''], duration: 0.000, lap: 0 },
    // driverOfTheDay: { driver: '', team: '', teamColor: TEAM_COLORS[''] },
  },

  '2025-7': {
    // 에밀리아로마냐 그랑프리 · Autodromo Enzo e Dino Ferrari (Imola)
    // fastestPitStop: { driver: '', team: '', teamColor: TEAM_COLORS[''], duration: 0.000, lap: 0 },
    // driverOfTheDay: { driver: '', team: '', teamColor: TEAM_COLORS[''] },
  },

  '2025-8': {
    // 모나코 그랑프리 · Circuit de Monaco
    // fastestPitStop: { driver: '', team: '', teamColor: TEAM_COLORS[''], duration: 0.000, lap: 0 },
    // driverOfTheDay: { driver: '', team: '', teamColor: TEAM_COLORS[''] },
  },

  '2025-9': {
    // 스페인 그랑프리 · Circuit de Barcelona-Catalunya
    // fastestPitStop: { driver: '', team: '', teamColor: TEAM_COLORS[''], duration: 0.000, lap: 0 },
    // driverOfTheDay: { driver: '', team: '', teamColor: TEAM_COLORS[''] },
  },

  '2025-10': {
    // 캐나다 그랑프리 · Circuit Gilles Villeneuve
    // fastestPitStop: { driver: '', team: '', teamColor: TEAM_COLORS[''], duration: 0.000, lap: 0 },
    // driverOfTheDay: { driver: '', team: '', teamColor: TEAM_COLORS[''] },
  },

  '2025-11': {
    // 오스트리아 그랑프리 · Red Bull Ring
    // fastestPitStop: { driver: '', team: '', teamColor: TEAM_COLORS[''], duration: 0.000, lap: 0 },
    // driverOfTheDay: { driver: '', team: '', teamColor: TEAM_COLORS[''] },
  },

  '2025-12': {
    // 영국 그랑프리 · Silverstone Circuit
    // fastestPitStop: { driver: '', team: '', teamColor: TEAM_COLORS[''], duration: 0.000, lap: 0 },
    // driverOfTheDay: { driver: '', team: '', teamColor: TEAM_COLORS[''] },
  },

  '2025-13': {
    // 벨기에 그랑프리 · Circuit de Spa-Francorchamps
    // fastestPitStop: { driver: '', team: '', teamColor: TEAM_COLORS[''], duration: 0.000, lap: 0 },
    // driverOfTheDay: { driver: '', team: '', teamColor: TEAM_COLORS[''] },
  },

  '2025-14': {
    // 헝가리 그랑프리 · Hungaroring
    // fastestPitStop: { driver: '', team: '', teamColor: TEAM_COLORS[''], duration: 0.000, lap: 0 },
    // driverOfTheDay: { driver: '', team: '', teamColor: TEAM_COLORS[''] },
  },

  '2025-15': {
    // 네덜란드 그랑프리 · Circuit Park Zandvoort
    // fastestPitStop: { driver: '', team: '', teamColor: TEAM_COLORS[''], duration: 0.000, lap: 0 },
    // driverOfTheDay: { driver: '', team: '', teamColor: TEAM_COLORS[''] },
  },

  '2025-16': {
    // 이탈리아 그랑프리 · Autodromo Nazionale di Monza
    // fastestPitStop: { driver: '', team: '', teamColor: TEAM_COLORS[''], duration: 0.000, lap: 0 },
    // driverOfTheDay: { driver: '', team: '', teamColor: TEAM_COLORS[''] },
  },

  '2025-17': {
    // 아제르바이잔 그랑프리 · Baku City Circuit
    // fastestPitStop: { driver: '', team: '', teamColor: TEAM_COLORS[''], duration: 0.000, lap: 0 },
    // driverOfTheDay: { driver: '', team: '', teamColor: TEAM_COLORS[''] },
  },

  '2025-18': {
    // 싱가포르 그랑프리 · Marina Bay Street Circuit
    // fastestPitStop: { driver: '', team: '', teamColor: TEAM_COLORS[''], duration: 0.000, lap: 0 },
    // driverOfTheDay: { driver: '', team: '', teamColor: TEAM_COLORS[''] },
  },

  '2025-19': {
    // 미국 그랑프리 · Circuit of the Americas
    // fastestPitStop: { driver: '', team: '', teamColor: TEAM_COLORS[''], duration: 0.000, lap: 0 },
    // driverOfTheDay: { driver: '', team: '', teamColor: TEAM_COLORS[''] },
  },

  '2025-20': {
    // 멕시코시티 그랑프리 · Autódromo Hermanos Rodríguez
    // fastestPitStop: { driver: '', team: '', teamColor: TEAM_COLORS[''], duration: 0.000, lap: 0 },
    // driverOfTheDay: { driver: '', team: '', teamColor: TEAM_COLORS[''] },
  },

  '2025-21': {
    // 상파울루 그랑프리 · Autódromo José Carlos Pace (Interlagos)
    // fastestPitStop: { driver: '', team: '', teamColor: TEAM_COLORS[''], duration: 0.000, lap: 0 },
    // driverOfTheDay: { driver: '', team: '', teamColor: TEAM_COLORS[''] },
  },

  '2025-22': {
    // 라스베이거스 그랑프리 · Las Vegas Strip Street Circuit
    // fastestPitStop: { driver: '', team: '', teamColor: TEAM_COLORS[''], duration: 0.000, lap: 0 },
    // driverOfTheDay: { driver: '', team: '', teamColor: TEAM_COLORS[''] },
  },

  '2025-23': {
    // 카타르 그랑프리 · Losail International Circuit
    // fastestPitStop: { driver: '', team: '', teamColor: TEAM_COLORS[''], duration: 0.000, lap: 0 },
    // driverOfTheDay: { driver: '', team: '', teamColor: TEAM_COLORS[''] },
  },

  '2025-24': {
    // 아부다비 그랑프리 · Yas Marina Circuit
    // fastestPitStop: { driver: '', team: '', teamColor: TEAM_COLORS[''], duration: 0.000, lap: 0 },
    // driverOfTheDay: { driver: '', team: '', teamColor: TEAM_COLORS[''] },
  },

  // ── 2026 시즌 ────────────────────────────────────────────────────
  // (라운드 번호는 공식 캘린더 확정 후 업데이트)

  '2026-1': {
    // fastestPitStop: { driver: '', team: '', teamColor: TEAM_COLORS[''], duration: 0.000, lap: 0 },
    // driverOfTheDay: { driver: '', team: '', teamColor: TEAM_COLORS[''] },
  },
}

// 팀 이름 참고 (TEAM_COLORS 키)
// '레드불' | '맥라렌' | '페라리' | '메르세데스' | '애스턴 마틴'
// '알핀'   | '윌리엄스' | '레이싱 불스' | '하스' | '킥 자우버'
// '아우디' | '캐딜락'
void TEAM_COLORS // suppress unused import warning
