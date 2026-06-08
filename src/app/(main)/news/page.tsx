import { fetchF1News } from '@/lib/newsApi'
import { auth } from '@/auth'
import NewsClient from './NewsClient'

export const revalidate = 300

export default async function NewsPage() {
  const [news, session] = await Promise.all([fetchF1News(), auth()])
  const isAdmin = session?.user?.email === process.env.ADMIN_EMAIL
  return (
    <main className="px-4 py-6">
      <NewsClient news={news} isAdmin={isAdmin} />
    </main>
  )
}
