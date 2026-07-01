import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@purebook/db";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const member = await prisma.member.findUnique({
          where: { email: credentials.email.toLowerCase() },
          include: { sites: true },
        });

        if (!member || !member.passwordHash) return null;

        const valid = await bcrypt.compare(credentials.password, member.passwordHash);
        if (!valid) return null;

        const primarySite = member.sites[0];

        return {
          id: member.id,
          email: member.email,
          name: `${member.firstName} ${member.lastName}`,
          siteId: primarySite?.id ?? null,
          siteName: primarySite?.name ?? null,
          role: member.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.siteId = (user as any).siteId;
        token.siteName = (user as any).siteName;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).siteId = token.siteId;
        (session.user as any).siteName = token.siteName;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};
