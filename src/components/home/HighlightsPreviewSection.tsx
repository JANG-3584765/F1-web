import Link from 'next/link'
import type { FetchedVideo } from '@/lib/youtubeApi'

interface Props {
  videos: FetchedVideo[]
}

export default function HighlightsPreviewSection({ videos }: Props) {
  if (videos.length === 0) return null

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-black text-[var(--text)]">최신 하이라이트</h2>
        <Link href="/highlights" className="text-xs font-semibold text-[var(--accent)] hover:underline">
          더보기 →
        </Link>
      </div>

      <div className="flex flex-col sm:grid sm:grid-cols-3 gap-3">
        {videos.map(video => (
          <a
            key={video.id}
            href={video.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[var(--card)] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-row sm:flex-col"
          >
            {video.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={video.thumbnailUrl}
                alt=""
                className="w-[72px] h-[72px] sm:w-full sm:h-auto sm:aspect-video object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-[72px] h-[72px] sm:w-full sm:aspect-video flex items-center justify-center flex-shrink-0 bg-[var(--border)]">
                <span className="text-[var(--muted)] text-[10px] font-bold">F1</span>
              </div>
            )}

            <div className="px-3 py-2.5 sm:px-4 sm:py-3 flex flex-col gap-1 sm:gap-1.5 flex-1 justify-center sm:justify-start">
              <span className="text-[10px] font-bold text-[var(--accent)]">{video.channelTitle}</span>
              <p className="text-sm font-semibold text-[var(--text)] leading-snug line-clamp-1 sm:line-clamp-2">
                {video.title}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
