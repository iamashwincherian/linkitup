import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthConfig } from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import { db } from "./lib/db";
import { LoginSchema } from "./schemas/auth";
import { getUserByEmail } from "./services/user";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import { LOGIN_PATH } from "./routes";

const { GOOGLE_ID, GOOGLE_SECRET } = process.env;

export default {
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    CredentialProvider({
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
    GoogleProvider({
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
        session.user.emailVerified = token.verified as Date | null;
      }
      return session;
    },
    async jwt({ token }) {
      const { email } = token;
      const user = await getUserByEmail(email);
      if (user) {
        token.verified = user?.emailVerified;
      }

      return token;
    },
  },
  pages: {
    signIn: LOGIN_PATH,
    error: "/auth/error",
  },
} satisfies NextAuthConfig;
