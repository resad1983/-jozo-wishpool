'use client'

import { Comment } from '@/lib/types'

export default function CommentList({
  comments,
}: {
  comments: Comment[]
  wishId: string
}) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        還沒有留言，來第一個吧！
      </div>
    )
  }

  return (
    <div className="mb-4">
      <h2 className="font-semibold text-gray-800 mb-3">💬 留言（{comments.length}）</h2>
      <div className="flex flex-col gap-3">
        {comments.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-medium text-sm text-gray-800">{c.author_name}</span>
              {c.author_social && (
                <span className="text-xs text-indigo-500">{c.author_social}</span>
              )}
              <span className="text-xs text-gray-400 ml-auto">
                {new Date(c.created_at).toLocaleDateString('zh-TW')}
              </span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
