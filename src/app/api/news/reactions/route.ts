import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin'

// GET /api/news/reactions?newsIds=id1,id2,...
// 여러 뉴스 아이템의 반응 수를 한번에 반환
export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get('newsIds')
  if (!ids) return NextResponse.json({})

  const newsIds = ids.split(',').filter(Boolean)

  const { data, error } = await supabase
    .from('news_reactions')
    .select('article_id, reaction')
    .in('article_id', newsIds)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // { [newsId]: { [emoji]: count } } 형태로 집계
  const counts: Record<string, Record<string, number>> = {}
  for (const row of (data ?? [])) {
    if (!counts[row.article_id]) counts[row.article_id] = {}
    counts[row.article_id][row.reaction] = (counts[row.article_id][row.reaction] ?? 0) + 1
  }

  return NextResponse.json(counts)
}
