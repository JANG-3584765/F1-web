'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'

const navItems = [
  { href: '/news',       label: '뉴스' },
  { href: '/highlights', label: '하이라이트' },
  { href: '/schedules',  label: '경기 일정' },
  { href: '/results',    label: '결과' },
  { href: '/standings',  label: '순위' },
  { href: '/prediction', label: '팬 투표' },
  { href: '/feedback',   label: '피드백' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const { data: session, status } = useSession()

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = saved ? saved === 'dark' : prefersDark
    setDark(isDark)
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  function toggleDark() {
    const next = !dark
    setDark(next)
    if (next) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <>
      {/* 상단 헤더 */}
      <header className="w-full bg-[var(--card)] border-b border-[var(--border)] sticky top-0 z-[9000] backdrop-blur-sm grid grid-cols-[1fr_auto_1fr] items-center py-1 relative">

        {/* 왼쪽: 로그인 상태 */}
        <div className="flex items-center pl-5">
          {status === 'loading' ? (
            <div className="w-9 h-9 rounded-full bg-[var(--border)] animate-pulse" />
          ) : session ? (
            <div className="flex items-center gap-2">
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt="프로필"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-[var(--border)]"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-sm font-bold ring-2 ring-[var(--border)]">
                  {session.user?.name?.slice(0, 1) ?? session.user?.email?.slice(0, 1)?.toUpperCase() ?? '?'}
                </div>
              )}
              <span className="text-sm text-[var(--text)] hidden sm:block truncate max-w-[80px]">
                {session.user?.name?.split(' ')[0]}
              </span>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center min-w-[44px] min-h-[44px]"
              aria-label="로그인"
            >
              <div className="w-9 h-9 rounded-full bg-[var(--border)] flex items-center justify-center hover:opacity-70 transition-opacity">
                <svg className="w-5 h-5 text-[var(--muted)]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </Link>
          )}
        </div>

        {/* 가운데: 로고 — absolute로 헤더 높이에 영향 없이 크게 표시 */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center z-[9002] pointer-events-none">
          <Link href="/" className="pointer-events-auto">
            <img src="/images/common/logo.png" alt="WhatisF1 로고" className="h-[120px] max-[480px]:h-[84px] object-contain" />
          </Link>
        </div>
        {/* 그리드 중간 컬럼 자리 유지용 */}
        <div aria-hidden="true" />

        {/* 오른쪽: 다크모드 + 햄버거 */}
        <div className="flex justify-end items-center pr-5 relative z-[9001]">
          <button
            className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-3 py-2 rounded-md text-[18px] bg-transparent border-none cursor-pointer hover:bg-black/5 transition-colors"
            aria-label={dark ? '라이트 모드로 전환' : '다크 모드로 전환'}
            onClick={toggleDark}
          >
            {dark ? '☀️' : '🌙'}
          </button>
          <button
            className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-3 py-2 rounded-md text-[18px] bg-transparent border-none cursor-pointer text-[var(--text)] hover:bg-black/5 transition-colors"
            aria-label="메뉴 열기"
            aria-controls="sideMenu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>
        </div>
      </header>

      {/* 사이드 메뉴 */}
      <nav
        id="sideMenu"
        className={`fixed top-0 right-0 h-screen w-[260px] max-[480px]:w-[220px] bg-[var(--card)] shadow-[-2px_0_8px_rgba(0,0,0,0.15)] transition-transform duration-300 pt-20 z-[9999] ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          className="absolute top-5 right-5 bg-transparent border-none cursor-pointer text-[32px] leading-none p-2 text-[var(--text)] hover:bg-black/5 hover:rounded-md transition-colors"
          aria-label="메뉴 닫기"
          onClick={() => setMenuOpen(false)}
        >
          &times;
        </button>
        <ul className="list-none m-0 p-0">
          {navItems.map((item) => (
            <li key={item.href} className="border-b border-[var(--border)]">
              <Link
                href={item.href}
                className="side-menu-link block py-[18px] px-6 text-base text-[var(--text)] no-underline transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {session && (
          <div className="px-6 pt-4">
            <button
              className="w-full py-3 rounded-lg text-sm font-medium text-[var(--muted)] border border-[var(--border)] bg-transparent cursor-pointer hover:bg-black/5 transition-colors"
              onClick={() => { signOut({ callbackUrl: '/' }); setMenuOpen(false) }}
            >
              로그아웃
            </button>
          </div>
        )}
      </nav>

      {/* 오버레이 (메뉴 열릴 때 배경 클릭 시 닫기) */}
      {menuOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-[9998]"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  )
}
