'use client'

import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import 'flag-icons/css/flag-icons.min.css'
import type { Race, RaceSession } from '@/lib/f1Api'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

function parseDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function formatDate(dateStr: string) {
  const d = parseDate(dateStr)
  return {
    display:  `${d.getMonth() + 1}월 ${d.getDate()}일`,
    weekday:  WEEKDAYS[d.getDay()],
  }
}

function toKST(session: RaceSession): string {
  if (!session.time) {
    const { display, weekday } = formatDate(session.date)
    return `${display} (${weekday})`
  }
  const d = new Date(`${session.date}T${session.time}`)
  const kst     = new Date(d.getTime() + 9 * 60 * 60 * 1000)
  const month   = kst.getUTCMonth() + 1
  const day     = kst.getUTCDate()
  const weekday = WEEKDAYS[kst.getUTCDay()]
  const hour    = String(kst.getUTCHours()).padStart(2, '0')
  const minute  = String(kst.getUTCMinutes()).padStart(2, '0')
  return `${month}월 ${day}일 (${weekday}) ${hour}:${minute}`
}

// 세션 예상 소요 시간 (분)
const SESSION_DURATIONS: Record<string, number> = {
  fp1: 60, fp2: 60, fp3: 60,
  sprintShootout: 45,
  sprint: 45,
  qualifying: 75,
  race: 120,
}

function isSessionLive(session: RaceSession | undefined, key: string, now: Date): boolean {
  if (!session?.time) return false
  const start = new Date(`${session.date}T${session.time}`)
  const end   = new Date(start.getTime() + (SESSION_DURATIONS[key] ?? 60) * 60_000)
  return now >= start && now < end
}

function getSessionLabel(key: string, isSprint: boolean): string {
  if (key === 'fp1') return isSprint ? '프랙티스' : '프랙티스 1'
  if (key === 'fp2') return '프랙티스 2'
  if (key === 'fp3') return '프랙티스 3'
  if (key === 'sprintShootout') return '스프린트 예선'
  if (key === 'sprint') return '스프린트'
  if (key === 'qualifying') return '예선'
  return '레이스'
}

interface Props {
  races: Race[]
  year: number
  seasons: number[]
}

