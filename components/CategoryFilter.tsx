'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const CATEGORY_TABS = [
  { value: 'all', label: '全部' },
  { value: 'event', label: '活動策劃' },
  { value: 'collab', label: '協作計畫' },
  { value: 'media', label: '內容媒體' },
  { value: 'space', label: '空間場域' },
  { value: 'research', label: '研究調查' },
]

export default function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') || 'all'
  const isUrgent = searchParams.get('urgent') === 'true'

  function handleCategoryClick(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete('category')
    } else {
      params.set('category', value)
    }
    params.delete('page')
    router.push(`/?${params.toString()}`)
  }

  function handleUrgentToggle() {
    const params = new URLSearchParams(searchParams.toString())
    if (isUrgent) {
      params.delete('urgent')
    } else {
      params.set('urgent', 'true')
    }
    params.delete('page')
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleCategoryClick(tab.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              currentCategory === tab.value
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'border hover:opacity-80'
            }`}
            style={currentCategory !== tab.value ? {
              background: 'var(--card)',
              color: 'var(--foreground)',
              borderColor: 'var(--border)',
            } : undefined}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2 w-fit cursor-pointer select-none">
        <input
          type="checkbox"
          checked={isUrgent}
          onChange={handleUrgentToggle}
          className="w-4 h-4 rounded accent-orange-500 cursor-pointer"
        />
        <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
          🔥 急需夥伴
        </span>
      </label>
    </div>
  )
}
