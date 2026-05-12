export type VideoSource = 'official' | 'coupang' | 'influencer'
export type VideoType = 'f1' | 'f2' | 'f3' | 'esports' | 'other'

export interface FetchedVideo {
  id: string
  title: string
  publishedAt: string
  thumbnailUrl: string
  videoUrl: string
  channelTitle: string
  source: VideoSource
  season: number
  type: VideoType
  isShort: boolean
}

export interface ChannelConfig {
  /** 특정 플레이리스트를 직접 지정 (우선순위 높음) */
  playlistId?: string
  /** 채널 전체 업로드를 가져올 때 사용 */
  channelId?: string
  source: VideoSource
  /** 생략 시 publishedAt 연도로 자동 추출 */
  season?: number
  /** 생략 시 'other' */
  type?: VideoType
  /** 채널별 최대 영상 수 오버라이드 */
  maxVideos?: number
  /** 제목 키워드로 F2/F3 자동 감지 (혼합 플레이리스트용) */
  inferType?: boolean
  /** 제목에서 연도(20XX) 추출하여 시즌 자동 감지 (재중계 영상 분리용) */
  inferSeason?: boolean
}

const YT_API = 'https://www.googleapis.com/youtube/v3'

function inferVideoType(title: string, fallback: VideoType): VideoType {
  if (/\bF2\b|Formula\s*2|포뮬러\s*2/i.test(title)) return 'f2'
  if (/\bF3\b|Formula\s*3|포뮬러\s*3/i.test(title)) return 'f3'
  return fallback
}

const UNAVAILABLE_TITLES = new Set(['private video', '[private video]', '[deleted video]', 'deleted video'])
function isUnavailableTitle(title: string) {
  return UNAVAILABLE_TITLES.has(title.toLowerCase())
}

function inferSeasonFromTitle(title: string, fallback: number): number {
  const match = title.match(/\b(20\d{2})\b/)
  if (match) {
    const year = parseInt(match[1])
    if (year >= 2010 && year <= 2035) return year
  }
  return fallback
}

function parseDurationSeconds(iso: string): number {
  const h = parseInt(iso.match(/(\d+)H/)?.[1] ?? '0')
  const m = parseInt(iso.match(/(\d+)M/)?.[1] ?? '0')
  const s = parseInt(iso.match(/(\d+)S/)?.[1] ?? '0')
  return h * 3600 + m * 60 + s
}

async function batchFetchIsShort(videoIds: string[], key: string): Promise<Map<string, boolean>> {
  const result = new Map<string, boolean>()
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50)
    const url = `${YT_API}/videos?part=contentDetails&id=${batch.join(',')}&key=${key}`
    const res = await fetch(url, { next: { revalidate: 86400 } })
    if (!res.ok) continue
    const data = await res.json()
    for (const item of (data.items ?? [])) {
      const duration: string = item.contentDetails?.duration ?? ''
      result.set(item.id as string, parseDurationSeconds(duration) <= 60)
    }
  }
  return result
}

// ─── B안: 제목 한국어 자동 번역 (보류) ───────────────────────────────────────
// 활성화 방법:
//   1. Google Cloud Console → Cloud Translation API 사용 설정
//   2. .env.local 에 GOOGLE_TRANSLATE_API_KEY=발급받은키 추가
//   3. 아래 함수 주석 해제
//   4. 아래 toVideo 내 title 줄을 주석 처리된 버전으로 교체
//
// async function translateToKorean(text: string): Promise<string> {
//   const key = process.env.GOOGLE_TRANSLATE_API_KEY
//   if (!key) return text
//   const res = await fetch(
//     `https://translation.googleapis.com/language/translate/v2?key=${key}`,
//     {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ q: text, target: 'ko', source: 'en' }),
//       next: { revalidate: 86400 },
//     }
//   )
//   if (!res.ok) return text
//   const data = await res.json()
//   return data.data?.translations?.[0]?.translatedText ?? text
// }
// ─────────────────────────────────────────────────────────────────────────────

async function resolvePlaylistId(config: ChannelConfig, key: string): Promise<string | null> {
  if (config.playlistId) return config.playlistId

  if (config.channelId) {
    const res = await fetch(
      `${YT_API}/channels?part=contentDetails&id=${config.channelId}&key=${key}`,
      { next: { revalidate: 86400 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ?? null
  }

  return null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toVideo(item: any, config: ChannelConfig): FetchedVideo {
  const s = item.snippet
  const videoId: string = s.resourceId.videoId
  const publishedAt: string = s.publishedAt
  return {
    id: videoId,
    title: s.title as string,          // B안 활성화 시: await translateToKorean(s.title as string)
    publishedAt,
    thumbnailUrl: (s.thumbnails?.high?.url ?? s.thumbnails?.default?.url ?? '') as string,
    videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
    channelTitle: s.channelTitle as string,
    source: config.source,
    season: config.season
      ?? (config.inferSeason
        ? inferSeasonFromTitle(s.title as string, new Date(publishedAt).getFullYear())
        : new Date(publishedAt).getFullYear()),
    type: config.inferType
      ? inferVideoType(s.title as string, config.type ?? 'other')
      : (config.type ?? 'other'),
    isShort: false,
  }
}

async function getPlaylistVideos(config: ChannelConfig, limit: number): Promise<FetchedVideo[]> {
  const key = process.env.YOUTUBE_API_KEY
  if (!key) return []

  const playlistId = await resolvePlaylistId(config, key)
  if (!playlistId) return []

  const videos: FetchedVideo[] = []
  let pageToken: string | undefined

  while (videos.length < limit) {
    const perPage = Math.min(50, limit - videos.length)
    const url = new URL(`${YT_API}/playlistItems`)
    url.searchParams.set('part', 'snippet')
    url.searchParams.set('playlistId', playlistId)
    url.searchParams.set('maxResults', String(perPage))
    url.searchParams.set('key', key)
    if (pageToken) url.searchParams.set('pageToken', pageToken)

    const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
    if (!res.ok) break

    const data = await res.json()
    for (const item of data.items ?? []) {
      const title: string = item.snippet?.title ?? ''
      const videoId: string = item.snippet?.resourceId?.videoId ?? ''
      if (!videoId || isUnavailableTitle(title)) continue
      videos.push(toVideo(item, config))
    }

    pageToken = data.nextPageToken
    if (!pageToken) break
  }

  return videos
}

export async function getAllHighlightVideos(
  channels: ChannelConfig[],
  maxPerChannel = 50
): Promise<FetchedVideo[]> {
  const results = await Promise.allSettled(
    channels.map(ch => getPlaylistVideos(ch, ch.maxVideos ?? maxPerChannel))
  )

  const seen = new Set<string>()
  const deduplicated = results
    .filter((r): r is PromiseFulfilledResult<FetchedVideo[]> => r.status === 'fulfilled')
    .flatMap(r => r.value)
    .filter(v => {
      if (seen.has(v.id)) return false
      seen.add(v.id)
      return true
    })

  const key = process.env.YOUTUBE_API_KEY
  if (key) {
    const nonOfficial = deduplicated.filter(v => v.source !== 'official')
    if (nonOfficial.length > 0) {
      const isShortMap = await batchFetchIsShort(nonOfficial.map(v => v.id), key)
      return deduplicated
        .map(v => ({ ...v, isShort: isShortMap.get(v.id) ?? false }))
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    }
  }

  return deduplicated.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}
