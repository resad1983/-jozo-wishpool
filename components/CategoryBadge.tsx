'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { WishCategory, CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/types'

export default function CategoryBadge({ category }: { category: WishCategory }) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const colors = CATEGORY_COLORS[category]
  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-medium transition-colors"
      style={{
        background: isDark ? colors.darkBg : colors.bg,
        color: isDark ? colors.darkText : colors.text,
      }}
    >
      {CATEGORY_LABELS[category]}
    </span>
  )
}
