export type WishCategory =
  | 'event'
  | 'collab'
  | 'media'
  | 'space'
  | 'research'

export const CATEGORY_LABELS: Record<WishCategory, string> = {
  event: '活動策劃',
  collab: '協作計畫',
  media: '內容媒體',
  space: '空間場域',
  research: '研究調查',
}

export interface Wish {
  id: string
  title: string
  category: WishCategory
  description: string
  author_name: string
  author_social: string | null
  is_urgent: boolean
  created_at: string
  comment_count?: number
  join_count?: number
}

export interface Comment {
  id: string
  wish_id: string
  author_name: string
  author_social: string | null
  content: string
  created_at: string
}

export interface Join {
  id: string
  wish_id: string
  name: string
  social: string | null
  message: string | null
  created_at: string
}
