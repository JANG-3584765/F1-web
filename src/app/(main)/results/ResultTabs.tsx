'use client'

import { useState, useMemo } from 'react'
import type {
  ResultRow, PitStopMap, TireStrategyMap, Stint,
  QualifyingRow, SprintRow, PracticeRow,
} from '@/lib/f1ResultsApi'

// ===== 공통 =====

export interface ConstructorChange {
  constructorId: string
  name: string
  teamColor: string
  currentPosition: number | null
  previousPosition: number | null
  currentPoints: number
  pointsGained: number
}

export interface StandingChange {
  driverId: string
  name: string
  team: string
  teamColor: string
  currentPosition: number | null
  previousPosition: number | null
  currentPoints: number
  pointsGained: number
}

function RaceChangeBadge({ grid, position }: { grid: number; position: number | null }) {
  if (!position || !grid) return null
  const delta = grid - position
  if (delta === 0) return <span className="text-[10px] text-[var(--muted)]">━</span>
  if (delta > 0) return <span className="text-[10px] font-black text-green-500">▲{delta}</span>
  return <span className="text-[10px] font-black text-red-500">▼{Math.abs(delta)}</span>
}

function ChampChangeBadge({ current, previous }: { current: number | null; previous: number | null }) {
  if (current == null || previous == null) return null
  const delta = previous - current
  if (delta === 0) return <span className="text-[10px] text-[var(--muted)]">━</span>
  if (delta > 0) return <span className="text-[10px] font-black text-green-500">▲{delta}</span>
  return <span className="text-[10px] font-black text-red-500">▼{Math.abs(delta)}</span>
}

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
      <table className="w-full min-w-[620px] table-fixed border-collapse">
        <thead>
          <tr className="bg-[var(--bg-2)] text-xs text-[var(--muted)]">
            <th className="w-14 px-3 py-3 text-center font-bold">순위</th>
            <th className="w-12 px-3 py-3 text-center font-bold">시작</th>
            <th className="px-3 py-3 text-left font-bold">드라이버</th>
            <th className="w-28 px-3 py-3 text-left font-bold">기록</th>
            <th className="w-16 px-3 py-3 text-center font-bold">랩</th>
            <th className="w-16 px-3 py-3 text-center font-bold">PTS</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={`${row.code}-${row.position ?? row.laps}`} className="border-t border-[var(--border)]">
              <td className="px-3 py-3 text-center">
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-sm font-black text-[var(--text)]">{row.position ?? '-'}</span>
                  <RaceChangeBadge grid={row.grid} position={row.position} />
                </div>
              </td>
              <td className="px-3 py-3 text-center text-sm font-bold text-[var(--muted)]">
                {row.grid > 0 ? row.grid : 'PL'}
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
          {rows.map(row => (
            <tr key={row.driverId} className="border-t border-[var(--border)]">
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

// ===== 컨스트럭터 변동 =====

function ConstructorChangeSection({ changes }: { changes: ConstructorChange[] }) {
  const hasPrev = changes.some(c => c.previousPosition != null)
  return (
    <div className="overflow-x-auto border border-[var(--border)] rounded-lg">
      <table className="w-full min-w-[380px] border-collapse">
        <thead>
          <tr className="bg-[var(--bg-2)] text-xs text-[var(--muted)]">
            <th className="w-20 px-3 py-3 text-center font-bold">순위</th>
            <th className="px-3 py-3 text-left font-bold">컨스트럭터</th>
            <th className="w-20 px-3 py-3 text-center font-bold">포인트</th>
            <th className="w-16 px-3 py-3 text-center font-bold">획득</th>
          </tr>
        </thead>
        <tbody>
          {changes.map(c => (
            <tr key={c.constructorId} className="border-t border-[var(--border)]">
              <td className="px-3 py-3 text-center">
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-sm font-black text-[var(--text)]">{c.currentPosition ?? '-'}</span>
                  {hasPrev && <ChampChangeBadge current={c.currentPosition} previous={c.previousPosition} />}
                </div>
              </td>
              <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-1 shrink-0 rounded-full" style={{ backgroundColor: c.teamColor }} />
                  <span className="text-sm font-black text-[var(--text)] truncate">{c.name}</span>
                </div>
              </td>
              <td className="px-3 py-3 text-center text-sm font-black text-[var(--text)]">{c.currentPoints}</td>
              <td className="px-3 py-3 text-center text-sm font-bold">
                {c.pointsGained > 0
                  ? <span className="font-black text-green-600">+{c.pointsGained}</span>
                  : <span className="text-[var(--muted)]">0</span>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ===== 챔피언십 변동 =====

function StandingChangeSection({ changes }: { changes: StandingChange[] }) {
  const hasPrev = changes.some(c => c.previousPosition != null)
  return (
    <div className="overflow-x-auto border border-[var(--border)] rounded-lg">
      <table className="w-full min-w-[480px] border-collapse">
        <thead>
          <tr className="bg-[var(--bg-2)] text-xs text-[var(--muted)]">
            <th className="w-20 px-3 py-3 text-center font-bold">순위</th>
            <th className="px-3 py-3 text-left font-bold">드라이버</th>
            <th className="w-20 px-3 py-3 text-center font-bold">포인트</th>
            <th className="w-16 px-3 py-3 text-center font-bold">획득</th>
          </tr>
        </thead>
        <tbody>
          {changes.map(c => (
            <tr key={c.driverId} className="border-t border-[var(--border)]">
              <td className="px-3 py-3 text-center">
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-sm font-black text-[var(--text)]">{c.currentPosition ?? '-'}</span>
                  {hasPrev && <ChampChangeBadge current={c.currentPosition} previous={c.previousPosition} />}
                </div>
              </td>
              <td className="px-3 py-3">
                <div className="text-sm font-black text-[var(--text)] truncate">{c.name}</div>
                <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-[var(--muted)]">
                  <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.teamColor }} />
                  <span className="truncate">{c.team}</span>
                </div>
              </td>
              <td className="px-3 py-3 text-center text-sm font-black text-[var(--text)]">{c.currentPoints}</td>
              <td className="px-3 py-3 text-center text-sm font-bold">
                {c.pointsGained > 0
                  ? <span className="font-black text-green-600">+{c.pointsGained}</span>
                  : <span className="text-[var(--muted)]">0</span>
                }
              </td>
            </tr>
          ))}
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

const ALL_TABS = ['FP1', 'FP2', 'FP3', '퀄리파잉', '스프린트', '전체 결과', '피트스탑', '타이어 전략', '챔피언십 변동', '컨스트럭터 변동'] as const
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
  standingChanges: StandingChange[] | null
  constructorChanges: ConstructorChange[] | null
}

export default function ResultTabs({ allRows, pitStopMap, tireMap, qualifying, sprint, fp1, fp2, fp3, standingChanges, constructorChanges }: Props) {
  const availableTabs = useMemo(() => ALL_TABS.filter(tab => {
    if (tab === 'FP1') return !!fp1
    if (tab === 'FP2') return !!fp2
    if (tab === 'FP3') return !!fp3
    if (tab === '퀄리파잉') return !!qualifying
    if (tab === '스프린트') return !!sprint
    if (tab === '피트스탑') return !!pitStopMap
    if (tab === '타이어 전략') return !!tireMap
    if (tab === '챔피언십 변동') return !!standingChanges?.length
    if (tab === '컨스트럭터 변동') return !!constructorChanges?.length
    return true
  }), [fp1, fp2, fp3, qualifying, sprint, pitStopMap, tireMap, standingChanges, constructorChanges])

  const [activeTab, setActiveTab] = useState<Tab>('전체 결과')
  const currentTab = availableTabs.includes(activeTab) ? activeTab : '전체 결과'

  return (
    <div>
      <div
        role="tablist"
        aria-label="경기 결과 탭"
        className="flex overflow-x-auto border-b border-[var(--border)] mb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {availableTabs.map(tab => (
          <button
            key={tab}
            role="tab"
            aria-selected={currentTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 px-4 py-2.5 text-sm font-black border-b-2 -mb-px transition-colors ${
              currentTab === tab
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {currentTab === 'FP1' && fp1 && <PracticeSection rows={fp1} />}
      {currentTab === 'FP2' && fp2 && <PracticeSection rows={fp2} />}
      {currentTab === 'FP3' && fp3 && <PracticeSection rows={fp3} />}
      {currentTab === '퀄리파잉' && qualifying && <QualifyingSection rows={qualifying} />}
      {currentTab === '스프린트' && sprint && <SprintSection rows={sprint} />}
      {currentTab === '전체 결과' && <ResultTable rows={allRows} />}
      {currentTab === '피트스탑' && pitStopMap && <PitStopSection rows={allRows} pitStopMap={pitStopMap} />}
      {currentTab === '타이어 전략' && tireMap && <TireStrategySection rows={allRows} tireMap={tireMap} />}
      {currentTab === '챔피언십 변동' && standingChanges && <StandingChangeSection changes={standingChanges} />}
      {currentTab === '컨스트럭터 변동' && constructorChanges && <ConstructorChangeSection changes={constructorChanges} />}
    </div>
  )
}
