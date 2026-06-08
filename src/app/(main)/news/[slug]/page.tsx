import Link from 'next/link'
import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin'
import { decodeNewsSlug } from '@/lib/newsSlug'
import NewsDetailClient from './NewsDetailClient'

interface ArticleRow {
  article_url:  string
  title_en:     string | null
  summary_en:   string | null
  title_kr:     string | null
  summary_kr:   string | null
  content_kr:   string | null
  image_url:    string | null
  source:       string
  pub_date:     string
  is_published: boolean
}

const SOURCE_BG: Record<string, string> = {
  'Autosport':  'linear-gradient(135deg, #7f1d1d, #b91c1c)',
  'Motorsport': 'linear-gradient(135deg, #1e3a5f, #2563eb)',
  'BBC Sport':  'linear-gradient(135deg, #7f1d1d, #374151)',
  'RaceFans':   'linear-gradient(135deg, #14532d, #16a34a)',
  'The Race':   'linear-gradient(135deg, #111827, #374151)',
  'Crash.net':  'linear-gradient(135deg, #7c2d12, #ea580c)',
  'MSWeek':     'linear-gradient(135deg, #1f2937, #6366f1)',
  'GPFans':     'linear-gradient(135deg, #78350f, #d97706)',
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function NewsDetailPage({ params }: Props) {
  const [{ slug }, session] = await Promise.all([params, auth()])
  const articleUrl = decodeNewsSlug(slug)
  const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL

  const { data, error } = await supabase
    .from('news_translations')
    .select('article_url, title_en, summary_en, title_kr, summary_kr, content_kr, image_url, source, pub_date, is_published')
    .eq('article_url', articleUrl)
    .maybeSingle()

  let article: ArticleRow
  if (data) {
    article = data as ArticleRow
  } else if (error) {
    const { data: fallback } = await supabase
      .from('news_translations')
      .select('article_url, title_en, summary_en, title_kr, summary_kr, image_url, source, pub_date, is_published')
      .eq('article_url', articleUrl)
      .maybeSingle()
    if (!fallback) notFound()
    article = { ...(fallback as Omit<ArticleRow, 'content_kr'>), content_kr: null }
  } else {
    notFound()
  }

  if (!isAdmin && !article.is_published) notFound()

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
            className="w-full rounded-xl aspect-[3/1] object-cover object-top"
          />
        ) : (
          <div
            className="w-full rounded-xl aspect-[3/1] flex items-center justify-center"
            style={{ background: SOURCE_BG[article.source] ?? 'linear-gradient(135deg, #1a1a1a, #333)' }}
          >
            <span className="text-white/50 text-sm font-semibold tracking-wide uppercase">{article.source}</span>
          </div>
        )}

        <NewsDetailClient
          articleUrl={articleUrl}
          isAdmin={isAdmin}
          isPublished={article.is_published}
          titleEn={article.title_en}
          summaryEn={article.summary_en}
          titleKr={article.title_kr}
          summaryKr={article.summary_kr}
          contentKr={article.content_kr}
          source={article.source}
          pubDate={article.pub_date}
        />

      </div>
    </main>
  )
}
