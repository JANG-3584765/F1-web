import Link from 'next/link'

export default function FanVoteCTA() {
  return (
    <section className="bg-[var(--card)] rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
      <div className="flex flex-col gap-1 text-center sm:text-left">
        <h2 className="text-base font-black text-[var(--text)]">팬 투표</h2>
        <p className="text-sm text-[var(--muted)]">이번 GP 우승자를 예측해보세요!</p>
      </div>
      <Link
        href="/prediction"
        className="text-sm font-bold bg-[var(--accent)] text-white rounded-xl px-6 py-2.5 hover:opacity-90 transition-opacity whitespace-nowrap"
      >
        투표 하러 가기 →
      </Link>
    </section>
  )
}
