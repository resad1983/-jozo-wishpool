import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sql } from '@/lib/db'

export async function GET() {
  const categories = await sql`SELECT * FROM categories ORDER BY created_at ASC`
  return NextResponse.json({ categories })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: '未授權' }, { status: 401 })

  const { slug, name } = await req.json()
  if (!slug || !name) return NextResponse.json({ error: '請填寫完整' }, { status: 400 })

  const rows = await sql`
    INSERT INTO categories (slug, name) VALUES (${slug}, ${name}) RETURNING *
  `

  return NextResponse.json({ category: rows[0] }, { status: 201 })
}
