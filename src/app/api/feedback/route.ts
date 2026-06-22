import { createHash } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

const CATEGORIES = ['bug', 'feature', 'other'] as const
const RATE_LIMIT = 3       // 시간당 최대 제출 수
const WINDOW_MS  = 60 * 60 * 1000  // 1시간

function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex').slice(0, 32)
}

function getIp(req: NextRequest): string | null {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip')
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })

  const { category, content, email } = body

  // 입력 검증
  if (!CATEGORIES.includes(category)) {
    return NextResponse.json({ error: '유효하지 않은 카테고리입니다.' }, { status: 400 })
  }
  if (typeof content !== 'string' || content.trim().length < 5) {
    return NextResponse.json({ error: '내용을 5자 이상 입력해주세요.' }, { status: 400 })
  }
  if (content.trim().length > 1000) {
    return NextResponse.json({ error: '내용은 1000자 이하로 입력해주세요.' }, { status: 400 })
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: '이메일 형식이 올바르지 않습니다.' }, { status: 400 })
  }

  // IP 기반 rate limiting
  const rawIp = getIp(req)
  const ipHash = rawIp ? hashIp(rawIp) : null

  if (ipHash) {
    const windowStart = new Date(Date.now() - WINDOW_MS).toISOString()
    const { count } = await supabaseAdmin
      .from('feedbacks')
      .select('*', { count: 'exact', head: true })
      .eq('ip_hash', ipHash)
      .gte('created_at', windowStart)

    if ((count ?? 0) >= RATE_LIMIT) {
      return NextResponse.json(
        { error: '너무 많은 요청입니다. 1시간 후 다시 시도해주세요.' },
        { status: 429 },
      )
    }
  }

  // 로그인 유저 정보 (선택)
  const session = await auth()
  const userId = session?.user?.id ?? null

  const { error } = await supabaseAdmin.from('feedbacks').insert({
    category,
    content: content.trim(),
    email: email?.trim() || null,
    user_id: userId,
    ip_hash: ipHash,
  })

  if (error) {
    console.error('[feedback] insert error:', error.message)
    return NextResponse.json({ error: '저장에 실패했습니다. 잠시 후 다시 시도해주세요.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
