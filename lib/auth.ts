import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

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

        const adminEmail = process.env.ADMIN_EMAIL
        const adminHash = process.env.ADMIN_PASSWORD_HASH

        if (!adminEmail || !adminHash) return null
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
