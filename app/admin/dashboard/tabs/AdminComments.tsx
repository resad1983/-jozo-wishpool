'use client'

import { useEffect, useState } from 'react'

interface CommentWithWish {
  id: string
  wish_id: string
  wish_title: string
  author_name: string
  author_social: string | null
  content: string
  created_at: string
}

export default function AdminComments() {
  const [comments, setComments] = useState<CommentWithWish[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [saving, setSaving] = useState(false)

  async function load() {
    // 先取所有許願，再取留言合併
    const [wRes, cRes] = await Promise.all([
      fetch('/api/wishes?page=1'),
      fetch('/api/admin/comments'),
    ])
    const wData = await wRes.json()
    const cData = await cRes.json()

    const wishMap: Record<string, string> = {}
    for (const w of wData.wishes || []) wishMap[w.id] = w.title

    const merged = (cData.comments || []).map((c: CommentWithWish) => ({
      ...c,
      wish_title: wishMap[c.wish_id] || c.wish_id,
    }))
    setComments(merged)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSave(id: string) {
    setSaving(true)
    const res = await fetch(`/api/admin/comments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editContent }),
    })
    if (res.ok) {
      setComments(prev => prev.map(c => c.id === id ? { ...c, content: editContent } : c))
      setEditingId(null)
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('確定刪除這則留言？')) return
    await fetch(`/api/admin/comments/${id}`, { method: 'DELETE' })
    setComments(prev => prev.filter(c => c.id !== id))
  }

  if (loading) return <p style={{ color: 'var(--muted)' }}>載入中...</p>
  if (comments.length === 0) return <p style={{ color: 'var(--muted)' }}>目前沒有留言</p>

  return (
    <div className="flex flex-col gap-2">
      {comments.map(c => (
        <div key={c.id} className="rounded-xl border p-4"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs mb-1" style={{ color: 'var(--muted)' }}>
                {c.wish_title} · {c.author_name}{c.author_social ? ` ${c.author_social}` : ''}
              </p>
              {editingId === c.id ? (
                <textarea
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  rows={2}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
                  style={{ borderColor: 'var(--border)' }}
                />
              ) : (
                <p className="text-sm" style={{ color: 'var(--foreground)' }}>{c.content}</p>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              {editingId === c.id ? (
                <>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-xs px-3 py-1.5 rounded-lg border"
                    style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                  >取消</button>
                  <button
                    onClick={() => handleSave(c.id)}
                    disabled={saving}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium disabled:opacity-60"
                    style={{ background: 'var(--foreground)', color: 'var(--background)' }}
                  >{saving ? '儲存中...' : '儲存'}</button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setEditingId(c.id); setEditContent(c.content) }}
                    className="text-xs px-3 py-1.5 rounded-lg border"
                    style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  >編輯</button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-red-300 text-red-500"
                  >刪除</button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
