import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  clinicId: string | null;
  isSuperAdmin: boolean;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'E-posta', type: 'email', placeholder: 'mail@klinik.com' },
        password: { label: 'Şifre', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        // Önce User (süper admin) modelinde ara
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (user) {
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) return null;
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            clinicId: null,
            isSuperAdmin: true,
          } as AuthUser;
        }
        // Sonra ClinicUser (klinik kullanıcıları) modelinde ara
        const clinicUser = await prisma.clinicUser.findFirst({
          where: { email: credentials.email },
        });
        if (clinicUser) {
          const isValid = await bcrypt.compare(credentials.password, clinicUser.password);
          if (!isValid) return null;
          return {
            id: clinicUser.id,
            email: clinicUser.email,
            name: clinicUser.name,
            role: clinicUser.role,
            clinicId: clinicUser.clinicId,
            isSuperAdmin: false,
          } as AuthUser;
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 gün
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as AuthUser;
        token.role = u.role;
        token.clinicId = u.clinicId;
        token.isSuperAdmin = u.isSuperAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).clinicId = token.clinicId;
        (session.user as any).isSuperAdmin = token.isSuperAdmin;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 