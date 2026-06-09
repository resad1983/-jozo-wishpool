import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: '未授權' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('admin_accounts')
    .select('id, email, created_at')
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ accounts: data })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: '未授權' }, { status: 401 })

  const { email, password } = await req.json()
  if (!email || !password) return NextResponse.json({ error: '請填寫完整' }, { status: 400 })
  if (password.length < 8) return NextResponse.json({ error: '密碼至少 8 個字元' }, { status: 400 })

  const password_hash = await bcrypt.hash(password, 10)

  const { data, error } = await supabaseAdmin
    .from('admin_accounts')
    .insert({ email, password_hash })
    .select('id, email, created_at')
    .single()

  if (error) {
    const msg = error.message.includes('unique') ? 'Email 已被使用' : error.message
    return NextResponse.json({ error: msg }, { status: 500 })
  }
  return NextResponse.json({ account: data }, { status: 201 })
}
