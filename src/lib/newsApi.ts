import { supabaseAdmin } from './supabaseAdmin'

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
  isPublished: boolean
}

interface MediaContent {
  $?: { url?: string }
}

interface RssItem {
  title?: string
  description?: string
  'content:encoded'?: string
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
  article_url:  string
  title_kr:     string | null
  summary_kr:   string | null
  image_url?:   string | null
  is_published: boolean
}

const RSS_SOURCES = [
  { url: 'https://www.autosport.com/rss/f1/news/',          name: 'Autosport'  },
  { url: 'https://www.motorsport.com/rss/f1/news/',         name: 'Motorsport' },
  { url: 'https://feeds.bbci.co.uk/sport/formula1/rss.xml', name: 'BBC Sport'  },
  { url: 'https://www.racefans.net/feed/',                  name: 'RaceFans'   },
  { url: 'https://the-race.com/feed/',                      name: 'The Race'   },
  { url: 'https://www.crash.net/rss/f1',                    name: 'Crash.net'  },
  { url: 'https://www.motorsportweek.com/feed/',             name: 'MSWeek'     },
  { url: 'https://www.gpfans.com/en/rss.xml',               name: 'GPFans'     },
]

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .trim()
}

const IMG_RE = /<img[^>]+src=["']([^"']+)["']/

function upgradeImageUrl(url: string, sourceName: string): string {
  // BBC Sport: /240/ → /976/
  if (sourceName === 'BBC Sport')
    return url.replace(/(ichef\.bbci\.co\.uk\/(?:onesport\/cps|ace\/standard))\/\d+\//, '$1/976/')
  return url
}

function extractImage(item: RssItem): string | undefined {
  const media = item['media:content'] ?? item['media:thumbnail']
  if (media) {
    const m = Array.isArray(media) ? media[0] : media
    if (m.$?.url) return m.$?.url
  }
  const enc = item.enclosure
  if (enc?.$?.url && enc.$?.type?.startsWith('image')) return enc.$?.url
  const desc    = typeof item.description       === 'string' ? item.description       : ''
  const content = typeof item['content:encoded'] === 'string' ? item['content:encoded'] : ''
  const html    = desc || content
  // srcset에서 1024w URL 우선 추출 (저해상도 src보다 선명)
  const srcsetAttr = html.match(/srcset=["']([^"']+)["']/)
  if (srcsetAttr) {
    const m = srcsetAttr[1].match(/([^\s,]+)\s+1024w/)
    if (m) return m[1]
  }
  return html.match(IMG_RE)?.[1]
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
      summaryEn: stripHtml(item.description ?? '').slice(0, 500),
      link,
      pubDate:   item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      source:    sourceName,
      image:     (() => {
        const img = extractImage(item)
        return img ? upgradeImageUrl(img, sourceName) : img
      })(),
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

  // 2. 중복 제거, 최신순, 최대 100개
  const seen = new Set<string>()
  const raw = rawAll
    .filter(n => { if (seen.has(n.id)) return false; seen.add(n.id); return true })
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, 100)

  if (raw.length === 0) return []

  // 3. Supabase에서 기존 기록 조회
  const { data: cached } = await supabaseAdmin
    .from('news_translations')
    .select('article_url, title_kr, summary_kr, image_url, is_published')
    .in('article_url', raw.map(n => n.link))

  const rowMap = new Map<string, CachedRow>(
    (cached ?? []).map(r => [r.article_url, r as CachedRow])
  )

  // 3-1. RaceFans: RSS에 이미지 없으므로 WordPress REST API로 수집
  const raceFansNeedImage = raw.filter(n =>
    n.source === 'RaceFans' && !n.image && !rowMap.get(n.link)?.image_url
  )
  if (raceFansNeedImage.length > 0) {
    type WpFmSize = { source_url?: string }
    type WpFm = { source_url?: string; media_details?: { sizes?: Record<string, WpFmSize> } }
    await Promise.allSettled(raceFansNeedImage.map(async n => {
      const slug = n.link.replace(/\/$/, '').split('/').pop()
      if (!slug) return
      try {
        const res = await fetch(
          `https://www.racefans.net/wp-json/wp/v2/posts?slug=${slug}&_embed`,
          { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; F1WebBot/1.0)' } }
        )
        if (!res.ok) return
        const data = await res.json() as Array<{ _embedded?: { 'wp:featuredmedia'?: WpFm[] } }>
        const fm = data[0]?._embedded?.['wp:featuredmedia']?.[0]
        const sizes = fm?.media_details?.sizes
        const img = sizes?.['post-thumbnail']?.source_url ?? sizes?.large?.source_url ?? fm?.source_url
        if (img) n.image = img
      } catch { /* ignore */ }
    }))
  }

  // 4. 새 기사만 삽입 (기존 번역 덮어쓰지 않음)
  const newArticles = raw.filter(n => !rowMap.has(n.link))
  if (newArticles.length > 0) {
    await supabaseAdmin
      .from('news_translations')
      .upsert(
        newArticles.map(n => ({
          article_url:  n.link,
          title_en:     n.titleEn,
          summary_en:   n.summaryEn,
          title_kr:     null,
          summary_kr:   null,
          image_url:    n.image ?? null,
          source:       n.source,
          pub_date:     n.pubDate,
          is_published: true,
        })),
        { onConflict: 'article_url', ignoreDuplicates: true },
      )
  }

  // 4-1. 기존 기사 중 image_url이 null이었는데 RSS에 이미지가 생긴 경우 업데이트
  const imagePatchArticles = raw.filter(n => {
    const row = rowMap.get(n.link)
    return row && !row.image_url && n.image
  })
  if (imagePatchArticles.length > 0) {
    await Promise.allSettled(
      imagePatchArticles.map(n =>
        supabaseAdmin.from('news_translations')
          .update({ image_url: n.image })
          .eq('article_url', n.link)
          .is('image_url', null)
      )
    )
  }

  // 4-2. 기존 저해상도 이미지 URL을 고해상도로 업그레이드
  const imageUpgradeArticles = raw.filter(n => {
    const stored = rowMap.get(n.link)?.image_url
    return stored && n.image && stored !== n.image
  })
  if (imageUpgradeArticles.length > 0) {
    await Promise.allSettled(
      imageUpgradeArticles.map(n =>
        supabaseAdmin.from('news_translations')
          .update({ image_url: n.image })
          .eq('article_url', n.link)
      )
    )
  }

  // 4-3. 미승인 기사 중 7일 이상 된 것 자동 삭제
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  await supabaseAdmin
    .from('news_translations')
    .delete()
    .eq('is_published', false)
    .lt('pub_date', sevenDaysAgo)

  // 5. 최종 반환 (한국어 번역 있으면 사용, 없으면 영어 원문)
  return raw.map(n => {
    const row = rowMap.get(n.link)
    return {
      id:          n.id,
      title:       row?.title_kr   ?? n.titleEn,
      titleEn:     n.titleEn,
      summary:     row?.summary_kr ?? n.summaryEn,
      summaryEn:   n.summaryEn,
      link:        n.link,
      pubDate:     n.pubDate,
      source:      n.source,
      image:       row?.image_url  ?? n.image,
      isPublished: row?.is_published ?? false,
    }
  })
}
