import NextAuth from "next-auth";
import Credential from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";

import { db } from "./lib/db";
import { LoginSchema } from "./schemas/auth";
import { createUser, getUserByEmail } from "./services/user";
import { LOGIN_PATH } from "./routes";

const { GOOGLE_ID, GOOGLE_SECRET } = process.env;

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    Credential({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (!validatedFields.success) return null;

        const { email, password } = validatedFields.data;
        const user = await getUserByEmail(email);
        if (!user || !user.password) return null;

        const isPasswordMatching = bcrypt.compareSync(password, user.password);
        if (!isPasswordMatching) return null;

        return user;
      },
    }),
    Google({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      let existingUser = await getUserByEmail(user?.email);

      if (account?.provider === "google") {
        return true;
        // if (!existingUser) {
        //   const { name = "", email } = user;
        //   if (!email || !name) return false;

        //   existingUser = await db.user.create({
        //     data: { name, email, emailVerified: new Date() },
        //   });

        // }
      }

      if (!existingUser) return false;
      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
  pages: {
    signIn: LOGIN_PATH,
    error: "/auth/error",
  },
});
