import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
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
    return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 })
  }

  const { honeypot: _, ...data } = result.data
  const { id } = await params

  const rows = await sql`
    INSERT INTO joins (wish_id, name, social, message)
    VALUES (${id}, ${data.name}, ${data.social ?? null}, ${data.message ?? null})
    RETURNING *
  `

  return NextResponse.json({ join: rows[0] }, { status: 201 })
}
