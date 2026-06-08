import Link from 'next/link'

export default function BeginnerGuideCTA() {
  return (
    <section className="bg-[var(--card)] rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-[var(--border)]">
      <div className="flex flex-col gap-1 text-center sm:text-left">
        <h2 className="text-base font-black text-[var(--text)]">F1이 처음이신가요?</h2>
        <p className="text-sm text-[var(--muted)]">팀·드라이버·기본 규칙을 한눈에 파악하세요.</p>
      </div>
      <Link
        href="/guide"
        className="text-sm font-bold border border-[var(--border)] text-[var(--text)] rounded-xl px-6 py-2.5 hover:bg-[var(--bg-2)] transition-colors whitespace-nowrap"
      >
        입문 가이드 보기 →
      </Link>
    </section>
  )
}
