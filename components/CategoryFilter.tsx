'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const TABS = [
  { value: 'all', label: '全部' },
  { value: 'event', label: '活動策劃' },
  { value: 'collab', label: '協作計畫' },
  { value: 'media', label: '內容媒體' },
  { value: 'space', label: '空間場域' },
  { value: 'research', label: '研究調查' },
  { value: 'urgent', label: '🔥 急需人手' },
]

export default function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = searchParams.get('urgent') === 'true'
    ? 'urgent'
    : (searchParams.get('category') || 'all')

  function handleClick(value: string) {
    const params = new URLSearchParams()
    if (value === 'urgent') {
      params.set('urgent', 'true')
    } else if (value !== 'all') {
      params.set('category', value)
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => handleClick(tab.value)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            current === tab.value
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
