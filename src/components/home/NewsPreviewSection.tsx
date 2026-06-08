import Link from 'next/link'
import { encodeNewsSlug } from '@/lib/newsSlug'

const SOURCE_COLOR: Record<string, string> = {
  'Autosport':  '#b91c1c',
  'Motorsport': '#2563eb',
  'BBC Sport':  '#374151',
  'RaceFans':   '#16a34a',
  'The Race':   '#374151',
  'Crash.net':  '#ea580c',
  'MSWeek':     '#6366f1',
  'GPFans':     '#d97706',
}

interface NewsRow {
  article_url: string
  title_kr:    string | null
  title_en:    string | null
  image_url:   string | null
  source:      string
  pub_date:    string
}

interface Props {
  news: NewsRow[]
}

function formatDate(iso: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    month:    'numeric',
    day:      'numeric',
  }).formatToParts(new Date(iso))
  const m = parts.find(p => p.type === 'month')?.value ?? ''
  const d = parts.find(p => p.type === 'day')?.value   ?? ''
  return `${m}. ${d}.`
}

export default function NewsPreviewSection({ news }: Props) {
  if (news.length === 0) return null

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-black text-[var(--text)]">최신 뉴스</h2>
        <Link href="/news" className="text-xs font-semibold text-[var(--accent)] hover:underline">
          더보기 →
        </Link>
      </div>

      <div className="flex flex-col sm:grid sm:grid-cols-3 gap-3">
        {news.map(item => {
          const title = item.title_kr ?? item.title_en ?? '제목 없음'
          const slug  = encodeNewsSlug(item.article_url)
          const color = SOURCE_COLOR[item.source] ?? '#374151'

          return (
            <Link
              key={item.article_url}
              href={`/news/${slug}`}
              className="bg-[var(--card)] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-row sm:flex-col"
            >
              {item.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image_url}
                  alt=""
                  className="w-[72px] h-[72px] sm:w-full sm:h-auto sm:aspect-video object-cover object-top flex-shrink-0"
                />
              ) : (
                <div
                  className="w-[72px] h-[72px] sm:w-full sm:aspect-video flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${color}88, ${color})` }}
                >
                  <span className="text-white/60 text-[10px] font-bold uppercase tracking-wide">
                    {item.source}
                  </span>
                </div>
              )}

              <div className="px-3 py-2.5 sm:px-4 sm:py-3 flex flex-col gap-1 sm:gap-1.5 flex-1 justify-center sm:justify-start">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold" style={{ color }}>{item.source}</span>
                  <span className="text-[var(--muted)] text-[10px]">· {formatDate(item.pub_date)}</span>
                </div>
                <p className="text-sm font-semibold text-[var(--text)] leading-snug line-clamp-1 sm:line-clamp-2">{title}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
