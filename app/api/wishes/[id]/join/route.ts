import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { joinSchema } from '@/lib/validations'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const body = await req.json()

  if (body.honeypot) {
    return NextResponse.json({ error: '送出失敗' }, { status: 400 })
  }

  const result = joinSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    )
  }

  const { honeypot: _, ...data } = result.data
  const { id } = await params

  const { data: join, error } = await supabase
    .from('joins')
    .insert({ ...data, wish_id: id })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ join }, { status: 201 })
}
