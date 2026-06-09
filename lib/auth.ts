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

        const { data, error } = await supabaseAdmin
          .from('admin_accounts')
          .select('id, email, password_hash')
          .eq('email', credentials.email)
          .single()

        if (error || !data) return null

        const isValid = await bcrypt.compare(credentials.password, data.password_hash)
        if (!isValid) return null

        return { id: data.id, email: data.email, name: 'Admin' }
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
