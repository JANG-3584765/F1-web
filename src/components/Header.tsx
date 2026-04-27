'use client'

import Link from 'next/link'
import { useState } from 'react'

const navItems = [
  { href: '/news',       label: '뉴스' },
  { href: '/highlights', label: '하이라이트' },
  { href: '/schedules',  label: '경기 일정' },
  { href: '/results',    label: '결과' },
  { href: '/standings',  label: '순위' },
  { href: '/prediction', label: '팬 투표' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* 상단 헤더 */}
      <header className="w-full bg-[var(--card)] border-b border-[var(--border)] sticky top-0 z-[9000] backdrop-blur-sm grid grid-cols-[1fr_auto_1fr] items-center py-3">

        {/* 왼쪽: 로그인 */}
        <div className="flex items-center pl-5">
          <Link
            href="/login"
            className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-3 py-2 rounded-md text-[18px] text-[var(--text)] no-underline hover:bg-black/5 transition-colors"
          >
            로그인
          </Link>
        </div>

        {/* 가운데: 로고 */}
        <div className="flex justify-center items-center">
          <Link href="/">
            <img src="/images/common/logo.png" alt="WhatisF1 로고" className="h-[70px] object-contain" />
          </Link>
        </div>

        {/* 오른쪽: 다크모드 + 햄버거 */}
        <div className="flex justify-end items-center pr-5 relative z-[9001]">
          <button
            className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-3 py-2 rounded-md text-[18px] bg-transparent border-none cursor-pointer hover:bg-black/5 transition-colors"
            aria-label="다크 모드로 전환"
          >
            🌙
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
        className={`fixed top-0 h-screen w-[260px] bg-[var(--card)] shadow-[-2px_0_8px_rgba(0,0,0,0.15)] transition-[right] duration-300 pt-20 z-[9999] ${
          menuOpen ? 'right-0' : 'right-[-260px]'
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
                className="block py-[18px] px-6 text-base text-[var(--text)] no-underline hover:bg-black/5 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* 오버레이 (메뉴 열릴 때 배경 클릭 시 닫기) */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[9998]"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  )
}
