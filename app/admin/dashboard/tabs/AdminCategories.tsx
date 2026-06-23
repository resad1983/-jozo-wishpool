'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Category, COLOR_PALETTE } from '@/lib/types'

function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(COLOR_PALETTE).map(([key, p]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          title={p.label}
          className="w-7 h-7 rounded-full border-2 transition-all"
          style={{
            background: p.swatch,
            borderColor: value === key ? (isDark ? '#fff' : '#111') : 'transparent',
            transform: value === key ? 'scale(1.2)' : 'scale(1)',
          }}
        />
      ))}
    </div>
  )
}

function CategoryRow({ cat, onEdit, onDelete }: {
  cat: Category
  onEdit: (id: string, data: { slug: string; name: string; color: string }) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const { resolvedTheme } = useTheme()
  const [editing, setEditing] = useState(false)
  const [data, setData] = useState({ slug: cat.slug, name: cat.name, color: cat.color })
  const [saving, setSaving] = useState(false)
  const isDark = resolvedTheme === 'dark'
  const p = COLOR_PALETTE[cat.color] ?? COLOR_PALETTE.orange

  async function save() {
    setSaving(true)
    await onEdit(cat.id, data)
    setSaving(false)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="rounded-xl border p-4 flex flex-col gap-3"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>slug</label>
            <input value={data.slug} onChange={e => setData({ ...data, slug: e.target.value })}
              className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none"
              style={{ borderColor: 'var(--border)' }} />
          </div>
          <div>
            <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>顯示名稱</label>
            <input value={data.name} onChange={e => setData({ ...data, name: e.target.value })}
              className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none"
              style={{ borderColor: 'var(--border)' }} />
          </div>
        </div>
        <div>
          <label className="text-xs mb-2 block" style={{ color: 'var(--muted)' }}>顏色</label>
          <ColorPicker value={data.color} onChange={c => setData({ ...data, color: c })} />
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={() => setEditing(false)} className="text-xs px-3 py-1.5 rounded-lg border"
            style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>取消</button>
          <button onClick={save} disabled={saving} className="text-xs px-3 py-1.5 rounded-lg font-medium disabled:opacity-60"
            style={{ background: 'var(--foreground)', color: 'var(--background)' }}>
            {saving ? '儲存中...' : '儲存'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border p-4 flex items-center justify-between gap-3"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="flex items-center gap-3 flex-1">
        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: isDark ? p.darkBg : p.bg, color: isDark ? p.darkText : p.text }}>
          {cat.name}
        </span>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>{cat.slug}</span>
        <div className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ background: p.swatch }} />
        <span className="text-xs" style={{ color: 'var(--muted)' }}>{COLOR_PALETTE[cat.color]?.label ?? cat.color}</span>
      </div>
      <div className="flex gap-2 shrink-0">
        <button onClick={() => setEditing(true)} className="text-xs px-3 py-1.5 rounded-lg border"
          style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>編輯</button>
        <button onClick={() => onDelete(cat.id)}
          className="text-xs px-3 py-1.5 rounded-lg border border-red-300 text-red-500">刪除</button>
      </div>
    </div>
  )
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [newData, setNewData] = useState({ slug: '', name: '', color: 'orange' })
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
    setNewData({ slug: '', name: '', color: 'orange' })
    setShowNew(false)
    setSaving(false)
  }

  async function handleEdit(id: string, data: { slug: string; name: string; color: string }) {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (res.ok) setCategories(prev => prev.map(c => c.id === id ? json.category : c))
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
        <button onClick={() => setShowNew(true)} className="text-sm px-4 py-2 rounded-lg font-medium"
          style={{ background: 'var(--foreground)', color: 'var(--background)' }}>
          ＋ 新增分類
        </button>
      </div>

      {showNew && (
        <div className="rounded-xl border p-4 mb-4 flex flex-col gap-3"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>新增分類</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>英文代號（slug）</label>
              <input placeholder="例如：design" value={newData.slug}
                onChange={e => setNewData({ ...newData, slug: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{ borderColor: 'var(--border)' }} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>顯示名稱</label>
              <input placeholder="例如：設計創作" value={newData.name}
                onChange={e => setNewData({ ...newData, name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{ borderColor: 'var(--border)' }} />
            </div>
          </div>
          <div>
            <label className="text-xs mb-2 block" style={{ color: 'var(--muted)' }}>顏色</label>
            <ColorPicker value={newData.color} onChange={c => setNewData({ ...newData, color: c })} />
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
          <CategoryRow key={c.id} cat={c} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  )
}
