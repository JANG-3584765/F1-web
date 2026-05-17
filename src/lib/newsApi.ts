import { supabase } from './supabaseClient'

export interface NewsItem {
  id: string
  title: string      // 한국어 (없으면 영어 원문)
  titleEn: string    // 영어 원문
  summary: string    // 한국어 (없으면 영어 원문)
  summaryEn: string  // 영어 원문
  link: string
  pubDate: string
  source: string
  image?: string
}

interface MediaContent {
  $?: { url?: string }
}

interface RssItem {
  title?: string
  description?: string
  link?: string
  guid?: string | { _: string; $?: Record<string, string> }
  pubDate?: string
  'media:content'?:   MediaContent | MediaContent[]
  'media:thumbnail'?: MediaContent | MediaContent[]
  enclosure?: { $?: { url?: string; type?: string } }
}

interface ParsedChannel {
  item?: RssItem | RssItem[]
}

interface ParsedRss {
  rss?: { channel?: ParsedChannel | ParsedChannel[] }
  feed?: { entry?: RssItem | RssItem[] }
}

interface RawNewsItem {
  id: string
  titleEn: string
  summaryEn: string
  link: string
  pubDate: string
  source: string
  image?: string
}

interface CachedRow {
  article_url: string
  title_kr:    string | null
  summary_kr:  string | null
  image_url?:  string | null
}

const RSS_SOURCES = [
  { url: 'https://www.autosport.com/rss/f1/news/',          name: 'Autosport'  },
  { url: 'https://www.motorsport.com/rss/f1/news/',         name: 'Motorsport' },
  { url: 'https://feeds.bbci.co.uk/sport/formula1/rss.xml', name: 'BBC Sport'  },
]

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .trim()
}

function extractImage(item: RssItem): string | undefined {
  const media = item['media:content'] ?? item['media:thumbnail']
  if (media) {
    const m = Array.isArray(media) ? media[0] : media
    if (m.$?.url) return m.$?.url
  }
  const enc = item.enclosure
  if (enc?.$?.url && enc.$?.type?.startsWith('image')) return enc.$?.url
  const desc = typeof item.description === 'string' ? item.description : ''
  return desc.match(/<img[^>]+src=["']([^"']+)["']/)?.[1]
}

function parseItems(parsed: ParsedRss, sourceName: string): RawNewsItem[] {
  const items: RssItem[] = []

  const channel = parsed.rss?.channel
  if (channel) {
    const ch  = Array.isArray(channel) ? channel[0] : channel
    const raw = ch.item ?? []
    items.push(...(Array.isArray(raw) ? raw : [raw]))
  }

  const entries = parsed.feed?.entry
  if (entries) {
    items.push(...(Array.isArray(entries) ? entries : [entries]))
  }

  return items.map(item => {
    const guid = typeof item.guid === 'object' ? item.guid._ : item.guid
    const link = item.link ?? guid ?? ''
    return {
      id:        link,
      titleEn:   stripHtml(item.title ?? ''),
      summaryEn: stripHtml(item.description ?? '').slice(0, 300),
      link,
      pubDate:   item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      source:    sourceName,
      image:     extractImage(item),
    }
  }).filter(n => n.titleEn && n.link)
}

async function fetchRss(url: string, name: string): Promise<RawNewsItem[]> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 1800 },
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; F1WebBot/1.0)' },
    })
    if (!res.ok) return []
    const xml = await res.text()
    const { parseStringPromise } = await import('xml2js')
    const parsed: ParsedRss = await parseStringPromise(xml, { explicitArray: false, ignoreAttrs: false })
    return parseItems(parsed, name)
  } catch {
    return []
  }
}

export async function fetchF1News(): Promise<NewsItem[]> {
  // 1. RSS 수집
  const results = await Promise.allSettled(RSS_SOURCES.map(s => fetchRss(s.url, s.name)))
  const rawAll: RawNewsItem[] = []
  for (const r of results) {
    if (r.status === 'fulfilled') rawAll.push(...r.value)
  }

  // 2. 중복 제거, 최신순, 최대 50개
  const seen = new Set<string>()
  const raw = rawAll
    .filter(n => { if (seen.has(n.id)) return false; seen.add(n.id); return true })
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, 50)

  if (raw.length === 0) return []

  // 3. Supabase에서 기존 기록 조회
  const { data: cached } = await supabase
    .from('news_translations')
    .select('article_url, title_kr, summary_kr, image_url')
    .in('article_url', raw.map(n => n.link))

  const rowMap = new Map<string, CachedRow>(
    (cached ?? []).map(r => [r.article_url, r as CachedRow])
  )

  // 4. 새 기사만 삽입 (기존 번역 덮어쓰지 않음)
  const newArticles = raw.filter(n => !rowMap.has(n.link))
  if (newArticles.length > 0) {
    await supabase
      .from('news_translations')
      .upsert(
        newArticles.map(n => ({
          article_url: n.link,
          title_kr:    null,
          summary_kr:  null,
          image_url:   n.image ?? null,
          source:      n.source,
          pub_date:    n.pubDate,
        })),
        { onConflict: 'article_url', ignoreDuplicates: true },
      )
  }

  // 5. 최종 반환 (한국어 번역 있으면 사용, 없으면 영어 원문)
  return raw.map(n => {
    const row = rowMap.get(n.link)
    return {
      id:        n.id,
      title:     row?.title_kr   ?? n.titleEn,
      titleEn:   n.titleEn,
      summary:   row?.summary_kr ?? n.summaryEn,
      summaryEn: n.summaryEn,
      link:      n.link,
      pubDate:   n.pubDate,
      source:    n.source,
      image:     row?.image_url  ?? n.image,
    }
  })
}
