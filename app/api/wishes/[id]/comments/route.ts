import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { commentSchema } from '@/lib/validations'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const body = await req.json()

  if (body.honeypot) {
    return NextResponse.json({ error: '送出失敗' }, { status: 400 })
  }

  const result = commentSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 })
  }

  const { honeypot: _, ...data } = result.data
  const { id } = await params

  const rows = await sql`
    INSERT INTO comments (wish_id, author_name, author_social, content)
    VALUES (${id}, ${data.author_name}, ${data.author_social ?? null}, ${data.content})
    RETURNING *
  `

  return NextResponse.json({ comment: rows[0] }, { status: 201 })
}
