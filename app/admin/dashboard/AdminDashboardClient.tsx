'use client'

import { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { Wish, CATEGORY_LABELS } from '@/lib/types'

export default function AdminDashboardClient() {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [loading, setLoading] = useState(true)

  async function loadWishes() {
    const res = await fetch('/api/wishes?page=1')
    const data = await res.json()
    setWishes(data.wishes || [])
    setLoading(false)
  }

  useEffect(() => {
    loadWishes()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('確定要刪除這個許願嗎？')) return
    await fetch(`/api/admin/wishes/${id}`, { method: 'DELETE' })
    setWishes((prev) => prev.filter((w) => w.id !== id))
  }

  async function handleToggleUrgent(wish: Wish) {
    const res = await fetch(`/api/admin/wishes/${wish.id}/urgent`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_urgent: !wish.is_urgent }),
    })
    const data = await res.json()
    setWishes((prev) => prev.map((w) => (w.id === wish.id ? data.wish : w)))
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold text-gray-900">管理後台</h1>
        <button
          onClick={() => signOut({ callbackUrl: '/admin' })}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          登出
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">載入中...</p>
      ) : wishes.length === 0 ? (
        <p className="text-gray-400">目前沒有許願</p>
      ) : (
        <div className="flex flex-col gap-3">
          {wishes.map((wish) => (
            <div
              key={wish.id}
              className={`bg-white rounded-xl border p-4 flex items-start justify-between gap-4 ${
                wish.is_urgent ? 'border-l-4 border-l-red-500' : 'border-gray-100'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {CATEGORY_LABELS[wish.category]}
                  </span>
                  {wish.is_urgent && (
                    <span className="text-xs text-red-500 font-medium">🔥 急需人手</span>
                  )}
                </div>
                <Link href={`/wish/${wish.id}`} className="font-medium text-gray-900 hover:underline block truncate">
                  {wish.title}
                </Link>
                <p className="text-xs text-gray-400 mt-0.5">by {wish.author_name}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggleUrgent(wish)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    wish.is_urgent
                      ? 'border-red-200 text-red-600 hover:bg-red-50'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {wish.is_urgent ? '取消急需' : '標記急需'}
                </button>
                <button
                  onClick={() => handleDelete(wish.id)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                >
                  刪除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
