import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// 公開用（anon key）
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 管理員用（service role key，繞過 RLS）
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
