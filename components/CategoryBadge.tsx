'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { COLOR_PALETTE } from '@/lib/types'

interface CategoryBadgeProps {
  name: string
  color: string
}

export default function CategoryBadge({ name, color }: CategoryBadgeProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const palette = COLOR_PALETTE[color] ?? COLOR_PALETTE.orange
  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-medium transition-colors"
      style={{
        background: isDark ? palette.darkBg : palette.bg,
        color: isDark ? palette.darkText : palette.text,
      }}
    >
      {name}
    </span>
  )
}
