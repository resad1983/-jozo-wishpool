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

  return (
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
  )
}
