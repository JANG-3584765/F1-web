import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full bg-[var(--card)] border-t border-[var(--border)] py-5 text-[var(--text)]">
      <div className="max-w-[960px] mx-auto px-5 flex flex-col gap-3">

        {/* 1행: 브랜드 + 인스타 + 이메일 / 정책 링크 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <div className="flex items-center justify-center sm:justify-start gap-2.5">
            <span className="text-base font-bold">WhatisF1</span>
            <a
              href="https://www.instagram.com/what_is_f1__?igsh=MnlzdDAydWVuaW0w"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatisF1 Instagram"
            >
              <img
                src="/images/common/instagram_logo.png"
                alt="인스타그램"
                className="w-8 h-8 object-contain hover:opacity-70 transition-opacity"
              />
            </a>
            <span className="text-xs text-[var(--muted)]">whatisf1@gmail.com</span>
          </div>

          <div className="flex gap-2 text-xs flex-wrap justify-center sm:justify-end">
            <Link href="/policy/terms"   className="text-[var(--muted)] hover:underline">이용약관</Link>
            <span className="text-[var(--border)]">|</span>
            <Link href="/policy/privacy" className="text-[var(--muted)] hover:underline">개인정보처리방침</Link>
            <span className="text-[var(--border)]">|</span>
            <Link href="/policy/policy"  className="text-[var(--muted)] hover:underline">운영정책</Link>
          </div>
        </div>

        {/* 2행: 고지문 + copyright */}
        <div className="border-t border-[var(--border)] pt-3 text-center">
          <p className="text-xs leading-relaxed text-[var(--muted)] mb-1">
            본 사이트는 Formula 1® 및 Formula One Management와 공식적으로 제휴되지 않은
            비공식 정보 제공 사이트입니다. 모든 팀, 드라이버, 경기 데이터 및 이미지의 권리는 각 권리자에게 있습니다.
          </p>
          <p className="text-xs text-[var(--muted)]">© 2026 WhatisF1. All rights reserved.</p>
        </div>

      </div>
    </footer>
  )
}
