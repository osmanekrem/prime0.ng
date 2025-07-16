import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { getUserById } from "@/data/user";

export const { handlers, auth, signIn, signOut } = NextAuth({
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;
      if (!user.id) return false;
      const existingUser = await getUserById(user.id);

      return !!existingUser && !!existingUser.emailVerified;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.surname && session.user) {
        session.user.surname = token.surname as string;
      }

      return session;
    },
    async jwt({ token }) {
      try {
        if (!token.sub) return token;

        const existingUser = await getUserById(token.sub);
        if (!existingUser) return token;

        token.surname = existingUser.surname;

        return token;
      } catch (error) {
        console.error("JWT callback error:", error);
        return token;
      }
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  ...authConfig,
});
