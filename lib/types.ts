export const COLOR_PALETTE: Record<string, {
  label: string
  swatch: string
  bg: string; text: string; darkBg: string; darkText: string
}> = {
  orange:  { label: '橘色', swatch: '#f97316', bg: '#fff0e0', text: '#c05c00', darkBg: '#2e1f0a', darkText: '#ffa94d' },
  amber:   { label: '琥珀', swatch: '#f59e0b', bg: '#fef3c7', text: '#92400e', darkBg: '#271a04', darkText: '#fcd34d' },
  yellow:  { label: '黃色', swatch: '#eab308', bg: '#fef9c3', text: '#854d0e', darkBg: '#2a1f00', darkText: '#fde047' },
  lime:    { label: '萊姆', swatch: '#84cc16', bg: '#f0fce7', text: '#3a6b00', darkBg: '#142200', darkText: '#bef264' },
  green:   { label: '綠色', swatch: '#22c55e', bg: '#e6f4e6', text: '#2a7a2a', darkBg: '#0e2110', darkText: '#87d987' },
  teal:    { label: '藍綠', swatch: '#14b8a6', bg: '#e0f7f4', text: '#0a7a6a', darkBg: '#0a2421', darkText: '#63d9c8' },
  cyan:    { label: '青色', swatch: '#06b6d4', bg: '#e0f7fb', text: '#0e6b7a', darkBg: '#042029', darkText: '#67e8f9' },
  blue:    { label: '藍色', swatch: '#3b82f6', bg: '#e0eeff', text: '#1d4ed8', darkBg: '#0a1830', darkText: '#93c5fd' },
  indigo:  { label: '靛藍', swatch: '#6366f1', bg: '#eef2ff', text: '#3730a3', darkBg: '#12123a', darkText: '#a5b4fc' },
  purple:  { label: '紫色', swatch: '#8b5cf6', bg: '#ede9ff', text: '#5b3fd4', darkBg: '#1e1640', darkText: '#b197fc' },
  violet:  { label: '紫羅蘭', swatch: '#a855f7', bg: '#f5e8ff', text: '#7e22ce', darkBg: '#240d38', darkText: '#d8b4fe' },
  pink:    { label: '粉紅', swatch: '#ec4899', bg: '#fde8f0', text: '#b5275a', darkBg: '#2a0f1c', darkText: '#f794b8' },
  rose:    { label: '玫瑰', swatch: '#f43f5e', bg: '#ffe4e8', text: '#9f1239', darkBg: '#2a0510', darkText: '#fda4af' },
  red:     { label: '紅色', swatch: '#ef4444', bg: '#fee2e2', text: '#991b1b', darkBg: '#2a0a0a', darkText: '#fca5a5' },
  stone:   { label: '石灰', swatch: '#78716c', bg: '#f5f5f4', text: '#44403c', darkBg: '#1c1917', darkText: '#d6d3d1' },
  slate:   { label: '石板', swatch: '#64748b', bg: '#f1f5f9', text: '#334155', darkBg: '#0f172a', darkText: '#cbd5e1' },
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
