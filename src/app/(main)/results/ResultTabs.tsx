'use client'

import { useState, useMemo, useEffect } from 'react'
import type {
  ResultRow, PitStopMap, TireStrategyMap, Stint,
  QualifyingRow, SprintRow, PracticeRow,
} from '@/lib/f1ResultsApi'

// ===== 공통 =====

function formatRecord(row: ResultRow | SprintRow) {
  if (row.timeOrGap) return row.timeOrGap
  return row.classified ? '완주' : '-'
}

const COMPOUND_STYLE: Record<string, { label: string; bg: string; text: string }> = {
  SOFT:         { label: '소프트',        bg: '#E8002D', text: '#fff' },
  MEDIUM:       { label: '미디엄',        bg: '#FFF200', text: '#000' },
  HARD:         { label: '하드',          bg: '#d9d9d9', text: '#000' },
  INTERMEDIATE: { label: '인터미디에이트', bg: '#39B54A', text: '#fff' },
  WET:          { label: '웨트',          bg: '#0067FF', text: '#fff' },
}

function CompoundBadge({ compound }: { compound: string }) {
  const style = COMPOUND_STYLE[compound]
  if (!style) return <span className="text-xs text-[var(--muted)]">-</span>
  return (
    <span
      className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-black"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {style.label}
    </span>
  )
}

// ===== 전체 결과 =====

