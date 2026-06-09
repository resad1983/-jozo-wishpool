'use client'

import { useState } from 'react'
import { Comment } from '@/lib/types'

export default function CommentList({
  comments,
}: {
  comments: Comment[]
  wishId: string
}) {
  const [showAll, setShowAll] = useState(false)

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        還沒有留言，來第一個吧！
      </div>
    )
  }

  const sorted = [...comments].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
  const visible = showAll ? sorted : sorted.slice(0, 3)
  const hidden = sorted.length - 3

  return (
    <div className="mb-4">
      <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
        💬 留言（{comments.length}）
      </h2>
      <div className="flex flex-col gap-3">
        {visible.map((c) => (
          <div key={c.id} className="rounded-xl border px-4 py-3"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{c.author_name}</span>
              {c.author_social && (
                <span className="text-xs text-indigo-500">{c.author_social}</span>
              )}
              <span className="text-xs text-gray-400 ml-auto">
                {new Date(c.created_at).toLocaleDateString('zh-TW')}
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>{c.content}</p>
          </div>
        ))}
      </div>

      {!showAll && hidden > 0 && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-3 w-full text-sm text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-xl py-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
        >
          顯示全部 {sorted.length} 則留言
        </button>
      )}

      {showAll && sorted.length > 3 && (
        <button
          onClick={() => setShowAll(false)}
          className="mt-3 w-full text-sm text-gray-500 border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          收起留言
        </button>
      )}
    </div>
  )
}
