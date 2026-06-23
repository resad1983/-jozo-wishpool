'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Category, COLOR_PALETTE } from '@/lib/types'

export default function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const currentCategory = searchParams.get('category') || 'all'

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => setCategories(d.categories || []))
  }, [])

  function handleClick(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete('category')
    } else {
      params.set('category', value)
    }
    params.delete('page')
    router.push(`/?${params.toString()}`)
  }

  function activeStyle(color: string) {
    const p = COLOR_PALETTE[color] ?? COLOR_PALETTE.orange
    return {
      background: p.swatch,
      color: '#ffffff',
      borderColor: 'transparent',
    }
  }

  const neutralStyle = {
    background: 'var(--card)',
    color: 'var(--foreground)',
    borderColor: 'var(--border)',
  }

  return (
    <div className="flex flex-wrap gap-2">
      {/* 全部 tab */}
      <button
        onClick={() => handleClick('all')}
        className="px-4 py-1.5 rounded-full text-sm font-medium border transition-colors hover:opacity-80"
        style={currentCategory === 'all'
          ? { background: 'var(--foreground)', color: 'var(--background)', borderColor: 'transparent' }
          : neutralStyle
        }
      >
        全部
      </button>

      {categories.map(cat => (
        <button
          key={cat.slug}
          onClick={() => handleClick(cat.slug)}
          className="px-4 py-1.5 rounded-full text-sm font-medium border transition-colors hover:opacity-80"
          style={currentCategory === cat.slug ? activeStyle(cat.color) : neutralStyle}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
