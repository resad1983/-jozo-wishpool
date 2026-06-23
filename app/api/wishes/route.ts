import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { wishSchema } from '@/lib/validations'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 12
  const offset = (page - 1) * limit

  const hasCategory = category && category !== 'all'

  const [wishes, countRows] = await Promise.all([
    hasCategory
      ? sql`
          SELECT w.*,
            COUNT(DISTINCT c.id)::int AS comment_count,
            COUNT(DISTINCT j.id)::int AS join_count
          FROM wishes w
          LEFT JOIN comments c ON c.wish_id = w.id
          LEFT JOIN joins j ON j.wish_id = w.id
          WHERE w.category = ${category}
          GROUP BY w.id
          ORDER BY w.created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `
      : sql`
          SELECT w.*,
            COUNT(DISTINCT c.id)::int AS comment_count,
            COUNT(DISTINCT j.id)::int AS join_count
          FROM wishes w
          LEFT JOIN comments c ON c.wish_id = w.id
          LEFT JOIN joins j ON j.wish_id = w.id
          GROUP BY w.id
          ORDER BY w.created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `,
    hasCategory
      ? sql`SELECT COUNT(*)::int AS total FROM wishes WHERE category = ${category}`
      : sql`SELECT COUNT(*)::int AS total FROM wishes`,
  ])

  return NextResponse.json({ wishes, total: countRows[0].total })
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  if (body.honeypot) {
    return NextResponse.json({ error: '送出失敗' }, { status: 400 })
  }

  const result = wishSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 })
  }

  const { honeypot: _, ...data } = result.data

  const rows = await sql`
    INSERT INTO wishes (title, category, description, author_name, author_social)
    VALUES (${data.title}, ${data.category}, ${data.description}, ${data.author_name}, ${data.author_social ?? null})
    RETURNING *
  `

  return NextResponse.json({ wish: rows[0] }, { status: 201 })
}
