'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import AdminWishes from './tabs/AdminWishes'
import AdminComments from './tabs/AdminComments'
import AdminCategories from './tabs/AdminCategories'
import AdminAccount from './tabs/AdminAccount'

const TABS = [
  { key: 'wishes', label: '許願' },
  { key: 'comments', label: '留言' },
  { key: 'categories', label: '分類' },
  { key: 'account', label: '帳號' },
]

export default function AdminDashboardClient() {
  const [tab, setTab] = useState('wishes')

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold" style={{ color: 'var(--foreground)' }}>管理後台</h1>
        <button
          onClick={() => signOut({ callbackUrl: '/admin' })}
          className="text-sm hover:opacity-70 transition-opacity"
          style={{ color: 'var(--muted)' }}
        >
          登出
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b" style={{ borderColor: 'var(--border)' }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t.key ? 'border-gray-900 dark:border-white' : 'border-transparent'
            }`}
            style={{ color: tab === t.key ? 'var(--foreground)' : 'var(--muted)' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'wishes' && <AdminWishes />}
      {tab === 'comments' && <AdminComments />}
      {tab === 'categories' && <AdminCategories />}
      {tab === 'account' && <AdminAccount />}
    </main>
  )
}
