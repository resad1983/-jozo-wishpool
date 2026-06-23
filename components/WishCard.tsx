'use client'

import Link from 'next/link'
import { Wish } from '@/lib/types'
import CategoryBadge from './CategoryBadge'

interface WishCardProps {
  wish: Wish
}

export default function WishCard({ wish }: WishCardProps) {
  return (
    <Link href={`/wish/${wish.id}`} className="block w-72 h-72 shrink-0">
      <div
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        className="rounded-xl shadow-sm border hover:shadow-md transition-all h-full flex flex-col overflow-hidden"
      >
        <div className="p-5 flex flex-col gap-3 flex-1">
          {/* 頂部 badges */}
          <div className="flex items-center">
            <CategoryBadge name={wish.category_name} color={wish.category_color} />
          </div>

          {/* 日期 */}
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            發起：{new Date(wish.created_at).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>

          {/* 標題 */}
          <h3
            className="font-semibold text-base leading-snug line-clamp-2"
            style={{ color: 'var(--foreground)' }}
          >
            {wish.title}
          </h3>

          {/* 描述 */}
          <p
            className="text-sm leading-relaxed line-clamp-3 flex-1"
            style={{ color: 'var(--muted)' }}
          >
            {wish.description.slice(0, 80)}
            {wish.description.length > 80 ? '...' : ''}
          </p>

          {/* 底部資訊 */}
          <div
            className="flex items-center justify-between text-xs pt-2 border-t"
            style={{ color: 'var(--muted)', borderColor: 'var(--border)' }}
          >
            <span>by {wish.author_name}</span>
            <div className="flex items-center gap-3">
              <span>💬 {wish.comment_count ?? 0}</span>
              <span>🙋 {wish.join_count ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
