import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const season = Number(req.nextUrl.searchParams.get('season') ?? '2026')

  const { data, error } = await supabaseAdmin
    .from('season_predictions')
    .select('prediction')
    .eq('user_id', session.user.id)
    .eq('season', season)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ prediction: data?.prediction ?? null })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { season = 2026, prediction } = body

  if (!prediction || typeof prediction !== 'object') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('season_predictions')
    .upsert(
      {
        user_id: session.user.id,
        season,
        prediction,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,season' },
    )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
