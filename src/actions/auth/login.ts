import { z } from "zod";

import { LoginSchema } from "@/schemas/auth";
import { signIn } from "next-auth/react";

export async function login(values: z.infer<typeof LoginSchema>) {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    });
  } catch (error) {
    // if (error instanceof NextAuth) {
    //   switch (error.type) {
    //     case "CredentialsSignin":
    //       return { error: "Invalid credentials!" };
    //     default:
    //       return { error: "Something went wrong!" };
    //   }
    // } else {
    // }
    throw error;
  }
}

export async function googleLogin() {
  try {
    await signIn("google");
  } catch (error) {
    console.log("stupid error", error);
  }
}
