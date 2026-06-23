import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sql } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: '未授權' }, { status: 401 })

  const { id } = await params
  const { email, password } = await req.json()

  if (!email && !password) return NextResponse.json({ error: '沒有任何變更' }, { status: 400 })
  if (password && password.length < 8) return NextResponse.json({ error: '密碼至少 8 個字元' }, { status: 400 })

  let rows
  if (email && password) {
    const password_hash = await bcrypt.hash(password, 10)
    rows = await sql`
      UPDATE admin_accounts SET email = ${email}, password_hash = ${password_hash}
      WHERE id = ${id} RETURNING id, email, created_at
    `
  } else if (email) {
    rows = await sql`
      UPDATE admin_accounts SET email = ${email}
      WHERE id = ${id} RETURNING id, email, created_at
    `
  } else {
    const password_hash = await bcrypt.hash(password, 10)
    rows = await sql`
      UPDATE admin_accounts SET password_hash = ${password_hash}
      WHERE id = ${id} RETURNING id, email, created_at
    `
  }

  if (!rows[0]) return NextResponse.json({ error: '找不到' }, { status: 404 })
  return NextResponse.json({ account: rows[0] })
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
    const rows = await sql`SELECT email FROM admin_accounts WHERE id = ${id} LIMIT 1`
    if (rows[0]?.email === session.user.email) {
      return NextResponse.json({ error: '不能刪除自己的帳號' }, { status: 400 })
    }
  }

  // 至少保留一個帳號
  const countRows = await sql`SELECT COUNT(*)::int AS total FROM admin_accounts`
  if ((countRows[0].total as number) <= 1) {
    return NextResponse.json({ error: '至少需要保留一個管理員帳號' }, { status: 400 })
  }

  await sql`DELETE FROM admin_accounts WHERE id = ${id}`
  return NextResponse.json({ success: true })
}
