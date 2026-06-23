import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const [wishes, comments, joins] = await Promise.all([
    sql`
      SELECT w.*,
        COALESCE(c.name, w.category) AS category_name,
        COALESCE(c.color, 'orange')  AS category_color
      FROM wishes w
      LEFT JOIN categories c ON c.slug = w.category
      WHERE w.id = ${id}
      LIMIT 1
    `,
    sql`SELECT * FROM comments WHERE wish_id = ${id} ORDER BY created_at ASC`,
    sql`SELECT * FROM joins WHERE wish_id = ${id} ORDER BY created_at ASC`,
  ])

  if (!wishes[0]) {
    return NextResponse.json({ error: '找不到這個許願' }, { status: 404 })
  }

  return NextResponse.json({ wish: wishes[0], comments, joins })
}
