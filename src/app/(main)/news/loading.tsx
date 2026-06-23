export default function NewsLoading() {
  return (
    <main className="px-4 py-6">
      <div className="max-w-[720px] mx-auto flex flex-col gap-4">
        <div className="bg-[var(--card)] rounded-xl shadow-sm px-6 py-5 flex flex-col gap-3">
          <div className="h-6 w-24 animate-pulse rounded bg-[var(--border)]" />
          <div className="flex gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-7 w-16 animate-pulse rounded-full bg-[var(--border)]" />
            ))}
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 w-16 animate-pulse rounded-lg bg-[var(--border)]" />
            ))}
          </div>
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-[var(--card)] rounded-xl shadow-sm overflow-hidden">
            <div className="w-full aspect-[3/1] animate-pulse bg-[var(--border)]" />
            <div className="px-5 py-4 flex flex-col gap-2.5">
              <div className="flex gap-2">
                <div className="h-3 w-16 animate-pulse rounded bg-[var(--border)]" />
                <div className="h-3 w-12 animate-pulse rounded bg-[var(--border)]" />
              </div>
              <div className="h-4 w-full animate-pulse rounded bg-[var(--border)]" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--border)]" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-[var(--border)]" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
