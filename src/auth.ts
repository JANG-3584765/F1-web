import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Kakao from 'next-auth/providers/kakao'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google, Kakao],
  pages: {
    signIn: '/login',
  },
})
