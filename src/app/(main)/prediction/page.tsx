'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { fetchSeasonRaces } from '@/lib/f1Api'
import { ALL_DRIVERS, ALL_TEAMS, ROOKIE_DRIVERS } from '@/data/f1-2026'

type SelectionType = 'rank' | 'single' | 'multi'

interface Question {
  id: number
  title: string
  subtitle?: string
  type: SelectionType
  max?: number
  options: { value: string; label: string; color?: string }[]
}

type Prediction = Record<number, { values: string[]; locked: boolean }>
type SyncStatus = 'idle' | 'saving' | 'saved' | 'error'

const STORAGE_KEY = 'season_prediction_2026'
const SEASON = 2026

function buildQuestions(raceOptions: { value: string; label: string }[]): Question[] {
  return [
    {
      id: 1,
      title: '드라이버 챔피언십 Top 3',
      subtitle: '상위 3명을 순서대로 선택하세요.',
      type: 'rank',
      options: ALL_DRIVERS,
    },
    {
      id: 2,
      title: '컨스트럭터 챔피언십 Top 3',
      subtitle: '상위 3팀을 순서대로 선택하세요.',
      type: 'rank',
      options: ALL_TEAMS,
    },
    {
      id: 3,
      title: '시즌 최다 우승 드라이버',
      type: 'single',
      options: ALL_DRIVERS,
    },
    {
      id: 4,
      title: '시즌 포인트 Top 10 진입',
      subtitle: '드라이버 챔피언십 Top 10에 진입할 드라이버를 최대 10명 선택하세요.',
      type: 'multi',
      max: 10,
      options: ALL_DRIVERS,
    },
    {
      id: 5,
      title: '루키 중 최고 순위',
      type: 'single',
      options: ROOKIE_DRIVERS,
    },
    {
      id: 6,
      title: '시즌 폴 포지션 최다',
      type: 'single',
      options: ALL_DRIVERS,
    },
    {
      id: 7,
      title: '퀄리파잉 최강 팀',
      type: 'single',
      options: ALL_TEAMS,
    },
    {
      id: 8,
      title: '가장 기대되는 루키',
      type: 'single',
      options: ROOKIE_DRIVERS,
    },
    {
      id: 9,
      title: '가장 기대되는 팀',
      type: 'single',
      options: ALL_TEAMS,
    },
    {
      id: 10,
      title: '가장 기대되는 레이스',
      type: 'single',
      options: raceOptions,
    },
    {
      id: 11,
      title: '내가 가장 응원하는 팀',
      subtitle: '최대 3개까지 선택할 수 있습니다.',
      type: 'multi',
      max: 3,
      options: ALL_TEAMS,
    },
    {
      id: 12,
      title: '내가 가장 응원할 드라이버',
      subtitle: '최대 3명까지 선택할 수 있습니다.',
      type: 'multi',
      max: 3,
      options: ALL_DRIVERS,
    },
  ]
}

function isComplete(q: Question, values: string[]) {
  if (q.type === 'rank') return values.length === 3
  if (q.type === 'multi') return values.length > 0
  return values.length === 1
}

function getSummary(q: Question, values: string[]): string {
  const findLabel = (v: string) => q.options.find(o => o.value === v)?.label ?? v
  if (q.type === 'rank') {
    return values.map((v, i) => `${i + 1}위 ${findLabel(v)}`).join(' · ')
  }
  if (q.type === 'multi') {
    const labels = values.map(findLabel)
    return labels.length <= 3
      ? labels.join(', ')
      : `${labels.slice(0, 3).join(', ')} 외 ${labels.length - 3}명`
  }
  return findLabel(values[0])
}

