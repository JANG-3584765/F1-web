import { fetchF1News } from '@/lib/newsApi'
import NewsClient from './NewsClient'

export const revalidate = 1800 // 30분마다 재생성

export default async function NewsPage() {
  const news = await fetchF1News()
  return (
    <main className="px-4 py-6">
      <NewsClient news={news} />
    </main>
  )
}
