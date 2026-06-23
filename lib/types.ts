export const COLOR_PALETTE: Record<string, {
  label: string
  swatch: string
  bg: string; text: string; darkBg: string; darkText: string
}> = {
  orange: { label: '橘色', swatch: '#f97316', bg: '#fff0e0', text: '#c05c00', darkBg: '#2e1f0a', darkText: '#ffa94d' },
  purple: { label: '紫色', swatch: '#8b5cf6', bg: '#ede9ff', text: '#5b3fd4', darkBg: '#1e1640', darkText: '#b197fc' },
  teal:   { label: '藍綠', swatch: '#14b8a6', bg: '#e0f7f4', text: '#0a7a6a', darkBg: '#0a2421', darkText: '#63d9c8' },
  green:  { label: '綠色', swatch: '#22c55e', bg: '#e6f4e6', text: '#2a7a2a', darkBg: '#0e2110', darkText: '#87d987' },
  pink:   { label: '粉紅', swatch: '#ec4899', bg: '#fde8f0', text: '#b5275a', darkBg: '#2a0f1c', darkText: '#f794b8' },
  blue:   { label: '藍色', swatch: '#3b82f6', bg: '#e0eeff', text: '#1d4ed8', darkBg: '#0a1830', darkText: '#93c5fd' },
  yellow: { label: '黃色', swatch: '#eab308', bg: '#fef9c3', text: '#854d0e', darkBg: '#2a1f00', darkText: '#fde047' },
  red:    { label: '紅色', swatch: '#ef4444', bg: '#fee2e2', text: '#991b1b', darkBg: '#2a0a0a', darkText: '#fca5a5' },
}

export interface Category {
  id: string
  slug: string
  name: string
  color: string
  created_at: string
}

export interface Wish {
  id: string
  title: string
  category: string
  category_name: string
  category_color: string
  description: string
  author_name: string
  author_social: string | null
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