export default function PredictionPage() {
  const { data: session, status: sessionStatus } = useSession()
  const [prediction, setPrediction] = useState<Prediction>({})
  const [mounted, setMounted] = useState(false)
  const [raceOptions, setRaceOptions] = useState<{ value: string; label: string }[]>([])
  const [raceLoading, setRaceLoading] = useState(true)
  const [raceError, setRaceError] = useState(false)
  const [collapsedIds, setCollapsedIds] = useState<Set<number>>(new Set())
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed: Prediction = JSON.parse(raw)
        setPrediction(parsed)
        const lockedIds = Object.entries(parsed)
          .filter(([, d]) => d.locked)
          .map(([id]) => Number(id))
        setCollapsedIds(new Set(lockedIds))
      }
    } catch {}
    setMounted(true)

    fetchSeasonRaces(2026)
      .then(races => setRaceOptions(races.map(r => ({ value: String(r.round), label: r.name }))))
      .catch(() => setRaceError(true))
      .finally(() => setRaceLoading(false))
  }, [])

  // 로그인 시 서버 데이터 로드 (서버 우선, 없으면 localStorage 업로드)
  useEffect(() => {
    if (sessionStatus !== 'authenticated') return

    async function syncOnLogin() {
      try {
        const res = await fetch(`/api/prediction?season=${SEASON}`)
        if (!res.ok) return
        const { prediction: serverData } = await res.json()

        if (serverData && Object.keys(serverData).length > 0) {
          setPrediction(serverData)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(serverData))
          const lockedIds = Object.entries(serverData as Prediction)
            .filter(([, d]) => d.locked)
            .map(([id]) => Number(id))
          setCollapsedIds(new Set(lockedIds))
        } else {
          try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (raw) {
              const localData: Prediction = JSON.parse(raw)
              if (Object.keys(localData).length > 0) {
                await fetch('/api/prediction', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ season: SEASON, prediction: localData }),
                })
              }
            }
          } catch {}
        }
      } catch {}
    }

    syncOnLogin()
  }, [sessionStatus])

  const questions = useMemo(() => buildQuestions(raceOptions), [raceOptions])
  const completedCount = questions.filter(q => prediction[q.id]?.locked).length

  function syncToServer(data: Prediction) {
    if (!session?.user) return
    if (syncTimer.current) clearTimeout(syncTimer.current)
    setSyncStatus('saving')
    syncTimer.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/prediction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ season: SEASON, prediction: data }),
        })
        setSyncStatus(res.ok ? 'saved' : 'error')
      } catch {
        setSyncStatus('error')
      }
      setTimeout(() => setSyncStatus('idle'), 2000)
    }, 800)
  }

  function save(next: Prediction) {
    setPrediction(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    syncToServer(next)
  }

  function handleClick(q: Question, value: string) {
    const data = prediction[q.id] ?? { values: [], locked: false }
    if (data.locked) return

    let values = [...data.values]

    if (q.type === 'single') {
      values = values.includes(value) ? [] : [value]
    } else {
      const max = q.type === 'rank' ? 3 : (q.max ?? 1)
      values = values.includes(value)
        ? values.filter(v => v !== value)
        : values.length < max ? [...values, value] : values
    }

    save({ ...prediction, [q.id]: { ...data, values } })
  }

  function handleSubmit(q: Question) {
    if (sessionStatus === 'unauthenticated') {
      setShowLoginModal(true)
      return
    }
    const data = prediction[q.id] ?? { values: [], locked: false }
    if (!isComplete(q, data.values)) return
    save({ ...prediction, [q.id]: { ...data, locked: true } })
    setCollapsedIds(prev => new Set([...prev, q.id]))
  }

  async function handleReset() {
    if (!confirm('정말로 모든 선택을 초기화하시겠습니까?')) return
    localStorage.removeItem(STORAGE_KEY)
    setPrediction({})
    setCollapsedIds(new Set())

    if (session?.user) {
      try {
        await fetch('/api/prediction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ season: SEASON, prediction: {} }),
        })
      } catch {}
    }
  }

  function toggleCollapse(id: number) {
    setCollapsedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  if (!mounted) return null

  return (
    <>
    {showLoginModal && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
        onClick={() => setShowLoginModal(false)}
      >
        <div
          className="bg-[var(--card)] rounded-2xl p-7 w-full max-w-sm shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <h2 className="text-lg font-black text-[var(--text)] mb-2">로그인이 필요합니다</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">
            예측을 확정하려면 로그인해야 합니다.<br />
            선택한 내용은 로그인 후에도 유지됩니다.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowLoginModal(false)}
              className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-sm font-semibold text-[var(--muted)] hover:bg-[var(--bg-2)] transition-colors cursor-pointer"
            >
              취소
            </button>
            <a
              href="/login"
              className="flex-1 py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-semibold text-center hover:opacity-90 transition-opacity"
            >
              로그인하기
            </a>
          </div>
        </div>
      </div>
    )}
    <main className="flex-1 bg-[var(--bg-2)] py-12 px-4">
      <div className="max-w-[640px] mx-auto flex flex-col gap-6">

        {/* 인트로 */}
        <div className="bg-[var(--card)] rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-[var(--text)] mb-1">2026 시즌 예측</h1>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">
            시즌 전 예측을 남겨보세요. 모든 예측은 시즌 종료 후 결과와 비교됩니다.
            <br />
            <span className="text-[var(--accent)] font-medium">* 한 번 확정하면 변경할 수 없습니다.</span>
          </p>

          {/* 로그인 유도 */}
          {sessionStatus === 'unauthenticated' && (
            <p className="text-xs text-[var(--muted)] bg-[var(--bg-2)] rounded-lg px-3 py-2 mb-4">
              로그인하면 예측이 서버에 저장되어 어떤 기기에서도 확인할 수 있습니다.
            </p>
          )}

          {/* 진행 상황 */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-[var(--muted)] mb-1.5">
              <span>진행 상황</span>
              <div className="flex items-center gap-2">
                {syncStatus === 'saving' && <span className="text-[var(--muted)]">저장 중...</span>}
                {syncStatus === 'saved' && <span className="text-green-500">✓ 저장됨</span>}
                {syncStatus === 'error' && <span className="text-red-400">저장 실패</span>}
                <span className="font-medium">{completedCount} / {questions.length} 완료</span>
              </div>
            </div>
            <div className="h-1.5 bg-[var(--bg-2)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleReset}
            className="text-sm text-[var(--muted)] border border-[var(--border)] rounded-lg px-4 py-2 hover:bg-[var(--bg-2)] transition-colors cursor-pointer bg-transparent"
          >
            예측 초기화
          </button>
        </div>

        {/* 질문 카드 */}
        {questions.map(q => {
          const data = prediction[q.id] ?? { values: [], locked: false }
          const { values, locked } = data
          const complete = isComplete(q, values)
          const useGrid = q.options.length > 5
          const hasSelection = values.length > 0 && !locked
          const isCollapsed = locked && collapsedIds.has(q.id)

          return (
            <div
              key={q.id}
              className={`relative bg-[var(--card)] rounded-xl shadow-sm overflow-hidden transition-opacity
                ${locked ? 'opacity-70' : ''}
              `}
            >
              {/* 임시저장 accent bar — 선택했지만 아직 확정 전 */}
              {hasSelection && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent)]" />
              )}

              <div className="p-6">
                {isCollapsed ? (
                  /* 접힌 상태 (확정 후 자동 접힘) */
                  <button
                    className="w-full text-left cursor-pointer"
                    onClick={() => toggleCollapse(q.id)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-[var(--accent)] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {q.id}
                      </span>
                      <span className="text-sm font-semibold text-[var(--text)] flex-1">{q.title}</span>
                      <span className="flex items-center gap-1 text-xs text-[var(--muted)] border border-[var(--border)] rounded-full px-2 py-0.5 flex-shrink-0">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        확정됨
                      </span>
                      <svg className="text-[var(--muted)] flex-shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="text-xs text-[var(--muted)] leading-relaxed">{getSummary(q, values)}</p>
                  </button>
                ) : (
                  /* 펼쳐진 상태 */
                  <>
                    {/* 헤더 */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 rounded-full bg-[var(--accent)] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {q.id}
                      </span>
                      {locked && (
                        <span className="flex items-center gap-1 text-xs text-[var(--muted)] border border-[var(--border)] rounded-full px-2.5 py-0.5">
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          확정됨
                        </span>
                      )}
                      {locked && (
                        <button
                          onClick={() => toggleCollapse(q.id)}
                          className="ml-auto flex items-center gap-1 text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
                        >
                          접기
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M3 9l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      )}
                    </div>

                    <h2 className="text-base font-semibold text-[var(--text)] mb-1">{q.title}</h2>
                    {q.subtitle && (
                      <p className="text-xs text-[var(--muted)] mb-3 leading-relaxed">{q.subtitle}</p>
                    )}

                    {/* rank — 선택 순서 슬롯 */}
                    {q.type === 'rank' && (
                      <div className="flex gap-2 mb-4">
                        {[0, 1, 2].map(i => {
                          const slotOpt = q.options.find(o => o.value === values[i])
                          const slotColor = slotOpt?.color
                          return (
                            <div
                              key={i}
                              className={`flex-1 flex items-center gap-1.5 rounded-lg border px-2.5 py-2 min-w-0
                                ${values[i]
                                  ? slotColor ? '' : 'border-[var(--accent)] bg-[var(--accent)]/10'
                                  : 'border-dashed border-[var(--border)]'
                                }
                              `}
                              style={values[i] && slotColor
                                ? { borderColor: slotColor, backgroundColor: slotColor + '18' }
                                : undefined
                              }
                            >
                              <span
                                className="text-xs font-bold flex-shrink-0"
                                style={{ color: values[i] ? (slotColor ?? 'var(--accent)') : 'var(--muted)' }}
                              >
                                {i + 1}위
                              </span>
                              <span className="text-xs text-[var(--text)] truncate">
                                {slotOpt?.label ?? '—'}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* multi — 선택 카운터 */}
                    {q.type === 'multi' && q.max && (
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs text-[var(--muted)] flex-shrink-0">
                          {values.length} / {q.max} 선택됨
                        </span>
                        <div className="flex-1 h-1 bg-[var(--bg-2)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--accent)] rounded-full transition-all"
                            style={{ width: `${(values.length / q.max) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* 옵션 / Q.10 로딩·에러 */}
                    {q.id === 10 && raceLoading ? (
                      <p className="text-xs text-[var(--muted)] mb-5">레이스 목록을 불러오는 중...</p>
                    ) : q.id === 10 && raceError ? (
                      <p className="text-xs text-[var(--muted)] mb-5">레이스 목록을 불러올 수 없습니다.</p>
                    ) : (
                      <div className={`mb-5 gap-2 ${useGrid ? 'grid grid-cols-2' : 'flex flex-wrap justify-center'}`}>
                        {q.options.map(opt => {
                          const rankIndex = q.type === 'rank' ? values.indexOf(opt.value) : -1
                          const isSelected = values.includes(opt.value)
                          const color = opt.color

                          return (
                            <button
                              key={opt.value}
                              onClick={() => handleClick(q, opt.value)}
                              disabled={locked}
                              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors
                                ${useGrid ? 'w-full text-left' : ''}
                                ${isSelected
                                  ? color ? 'border-2' : 'bg-[var(--accent)] border-[var(--accent)] text-white'
                                  : 'bg-[var(--bg-2)] border-[var(--border)] text-[var(--text)]'
                                }
                                ${!isSelected && !color ? 'hover:border-[var(--accent)]' : ''}
                                ${locked ? 'cursor-not-allowed' : 'cursor-pointer'}
                              `}
                              style={
                                isSelected && color
                                  ? { backgroundColor: color + '20', borderColor: color, color }
                                  : !isSelected && color && useGrid
                                    ? { borderLeftColor: color, borderLeftWidth: '3px', borderLeftStyle: 'solid' }
                                    : undefined
                              }
                            >
                              {q.type === 'rank' && isSelected && (
                                <span
                                  className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0"
                                  style={{ backgroundColor: color ?? 'white', color: color ? 'white' : 'var(--accent)' }}
                                >
                                  {rankIndex + 1}
                                </span>
                              )}
                              <span className="truncate">{opt.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {/* 확정 버튼 */}
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
                  </>
                )}
              </div>
            </div>
          )
        })}

      </div>
    </main>
    </>
  )
}
