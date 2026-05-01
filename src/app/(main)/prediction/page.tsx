'use client'

import { useState, useEffect } from 'react'

type SelectionType = 'rank' | 'single' | 'multi'

interface Question {
  week: number
  title: string
  subtitle?: string
  type: SelectionType
  max?: number
  options: { value: string; label: string }[]
}

type Prediction = Record<number, { values: string[]; locked: boolean }>

const STORAGE_KEY = 'season_prediction'

const ALL_DRIVERS = [
  { value: 'verstappen', label: '막스 베르스타펜' },
  { value: 'lawson',     label: '리암 로슨' },
  { value: 'norris',     label: '란도 노리스' },
  { value: 'piastri',   label: '오스카 피아스트리' },
  { value: 'leclerc',   label: '샤를 르클레르' },
  { value: 'hamilton',  label: '루이스 해밀턴' },
  { value: 'russell',   label: '조지 러셀' },
  { value: 'antonelli', label: '안드레아 키미 안토넬리' },
  { value: 'alonso',    label: '페르난도 알론소' },
  { value: 'stroll',    label: '랜스 스트롤' },
  { value: 'gasly',     label: '피에르 가슬리' },
  { value: 'doohan',    label: '잭 두한' },
  { value: 'albon',     label: '알렉산더 알본' },
  { value: 'sainz',     label: '카를로스 사인츠' },
  { value: 'tsunoda',   label: '츠노다 유키' },
  { value: 'hadjar',    label: '아이작 하자르' },
  { value: 'ocon',      label: '에스테반 오콘' },
  { value: 'bearman',   label: '올리버 베어만' },
  { value: 'hulkenberg', label: '니코 휠켄베르크' },
  { value: 'bortoleto', label: '가브리엘 보르톨레토' },
]

const ALL_TEAMS = [
  { value: 'redbull',     label: '레드불 레이싱' },
  { value: 'mclaren',     label: '맥라렌' },
  { value: 'ferrari',     label: '페라리' },
  { value: 'mercedes',    label: '메르세데스' },
  { value: 'astonmartin', label: '애스턴 마틴' },
  { value: 'alpine',      label: '알파인' },
  { value: 'williams',    label: '윌리엄스' },
  { value: 'rb',          label: 'RB' },
  { value: 'haas',        label: '하스' },
  { value: 'sauber',      label: '킥 자우버' },
]

const ROOKIE_DRIVERS = [
  { value: 'antonelli',  label: '안드레아 키미 안토넬리' },
  { value: 'doohan',     label: '잭 두한' },
  { value: 'hadjar',     label: '아이작 하자르' },
  { value: 'bearman',    label: '올리버 베어만' },
  { value: 'bortoleto',  label: '가브리엘 보르톨레토' },
]

const questions: Question[] = [
  {
    week: 1,
    title: '드라이버 챔피언십 Top 3',
    subtitle: '상위 3명을 순서대로 선택하세요.',
    type: 'rank',
    options: ALL_DRIVERS,
  },
  {
    week: 2,
    title: '컨스트럭터 챔피언십 Top 3',
    subtitle: '상위 3팀을 순서대로 선택하세요.',
    type: 'rank',
    options: ALL_TEAMS,
  },
  {
    week: 3,
    title: '시즌 최다 우승 드라이버',
    type: 'single',
    options: ALL_DRIVERS,
  },
  {
    week: 4,
    title: '시즌 포인트 Top 10 진입',
    subtitle: '드라이버 챔피언십 Top 10에 진입할 것으로 예상되는 드라이버를 최대 10명 선택하세요.',
    type: 'multi',
    max: 10,
    options: ALL_DRIVERS,
  },
  {
    week: 5,
    title: '루키 중 최고 순위',
    type: 'single',
    options: ROOKIE_DRIVERS,
  },
  {
    week: 6,
    title: '시즌 폴 포지션 최다',
    type: 'single',
    options: ALL_DRIVERS,
  },
  {
    week: 7,
    title: '퀄리파잉 최강 팀',
    type: 'single',
    options: ALL_TEAMS,
  },
  {
    week: 8,
    title: '가장 기대되는 루키',
    type: 'single',
    options: ROOKIE_DRIVERS,
  },
  {
    week: 9,
    title: '가장 기대되는 팀',
    type: 'single',
    options: ALL_TEAMS,
  },
  {
    week: 10,
    title: '시즌 최고의 레이스',
    type: 'single',
    options: [
      { value: 'monaco',     label: '모나코 GP' },
      { value: 'british',    label: '브리티시 GP' },
      { value: 'japanese',   label: '일본 GP' },
      { value: 'italian',    label: '이탈리아 GP' },
      { value: 'belgian',    label: '벨기에 GP' },
      { value: 'singapore',  label: '싱가포르 GP' },
    ],
  },
  {
    week: 11,
    title: '내가 가장 응원하는 팀',
    type: 'single',
    options: ALL_TEAMS,
  },
  {
    week: 12,
    title: '내가 가장 응원할 드라이버',
    type: 'single',
    options: ALL_DRIVERS,
  },
]

