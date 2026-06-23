import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sql } from '@/lib/db'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: '未授權' }, { status: 401 })

  const { id } = await params
  const { title, category, description, author_name, author_social } = await req.json()

  const rows = await sql`
    UPDATE wishes
    SET
      title = COALESCE(${title ?? null}, title),
      category = COALESCE(${category ?? null}, category),
      description = COALESCE(${description ?? null}, description),
      author_name = COALESCE(${author_name ?? null}, author_name),
      author_social = COALESCE(${author_social ?? null}, author_social)
    WHERE id = ${id}
    RETURNING *
  `

  if (!rows[0]) return NextResponse.json({ error: '找不到' }, { status: 404 })
  return NextResponse.json({ wish: rows[0] })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: '未授權' }, { status: 401 })

  const { id } = await params
  await sql`DELETE FROM wishes WHERE id = ${id}`

  return NextResponse.json({ success: true })
}
