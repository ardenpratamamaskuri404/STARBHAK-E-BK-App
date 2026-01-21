import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { query } from "@/lib/database";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        identifier: { label: "Email / NIS / NIP", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const { identifier, password } = credentials;

        if (!identifier || !password) return null;

        // Cari user berdasarkan email, nis, nip
        const rows = await query(
          `
          SELECT u.*
          FROM users u
          LEFT JOIN siswa_profile sp ON sp.user_id = u.id
          LEFT JOIN guru_profile gp ON gp.user_id = u.id
          WHERE u.email = ?
             OR sp.nis = ?
             OR gp.nip = ?
          LIMIT 1
          `,
          [identifier, identifier, identifier]
        );

        const user = rows[0];
        if (!user) return null;

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return null;

        // WAJIB return **objek clean**
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar_url: user.avatar_url || null,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
  async jwt({ token, user, trigger, session }) {
    // SIMPAN DATA USER KE TOKEN SAAT LOGIN
    if (user) {
      token.id = user.id;
      token.name = user.name;
      token.role = user.role;
      token.email = user.email;        // ⭐ WAJIB SUPAYA SESSION LENGKAP
      token.avatar_url = user.avatar_url || null;
    }

    // UPDATE SESSION (avatar / nama)
    if (trigger === "update") {
      if (session.name !== undefined) token.name = session.name;
      if (session.avatar_url !== undefined) token.avatar_url = session.avatar_url;
    }

    return token;
  },

  async session({ session, token }) {
    // ⭐ SESSION HARUS SELALU PUNYA STRUKTUR LENGKAP
    session.user = {
      id: token.id ?? null,
      name: token.name ?? "",
      email: token.email ?? "",         // ⭐ PENTING: email diset dari token
      role: token.role ?? "",
      avatar_url: token.avatar_url ?? null,
    };

    return session;
  },
},

  pages: {
    signIn: "/auth/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// Jangan ubah ini
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
