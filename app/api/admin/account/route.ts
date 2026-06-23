import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sql } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: '未授權' }, { status: 401 })

  const accounts = await sql`
    SELECT id, email, created_at FROM admin_accounts ORDER BY created_at ASC
  `
  return NextResponse.json({ accounts })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: '未授權' }, { status: 401 })

  const { email, password } = await req.json()
  if (!email || !password) return NextResponse.json({ error: '請填寫完整' }, { status: 400 })
  if (password.length < 8) return NextResponse.json({ error: '密碼至少 8 個字元' }, { status: 400 })

  const password_hash = await bcrypt.hash(password, 10)

  try {
    const rows = await sql`
      INSERT INTO admin_accounts (email, password_hash)
      VALUES (${email}, ${password_hash})
      RETURNING id, email, created_at
    `
    return NextResponse.json({ account: rows[0] }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Email 已被使用' }, { status: 500 })
  }
}
