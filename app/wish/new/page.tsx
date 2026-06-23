'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Category } from '@/lib/types'

export default function NewWishPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(d.categories || []))
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = e.currentTarget
    const data = {
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      category: (form.elements.namedItem('category') as HTMLSelectElement).value,
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
      author_name: (form.elements.namedItem('author_name') as HTMLInputElement).value,
      author_social: (form.elements.namedItem('author_social') as HTMLInputElement).value,
honeypot: (form.elements.namedItem('honeypot') as HTMLInputElement).value,
    }

    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json()
      if (!res.ok) {
        setError(json.error || '送出失敗，請再試一次')
        return
      }

      router.push(`/wish/${json.wish.id}`)
    } catch {
      setError('網路錯誤，請再試一次')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
          ← 回許願池
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">發起一個揪作 ✨</h1>
      <p className="text-gray-500 text-sm mb-8">說出你的計畫或想揪的事，讓對的人看見你</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">
        {/* Honeypot */}
        <input name="honeypot" type="text" className="hidden" tabIndex={-1} autoComplete="off" />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            許願標題 <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            type="text"
            maxLength={50}
            placeholder="這個揪作的主題是什麼？（最多 50 字）"
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            分類 <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">請選擇分類</option>
            {categories.map(cat => (
              <option key={cat.slug} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            描述 <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            rows={5}
            maxLength={500}
            placeholder="說說這個計畫的背景、你在找什麼樣的人、怎麼參與……（最多 500 字）"
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              你的名稱 <span className="text-red-500">*</span>
            </label>
            <input
              name="author_name"
              type="text"
              maxLength={20}
              placeholder="暱稱或本名"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              IG / Threads（選填）
            </label>
            <input
              name="author_social"
              type="text"
              maxLength={30}
              placeholder="@your_handle"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
        </div>

{error && (
          <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60"
        >
          {loading ? '送出中...' : '✨ 發起揪作'}
        </button>
      </form>
    </main>
  )
}
