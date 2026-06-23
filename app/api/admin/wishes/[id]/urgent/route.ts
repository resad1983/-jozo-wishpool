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
  const { is_urgent } = await req.json()

  const rows = await sql`
    UPDATE wishes SET is_urgent = ${is_urgent} WHERE id = ${id} RETURNING *
  `

  if (!rows[0]) return NextResponse.json({ error: '找不到' }, { status: 404 })
  return NextResponse.json({ wish: rows[0] })
}
