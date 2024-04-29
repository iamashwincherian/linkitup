"use server";

import { z } from "zod";

import { RegisterSchema } from "@/schemas/auth";
import { createUser } from "@/services/user";

export default async function login(values: z.infer<typeof RegisterSchema>) {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const response = await createUser(validatedFields.data);
  if (response?.error) {
    return response;
  }

  return { success: "Successfully created a new account!" };
}
