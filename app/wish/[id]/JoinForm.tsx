'use client'

import { useState } from 'react'

export default function JoinForm({ wishId }: { wishId: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      social: (form.elements.namedItem('social') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
      honeypot: (form.elements.namedItem('honeypot') as HTMLInputElement).value,
    }

    try {
      const res = await fetch(`/api/wishes/${wishId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || '送出失敗')
        return
      }
      setDone(true)
    } catch {
      setError('網路錯誤，請再試一次')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
        <p className="text-green-700 font-medium">🎉 感謝你的加入意願！</p>
        <p className="text-green-600 text-sm mt-1">發起人會看到你的訊息</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl shadow-sm border p-5"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full py-3 rounded-lg font-medium hover:opacity-80 transition-opacity"
          style={{ background: 'var(--foreground)', color: 'var(--background)' }}
        >
          🙋 我來！
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h3 className="font-semibold text-gray-800">填寫加入資料</h3>
          <input name="honeypot" type="text" className="hidden" tabIndex={-1} autoComplete="off" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                名稱 <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
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
                name="social"
                type="text"
                maxLength={30}
                placeholder="@your_handle"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              簡短說明（選填）
            </label>
            <textarea
              name="message"
              maxLength={100}
              rows={2}
              placeholder="你能帶來什麼？"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 py-2.5 rounded-lg text-sm border hover:opacity-70 transition-opacity"
              style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-60"
              style={{ background: 'var(--foreground)', color: 'var(--background)' }}
            >
              {loading ? '送出中...' : '確認加入'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
