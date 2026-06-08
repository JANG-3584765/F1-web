'use client'

import { useState, useEffect } from 'react'

interface Props {
  startIso: string
  endIso:   string
}

export default function CountdownTimer({ startIso, endIso }: Props) {
  const [display, setDisplay] = useState<string | null>(null)

  useEffect(() => {
    const start = new Date(startIso).getTime()
    const end   = new Date(endIso).getTime()

    function tick() {
      const now  = Date.now()

      if (now >= start && now <= end) {
        setDisplay('진행 중')
        return
      }

      const diff = start - now
      if (diff <= 0) {
        setDisplay(null)
        return
      }

      const d  = Math.floor(diff / 86_400_000)
      const h  = Math.floor((diff % 86_400_000) / 3_600_000)
      const m  = Math.floor((diff % 3_600_000) / 60_000)
      const s  = Math.floor((diff % 60_000) / 1_000)

      const hh = String(h).padStart(2, '0')
      const mm = String(m).padStart(2, '0')
      const ss = String(s).padStart(2, '0')

      setDisplay(d > 0 ? `${d}일  ${hh} : ${mm} : ${ss}` : `${hh} : ${mm} : ${ss}`)
    }

    tick()
    const id = setInterval(tick, 1000)

    // 탭 전환 후 복귀 시 throttle된 타이머를 즉시 보정
    const onVisible = () => { if (document.visibilityState === 'visible') tick() }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [startIso, endIso])

  if (display === null) return null

  return (
    <span className="text-3xl font-black tabular-nums tracking-wide text-[var(--accent)]">
      {display}
    </span>
  )
}
