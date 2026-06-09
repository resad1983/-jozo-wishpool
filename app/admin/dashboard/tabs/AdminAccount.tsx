'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface Account { id: string; email: string; created_at: string }

export default function AdminAccount() {
  const { data: session } = useSession()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState({ email: '', password: '', confirm: '' })
  const [showNew, setShowNew] = useState(false)
  const [newData, setNewData] = useState({ email: '', password: '', confirm: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function load() {
    const res = await fetch('/api/admin/account')
    const data = await res.json()
    setAccounts(data.accounts || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleAdd() {
    setError('')
    if (!newData.email || !newData.password) { setError('請填寫完整'); return }
    if (newData.password !== newData.confirm) { setError('兩次密碼不一致'); return }
    if (newData.password.length < 8) { setError('密碼至少 8 個字元'); return }

    setSaving(true)
    const res = await fetch('/api/admin/account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newData.email, password: newData.password }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setSaving(false); return }

    setAccounts(prev => [...prev, data.account])
    setNewData({ email: '', password: '', confirm: '' })
    setShowNew(false)
    setSaving(false)
  }

  async function handleEdit(id: string) {
    setError('')
    if (editData.password && editData.password !== editData.confirm) {
      setError('兩次密碼不一致'); return
    }
    setSaving(true)

    const body: Record<string, string> = {}
    const original = accounts.find(a => a.id === id)
    if (editData.email && editData.email !== original?.email) body.email = editData.email
    if (editData.password) body.password = editData.password

    const res = await fetch(`/api/admin/account/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setSaving(false); return }

    setAccounts(prev => prev.map(a => a.id === id ? data.account : a))
    setEditingId(null)
    setSuccess('✅ 更新成功')
    setSaving(false)
    setTimeout(() => setSuccess(''), 3000)
  }

  async function handleDelete(id: string) {
    if (!confirm('確定刪除這個管理員帳號？')) return
    const res = await fetch(`/api/admin/account/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) { setError(data.error); return }
    setAccounts(prev => prev.filter(a => a.id !== id))
  }

  if (loading) return <p style={{ color: 'var(--muted)' }}>載入中...</p>

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => { setShowNew(true); setError('') }}
          className="text-sm px-4 py-2 rounded-lg font-medium"
          style={{ background: 'var(--foreground)', color: 'var(--background)' }}
        >＋ 新增管理員</button>
      </div>

      {success && <p className="text-green-600 text-sm mb-4">{success}</p>}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* 新增表單 */}
      {showNew && (
        <div className="rounded-xl border p-5 mb-4 flex flex-col gap-3"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>新增管理員帳號</h3>
          <input type="email" placeholder="Email" value={newData.email}
            onChange={e => setNewData({ ...newData, email: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
            style={{ borderColor: 'var(--border)' }} />
          <input type="password" placeholder="密碼（至少 8 個字元）" value={newData.password}
            onChange={e => setNewData({ ...newData, password: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
            style={{ borderColor: 'var(--border)' }} />
          <input type="password" placeholder="確認密碼" value={newData.confirm}
            onChange={e => setNewData({ ...newData, confirm: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
            style={{ borderColor: 'var(--border)' }} />
          <div className="flex gap-2 justify-end">
            <button onClick={() => { setShowNew(false); setError('') }}
              className="text-xs px-3 py-1.5 rounded-lg border"
              style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>取消</button>
            <button onClick={handleAdd} disabled={saving}
              className="text-xs px-3 py-1.5 rounded-lg font-medium disabled:opacity-60"
              style={{ background: 'var(--foreground)', color: 'var(--background)' }}>
              {saving ? '新增中...' : '新增'}
            </button>
          </div>
        </div>
      )}

      {/* 帳號列表 */}
      <div className="flex flex-col gap-2">
        {accounts.map(a => (
          <div key={a.id} className="rounded-xl border p-4"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            {editingId === a.id ? (
              <div className="flex flex-col gap-3">
                <input type="email" value={editData.email}
                  onChange={e => setEditData({ ...editData, email: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
                  style={{ borderColor: 'var(--border)' }} />
                <input type="password" placeholder="新密碼（不修改請留空）" value={editData.password}
                  onChange={e => setEditData({ ...editData, password: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
                  style={{ borderColor: 'var(--border)' }} />
                {editData.password && (
                  <input type="password" placeholder="確認新密碼" value={editData.confirm}
                    onChange={e => setEditData({ ...editData, confirm: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
                    style={{ borderColor: 'var(--border)' }} />
                )}
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setEditingId(null)} className="text-xs px-3 py-1.5 rounded-lg border"
                    style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>取消</button>
                  <button onClick={() => handleEdit(a.id)} disabled={saving}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium disabled:opacity-60"
                    style={{ background: 'var(--foreground)', color: 'var(--background)' }}>
                    {saving ? '儲存中...' : '儲存'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                    {a.email}
                    {a.email === session?.user?.email && (
                      <span className="ml-2 text-xs" style={{ color: 'var(--muted)' }}>(你)</span>
                    )}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                    建立於 {new Date(a.created_at).toLocaleDateString('zh-TW')}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => { setEditingId(a.id); setEditData({ email: a.email, password: '', confirm: '' }); setError('') }}
                    className="text-xs px-3 py-1.5 rounded-lg border"
                    style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}>編輯</button>
                  {a.email !== session?.user?.email && (
                    <button onClick={() => handleDelete(a.id)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-red-300 text-red-500">刪除</button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