function ResultTable({ rows }: { rows: ResultRow[] }) {
  return (
    <div className="overflow-x-auto border border-[var(--border)] rounded-lg">
      <table className="w-full min-w-[560px] table-fixed border-collapse">
        <thead>
          <tr className="bg-[var(--bg-2)] text-xs text-[var(--muted)]">
            <th className="w-14 px-3 py-3 text-center font-bold">순위</th>
            <th className="px-3 py-3 text-left font-bold">드라이버</th>
            <th className="w-28 px-3 py-3 text-left font-bold">기록</th>
            <th className="w-16 px-3 py-3 text-center font-bold">랩</th>
            <th className="w-16 px-3 py-3 text-center font-bold">PTS</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={`${row.code}-${row.position ?? row.laps}`} className="border-t border-[var(--border)]">
              <td className="px-3 py-3 text-center text-sm font-black text-[var(--text)]">
                {row.position ?? '-'}
              </td>
              <td className="px-3 py-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm font-black text-[var(--text)]">
                    <span className="truncate">{row.name}</span>
                    {row.fastestLap && (
                      <span className="shrink-0 rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-black text-purple-700">FL</span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-[var(--muted)]">
                    <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: row.teamColor }} />
                    <span className="truncate">{row.team}</span>
                  </div>
                </div>
              </td>
              <td className="px-3 py-3 text-left text-sm font-bold text-[var(--text)]">{formatRecord(row)}</td>
              <td className="px-3 py-3 text-center text-sm font-bold text-[var(--text)]">{row.laps}</td>
              <td className="px-3 py-3 text-center text-sm font-black text-[var(--text)]">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ===== 퀄리파잉 =====

function QualifyingSection({ rows }: { rows: QualifyingRow[] }) {
  const hasQ2 = rows.some(r => r.q2)
  const hasQ3 = rows.some(r => r.q3)
  return (
    <div className="overflow-x-auto border border-[var(--border)] rounded-lg">
      <table className="w-full min-w-[480px] border-collapse">
        <thead>
          <tr className="bg-[var(--bg-2)] text-xs text-[var(--muted)]">
            <th className="w-14 px-3 py-3 text-center font-bold">순위</th>
            <th className="px-3 py-3 text-left font-bold">드라이버</th>
            <th className="w-28 px-3 py-3 text-center font-bold">Q1</th>
            {hasQ2 && <th className="w-28 px-3 py-3 text-center font-bold">Q2</th>}
            {hasQ3 && <th className="w-28 px-3 py-3 text-center font-bold">Q3</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.driverId} className="border-t border-[var(--border)]">
              <td className="px-3 py-3 text-center text-sm font-black text-[var(--text)]">{row.position}</td>
              <td className="px-3 py-3">
                <div className="text-sm font-black text-[var(--text)] truncate">{row.name}</div>
                <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-[var(--muted)]">
                  <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: row.teamColor }} />
                  <span className="truncate">{row.team}</span>
                </div>
              </td>
              <td className="px-3 py-3 text-center text-sm font-bold text-[var(--text)] tabular-nums">
                {row.q1 ?? <span className="text-[var(--muted)]">-</span>}
              </td>
              {hasQ2 && (
                <td className="px-3 py-3 text-center text-sm font-bold text-[var(--text)] tabular-nums">
                  {row.q2 ?? <span className="text-[var(--muted)]">-</span>}
                </td>
              )}
              {hasQ3 && (
                <td className="px-3 py-3 text-center text-sm font-bold text-[var(--text)] tabular-nums">
                  {row.q3 ?? <span className="text-[var(--muted)]">-</span>}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ===== 스프린트 =====

function SprintSection({ rows }: { rows: SprintRow[] }) {
  return (
    <div className="overflow-x-auto border border-[var(--border)] rounded-lg">
      <table className="w-full min-w-[480px] table-fixed border-collapse">
        <thead>
          <tr className="bg-[var(--bg-2)] text-xs text-[var(--muted)]">
            <th className="w-14 px-3 py-3 text-center font-bold">순위</th>
            <th className="px-3 py-3 text-left font-bold">드라이버</th>
            <th className="w-28 px-3 py-3 text-left font-bold">기록</th>
            <th className="w-16 px-3 py-3 text-center font-bold">랩</th>
            <th className="w-16 px-3 py-3 text-center font-bold">PTS</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.driverId || i} className="border-t border-[var(--border)]">
              <td className="px-3 py-3 text-center text-sm font-black text-[var(--text)]">{row.position ?? '-'}</td>
              <td className="px-3 py-3">
                <div className="text-sm font-black text-[var(--text)] truncate">{row.name}</div>
                <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-[var(--muted)]">
                  <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: row.teamColor }} />
                  <span className="truncate">{row.team}</span>
                </div>
              </td>
              <td className="px-3 py-3 text-left text-sm font-bold text-[var(--text)]">{formatRecord(row)}</td>
              <td className="px-3 py-3 text-center text-sm font-bold text-[var(--text)]">{row.laps}</td>
              <td className="px-3 py-3 text-center text-sm font-black text-[var(--text)]">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ===== 프랙티스 =====

function PracticeSection({ rows }: { rows: PracticeRow[] }) {
  return (
    <div className="overflow-x-auto border border-[var(--border)] rounded-lg">
      <table className="w-full min-w-[400px] border-collapse">
        <thead>
          <tr className="bg-[var(--bg-2)] text-xs text-[var(--muted)]">
            <th className="w-14 px-3 py-3 text-center font-bold">순위</th>
            <th className="px-3 py-3 text-left font-bold">드라이버</th>
            <th className="w-32 px-3 py-3 text-center font-bold">랩타임</th>
            <th className="w-16 px-3 py-3 text-center font-bold">랩</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.driverId} className="border-t border-[var(--border)]">
              <td className="px-3 py-3 text-center text-sm font-black text-[var(--text)]">{row.position}</td>
              <td className="px-3 py-3">
                <div className="text-sm font-black text-[var(--text)] truncate">{row.name}</div>
                <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-[var(--muted)]">
                  <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: row.teamColor }} />
                  <span className="truncate">{row.team}</span>
                </div>
              </td>
              <td className="px-3 py-3 text-center text-sm font-bold tabular-nums text-[var(--text)]">
                {row.lapTime ?? <span className="text-[var(--muted)]">-</span>}
              </td>
              <td className="px-3 py-3 text-center text-sm font-bold text-[var(--text)]">{row.laps}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ===== 피트스탑 =====

function PitStopSection({ rows, pitStopMap }: { rows: ResultRow[]; pitStopMap: PitStopMap }) {
  return (
    <div className="overflow-x-auto border border-[var(--border)] rounded-lg">
      <table className="w-full min-w-[480px] border-collapse">
        <thead>
          <tr className="bg-[var(--bg-2)] text-xs text-[var(--muted)]">
            <th className="w-40 px-3 py-3 text-left font-bold">드라이버</th>
            <th className="w-14 px-3 py-3 text-center font-bold">횟수</th>
            <th className="px-3 py-3 text-left font-bold">스탑 기록</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => {
            const pit = pitStopMap[row.driverId]
            return (
              <tr key={row.driverId} className="border-t border-[var(--border)]">
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: row.teamColor }} />
                    <span className="text-sm font-bold text-[var(--text)] truncate">{row.name}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-center text-sm font-bold text-[var(--text)]">
                  {pit ? `${pit.count}회` : '-'}
                </td>
                <td className="px-3 py-3">
                  {!pit ? (
                    <span className="text-xs text-[var(--muted)]">-</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {pit.stops.map((s, i) => (
                        <div key={i} className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--bg-2)] px-2.5 py-1.5">
                          <span className="text-[10px] font-black text-[var(--muted)]">{i + 1}</span>
                          <span className="text-[var(--border)] text-xs">|</span>
                          <span className="text-xs font-black text-[var(--text)]">{s.lap}랩</span>
                          <span className="text-[var(--border)] text-xs">·</span>
                          <span className="text-xs font-bold text-[var(--text)]">{s.duration}s</span>
                        </div>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ===== 타이어 전략 =====

function TireStrategySection({ rows, tireMap }: { rows: ResultRow[]; tireMap: TireStrategyMap }) {
  return (
    <div className="overflow-x-auto border border-[var(--border)] rounded-lg">
      <table className="w-full min-w-[520px] border-collapse">
        <thead>
          <tr className="bg-[var(--bg-2)] text-xs text-[var(--muted)]">
            <th className="w-40 px-3 py-3 text-left font-bold">드라이버</th>
            <th className="px-3 py-3 text-left font-bold">타이어 전략</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => {
            const stints: Stint[] = tireMap[row.code] ?? []
            return (
              <tr key={row.code} className="border-t border-[var(--border)]">
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: row.teamColor }} />
                    <span className="text-sm font-bold text-[var(--text)] truncate">{row.name}</span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  {stints.length === 0 ? (
                    <span className="text-xs text-[var(--muted)]">-</span>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      {stints.map((s, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="flex flex-col items-center gap-0.5">
                            <CompoundBadge compound={s.compound} />
                            <span className="text-[10px] font-bold text-[var(--muted)]">
                              {s.lapEnd - s.lapStart + 1}랩
                            </span>
                          </div>
                          {i < stints.length - 1 && (
                            <span className="text-[var(--muted)] text-xs">→</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ===== 탭 메인 =====

const ALL_TABS = ['FP1', 'FP2', 'FP3', '퀄리파잉', '스프린트', '전체 결과', '피트스탑', '타이어 전략'] as const
type Tab = typeof ALL_TABS[number]

interface Props {
  allRows: ResultRow[]
  pitStopMap: PitStopMap | null
  tireMap: TireStrategyMap | null
  qualifying: QualifyingRow[] | null
  sprint: SprintRow[] | null
  fp1: PracticeRow[] | null
  fp2: PracticeRow[] | null
  fp3: PracticeRow[] | null
}

export default function ResultTabs({ allRows, pitStopMap, tireMap, qualifying, sprint, fp1, fp2, fp3 }: Props) {
  const availableTabs = useMemo(() => ALL_TABS.filter(tab => {
    if (tab === 'FP1') return !!fp1
    if (tab === 'FP2') return !!fp2
    if (tab === 'FP3') return !!fp3
    if (tab === '퀄리파잉') return !!qualifying
    if (tab === '스프린트') return !!sprint
    if (tab === '피트스탑') return !!pitStopMap
    if (tab === '타이어 전략') return !!tireMap
    return true
  }), [fp1, fp2, fp3, qualifying, sprint, pitStopMap, tireMap])

  const [activeTab, setActiveTab] = useState<Tab>('전체 결과')

  useEffect(() => {
    if (!availableTabs.includes(activeTab)) {
      setActiveTab('전체 결과')
    }
  }, [availableTabs, activeTab])

  return (
    <div>
      <div className="flex overflow-x-auto border-b border-[var(--border)] mb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {availableTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 px-4 py-2.5 text-sm font-black border-b-2 -mb-px transition-colors ${
              activeTab === tab
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'FP1' && fp1 && <PracticeSection rows={fp1} />}
      {activeTab === 'FP2' && fp2 && <PracticeSection rows={fp2} />}
      {activeTab === 'FP3' && fp3 && <PracticeSection rows={fp3} />}
      {activeTab === '퀄리파잉' && qualifying && <QualifyingSection rows={qualifying} />}
      {activeTab === '스프린트' && sprint && <SprintSection rows={sprint} />}
      {activeTab === '전체 결과' && <ResultTable rows={allRows} />}
      {activeTab === '피트스탑' && pitStopMap && <PitStopSection rows={allRows} pitStopMap={pitStopMap} />}
      {activeTab === '타이어 전략' && tireMap && <TireStrategySection rows={allRows} tireMap={tireMap} />}
    </div>
  )
}
