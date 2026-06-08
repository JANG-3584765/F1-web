'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { DriverStandingRow, ConstructorStandingRow } from '@/lib/f1StandingsApi'

type Tab = 'drivers' | 'constructors'

interface Props {
  drivers:      DriverStandingRow[] | null
  constructors: ConstructorStandingRow[] | null
}

const POSITION_COLOR = ['text-yellow-500', 'text-slate-400', 'text-amber-600']
const POSITION_LABEL = ['1st', '2nd', '3rd']

export default function StandingsPreviewSection({ drivers, constructors }: Props) {
  const [tab, setTab] = useState<Tab>('drivers')

  const hasAnyData = (drivers?.length ?? 0) > 0 || (constructors?.length ?? 0) > 0
  if (!hasAnyData) return null

  const items = (tab === 'drivers' ? drivers : constructors) ?? []

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-black text-[var(--text)]">순위 TOP3</h2>
          <div role="tablist" className="flex rounded-lg border border-[var(--border)] overflow-hidden text-xs">
            <button
              role="tab"
              aria-selected={tab === 'drivers'}
              onClick={() => setTab('drivers')}
              className={`px-3 py-1 font-semibold transition-colors ${
                tab === 'drivers'
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              드라이버
            </button>
            <button
              role="tab"
              aria-selected={tab === 'constructors'}
              onClick={() => setTab('constructors')}
              className={`px-3 py-1 font-semibold transition-colors ${
                tab === 'constructors'
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              컨스트럭터
            </button>
          </div>
        </div>
        <Link href="/standings" className="text-xs font-semibold text-[var(--accent)] hover:underline">
          전체 순위 →
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {items.map((item, i) => (
          <div
            key={'driverId' in item ? item.driverId : item.constructorId}
            className="bg-[var(--card)] rounded-xl p-4 flex flex-col items-center gap-2 text-center shadow-sm"
            style={{ borderTop: `3px solid ${item.teamColor}` }}
          >
            <span className={`text-xl font-black ${POSITION_COLOR[i]}`}>{POSITION_LABEL[i]}</span>
            <span className="text-xs font-bold text-[var(--text)] leading-tight">{item.name}</span>
            <span className="text-xs text-[var(--muted)] font-semibold">{item.points} pts</span>
          </div>
        ))}
      </div>
    </section>
  )
}
