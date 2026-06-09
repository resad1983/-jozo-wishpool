import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: '未授權' }, { status: 401 })

  const { id } = await params
  const { email, password } = await req.json()
  const updates: Record<string, string> = {}

  if (email) updates.email = email
  if (password) {
    if (password.length < 8) return NextResponse.json({ error: '密碼至少 8 個字元' }, { status: 400 })
    updates.password_hash = await bcrypt.hash(password, 10)
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: '沒有任何變更' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('admin_accounts')
    .update(updates)
    .eq('id', id)
    .select('id, email, created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ account: data })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: '未授權' }, { status: 401 })

  const { id } = await params

  // 不能刪掉自己
  if (session.user?.email) {
    const { data } = await supabaseAdmin
      .from('admin_accounts')
      .select('email')
      .eq('id', id)
      .single()
    if (data?.email === session.user.email) {
      return NextResponse.json({ error: '不能刪除自己的帳號' }, { status: 400 })
    }
  }

  // 至少保留一個帳號
  const { count } = await supabaseAdmin
    .from('admin_accounts')
    .select('*', { count: 'exact', head: true })

  if ((count ?? 0) <= 1) {
    return NextResponse.json({ error: '至少需要保留一個管理員帳號' }, { status: 400 })
  }

  const { error } = await supabaseAdmin.from('admin_accounts').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
