import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const [wishRes, commentsRes, joinsRes] = await Promise.all([
    supabase.from('wishes').select('*').eq('id', id).single(),
    supabase
      .from('comments')
      .select('*')
      .eq('wish_id', id)
      .order('created_at', { ascending: true }),
    supabase.from('joins').select('*').eq('wish_id', id),
  ])

  if (wishRes.error || !wishRes.data) {
    return NextResponse.json({ error: '找不到這個許願' }, { status: 404 })
  }

  return NextResponse.json({
    wish: wishRes.data,
    comments: commentsRes.data || [],
    joins: joinsRes.data || [],
  })
}
