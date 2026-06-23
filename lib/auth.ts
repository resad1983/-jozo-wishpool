import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { sql } from './db'

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

        const rows = await sql`
          SELECT id, email, password_hash
          FROM admin_accounts
          WHERE email = ${credentials.email}
          LIMIT 1
        `
        const account = rows[0]
        if (!account) return null

        const isValid = await bcrypt.compare(credentials.password, account.password_hash as string)
        if (!isValid) return null

        return { id: account.id as string, email: account.email as string, name: 'Admin' }
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
