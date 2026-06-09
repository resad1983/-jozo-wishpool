'use client'

import { useEffect, useState } from 'react'

export default function AdminAccount() {
  const [email, setEmail] = useState('')
  const [currentEmail, setCurrentEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/account').then(r => r.json()).then(data => {
      setCurrentEmail(data.account?.email || '')
      setEmail(data.account?.email || '')
      setLoading(false)
    })
  }, [])

  async function handleSave() {
    setError(''); setSuccess('')
    if (password && password !== confirm) {
      setError('兩次密碼不一致'); return
    }
    if (password && password.length < 8) {
      setError('密碼至少 8 個字元'); return
    }
    setSaving(true)

    const body: Record<string, string> = {}
    if (email && email !== currentEmail) body.email = email
    if (password) body.password = password

    if (Object.keys(body).length === 0) {
      setError('沒有任何變更'); setSaving(false); return
    }

    const res = await fetch('/api/admin/account', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setSaving(false); return }

    setCurrentEmail(email)
    setPassword(''); setConfirm('')
    setSuccess('✅ 更新成功，下次登入時生效')
    setSaving(false)
  }

  if (loading) return <p style={{ color: 'var(--muted)' }}>載入中...</p>

  return (
    <div className="max-w-sm">
      <h3 className="font-semibold mb-4 text-sm" style={{ color: 'var(--foreground)' }}>管理員帳號設定</h3>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-xs mb-1.5 font-medium" style={{ color: 'var(--muted)' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none"
            style={{ borderColor: 'var(--border)' }}
          />
        </div>

        <div>
          <label className="block text-xs mb-1.5 font-medium" style={{ color: 'var(--muted)' }}>新密碼（不修改請留空）</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="至少 8 個字元"
            className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none"
            style={{ borderColor: 'var(--border)' }}
          />
        </div>

        {password && (
          <div>
            <label className="block text-xs mb-1.5 font-medium" style={{ color: 'var(--muted)' }}>確認新密碼</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2.5 rounded-lg text-sm font-medium disabled:opacity-60"
          style={{ background: 'var(--foreground)', color: 'var(--background)' }}
        >
          {saving ? '更新中...' : '更新帳號'}
        </button>
      </div>
    </div>
  )
}
