export interface TeamGuide {
  id: string
  name: string
  color: string
  engine: string
  base: string
  drivers: string[]
  founded: number
  championships: number
  tag: string
  description: string
  note?: string
}

export interface DriverGuide {
  id: string
  name: string
  nameEn: string
  teamId: string
  teamName: string
  teamColor: string
  nationality: string
  flag: string
  number: number
  championships: number
  bio: string
  highlight: string
}

export const TEAMS_GUIDE: TeamGuide[] = [
  {
    id: 'mclaren',
    name: '맥라렌',
    color: '#FF8000',
    engine: 'Mercedes',
    base: '영국',
    drivers: ['랜도 노리스', '오스카 피아스트리'],
    founded: 1963,
    championships: 9,
    tag: '2024 챔피언',
    description:
      '2024 컨스트럭터 챔피언. 노리스·피아스트리 조합이 팀 역사상 최고의 전성기를 만들고 있습니다.',
  },
  {
    id: 'ferrari',
    name: '페라리',
    color: '#E8002D',
    engine: 'Ferrari',
    base: '이탈리아',
    drivers: ['샤를 르클레르', '루이스 해밀턴'],
    founded: 1950,
    championships: 16,
    tag: '최다 우승팀',
    description:
      '역대 최다 컨스트럭터 우승(16회). 2025년 해밀턴 영입으로 전 세계 팬들의 기대가 집중됐습니다.',
  },
  {
    id: 'mercedes',
    name: '메르세데스',
    color: '#00D2BE',
    engine: 'Mercedes',
    base: '영국',
    drivers: ['조지 러셀', '키미 안토넬리'],
    founded: 2010,
    championships: 8,
    tag: '은빛 화살',
    description:
      '2014~2021 8연속 컨스트럭터 챔피언. 해밀턴 이적 후 러셀·안토넬리 체제로 재건 중입니다.',
    note: 'mercedes_lineage',
  },
  {
    id: 'redbull',
    name: '레드불 레이싱',
    color: '#3671C6',
    engine: 'Red Bull Ford',
    base: '영국',
    drivers: ['막스 베르스타펜', '아이작 하자르'],
    founded: 2005,
    championships: 6,
    tag: '4연속 챔피언',
    description:
      '베르스타펜의 4연속 드라이버 챔피언팀. 2022~2023 시즌 21승으로 역대급 지배력을 보여줬습니다.',
  },
  {
    id: 'williams',
    name: '윌리엄스',
    color: '#005AFF',
    engine: 'Mercedes',
    base: '영국',
    drivers: ['알렉스 알본', '카를로스 사인츠'],
    founded: 1977,
    championships: 9,
    tag: '명문 부활 도전',
    description:
      '1980~90년대 만셀·힐과 함께 9번의 타이틀을 차지한 명문. 사인츠 영입으로 재도약을 노립니다.',
  },
  {
    id: 'astonmartin',
    name: '애스턴 마틴',
    color: '#229971',
    engine: 'Honda',
    base: '영국',
    drivers: ['페르난도 알론소', '랜스 스트롤'],
    founded: 2021,
    championships: 0,
    tag: '전설 알론소',
    description:
      '2021년 재출범. 44세 알론소가 여전히 날카로운 레이싱으로 팬들의 탄성을 자아냅니다.',
  },
  {
    id: 'rb',
    name: '레이싱 불스',
    color: '#6692FF',
    engine: 'Red Bull Ford',
    base: '이탈리아',
    drivers: ['리암 로슨', '아비드 린드블라드'],
    founded: 2006,
    championships: 0,
    tag: '레드불 유스팀',
    description:
      '레드불 자매 팀, 신인 육성 전문. 베텔·베르스타펜·리카도를 배출했고 2026년은 역사상 가장 젊은 라인업입니다.',
  },
  {
    id: 'haas',
    name: '하스',
    color: '#B6BABD',
    engine: 'Ferrari',
    base: '미국',
    drivers: ['에스테반 오콘', '올리버 베어먼'],
    founded: 2016,
    championships: 0,
    tag: '미국 기반 팀',
    description:
      '2016년 참가한 미국 기반 팀. 페라리 파워유닛으로 중위권 경쟁 중입니다.',
  },
  {
    id: 'audi',
    name: '아우디',
    color: '#C0C0C0',
    engine: 'Audi (자체 개발)',
    base: '스위스',
    drivers: ['니코 휠켄베르트', '가브리에우 보르톨레투'],
    founded: 2026,
    championships: 0,
    tag: '2026 독일의 귀환',
    description:
      '자우버/알파로메오 팀을 인수해 2026년 자체 파워유닛으로 F1에 공식 참가합니다.',
  },
  {
    id: 'alpine',
    name: '알핀',
    color: '#FF87BC',
    engine: 'Mercedes',
    base: '영국',
    drivers: ['피에르 가슬리', '프랑코 콜라핀토'],
    founded: 2021,
    championships: 2,
    tag: '프랑스 대표팀',
    description:
      '르노 팀이 2021년 리브랜딩. 2005~2006 알론소와 2연속 챔피언의 역사를 갖고 있습니다.',
  },
  {
    id: 'cadillac',
    name: '캐딜락',
    color: '#C41E3A',
    engine: 'Ferrari',
    base: '미국',
    drivers: ['콜튼 헤르타', '잭 크로포드'],
    founded: 2026,
    championships: 0,
    tag: '2026 신규 참가',
    description:
      'GM 캐딜락의 F1 신규 참가팀. 미국인 드라이버 헤르타·크로포드를 기용해 미국 팬들의 열광적인 지지를 받습니다.',
  },
]

