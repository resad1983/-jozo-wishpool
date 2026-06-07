import { z } from 'zod'

export const wishSchema = z.object({
  title: z.string().min(2, '標題至少 2 字').max(50, '標題最多 50 字'),
  category: z.enum(['event', 'collab', 'media', 'space', 'research'], {
    error: '請選擇分類',
  }),
  description: z.string().min(10, '描述至少 10 字').max(500, '描述最多 500 字'),
  author_name: z.string().min(1, '請填寫名稱').max(20, '名稱最多 20 字'),
  author_social: z
    .string()
    .max(30, '社群帳號最多 30 字')
    .refine((v) => !v || v.startsWith('@'), { message: '社群帳號請以 @ 開頭' })
    .optional()
    .or(z.literal('')),
  is_urgent: z.boolean().optional().default(false),
  honeypot: z.string().max(0, '').optional(),
})

export const commentSchema = z.object({
  author_name: z.string().min(1, '請填寫名稱').max(20, '名稱最多 20 字'),
  author_social: z
    .string()
    .max(30, '社群帳號最多 30 字')
    .refine((v) => !v || v.startsWith('@'), { message: '社群帳號請以 @ 開頭' })
    .optional()
    .or(z.literal('')),
  content: z.string().min(1, '留言不能為空').max(300, '留言最多 300 字'),
  honeypot: z.string().max(0, '').optional(),
})

export const joinSchema = z.object({
  name: z.string().min(1, '請填寫名稱').max(20, '名稱最多 20 字'),
  social: z
    .string()
    .max(30, '社群帳號最多 30 字')
    .refine((v) => !v || v.startsWith('@'), { message: '社群帳號請以 @ 開頭' })
    .optional()
    .or(z.literal('')),
  message: z.string().max(100, '說明最多 100 字').optional().or(z.literal('')),
  honeypot: z.string().max(0, '').optional(),
})
