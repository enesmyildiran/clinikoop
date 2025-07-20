import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Önce ClinicUser'da ara (klinik kullanıcıları)
          const clinicUser = await prisma.clinicUser.findFirst({
            where: { 
              email: credentials.email,
              isActive: true
            },
            include: { clinic: true }
          });

          if (clinicUser) {
            const isPasswordValid = await bcrypt.compare(
              credentials.password,
              clinicUser.password
            );

            if (isPasswordValid) {
              return {
                id: clinicUser.id,
                email: clinicUser.email,
                name: clinicUser.name,
                role: clinicUser.role,
                clinicId: clinicUser.clinicId,
                clinic: clinicUser.clinic
              };
            }
          }

          // Eğer ClinicUser'da bulunamazsa User'da ara (süper admin için)
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (user) {
            // User modelinde password yok, sadece email kontrolü
            // Bu sadece development için - production'da password olmalı
            if (credentials.email === user.email && credentials.password === "superadmin123") {
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
              };
            }
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.clinicId = (user as any).clinicId;
        token.clinic = (user as any).clinic;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.sub!;
        (session.user as any).role = token.role as string;
        (session.user as any).clinicId = token.clinicId as string;
        (session.user as any).clinic = token.clinic as any;
      }
      return session;
    }
  },
  pages: {
    signIn: "/admin-login",
    error: "/admin-login"
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}; 