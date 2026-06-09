import { notFound } from 'next/navigation'
import Link from 'next/link'
import CategoryBadge from '@/components/CategoryBadge'
import JoinForm from './JoinForm'
import CommentForm from './CommentForm'
import CommentList from './CommentList'

async function getWish(id: string) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/wishes/${id}`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

export default async function WishDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const data = await getWish(id)
  if (!data) notFound()

  const { wish, comments, joins } = data

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/" className="text-sm hover:opacity-70 transition-opacity" style={{ color: 'var(--muted)' }}>
          ← 回許願池
        </Link>
      </div>

      {/* Wish detail */}
      <div
        className="rounded-xl shadow-sm border p-6 mb-4"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="flex flex-wrap gap-2 mb-2">
          <CategoryBadge category={wish.category} />
          {wish.is_urgent && (
            <span
              style={{ background: 'var(--badge-bg)', color: 'var(--badge-text)' }}
              className="text-xs px-2 py-0.5 rounded-full font-medium"
            >
              🔥 急需人手
            </span>
          )}
        </div>

        <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>
          {new Date(wish.created_at).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <h1 className="text-xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>{wish.title}</h1>

        <p className="leading-relaxed whitespace-pre-wrap mb-6" style={{ color: 'var(--foreground)' }}>
          {wish.description}
        </p>

        <div className="text-sm border-t pt-4" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
          <span>發起人：{wish.author_name}</span>
          {wish.author_social && (
            <span className="ml-3" style={{ color: 'var(--badge-text)' }}>{wish.author_social}</span>
          )}
        </div>
      </div>

      {/* 加入人 */}
      {joins.length > 0 && (
        <div className="rounded-xl shadow-sm border p-5 mb-4"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <h2 className="font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
            🙋 想加入的人（{joins.length}）
          </h2>
          <div className="flex flex-col gap-2">
            {joins.map((j: { id: string; name: string; social?: string; message?: string }) => (
              <div key={j.id} className="text-sm rounded-lg px-3 py-2"
                style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
                <span className="font-medium">{j.name}</span>
                {j.social && <span className="ml-2" style={{ color: 'var(--badge-text)' }}>{j.social}</span>}
                {j.message && <p className="mt-0.5" style={{ color: 'var(--muted)' }}>{j.message}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 我來按鈕 */}
      <JoinForm wishId={wish.id} />

      {/* 留言區 */}
      <div className="mt-6">
        <CommentList comments={comments} wishId={wish.id} />
        <CommentForm wishId={wish.id} />
      </div>
    </main>
  )
}
