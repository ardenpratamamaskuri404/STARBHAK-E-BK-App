// lib/auth.js → VERSI FINAL PAKE JAVASCRIPT DOANG (BUAT KAMU!)
import CredentialsProvider from "next-auth/providers/credentials";
import { pool } from "@/lib/database";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const [rows] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [credentials.email]
          );

          const user = rows[0];
          if (!user) return null;

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            phone: user.phone,
            avatar_url: user.avatar_url,
          };
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.phone = user.phone;
        token.avatar_url = user.avatar_url;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.phone = token.phone;
        session.user.avatar_url = token.avatar_url;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET || "ganti-rahasia-ini-jangan-pake-yang-ini",
};

export default authOptions;