function isComplete(q: Question, values: string[]) {
  if (q.type === 'rank') return values.length === 3
  if (q.type === 'multi') return values.length > 0
  return values.length === 1
}

export default function PredictionPage() {
  const [prediction, setPrediction] = useState<Prediction>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setPrediction(JSON.parse(raw))
    } catch {}
    setMounted(true)
  }, [])

  function save(next: Prediction) {
    setPrediction(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  function handleClick(q: Question, value: string) {
    const weekData = prediction[q.week] ?? { values: [], locked: false }
    if (weekData.locked) return

    let values = [...weekData.values]

    if (q.type === 'rank') {
      if (values.includes(value)) {
        values = values.filter(v => v !== value)
      } else if (values.length < 3) {
        values = [...values, value]
      }
    } else if (q.type === 'single') {
      values = [value]
    } else {
      if (values.includes(value)) {
        values = values.filter(v => v !== value)
      } else if (values.length < (q.max ?? 1)) {
        values = [...values, value]
      }
    }

    save({ ...prediction, [q.week]: { ...weekData, values } })
  }

  function handleSubmit(q: Question) {
    const weekData = prediction[q.week] ?? { values: [], locked: false }
    if (!isComplete(q, weekData.values)) return
    save({ ...prediction, [q.week]: { ...weekData, locked: true } })
  }

  function handleReset() {
    if (!confirm('정말로 모든 선택을 초기화하시겠습니까?')) return
    localStorage.removeItem(STORAGE_KEY)
    setPrediction({})
  }

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-[var(--bg-2)] py-12 px-4">
      <div className="max-w-[640px] mx-auto flex flex-col gap-6">

        {/* 인트로 */}
        <div className="bg-[var(--card)] rounded-xl shadow-sm p-7 text-center">
          <h1 className="text-2xl font-bold text-[var(--text)] mb-2">시즌 전 팬 투표</h1>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-5">
            시즌이 시작되기 전, 당신의 예측을 남겨보세요.<br />
            모든 예측은 시즌 종료 후 결과와 비교됩니다.<br />
            <span className="text-[var(--accent)] font-medium">* 한 번 확정하면 변경할 수 없습니다.</span>
          </p>
          <button
            onClick={handleReset}
            className="text-sm text-[var(--muted)] border border-[var(--border)] rounded-md px-4 py-2 hover:bg-[var(--bg-2)] transition-colors cursor-pointer bg-transparent"
          >
            예측 초기화
          </button>
        </div>

        {/* 질문 카드 */}
        {questions.map(q => {
          const weekData = prediction[q.week] ?? { values: [], locked: false }
          const { values, locked } = weekData
          const complete = isComplete(q, values)

          return (
            <div
              key={q.week}
              className={`bg-[var(--card)] rounded-xl shadow-sm p-6 transition-opacity ${locked ? 'opacity-75' : ''}`}
            >
              {/* 헤더 */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-white bg-[var(--accent)] rounded-full px-3 py-0.5">
                  Week {q.week}
                </span>
                {locked && (
                  <span className="text-xs text-[var(--muted)] border border-[var(--border)] rounded-full px-2.5 py-0.5">
                    확정됨
                  </span>
                )}
              </div>

              <h2 className="text-base font-semibold text-[var(--text)] mb-1">{q.title}</h2>
              {q.subtitle && (
                <p className="text-xs text-[var(--muted)] mb-4 leading-relaxed">{q.subtitle}</p>
              )}

              {/* 옵션 */}
              <div className="flex flex-wrap gap-2 justify-center mb-5">
                {q.options.map(opt => {
                  const rankIndex = q.type === 'rank' ? values.indexOf(opt.value) : -1
                  const isSelected = values.includes(opt.value)

                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleClick(q, opt.value)}
                      disabled={locked}
                      className={`relative flex items-center gap-1.5 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors
                        ${isSelected
                          ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                          : 'bg-[var(--bg-2)] border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)]'
                        }
                        ${locked ? 'cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      {q.type === 'rank' && isSelected && (
                        <span className="w-5 h-5 rounded-full bg-white text-[var(--accent)] text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {rankIndex + 1}
                        </span>
                      )}
                      {opt.label}
                    </button>
                  )
                })}
              </div>

              {/* 선택 완료 버튼 */}
              <button
                onClick={() => handleSubmit(q)}
                disabled={locked || !complete}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors
                  ${locked || !complete
                    ? 'bg-[var(--border)] text-[var(--muted)] cursor-not-allowed'
                    : 'bg-[var(--accent)] text-white hover:opacity-90 cursor-pointer'
                  }
                `}
              >
                {locked ? '확정됨' : '선택 완료'}
              </button>
            </div>
          )
        })}

      </div>
    </main>
  )
}
