export interface GlossaryEntry {
  title: string
  subtitle?: string
  desc: string
}

export const GLOSSARY: Record<string, GlossaryEntry> = {
  drs: {
    title: 'DRS',
    subtitle: 'Drag Reduction System',
    desc: '리어 윙 플랩을 열어 공기 저항을 줄이는 추월 보조 장치. 앞차와 1초 이내 간격 + 지정 구간에서만 사용 가능. 2026년 액티브 에어로로 대체됩니다.',
  },
  ers: {
    title: 'ERS',
    subtitle: 'Energy Recovery System · 에너지 회수 시스템',
    desc: '제동·배기열에서 전기 에너지를 회수해 추가 동력으로 사용하는 하이브리드 시스템. 2026년부터는 MGU-K만 유지되고 출력이 대폭 증가합니다.',
  },
  mguk: {
    title: 'MGU-K',
    subtitle: 'Motor Generator Unit – Kinetic',
    desc: '제동 시 운동 에너지를 전기로 변환·저장해 가속 시 추가 동력을 공급하는 장치. 2026년 출력이 120kW → 350kW로 대폭 향상됩니다.',
  },
  mguh: {
    title: 'MGU-H',
    subtitle: 'Motor Generator Unit – Heat',
    desc: '터보차저에 연결된 열 에너지 회수 장치. 구조가 매우 복잡하고 개발 비용이 높아 2026년 폐지됩니다.',
  },
  downforce: {
    title: '다운포스',
    subtitle: 'Downforce',
    desc: '공기역학적으로 차체를 지면 방향으로 누르는 힘. 높을수록 코너링이 빨라지지만 드래그도 함께 늘어납니다.',
  },
  drag: {
    title: '드래그',
    subtitle: 'Drag · 공기 저항',
    desc: '진행 방향 반대로 작용하는 공기 저항. 높을수록 직선 최고 속도가 낮아집니다. 다운포스와 트레이드오프 관계입니다.',
  },
  outwash: {
    title: '아웃워시',
    subtitle: 'Outwash',
    desc: '프런트 윙이 앞타이어 주변 공기를 차체 바깥쪽으로 흘려보내는 방식. 2022년 이전 F1의 일반적인 방식. 자기 차는 깨끗하지만 뒤차에 더티 에어를 많이 발생시킵니다.',
  },
  inwash: {
    title: '인워시',
    subtitle: 'Inwash',
    desc: '앞타이어 주변 공기를 차체 하단 안쪽으로 유도하는 방식. 2026년 도입. 뒤차의 다운포스 손실을 줄여 근접 추월이 쉬워집니다.',
  },
  dirtyair: {
    title: '더티 에어',
    subtitle: 'Dirty Air',
    desc: '앞차가 지나간 뒤 남기는 난기류. 이 구역에 들어서면 다운포스가 떨어지고 타이어 마모가 빨라져 추월이 어렵습니다.',
  },
  wingflap: {
    title: '윙 플랩',
    subtitle: 'Wing Flap',
    desc: '윙에서 각도를 조절할 수 있는 가동 판. 각도를 높이면 다운포스 증가, 낮추면 드래그 감소.',
  },
  beamwing: {
    title: '빔 윙',
    subtitle: 'Beam Wing',
    desc: '리어 윙 하단 디퓨저 출구 위에 위치한 수평 날개. 후방 공기 흐름을 정리하고 다운포스를 추가 생성합니다. 2026년 삭제.',
  },
  sidepod: {
    title: '사이드팟',
    subtitle: 'Sidepod',
    desc: '차량 양쪽 돌출 구조물. 내부에 냉각 라디에이터가 있으며, 형태에 따라 에어로 성능이 크게 달라집니다.',
  },
  wheelwake: {
    title: '인워싱 휠 웨이크 제어 보드',
    desc: '2026년 신설된 부품. 사이드팟 앞에 수직으로 부착되어 앞타이어 후방 난기류를 차체 안쪽으로 유도합니다.',
  },
  activeaero: {
    title: '액티브 에어로',
    subtitle: 'Active Aerodynamics',
    desc: '주행 중 전·후 윙 플랩을 자동 조정하는 시스템. 2026년 DRS를 대체. 코너·직선·추월 3가지 모드로 전환됩니다.',
  },
  straightline: {
    title: '스트레이트-라인 모드',
    desc: '직선 구간에서 전·후 윙 플랩 각도를 줄여 드래그를 감소시키는 모드. DRS와 달리 앞차 간격 제약 없이 누구나 사용할 수 있습니다.',
  },
  overtakemode: {
    title: '오버테이크 모드',
    desc: '앞차와 1초 이내일 때 ERS 동력을 추가 공급하는 모드. 에어로 설정 변경 + 전기 부스트를 동시에 제공합니다.',
  },
  wheelbase: {
    title: '휠베이스',
    subtitle: 'Wheelbase',
    desc: '앞바퀴 중심과 뒷바퀴 중심 사이의 거리. 길수록 직선 안정성이 높고, 짧을수록 코너 응답이 빠릅니다. 2026년 3,600mm → 3,400mm로 축소됩니다.',
  },
  tirecompound: {
    title: '타이어 컴파운드',
    subtitle: 'C1 ~ C5 (2026)',
    desc: '피렐리가 공급하는 슬릭 타이어 번호. C1(하드·내구성↑) → C5(소프트·속도↑) 순으로 부드러워집니다. 2026년 C6 폐지로 C1~C5 5종만 사용합니다.',
  },
  rollhoop: {
    title: '롤 후프',
    subtitle: 'Roll Hoop',
    desc: '드라이버 머리 위를 감싸는 금속 아치형 구조물. 차량 전복 시 드라이버를 보호하는 핵심 안전 장치입니다. 2026년 강도 기준이 강화됩니다.',
  },
  powerunit: {
    title: '파워유닛',
    subtitle: 'Power Unit',
    desc: 'F1 엔진의 공식 명칭. 1.6L V6 터보 내연기관 + ERS(에너지 회수 시스템)로 구성된 복합 동력 장치입니다. 단순 엔진이 아닌 하이브리드 시스템 전체를 포함합니다.',
  },
  wingtype: {
    title: '에어로 윙 구조',
    desc: 'F1 머신의 날개 부품. 프런트 윙(앞)과 리어 윙(뒤)으로 나뉘며, 각 윙에는 각도 조절 가능한 플랩이 달려 있습니다. 플랩 각도로 다운포스와 드래그 균형을 조절합니다.',
  },
  mercedes_lineage: {
    title: '메르세데스 창단 연도',
    desc: '2010년은 메르세데스가 브런 GP를 인수해 공식 출범한 해. 전신 계보: 타이렐(1970) → BAR(1999) → 혼다 레이싱 F1(2006) → 브런 GP(2009) → 메르세데스 AMG(2010).',
  },
}
