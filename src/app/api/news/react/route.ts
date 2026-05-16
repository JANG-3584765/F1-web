import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

const ALLOWED_EMOJIS = ['🔥', '😮', '😂', '👏', '😢']

// POST /api/news/react
// body: { newsId: string, emoji: string, sessionId: string }
// sessionId: 클라이언트가 localStorage에 저장한 익명 ID (로그인 불필요)
export async function POST(req: NextRequest) {
  const body = await req.json() as { newsId?: string; emoji?: string; sessionId?: string }
  const { newsId, emoji, sessionId } = body

  if (!newsId || !emoji || !sessionId) {
    return NextResponse.json({ error: '필수 파라미터 누락' }, { status: 400 })
  }
  if (!ALLOWED_EMOJIS.includes(emoji)) {
    return NextResponse.json({ error: '허용되지 않은 이모지' }, { status: 400 })
  }

  // 같은 sessionId + newsId + emoji면 토글(삭제), 아니면 삽입
  const { data: existing } = await supabase
    .from('news_reactions')
    .select('id')
    .eq('news_id', newsId)
    .eq('emoji', emoji)
    .eq('session_id', sessionId)
    .maybeSingle()

  if (existing) {
    await supabase.from('news_reactions').delete().eq('id', existing.id)
    return NextResponse.json({ action: 'removed' })
  }

  const { error } = await supabase.from('news_reactions').insert({
    news_id:    newsId,
    emoji,
    session_id: sessionId,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ action: 'added' })
}
