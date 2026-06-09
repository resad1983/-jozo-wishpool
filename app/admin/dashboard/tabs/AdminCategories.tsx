'use client'

import { useEffect, useState } from 'react'

interface Category { id: string; slug: string; name: string }

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState({ slug: '', name: '' })
  const [newData, setNewData] = useState({ slug: '', name: '' })
  const [showNew, setShowNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    const res = await fetch('/api/admin/categories')
    const data = await res.json()
    setCategories(data.categories || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleAdd() {
    if (!newData.slug || !newData.name) { setError('請填寫完整'); return }
    setSaving(true); setError('')
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setSaving(false); return }
    setCategories(prev => [...prev, data.category])
    setNewData({ slug: '', name: '' })
    setShowNew(false)
    setSaving(false)
  }

  async function handleEdit(id: string) {
    setSaving(true); setError('')
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setSaving(false); return }
    setCategories(prev => prev.map(c => c.id === id ? data.category : c))
    setEditingId(null)
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('刪除分類後，使用此分類的許願不受影響，但分類名稱可能顯示異常，確定刪除？')) return
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    setCategories(prev => prev.filter(c => c.id !== id))
  }

  if (loading) return <p style={{ color: 'var(--muted)' }}>載入中...</p>

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowNew(true)}
          className="text-sm px-4 py-2 rounded-lg font-medium"
          style={{ background: 'var(--foreground)', color: 'var(--background)' }}
        >＋ 新增分類</button>
      </div>

      {showNew && (
        <div className="rounded-xl border p-4 mb-4 flex flex-col gap-3"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>新增分類</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>英文代號（slug）</label>
              <input
                placeholder="例如：design"
                value={newData.slug}
                onChange={e => setNewData({ ...newData, slug: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{ borderColor: 'var(--border)' }}
              />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>顯示名稱</label>
              <input
                placeholder="例如：設計創作"
                value={newData.name}
                onChange={e => setNewData({ ...newData, name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{ borderColor: 'var(--border)' }}
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowNew(false)} className="text-xs px-3 py-1.5 rounded-lg border"
              style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>取消</button>
            <button onClick={handleAdd} disabled={saving} className="text-xs px-3 py-1.5 rounded-lg font-medium disabled:opacity-60"
              style={{ background: 'var(--foreground)', color: 'var(--background)' }}>
              {saving ? '新增中...' : '新增'}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {categories.map(c => (
          <div key={c.id} className="rounded-xl border p-4 flex items-center justify-between gap-3"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            {editingId === c.id ? (
              <div className="flex flex-1 gap-3 items-center">
                <input
                  value={editData.slug}
                  onChange={e => setEditData({ ...editData, slug: e.target.value })}
                  className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none w-32"
                  style={{ borderColor: 'var(--border)' }}
                  placeholder="slug"
                />
                <input
                  value={editData.name}
                  onChange={e => setEditData({ ...editData, name: e.target.value })}
                  className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none flex-1"
                  style={{ borderColor: 'var(--border)' }}
                  placeholder="名稱"
                />
              </div>
            ) : (
              <div className="flex-1">
                <span className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{c.name}</span>
                <span className="text-xs ml-2" style={{ color: 'var(--muted)' }}>{c.slug}</span>
              </div>
            )}
            <div className="flex gap-2 shrink-0">
              {editingId === c.id ? (
                <>
                  <button onClick={() => setEditingId(null)} className="text-xs px-3 py-1.5 rounded-lg border"
                    style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>取消</button>
                  <button onClick={() => handleEdit(c.id)} disabled={saving} className="text-xs px-3 py-1.5 rounded-lg font-medium disabled:opacity-60"
                    style={{ background: 'var(--foreground)', color: 'var(--background)' }}>
                    {saving ? '儲存中...' : '儲存'}
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { setEditingId(c.id); setEditData({ slug: c.slug, name: c.name }) }}
                    className="text-xs px-3 py-1.5 rounded-lg border"
                    style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>編輯</button>
                  <button onClick={() => handleDelete(c.id)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-red-300 text-red-500">刪除</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
