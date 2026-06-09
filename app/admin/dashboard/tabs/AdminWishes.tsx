'use client'

import { useEffect, useState } from 'react'
import { Wish } from '@/lib/types'

interface Category { id: string; slug: string; name: string }

const EMPTY: Partial<Wish> = {
  title: '', category: 'event', description: '',
  author_name: '', author_social: '',
}

export default function AdminWishes() {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [editing, setEditing] = useState<Partial<Wish> | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    const [wRes, cRes] = await Promise.all([
      fetch('/api/wishes?page=1'),
      fetch('/api/admin/categories'),
    ])
    const wData = await wRes.json()
    const cData = await cRes.json()
    setWishes(wData.wishes || [])
    setCategories(cData.categories || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSave() {
    if (!editing) return
    setSaving(true)
    setError('')

    const url = isNew ? '/api/wishes' : `/api/admin/wishes/${editing.id}`
    const method = isNew ? 'POST' : 'PATCH'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setSaving(false); return }

    await load()
    setEditing(null)
    setIsNew(false)
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('確定刪除這個許願？')) return
    await fetch(`/api/admin/wishes/${id}`, { method: 'DELETE' })
    setWishes(prev => prev.filter(w => w.id !== id))
  }

  if (loading) return <p style={{ color: 'var(--muted)' }}>載入中...</p>

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => { setEditing({ ...EMPTY }); setIsNew(true) }}
          className="text-sm px-4 py-2 rounded-lg font-medium"
          style={{ background: 'var(--foreground)', color: 'var(--background)' }}
        >
          ＋ 新增許願
        </button>
      </div>

      {/* 編輯 / 新增表單 */}
      {editing && (
        <div className="rounded-xl border p-5 mb-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
            {isNew ? '新增許願' : '編輯許願'}
          </h3>
          <div className="flex flex-col gap-3">
            <input
              placeholder="標題"
              value={editing.title || ''}
              onChange={e => setEditing({ ...editing, title: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
              style={{ borderColor: 'var(--border)' }}
            />
            <select
              value={editing.category || ''}
              onChange={e => setEditing({ ...editing, category: e.target.value as Wish['category'] })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
              style={{ borderColor: 'var(--border)' }}
            >
              {categories.map(c => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
            <textarea
              placeholder="描述"
              rows={4}
              value={editing.description || ''}
              onChange={e => setEditing({ ...editing, description: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
              style={{ borderColor: 'var(--border)' }}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="發起人名稱"
                value={editing.author_name || ''}
                onChange={e => setEditing({ ...editing, author_name: e.target.value })}
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{ borderColor: 'var(--border)' }}
              />
              <input
                placeholder="社群帳號（選填）"
                value={editing.author_social || ''}
                onChange={e => setEditing({ ...editing, author_social: e.target.value })}
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{ borderColor: 'var(--border)' }}
              />
            </div>
{error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setEditing(null); setIsNew(false) }}
                className="px-4 py-2 text-sm rounded-lg border"
                style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
              >取消</button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm rounded-lg font-medium disabled:opacity-60"
                style={{ background: 'var(--foreground)', color: 'var(--background)' }}
              >{saving ? '儲存中...' : '儲存'}</button>
            </div>
          </div>
        </div>
      )}

      {/* 列表 */}
      {wishes.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>目前沒有許願</p>
      ) : (
        <div className="flex flex-col gap-2">
          {wishes.map(w => (
            <div key={w.id} className="rounded-xl border p-4 flex items-center justify-between gap-3"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-sm" style={{ color: 'var(--foreground)' }}>{w.title}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>by {w.author_name} · {w.category}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => { setEditing({ ...w }); setIsNew(false) }}
                  className="text-xs px-3 py-1.5 rounded-lg border"
                  style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                >編輯</button>
                <button
                  onClick={() => handleDelete(w.id)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-red-300 text-red-500"
                >刪除</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
