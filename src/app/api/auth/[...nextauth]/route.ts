import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // 1) LOGIN: obtiene la cookie httpOnly del backend
        const loginRes = await fetch(`${BACKEND_URL}/api/auth/signin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!loginRes.ok) return null;

        // <-- OBTENER LA COOKIE DEL BACKEND (super importante)
        const cookie = loginRes.headers.get("set-cookie");
        if (!cookie) return null; // sin cookie, no hay sesión válida

        // 2) Llamar /me reenviando la cookie manualmente
        const meRes = await fetch(`${BACKEND_URL}/api/users/me`, {
          method: "GET",
          headers: {
            Cookie: cookie, // <-- REENVÍA la cookie httpOnly
          },
        });

        if (!meRes.ok) return null;

        const user = await meRes.json();

        // user = { id, email, name, role }
        return user;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
