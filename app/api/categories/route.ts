import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  const categories = await sql`SELECT * FROM categories ORDER BY created_at ASC`
  return NextResponse.json({ categories })
}
