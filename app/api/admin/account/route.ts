import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: '未授權' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('admin_account')
    .select('email, updated_at')
    .eq('id', 1)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ account: data })
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: '未授權' }, { status: 401 })

  const { email, password } = await req.json()
  const updates: Record<string, string> = { updated_at: new Date().toISOString() }

  if (email) updates.email = email
  if (password) {
    if (password.length < 8) {
      return NextResponse.json({ error: '密碼至少 8 個字元' }, { status: 400 })
    }
    updates.password_hash = await bcrypt.hash(password, 10)
  }

  const { error } = await supabaseAdmin
    .from('admin_account')
    .update(updates)
    .eq('id', 1)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
