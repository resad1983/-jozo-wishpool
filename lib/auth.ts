import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from './supabase'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: '密碼', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // 從 Supabase 取得管理員帳號
        const { data, error } = await supabaseAdmin
          .from('admin_account')
          .select('email, password_hash')
          .eq('id', 1)
          .single()

        // fallback 到環境變數（初始化時用）
        const adminEmail = data?.email ?? process.env.ADMIN_EMAIL
        const adminHash = data?.password_hash ?? process.env.ADMIN_PASSWORD_HASH

        if (error || !adminEmail || !adminHash) return null
        if (credentials.email !== adminEmail) return null

        const isValid = await bcrypt.compare(credentials.password, adminHash)
        if (!isValid) return null

        return { id: '1', email: adminEmail, name: 'Admin' }
      },
    }),
  ],
  pages: {
    signIn: '/admin',
  },
  session: {
    strategy: 'jwt',
  },
}
