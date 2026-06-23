export default function ResultsLoading() {
  return (
    <main className="min-h-screen bg-[var(--bg-2)] px-4 py-6">
      <div className="mx-auto max-w-[980px] flex flex-col gap-6">
        <div className="bg-[var(--card)] rounded-xl shadow-sm p-4 flex flex-col gap-3">
          <div className="h-5 w-32 animate-pulse rounded bg-[var(--border)]" />
          <div className="flex gap-2">
            <div className="h-9 w-24 animate-pulse rounded-lg bg-[var(--border)]" />
            <div className="h-9 w-36 animate-pulse rounded-lg bg-[var(--border)]" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          <div className="flex flex-col gap-4">
            <div className="bg-[var(--card)] rounded-xl shadow-sm overflow-hidden">
              <div className="w-full aspect-[16/9] animate-pulse bg-[var(--border)]" />
              <div className="p-5 flex flex-col gap-3">
                <div className="h-6 w-48 animate-pulse rounded bg-[var(--border)]" />
                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-14 animate-pulse rounded-lg bg-[var(--border)]" />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[var(--card)] rounded-xl shadow-sm p-4">
              <div className="h-4 w-24 animate-pulse rounded bg-[var(--border)] mb-3" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse border-t border-[var(--border)] bg-[var(--card)]" style={{ opacity: 1 - i * 0.2 }} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="h-[300px] animate-pulse rounded-xl bg-[var(--card)] shadow-sm" />
          </div>
        </div>
      </div>
    </main>
  )
}
