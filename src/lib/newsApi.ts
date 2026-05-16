export interface NewsItem {
  id: string       // guid or link (unique key)
  title: string
  summary: string
  link: string
  pubDate: string  // ISO string
  source: string   // e.g. "Autosport"
}

interface RssItem {
  title?: string
  description?: string
  link?: string
  guid?: string | { _: string }
  pubDate?: string
}

interface ParsedChannel {
  item?: RssItem | RssItem[]
}

interface ParsedRss {
  rss?: { channel?: ParsedChannel | ParsedChannel[] }
  feed?: { entry?: RssItem | RssItem[] }
}

const RSS_SOURCES: { url: string; name: string }[] = [
  { url: 'https://www.autosport.com/rss/f1/news/', name: 'Autosport' },
  { url: 'https://www.motorsport.com/rss/f1/news/',  name: 'Motorsport' },
  { url: 'https://feeds.bbci.co.uk/sport/formula1/rss.xml', name: 'BBC Sport' },
]

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim()
}

function parseItems(parsed: ParsedRss, sourceName: string): NewsItem[] {
  const items: RssItem[] = []

  const channel = parsed.rss?.channel
  if (channel) {
    const ch = Array.isArray(channel) ? channel[0] : channel
    const raw = ch.item ?? []
    const arr = Array.isArray(raw) ? raw : [raw]
    items.push(...arr)
  }

  const entries = parsed.feed?.entry
  if (entries) {
    const arr = Array.isArray(entries) ? entries : [entries]
    items.push(...arr)
  }

  return items.map(item => {
    const guid = typeof item.guid === 'object' ? item.guid._ : item.guid
    const link = item.link ?? guid ?? ''
    return {
      id:      link,
      title:   stripHtml(item.title ?? ''),
      summary: stripHtml(item.description ?? '').slice(0, 200),
      link,
      pubDate: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      source:  sourceName,
    }
  }).filter(n => n.title && n.link)
}

async function fetchRss(url: string, name: string): Promise<NewsItem[]> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 1800 },
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; F1WebBot/1.0)' },
    })
    if (!res.ok) return []
    const xml = await res.text()

    // Dynamic import only runs on server (Node.js)
    const { parseStringPromise } = await import('xml2js')
    const parsed: ParsedRss = await parseStringPromise(xml, { explicitArray: false, ignoreAttrs: false })
    return parseItems(parsed, name)
  } catch {
    return []
  }
}

export async function fetchF1News(): Promise<NewsItem[]> {
  const results = await Promise.allSettled(
    RSS_SOURCES.map(s => fetchRss(s.url, s.name))
  )

  const all: NewsItem[] = []
  for (const r of results) {
    if (r.status === 'fulfilled') all.push(...r.value)
  }

  // 중복 제거 (같은 링크), 최신순 정렬
  const seen = new Set<string>()
  return all
    .filter(n => { if (seen.has(n.id)) return false; seen.add(n.id); return true })
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, 50)
}
