'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CommentForm({ wishId }: { wishId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = e.currentTarget
    const data = {
      author_name: (form.elements.namedItem('author_name') as HTMLInputElement).value,
      author_social: (form.elements.namedItem('author_social') as HTMLInputElement).value,
      content: (form.elements.namedItem('content') as HTMLTextAreaElement).value,
      honeypot: (form.elements.namedItem('honeypot') as HTMLInputElement).value,
    }

    try {
      const res = await fetch(`/api/wishes/${wishId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || '送出失敗')
        return
      }
      form.reset()
      router.refresh()
    } catch {
      setError('網路錯誤，請再試一次')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl shadow-sm border p-5 flex flex-col gap-4"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      <h3 className="font-semibold text-gray-800">留言</h3>
      <input name="honeypot" type="text" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            名稱 <span className="text-red-500">*</span>
          </label>
          <input
            name="author_name"
            type="text"
            maxLength={20}
            required
            placeholder="暱稱或本名"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            IG / Threads（選填）
          </label>
          <input
            name="author_social"
            type="text"
            maxLength={30}
            placeholder="@your_handle"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          留言內容 <span className="text-red-500">*</span>
        </label>
        <textarea
          name="content"
          rows={3}
          maxLength={300}
          required
          placeholder="說點什麼吧（最多 300 字）"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="py-2.5 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-60"
      style={{ background: 'var(--foreground)', color: 'var(--background)' }}
      >
        {loading ? '送出中...' : '送出留言'}
      </button>
    </form>
  )
}