export default function RaceList({ races, year, seasons }: Props) {
  const router = useRouter()
  const [expandedRound, setExpandedRound] = useState<number | null>(null)
  const [now, setNow] = useState<Date>(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const today = useMemo(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
  }, [])

  const nextRace = useMemo(
    () => races.find(r => parseDate(r.raceDate) >= today),
    [races, today],
  )

  // 다음 레이스까지 카운트다운
  const countdown = useMemo(() => {
    if (!nextRace) return null
    const target = nextRace.raceTime
      ? new Date(`${nextRace.raceDate}T${nextRace.raceTime}`)
      : parseDate(nextRace.raceDate)
    const diff = target.getTime() - now.getTime()
    if (diff <= 0) return null
    return {
      days:    Math.floor(diff / 86_400_000),
      hours:   Math.floor((diff % 86_400_000) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1_000),
      hasTime: !!nextRace.raceTime,
    }
  }, [nextRace, now])

  const seasonOver = !nextRace
  const sprintCount = races.filter(r => r.sprint).length

  return (
    <div className="max-w-[720px] mx-auto flex flex-col gap-3">

      {/* 헤더 */}
      <div className="bg-[var(--card)] rounded-xl shadow-sm px-6 py-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[var(--text)]">{year} 시즌 캘린더</h1>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            총 {races.length} 라운드 · 스프린트 {sprintCount}회
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="relative">
            <select
              value={year}
              onChange={e => router.push(`?season=${e.target.value}`)}
              className="appearance-none text-sm font-semibold bg-[var(--bg-2)] border border-[var(--border)] text-[var(--text)] rounded-lg pl-4 pr-9 py-2 cursor-pointer outline-none focus:border-[var(--accent)] transition-colors hover:border-[var(--accent)]"
            >
              {seasons.map(s => (
                <option key={s} value={s}>{s} 시즌</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] text-[10px]">▼</span>
          </div>
          <span className={`text-xs font-semibold rounded-full px-3 py-1.5 border ${
            seasonOver
              ? 'text-[var(--muted)] border-[var(--border)] bg-[var(--bg-2)]'
              : 'text-[var(--accent)] border-[var(--accent)] bg-[var(--bg-2)]'
          }`}>
            {seasonOver ? '시즌 종료' : '시즌 진행 중'}
          </span>
        </div>
      </div>

      {/* 다음 레이스 배너 */}
      {nextRace ? (
        <div className="bg-[var(--accent)] rounded-xl shadow-sm px-6 py-5 text-white">
          <p className="text-xs font-semibold opacity-80 mb-1">
            NEXT RACE · R{String(nextRace.round).padStart(2, '0')}
          </p>
          <div className="flex items-center gap-3 mb-0.5">
            {nextRace.flag && (
              <span className={`fi fi-${nextRace.flag} rounded-sm`} style={{ fontSize: '1.5rem' }} />
            )}
            <p className="text-lg font-bold">{nextRace.name}</p>
          </div>
          <p className="text-sm opacity-80">{nextRace.circuit}</p>
          <p className="text-sm font-semibold mt-1">
            {formatDate(nextRace.raceDate).display} ({formatDate(nextRace.raceDate).weekday})
            {nextRace.raceTime && (
              <span className="opacity-70 font-normal ml-2 text-xs">
                레이스 {toKST({ date: nextRace.raceDate, time: nextRace.raceTime }).split(' ').slice(-1)[0]} KST
              </span>
            )}
          </p>

          {/* 카운트다운 */}
          {countdown && (
            <div className="mt-3 flex items-center gap-4 flex-wrap">
              {countdown.days > 0 && (
                <span>
                  <span className="text-2xl font-bold tabular-nums">{String(countdown.days).padStart(2, '0')}</span>
                  <span className="text-sm font-semibold opacity-75 ml-0.5">일</span>
                </span>
              )}
              {countdown.hasTime && (
                <>
                  <span>
                    <span className="text-2xl font-bold tabular-nums">{String(countdown.hours).padStart(2, '0')}</span>
                    <span className="text-sm font-semibold opacity-75 ml-0.5">시</span>
                  </span>
                  <span>
                    <span className="text-2xl font-bold tabular-nums">{String(countdown.minutes).padStart(2, '0')}</span>
                    <span className="text-sm font-semibold opacity-75 ml-0.5">분</span>
                  </span>
                  <span>
                    <span className="text-2xl font-bold tabular-nums">{String(countdown.seconds).padStart(2, '0')}</span>
                    <span className="text-sm font-semibold opacity-75 ml-0.5">초</span>
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[var(--card)] rounded-xl shadow-sm px-6 py-5 text-center">
          <p className="text-sm font-semibold text-[var(--text)]">{year} 시즌이 종료되었습니다.</p>
          <p className="text-xs text-[var(--muted)] mt-1">
            최종전: {races[races.length - 1]?.name} · {formatDate(races[races.length - 1]?.raceDate).display}
          </p>
        </div>
      )}

      {/* 범례 */}
      <div className="flex items-center gap-4 px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold bg-[var(--accent)] text-white rounded px-1.5 py-0.5">S</span>
          <span className="text-xs text-[var(--muted)]">스프린트 위크엔드</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-xs text-[var(--muted)]">진행 중</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-[var(--muted)]">카드 클릭 시 세부 일정</span>
        </div>
      </div>

      {/* 레이스 목록 */}
      {races.map(race => {
        const isPast     = parseDate(race.raceDate) < today
        const isNext     = nextRace?.round === race.round
        const isExpanded = expandedRound === race.round
        const { display, weekday } = formatDate(race.raceDate)

        const sessionOrder: (keyof Race['sessions'] | 'race')[] = race.sprint
          ? ['fp1', 'fp2', 'sprintShootout', 'sprint', 'qualifying', 'race']
          : ['fp1', 'fp2', 'fp3', 'qualifying', 'race']

        // 이 레이스 주말에 현재 진행 중인 세션이 있는지
        const hasLiveSession = sessionOrder.some(key => {
          const s = key === 'race'
            ? { date: race.raceDate, time: race.raceTime }
            : race.sessions[key as keyof Race['sessions']]
          return isSessionLive(s, key, now)
        })

        return (
          <div
            key={race.round}
            className={`bg-[var(--card)] rounded-xl shadow-sm overflow-hidden
              ${isPast && !hasLiveSession ? 'opacity-50' : ''}
              ${isNext  ? 'ring-2 ring-[var(--accent)]' : ''}
              ${hasLiveSession ? 'ring-2 ring-green-500' : ''}
            `}
          >
            <div
              onClick={() => setExpandedRound(isExpanded ? null : race.round)}
              className="w-full px-5 py-4 flex items-center gap-4 cursor-pointer text-left"
            >
              {/* 라운드 */}
              <div className="w-9 flex-shrink-0 text-center">
                <span className="block text-[10px] font-bold text-[var(--accent)] leading-none">R</span>
                <span className="block text-base font-bold text-[var(--text)] leading-tight">
                  {String(race.round).padStart(2, '0')}
                </span>
              </div>

              <div className="w-px h-9 bg-[var(--border)] flex-shrink-0" />

              {/* 레이스 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {race.flag
                    ? <span className={`fi fi-${race.flag} rounded-sm flex-shrink-0`} style={{ fontSize: '1.1rem' }} />
                    : <span className="text-base leading-none">🏁</span>
                  }
                  <span className="text-sm font-semibold text-[var(--text)]">{race.name}</span>
                  {race.sprint && (
                    <span className="text-[10px] font-bold bg-[var(--accent)] text-white rounded px-1.5 py-0.5 leading-none">S</span>
                  )}
                  {hasLiveSession && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-green-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      LIVE
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--muted)] mt-1 truncate">{race.circuit}</p>
              </div>

              {/* 날짜 */}
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-[var(--text)]">{display}</p>
                <p className="text-xs text-[var(--muted)]">{weekday}요일</p>
              </div>

              {/* 완료 체크 / 결과 보기 */}
              {isPast && !hasLiveSession ? (
                <Link
                  href={`/results?season=${year}&round=${race.round}`}
                  onClick={e => e.stopPropagation()}
                  className="flex-shrink-0 text-xs font-semibold text-[var(--accent)] border border-[var(--accent)] rounded-md px-2.5 py-1 hover:bg-[var(--accent)] hover:text-white transition-colors"
                >
                  결과 보기
                </Link>
              ) : (
                <div className="w-5 h-5 flex-shrink-0" />
              )}

              <span className={`text-[var(--muted)] text-[10px] flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </div>

            {/* 세부 일정 패널 */}
            {isExpanded && (
              <div className="border-t border-[var(--border)] px-5 py-4 flex flex-col gap-2.5">
                {sessionOrder.map(key => {
                  const session: RaceSession | undefined = key === 'race'
                    ? { date: race.raceDate, time: race.raceTime }
                    : race.sessions[key as keyof Race['sessions']]
                  if (!session) return null

                  const live = isSessionLive(session, key, now)

                  return (
                    <div key={key} className={`flex items-center justify-between gap-4 rounded-lg px-3 py-2 -mx-3 transition-colors ${
                      live ? 'bg-green-500/10' : ''
                    }`}>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {live && (
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                        )}
                        <span className={`text-xs font-semibold ${
                          live ? 'text-green-500' : key === 'race' ? 'text-[var(--accent)]' : 'text-[var(--muted)]'
                        }`}>
                          {getSessionLabel(key, race.sprint)}
                        </span>
                        {live && (
                          <span className="text-[10px] font-bold text-green-500 bg-green-500/15 rounded px-1.5 py-0.5 leading-none">
                            진행 중
                          </span>
                        )}
                      </div>
                      <span className={`text-xs text-right ${live ? 'text-green-500 font-medium' : 'text-[var(--text)]'}`}>
                        {toKST(session)}
                        {session.time && (
                          <span className="text-[var(--muted)] ml-1 text-[10px]">KST</span>
                        )}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

    </div>
  )
}
