import type { ReactNode } from 'react'
import Term from '@/components/ui/Term'

export default function RegulationsPage() {
  const changes: { label: ReactNode; before: string; after: string }[] = [
    { label: <Term id="wheelbase">휠베이스</Term>,  before: '3,600mm',       after: '3,400mm' },
    { label: '차량 폭',   before: '2,000mm',       after: '1,900mm' },
    { label: '최소 무게', before: '800kg',          after: '768kg' },
    { label: '앞 타이어', before: '305mm',          after: '280mm' },
    { label: '뒤 타이어', before: '405mm',          after: '375mm' },
    { label: '추월 보조', before: 'DRS',            after: '오버테이크 모드' },
    { label: '하이브리드',before: 'MGU-K + MGU-H', after: 'MGU-K (MGU-H 폐지)' },
    { label: '전력 생산', before: '120kW',          after: '350kW' },
  ]

  const tireChanges: ReactNode[] = [
    '규격 축소 — 앞 280mm · 뒤 375mm',
    <><Term id="tirecompound">C6</Term> 폐지 → C1~C5 슬릭 5종으로 간소화</>,
    '외부 디자인 — 두꺼운 선 → 체크무늬 패턴',
    '인터미디어트·웻은 2025년과 동일 패턴 유지',
  ]

  return (
    <main className="flex-1 bg-[var(--bg-2)] py-12 px-4">
      <div className="max-w-[720px] mx-auto flex flex-col gap-6">

        {/* 헤더 */}
        <div className="bg-[var(--card)] rounded-2xl px-8 py-8 shadow-sm">
          <p className="text-xs font-semibold text-[var(--accent)] mb-2 tracking-widest uppercase">2026 Season</p>
          <h1 className="text-3xl font-black text-[var(--text)] mb-4">2026 규정 변경</h1>
          <p className="text-sm text-[var(--muted)] leading-[1.9]">
            2022년 규정을 완전히 대체하는 새 기술 규정.<br />
            차량 소형화, <Term id="drs">DRS</Term> 폐지, 하이브리드 개편이 핵심입니다.
          </p>
          <p className="text-xs text-[var(--muted)] mt-4">
            <span className="border-b-2 border-dashed border-[var(--accent)] text-[var(--accent)] font-semibold">점선 밑줄 단어</span>를 클릭하면 용어 설명을 볼 수 있습니다.
          </p>
        </div>

        {/* 차량 규격 변경 표 */}
        <div className="bg-[var(--card)] rounded-2xl px-8 py-8 shadow-sm">
          <h2 className="text-lg font-black text-[var(--text)] mb-6">차량 규격 주요 변경</h2>
          <div className="flex flex-col gap-3">
            {changes.map((r, i) => (
              <div key={i} className="grid grid-cols-[90px_1fr_24px_1fr] items-center gap-3 text-sm">
                <span className="text-[var(--muted)] font-semibold text-xs">{r.label}</span>
                <span className="bg-[var(--bg-2)] rounded-lg px-3 py-2.5 text-center text-[var(--text)] line-through opacity-35">{r.before}</span>
                <span className="text-center text-[var(--muted)] text-xs">→</span>
                <span className="bg-[var(--accent)]/10 text-[var(--accent)] rounded-lg px-3 py-2.5 text-center font-bold">{r.after}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 에어로다이나믹 */}
        <div className="bg-[var(--card)] rounded-2xl px-8 py-8 shadow-sm">
          <h2 className="text-lg font-black text-[var(--text)] mb-3">에어로다이나믹</h2>
          <p className="text-sm text-[var(--muted)] leading-[1.9] mb-6">
            <strong className="text-[var(--text)]"><Term id="outwash">아웃워시</Term> → <Term id="inwash">인워시</Term></strong> 컨셉으로 전환.{' '}
            <Term id="dirtyair">더티 에어</Term>를 줄여 근접 추월이 더 쉬워집니다.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[var(--bg-2)] rounded-xl py-6 text-center">
              <p className="text-2xl font-black text-[var(--accent)]">약 33%</p>
              <p className="text-xs font-semibold text-[var(--text)] mt-2">
                <Term id="downforce">다운포스</Term> 감소
              </p>
              <p className="text-xs text-[var(--muted)] mt-1">2022 규정 대비</p>
            </div>
            <div className="bg-[var(--bg-2)] rounded-xl py-6 text-center">
              <p className="text-2xl font-black text-[var(--accent)]">약 55%</p>
              <p className="text-xs font-semibold text-[var(--text)] mt-2">
                <Term id="drag">드래그</Term> 감소
              </p>
              <p className="text-xs text-[var(--muted)] mt-1">2022 규정 대비</p>
            </div>
          </div>
          <div className="bg-[var(--bg-2)] rounded-xl px-5 py-5 flex flex-col gap-3">
            <div className="flex items-start gap-2.5">
              <span className="mt-2 w-1 h-1 rounded-full bg-[var(--muted)] flex-shrink-0 opacity-60" />
              <p className="text-sm text-[var(--muted)]">파워유닛 엔진 : 모터 출력 비율 약 55:45</p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="mt-2 w-1 h-1 rounded-full bg-[var(--muted)] flex-shrink-0 opacity-60" />
              <p className="text-sm text-[var(--muted)]">
                프런트·리어 <Term id="wingflap">윙 플랩</Term> 3개로 변경, 하단 <Term id="beamwing">빔 윙</Term> 삭제
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="mt-2 w-1 h-1 rounded-full bg-[var(--muted)] flex-shrink-0 opacity-60" />
              <p className="text-sm text-[var(--muted)]">
                <Term id="sidepod">사이드팟</Term> 앞 '<Term id="wheelwake">인워싱 휠 웨이크 제어 보드</Term>' 신설
              </p>
            </div>
          </div>
        </div>

        {/* 추월 시스템 */}
        <div className="bg-[var(--card)] rounded-2xl px-8 py-8 shadow-sm">
          <h2 className="text-lg font-black text-[var(--text)] mb-3">추월 시스템 — DRS 폐지</h2>
          <p className="text-sm text-[var(--muted)] leading-[1.9] mb-6">
            DRS가 폐지되고{' '}
            <Term id="activeaero">액티브 에어로 시스템</Term>으로 대체됩니다.
            전·후 윙 가변 플랩이 주행 상황에 따라 자동 조정됩니다.
          </p>
          <div className="flex flex-col gap-4">

            {/* 코너 모드 */}
            <div className="bg-[var(--bg-2)] rounded-xl px-5 py-5 border-l-4 border-l-slate-400">
              <div className="flex items-center gap-2 mb-2.5">
                <p className="text-sm font-bold text-[var(--text)]">코너 모드</p>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-500/15 text-slate-400">기본 적용</span>
              </div>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                최대 다운포스로 코너링 안정성 확보. 평상시 항상 적용되는 기본 모드.
              </p>
            </div>

            {/* 스트레이트-라인 모드 */}
            <div className="bg-[var(--bg-2)] rounded-xl px-5 py-5 border-l-4 border-l-blue-400">
              <div className="flex items-center gap-2 mb-2.5">
                <p className="text-sm font-bold text-[var(--text)]"><Term id="straightline">스트레이트-라인 모드</Term></p>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400">직선 구간</span>
              </div>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                윙 플랩 각도를 줄여 드래그 감소.
                앞차 간격 제약 없이 지정 구간에서 사용 가능해 DRS보다 자유롭습니다.
              </p>
            </div>

            {/* 오버테이크 모드 */}
            <div className="bg-[var(--bg-2)] rounded-xl px-5 py-5 border-l-4 border-l-red-400">
              <div className="flex items-center gap-2 mb-2.5">
                <p className="text-sm font-bold text-[var(--text)]"><Term id="overtakemode">오버테이크 모드</Term></p>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400">1초 이내</span>
              </div>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                앞차 1초 이내 간격 시 <Term id="ers">ERS</Term>를 추가 공급해 추월을 돕습니다.{' '}
                DRS를 대체하는 핵심 장치.
              </p>
            </div>

          </div>
        </div>

        {/* 파워유닛 */}
        <div className="bg-[var(--card)] rounded-2xl px-8 py-8 shadow-sm">
          <h2 className="text-lg font-black text-[var(--text)] mb-4">파워유닛</h2>
          <p className="text-sm text-[var(--muted)] leading-[1.9]">
            <strong className="text-[var(--text)]">V6 1.6L 터보</strong>는 유지.{' '}
            <Term id="mguh">MGU-H</Term> 폐지, <Term id="mguk">MGU-K</Term>만 남아{' '}
            전력 생산이 120kW → <strong className="text-[var(--text)]">350kW</strong>로 대폭 증가합니다.
            엔진 출력은 약 540마력.
          </p>
        </div>

        {/* 타이어 */}
        <div className="bg-[var(--card)] rounded-2xl px-8 py-8 shadow-sm">
          <h2 className="text-lg font-black text-[var(--text)] mb-5">타이어 규정 변경</h2>
          <div className="flex flex-col gap-4">
            {tireChanges.map((t, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-black flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-[var(--muted)] leading-relaxed pt-0.5">{t}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 안전 규정 */}
        <div className="bg-[var(--card)] rounded-2xl px-8 py-8 shadow-sm">
          <h2 className="text-lg font-black text-[var(--text)] mb-5">안전 규정</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-black flex items-center justify-center mt-0.5">1</span>
              <p className="text-sm text-[var(--muted)] leading-relaxed pt-0.5">전면·측면 충돌 테스트 기준 강화</p>
            </div>
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-black flex items-center justify-center mt-0.5">2</span>
              <p className="text-sm text-[var(--muted)] leading-relaxed pt-0.5">
                <Term id="rollhoop">롤 후프</Term> 강도 기준 강화
              </p>
            </div>
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-black flex items-center justify-center mt-0.5">3</span>
              <p className="text-sm text-[var(--muted)] leading-relaxed pt-0.5">
                ERS 상태 식별 안전 LED — 온보드 카메라에 설치
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
