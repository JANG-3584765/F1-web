import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin'

const ALLOWED_EMOJIS = ['🔥', '😮', '😂', '👏', '😢']

export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
  }

  const userId = session.user.id
  if (!userId) {
    return NextResponse.json({ error: '사용자 ID를 확인할 수 없습니다' }, { status: 400 })
  }

  const body = await req.json() as { newsId?: string; emoji?: string }
  const { newsId, emoji } = body

  if (!newsId || !emoji) {
    return NextResponse.json({ error: '필수 파라미터 누락' }, { status: 400 })
  }
  if (!ALLOWED_EMOJIS.includes(emoji)) {
    return NextResponse.json({ error: '허용되지 않은 이모지' }, { status: 400 })
  }

  const { data: existing, error: selError } = await supabase
    .from('news_reactions')
    .select('id, reaction')
    .eq('article_id', newsId)
    .eq('user_id', userId)
    .maybeSingle()

  if (selError) {
    return NextResponse.json({ error: selError.message }, { status: 500 })
  }

  if (existing) {
    if (existing.reaction === emoji) {
      const { error: delError } = await supabase
        .from('news_reactions')
        .delete()
        .eq('article_id', newsId)
        .eq('user_id', userId)
      if (delError) {
        return NextResponse.json({ error: delError.message }, { status: 500 })
      }
      return NextResponse.json({ action: 'removed' })
    }
    const { error: upError } = await supabase
      .from('news_reactions')
      .update({ reaction: emoji })
      .eq('article_id', newsId)
      .eq('user_id', userId)
    if (upError) {
      return NextResponse.json({ error: upError.message }, { status: 500 })
    }
    return NextResponse.json({ action: 'added' })
  }

  const { error } = await supabase.from('news_reactions').insert({
    article_id: newsId,
    reaction:   emoji,
    user_id:    userId,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ action: 'added' })
}
