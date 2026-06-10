export default function StandingsLoading() {
  return (
    <main className="min-h-screen bg-[var(--bg-2)] px-4 py-10">
      <div className="mx-auto flex max-w-[980px] flex-col gap-4">
        <div className="h-7 w-64 animate-pulse rounded-lg bg-[var(--border)]" />

        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3">
          <div className="h-4 w-24 animate-pulse rounded bg-[var(--border)] mb-2" />
          <div className="flex gap-2">
            <div className="h-10 flex-1 animate-pulse rounded-md bg-[var(--bg-2)]" />
            <div className="h-10 w-16 animate-pulse rounded-md bg-[var(--bg-2)]" />
          </div>
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3">
          <div className="h-10 w-36 animate-pulse rounded-md bg-[var(--bg-2)]" />
        </div>

        <div className="flex gap-1 rounded-lg border border-[var(--border)] bg-[var(--bg-2)] p-1">
          <div className="h-9 flex-1 animate-pulse rounded-md bg-[var(--card)]" />
          <div className="h-9 flex-1 animate-pulse rounded-md" />
        </div>

        <div className="overflow-hidden rounded-lg border border-[var(--border)]">
          <div className="h-10 animate-pulse bg-[var(--bg-2)]" />
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-14 animate-pulse border-t border-[var(--border)] bg-[var(--card)]"
              style={{ opacity: 1 - i * 0.06 }}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
