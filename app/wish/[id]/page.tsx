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
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
          ← 回許願池
        </Link>
      </div>

      {/* Wish detail */}
      <div className={`bg-white rounded-xl shadow-sm border p-6 mb-6 ${wish.is_urgent ? 'border-l-4 border-l-red-500' : 'border-gray-100'}`}>
        <div className="flex flex-wrap gap-2 mb-3">
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

        <h1 className="text-xl font-bold text-gray-900 mb-4">{wish.title}</h1>

        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">{wish.description}</p>

        <div className="text-sm text-gray-500 border-t border-gray-50 pt-4">
          <span>發起人：{wish.author_name}</span>
          {wish.author_social && (
            <span className="ml-3 text-indigo-500">{wish.author_social}</span>
          )}
        </div>
      </div>

      {/* 加入人 */}
      {joins.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-4">
          <h2 className="font-semibold text-gray-800 mb-3">🙋 想加入的人（{joins.length}）</h2>
          <div className="flex flex-col gap-2">
            {joins.map((j: { id: string; name: string; social?: string; message?: string }) => (
              <div key={j.id} className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                <span className="font-medium">{j.name}</span>
                {j.social && <span className="text-indigo-500 ml-2">{j.social}</span>}
                {j.message && <p className="text-gray-500 mt-0.5">{j.message}</p>}
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
