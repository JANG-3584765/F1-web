import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin'

// PATCH /api/news/translate
// body: { articleUrl, titleKr, summaryKr, contentKr? }
// 관리자 이메일만 허용
export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (session?.user?.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json() as {
    articleUrl?: string
    titleKr?: string | null
    summaryKr?: string | null
    contentKr?: string | null
  }
  const { articleUrl, titleKr, summaryKr, contentKr } = body

  if (!articleUrl) {
    return NextResponse.json({ error: 'articleUrl 필요' }, { status: 400 })
  }

  const updateData: Record<string, string | null> = {
    title_kr:   titleKr   ?? null,
    summary_kr: summaryKr ?? null,
  }
  if (contentKr !== undefined) {
    updateData.content_kr = contentKr
  }

  const { error } = await supabase
    .from('news_translations')
    .update(updateData)
    .eq('article_url', articleUrl)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