export const DRIVERS_GUIDE: DriverGuide[] = [
  {
    id: 'verstappen',
    name: '막스 베르스타펜',
    nameEn: 'Max Verstappen',
    teamId: 'redbull',
    teamName: '레드불 레이싱',
    teamColor: '#3671C6',
    nationality: '네덜란드',
    flag: '🇳🇱',
    number: 1,
    championships: 4,
    bio: '2021~2024 4연속 드라이버 챔피언. 17세 데뷔로 역대 최연소 포인트 기록을 세웠습니다. 공격적인 스타일로 현세대 최강 드라이버로 불립니다.',
    highlight: '4연속 챔피언 (2021~2024) · 역대 최다 단일 시즌 승리 19승',
  },
  {
    id: 'hamilton',
    name: '루이스 해밀턴',
    nameEn: 'Lewis Hamilton',
    teamId: 'ferrari',
    teamName: '페라리',
    teamColor: '#E8002D',
    nationality: '영국',
    flag: '🇬🇧',
    number: 44,
    championships: 7,
    bio: '최다 우승(103승)·최다 폴포지션(104회) 보유. 슈마허와 챔피언 7회 공동 기록. 2025년 페라리 이적으로 전 세계 팬들을 놀라게 했습니다.',
    highlight: '역대 최다 103승 · 챔피언 7회 · 폴포지션 104회',
  },
  {
    id: 'norris',
    name: '랜도 노리스',
    nameEn: 'Lando Norris',
    teamId: 'mclaren',
    teamName: '맥라렌',
    teamColor: '#FF8000',
    nationality: '영국',
    flag: '🇬🇧',
    number: 4,
    championships: 0,
    bio: '2024 드라이버 챔피언십 2위. 맥라렌 부활의 핵심. SNS·스트리밍으로 젊은 팬층에서 인기가 높습니다.',
    highlight: '2024 드라이버 챔피언십 2위 · 2024년 6승',
  },
  {
    id: 'leclerc',
    name: '샤를 르클레르',
    nameEn: 'Charles Leclerc',
    teamId: 'ferrari',
    teamName: '페라리',
    teamColor: '#E8002D',
    nationality: '모나코',
    flag: '🇲🇨',
    number: 16,
    championships: 0,
    bio: '페라리 에이스. 예선 단발 랩 속도가 그리드 최고 수준. 2024년 드디어 고향 모나코 GP 첫 우승을 달성했습니다.',
    highlight: '2024 모나코 GP 우승 · 폴포지션 장인',
  },
  {
    id: 'alonso',
    name: '페르난도 알론소',
    nameEn: 'Fernando Alonso',
    teamId: 'astonmartin',
    teamName: '애스턴 마틴',
    teamColor: '#229971',
    nationality: '스페인',
    flag: '🇪🇸',
    number: 14,
    championships: 2,
    bio: '2005·2006 챔피언. 44세에도 최상위 퍼포먼스를 발휘하며 33번째 시즌을 소화 중입니다.',
    highlight: '챔피언 2회 (2005·2006) · 최고령 현역 드라이버 44세',
  },
  {
    id: 'piastri',
    name: '오스카 피아스트리',
    nameEn: 'Oscar Piastri',
    teamId: 'mclaren',
    teamName: '맥라렌',
    teamColor: '#FF8000',
    nationality: '호주',
    flag: '🇦🇺',
    number: 81,
    championships: 0,
    bio: '2023 신인왕. 2024 헝가리 GP 첫 우승. 노리스와의 팀 내 경쟁이 시즌 최고 볼거리 중 하나입니다.',
    highlight: '2023 신인왕 · 2024 헝가리 GP 첫 우승',
  },
  {
    id: 'russell',
    name: '조지 러셀',
    nameEn: 'George Russell',
    teamId: 'mercedes',
    teamName: '메르세데스',
    teamColor: '#00D2BE',
    nationality: '영국',
    flag: '🇬🇧',
    number: 63,
    championships: 0,
    bio: '2022 브라질 GP 첫 우승. 해밀턴 이적 후 메르세데스 재건을 이끄는 팀 리더입니다.',
    highlight: '2022 브라질 GP 우승 · 메르세데스 최다 포인트 드라이버',
  },
  {
    id: 'antonelli',
    name: '키미 안토넬리',
    nameEn: 'Andrea Kimi Antonelli',
    teamId: 'mercedes',
    teamName: '메르세데스',
    teamColor: '#00D2BE',
    nationality: '이탈리아',
    flag: '🇮🇹',
    number: 12,
    championships: 0,
    bio: '18세 F1 데뷔. 해밀턴이 직접 지목한 후계자. F2 압도적 성적을 뒤로하고 역대 최연소 메르세데스 드라이버가 됐습니다.',
    highlight: '해밀턴이 지목한 차세대 에이스 · 역대 최연소 메르세데스 드라이버',
  },
]
