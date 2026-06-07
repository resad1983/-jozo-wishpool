import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { wishSchema } from '@/lib/validations'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const urgent = searchParams.get('urgent')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 12
  const offset = (page - 1) * limit

  let query = supabase
    .from('wishes')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }
  if (urgent === 'true') {
    query = query.eq('is_urgent', true)
  }

  const { data: wishes, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 取得每個許願的留言數和加入人數
  const wishIds = (wishes || []).map((w) => w.id)

  const [commentsRes, joinsRes] = await Promise.all([
    supabase.from('comments').select('wish_id').in('wish_id', wishIds),
    supabase.from('joins').select('wish_id').in('wish_id', wishIds),
  ])

  const commentCounts: Record<string, number> = {}
  const joinCounts: Record<string, number> = {}

  for (const c of commentsRes.data || []) {
    commentCounts[c.wish_id] = (commentCounts[c.wish_id] || 0) + 1
  }
  for (const j of joinsRes.data || []) {
    joinCounts[j.wish_id] = (joinCounts[j.wish_id] || 0) + 1
  }

  const wishesWithCounts = (wishes || []).map((w) => ({
    ...w,
    comment_count: commentCounts[w.id] || 0,
    join_count: joinCounts[w.id] || 0,
  }))

  return NextResponse.json({ wishes: wishesWithCounts, total: count || 0 })
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  // Honeypot 檢查
  if (body.honeypot) {
    return NextResponse.json({ error: '送出失敗' }, { status: 400 })
  }

  const result = wishSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    )
  }

  const { honeypot: _, ...data } = result.data

  const { data: wish, error } = await supabase
    .from('wishes')
    .insert(data)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ wish }, { status: 201 })
}
