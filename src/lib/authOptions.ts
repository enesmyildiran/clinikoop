import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db";
import bcrypt from "bcryptjs";
import { AuditLogger } from "./audit-logger";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
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
              // Audit log - successful login
              await AuditLogger.logLogin(clinicUser.id, true);
              
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
            where: { email: credentials.email },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              password: true
            }
          });

          if (user) {
            // Database'deki hash'li şifreyi karşılaştır
            const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
            if (isPasswordValid) {
              // Audit log - successful admin login
              await AuditLogger.logLogin(user.id, true);
              
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                isSuperAdmin: true
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
    maxAge: parseInt(process.env.SESSION_MAX_AGE || "28800"), // 8 hours
  },
  jwt: {
    maxAge: parseInt(process.env.SESSION_MAX_AGE || "28800"), // 8 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.clinicId = (user as any).clinicId;
        token.clinic = (user as any).clinic;
        token.isSuperAdmin = (user as any).isSuperAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.sub!;
        (session.user as any).role = token.role as string;
        (session.user as any).clinicId = token.clinicId as string;
        (session.user as any).clinic = token.clinic as any;
        (session.user as any).isSuperAdmin = token.isSuperAdmin as boolean;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}; 