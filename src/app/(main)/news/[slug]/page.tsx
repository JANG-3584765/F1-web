import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { decodeNewsSlug } from '@/lib/newsSlug'
import NewsDetailClient from './NewsDetailClient'

interface ArticleRow {
  article_url: string
  title_kr:    string
  summary_kr:  string
  image_url:   string | null
  source:      string
  pub_date:    string
}

const SOURCE_BG: Record<string, string> = {
  'Autosport':  'linear-gradient(135deg, #7f1d1d, #b91c1c)',
  'Motorsport': 'linear-gradient(135deg, #1e3a5f, #2563eb)',
  'BBC Sport':  'linear-gradient(135deg, #7f1d1d, #374151)',
  'RaceFans':   'linear-gradient(135deg, #14532d, #16a34a)',
  'The Race':   'linear-gradient(135deg, #111827, #374151)',
  'Crash.net':  'linear-gradient(135deg, #7c2d12, #ea580c)',
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params
  const articleUrl = decodeNewsSlug(slug)

  const { data } = await supabase
    .from('news_translations')
    .select('article_url, title_kr, summary_kr, image_url, source, pub_date')
    .eq('article_url', articleUrl)
    .maybeSingle()

  if (!data) notFound()
  const article = data as ArticleRow

  return (
    <main className="px-4 py-6">
      <div className="max-w-[720px] mx-auto flex flex-col gap-5">

        {/* 뒤로 가기 */}
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
        >
          ← 뉴스 목록
        </Link>

        {/* 썸네일 */}
        {article.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.image_url}
            alt=""
            className="w-full rounded-xl aspect-video object-cover"
          />
        ) : (
          <div
            className="w-full rounded-xl aspect-video flex items-center justify-center"
            style={{ background: SOURCE_BG[article.source] ?? 'linear-gradient(135deg, #1a1a1a, #333)' }}
          >
            <span className="text-white/50 text-sm font-semibold tracking-wide uppercase">{article.source}</span>
          </div>
        )}

        <div className="bg-[var(--card)] rounded-xl shadow-sm px-6 py-6 flex flex-col gap-5">
          {/* 소스 + 날짜 */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-[var(--accent)]">{article.source}</span>
            <span className="text-[var(--muted)]">·</span>
            <span className="text-[var(--muted)]">{formatDate(article.pub_date)}</span>
          </div>

          {/* 한국어 제목 */}
          <h1 className="text-xl font-bold text-[var(--text)] leading-snug">
            {article.title_kr}
          </h1>

          {/* 한국어 요약 */}
          {article.summary_kr && (
            <p className="text-sm text-[var(--muted)] leading-relaxed border-l-2 border-[var(--border)] pl-4">
              {article.summary_kr}
            </p>
          )}

          <hr className="border-[var(--border)]" />

          {/* 이모지 반응 */}
          <NewsDetailClient newsId={articleUrl} />

          <hr className="border-[var(--border)]" />

          {/* 원문 보기 */}
          <a
            href={articleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[var(--accent)] border border-[var(--accent)] rounded-lg px-4 py-2.5 hover:bg-[var(--accent)] hover:text-white transition-colors"
          >
            원문 보기 ({article.source}) →
          </a>
        </div>

      </div>
    </main>
  )
}
