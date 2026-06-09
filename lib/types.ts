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

// 淺色模式：bg / text；深色模式：darkBg / darkText
export const CATEGORY_COLORS: Record<WishCategory, {
  bg: string; text: string; darkBg: string; darkText: string
}> = {
  event:    { bg: '#fff0e0', text: '#c05c00', darkBg: '#2e1f0a', darkText: '#ffa94d' },
  collab:   { bg: '#ede9ff', text: '#5b3fd4', darkBg: '#1e1640', darkText: '#b197fc' },
  media:    { bg: '#e0f7f4', text: '#0a7a6a', darkBg: '#0a2421', darkText: '#63d9c8' },
  space:    { bg: '#e6f4e6', text: '#2a7a2a', darkBg: '#0e2110', darkText: '#87d987' },
  research: { bg: '#fde8f0', text: '#b5275a', darkBg: '#2a0f1c', darkText: '#f794b8' },
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
