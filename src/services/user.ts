import bcrypt from "bcryptjs";
import { z } from "zod";

import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas/auth";

export async function getUserByEmail(email: string | null | undefined) {
  if (!email) return;

  const user = await db.user.findUnique({ where: { email } });
  return user;
}

export async function getUserById(id: string | undefined) {
  if (!id) return;

  const user = await db.user.findFirst({ where: { id } });
  return user;
}

export async function createUser(data: z.infer<typeof RegisterSchema>) {
  const { name, email } = data;
  let password = data.password;

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "Email already exists!" };
  }

  if (password) {
    password = bcrypt.hashSync(password, 10);
  }

  await db.user.create({
    data: { name, email, password, emailVerified: new Date() },
  });
}
