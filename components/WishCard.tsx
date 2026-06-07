'use client'

import Link from 'next/link'
import { Wish, CATEGORY_LABELS } from '@/lib/types'

interface WishCardProps {
  wish: Wish
}

export default function WishCard({ wish }: WishCardProps) {
  return (
    <Link href={`/wish/${wish.id}`}>
      <div
        className={`bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow h-full flex flex-col ${
          wish.is_urgent ? 'border-l-4 border-l-red-500' : 'border-gray-100'
        }`}
      >
        <div className="p-5 flex flex-col gap-3 flex-1">
          {/* 頂部 badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
              {CATEGORY_LABELS[wish.category]}
            </span>
            {wish.is_urgent && (
              <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-medium">
                🔥 急需人手
              </span>
            )}
          </div>

          {/* 標題 */}
          <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2">
            {wish.title}
          </h3>

          {/* 描述 */}
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1">
            {wish.description.slice(0, 80)}
            {wish.description.length > 80 ? '...' : ''}
          </p>

          {/* 底部資訊 */}
          <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-50">
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
