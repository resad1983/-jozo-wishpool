import { Suspense } from 'react'
import Link from 'next/link'
import WishCard from '@/components/WishCard'
import CategoryFilter from '@/components/CategoryFilter'
import ThemeToggle from '@/components/ThemeToggle'
import { Wish } from '@/lib/types'

async function getWishes(searchParams: Record<string, string>) {
  const params = new URLSearchParams()
  if (searchParams.category) params.set('category', searchParams.category)
  if (searchParams.urgent) params.set('urgent', searchParams.urgent)
  if (searchParams.page) params.set('page', searchParams.page)

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/wishes?${params.toString()}`, {
    cache: 'no-store',
  })

  if (!res.ok) return { wishes: [], total: 0 }
  return res.json() as Promise<{ wishes: Wish[]; total: number }>
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const resolvedParams = await searchParams
  const { wishes, total } = await getWishes(resolvedParams)
  const page = parseInt(resolvedParams.page || '1')
  const totalPages = Math.ceil(total / 12)

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Jōzō 揪作許願池</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>讓想法被看見，讓對的人找到彼此</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/admin"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400 text-sm"
            title="管理員登入"
          >
            🔑
          </Link>
          <Link
            href="/wish/new"
            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
          >
            ✨ 許個願
          </Link>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <Suspense>
          <CategoryFilter />
        </Suspense>
      </div>

      {/* Grid */}
      {wishes.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">🌊</p>
          <p>還沒有許願，來第一個吧！</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishes.map((wish) => (
            <WishCard key={wish.id} wish={wish} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/?${new URLSearchParams({ ...resolvedParams, page: String(p) }).toString()}`}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
