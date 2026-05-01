import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full bg-[var(--card)] border-t border-[var(--border)] pt-8 pb-6 text-[var(--text)]">

      {/* 상단 묶음: 브랜드 / SNS / 정책 */}
      <div className="max-w-[960px] mx-auto px-5 flex flex-col items-center gap-[18px] text-center">

        {/* 브랜드 */}
        <div className="flex flex-col gap-1.5">
          <h2 className="text-xl font-bold m-0">WhatisF1</h2>
          <p className="text-sm text-[var(--muted)] m-0">문의 : whatisf1@gmail.com</p>
        </div>

        {/* SNS */}
        <div className="flex flex-col items-center gap-1.5">
          <a
            href="https://www.instagram.com/what_is_f1__?igsh=MnlzdDAydWVuaW0w"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatisF1 Instagram"
            className="inline-flex justify-center items-center"
          >
            <img
              src="/images/common/instagram_logo.png"
              alt="인스타그램"
              className="w-11 h-11 object-contain hover:opacity-70 transition-opacity"
            />
          </a>
        </div>

        {/* 정책 링크 */}
        <div className="flex gap-2 text-[13px] flex-wrap justify-center">
          <Link href="/policy/terms"    className="text-[var(--muted)] no-underline hover:underline">이용약관</Link>
          <span className="text-[var(--border)]">|</span>
          <Link href="/policy/privacy"  className="text-[var(--muted)] no-underline hover:underline">개인정보처리방침</Link>
          <span className="text-[var(--border)]">|</span>
          <Link href="/policy/policy"   className="text-[var(--muted)] no-underline hover:underline">운영정책</Link>
        </div>

      </div>

      {/* 하단 고지 */}
      <div className="mt-[22px] px-5 text-center">
        <p className="text-xs leading-relaxed text-[var(--muted)] max-w-[960px] mx-auto mb-1.5">
          본 사이트는 Formula 1® 및 Formula One Management와 공식적으로 제휴되지 않은
          비공식 정보 제공 사이트입니다.<br />
          모든 팀, 드라이버, 경기 데이터 및 이미지의 권리는 각 권리자에게 있습니다.
        </p>
        <p className="text-xs text-[var(--muted)] m-0">© 2025 WhatisF1. All rights reserved.</p>
      </div>

    </footer>
  )
}
