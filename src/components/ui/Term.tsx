'use client'

import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { GLOSSARY } from '@/data/glossary'

interface Props {
  id: string
  children: React.ReactNode
}

export default function Term({ id, children }: Props) {
  const [open, setOpen] = useState(false)
  const [above, setAbove] = useState(false)
  const [alignRight, setAlignRight] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const entry = GLOSSARY[id]

  // reposition when popover opens
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return
    const r = triggerRef.current.getBoundingClientRect()
    const POPOVER_W = 288
    const POPOVER_H = 160

    setAbove(r.bottom + POPOVER_H + 12 > window.innerHeight - 16)
    setAlignRight(r.left + POPOVER_W / 2 > window.innerWidth - 16)
  }, [open])

  // close on outside click / touch
  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node
      if (!triggerRef.current?.contains(t) && !popoverRef.current?.contains(t)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('touchstart', close)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('touchstart', close)
    }
  }, [open])

  // close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  if (!entry) return <>{children}</>

  const hAlign = alignRight ? 'right-0' : 'left-0'
  const vPos   = above ? 'bottom-full mb-2' : 'top-full mt-2'
  const arrowV = above ? 'bottom-[-7px] border-b border-r rotate-45' : 'top-[-7px] border-t border-l rotate-45'
  const arrowH = alignRight ? 'right-4' : 'left-4'

  return (
    <span className="relative inline-block">
      <button
        ref={triggerRef}
        onClick={() => setOpen(v => !v)}
        className={`border-b-2 border-dashed border-[var(--accent)] cursor-pointer transition-opacity leading-normal ${
          open ? 'opacity-60' : 'hover:opacity-70'
        }`}
      >
        {children}
      </button>

      {open && (
        <span
          ref={popoverRef}
          className={`absolute ${vPos} ${hAlign} z-50 w-72 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl p-5 text-left`}
          style={{ display: 'block' }}
        >
          {/* arrow */}
          <span
            className={`absolute ${arrowV} ${arrowH} w-3 h-3 bg-[var(--card)] border-[var(--border)]`}
          />

          <span className="block text-sm font-black text-[var(--text)]">{entry.title}</span>
          {entry.subtitle && (
            <span className="block text-[11px] text-[var(--accent)] font-semibold mt-0.5 mb-2">{entry.subtitle}</span>
          )}
          {!entry.subtitle && <span className="block mt-1.5" />}
          <span className="block text-xs text-[var(--muted)] leading-relaxed">{entry.desc}</span>
        </span>
      )}
    </span>
  )
}
