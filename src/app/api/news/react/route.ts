import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { supabase } from '@/lib/supabaseClient'

const ALLOWED_EMOJIS = ['🔥', '😮', '😂', '👏', '😢']

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
  }

  const body = await req.json() as { newsId?: string; emoji?: string }
  const { newsId, emoji } = body
  const userEmail = session.user.email!

  if (!newsId || !emoji) {
    return NextResponse.json({ error: '필수 파라미터 누락' }, { status: 400 })
  }
  if (!ALLOWED_EMOJIS.includes(emoji)) {
    return NextResponse.json({ error: '허용되지 않은 이모지' }, { status: 400 })
  }

  // 같은 유저가 이 기사에 이미 반응했는지 확인
  const { data: existing } = await supabase
    .from('news_reactions')
    .select('id, emoji')
    .eq('news_id', newsId)
    .eq('user_email', userEmail)
    .maybeSingle()

  if (existing) {
    if (existing.emoji === emoji) {
      // 같은 이모지 → 토글 해제
      await supabase.from('news_reactions').delete().eq('id', existing.id)
      return NextResponse.json({ action: 'removed' })
    }
    // 다른 이모지 → 교체
    await supabase.from('news_reactions').update({ emoji }).eq('id', existing.id)
    return NextResponse.json({ action: 'added' })
  }

  const { error } = await supabase.from('news_reactions').insert({
    news_id:    newsId,
    emoji,
    user_email: userEmail,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ action: 'added' })
}
