import Link from 'next/link'
import schedule from '@/data/schedule2026.json'
import CountdownTimer from './CountdownTimer'

function emojiToCountryCode(emoji: string): string {
  return [...emoji]
    .map(c => c.codePointAt(0) ?? 0)
    .filter(cp => cp >= 0x1F1E6 && cp <= 0x1F1FF)
    .map(cp => String.fromCharCode(cp - 0x1F1E6 + 65))
    .join('')
    .toLowerCase()
}

interface Session {
  name:  string
  start: string
  end:   string
}

interface Race {
  round:         number
  flag:          string
  location:      string
  city:          string
  race_name:     string
  circuit:       string
  circuit_image: string
  sessions:      Session[]
}

function getCircuitImagePath(circuitImage: string): string {
  const filename = circuitImage.split('/').pop() ?? ''
  return `/images/circuits/${filename}`
}

function formatSessionTime(iso: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone:    'Asia/Seoul',
    month:       'numeric',
    day:         'numeric',
    hour:        '2-digit',
    minute:      '2-digit',
    hour12:      false,
  }).formatToParts(new Date(iso))

  const get = (type: string) => parts.find(p => p.type === type)?.value ?? ''
  return `${get('month')}/${get('day')} ${get('hour')}:${get('minute')}`
}

export default function NextRaceSection() {
  const now = new Date()
  let nextRace: Race | null = null
  let nextSession: Session | null = null

  for (const race of schedule as Race[]) {
    for (const session of race.sessions) {
      if (!session.start || !session.end) continue
      if (new Date(session.end) > now) {
        nextRace    = race
        nextSession = session
        break
      }
    }
    if (nextRace) break
  }

  if (!nextRace || !nextSession) {
    return (
      <section className="bg-[var(--card)] rounded-2xl p-6 text-center text-[var(--muted)] text-sm">
        2026 시즌 일정이 모두 종료됐습니다.
      </section>
    )
  }

  const circuitImg = getCircuitImagePath(nextRace.circuit_image)

  return (
    <section className="bg-[var(--card)] rounded-2xl overflow-hidden shadow-sm">

      {/* 헤더 */}
      <div className="px-6 pt-5 pb-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--accent)]">
            Round {nextRace.round} · 2026
          </span>
          <h2 className="text-lg font-black text-[var(--text)] leading-tight flex items-center gap-2">
            <span className={`fi fi-${emojiToCountryCode(nextRace.flag)} rounded-sm`} style={{ fontSize: '1.2em' }} />
            {nextRace.race_name}
          </h2>
          <span className="text-xs text-[var(--muted)]">{nextRace.city}, {nextRace.location}</span>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={circuitImg}
          alt={nextRace.circuit}
          className="h-28 sm:h-20 w-auto object-contain opacity-70 self-center sm:self-start sm:flex-shrink-0"
        />
      </div>

      {/* 카운트다운 */}
      <div className="px-6 py-4 border-t border-[var(--border)] flex flex-col gap-1">
        <span className="text-[10px] font-semibold text-[var(--muted)] uppercase tracking-wider">
          {nextSession.name}까지
        </span>
        <CountdownTimer startIso={nextSession.start} endIso={nextSession.end} />
      </div>

      {/* 세션 목록 */}
      <div className="px-6 py-4 border-t border-[var(--border)]">
        <ul className="flex flex-col gap-2.5">
          {nextRace.sessions.map(s => {
            const isPast    = new Date(s.end) < now
            const isCurrent = new Date(s.start) <= now && now <= new Date(s.end)
            return (
              <li
                key={s.name}
                className={`flex items-center justify-between text-xs font-semibold ${
                  isCurrent ? 'text-[var(--accent)]' : isPast ? 'text-[var(--muted)] opacity-40' : 'text-[var(--text)]'
                }`}
              >
                <span>{s.name}</span>
                <span className="tabular-nums">{formatSessionTime(s.start)}</span>
              </li>
            )
          })}
        </ul>
      </div>

      {/* 링크 버튼 */}
      <div className="px-6 py-4 border-t border-[var(--border)] flex gap-3">
        <Link
          href="/schedules"
          className="flex-1 text-center text-xs font-semibold py-2 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
        >
          전체 일정 보기
        </Link>
        <Link
          href="/results"
          className="flex-1 text-center text-xs font-semibold py-2 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
        >
          지난 경기 결과
        </Link>
      </div>

    </section>
  )
}
