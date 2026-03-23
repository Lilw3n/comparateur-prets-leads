import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { isConfiguredAdminEmail } from "@/lib/admin-env";

const ADMIN = "ADMIN" as const;
const USER = "USER" as const;

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const [{ getPrisma }, { compare }] = await Promise.all([
            import("@/lib/prisma"),
            import("bcryptjs"),
          ]);
          const prisma = getPrisma();
          const email = String(credentials.email).toLowerCase().trim();
          let user = await prisma.user.findUnique({ where: { email } });
          if (!user) return null;
          const valid = await compare(String(credentials.password), user.passwordHash);
          if (!valid) return null;

          if (isConfiguredAdminEmail(user.email) && user.role !== ADMIN) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { role: ADMIN },
            });
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (err) {
          console.error("[auth] authorize", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = (user as { role: typeof ADMIN | typeof USER }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        if (token.email) session.user.email = token.email as string;
        if (token.name !== undefined) session.user.name = token.name as string | null;
        const r = token.role;
        session.user.role = r === ADMIN || r === USER ? r : USER;
      }
      return session;
    },
  },
});
