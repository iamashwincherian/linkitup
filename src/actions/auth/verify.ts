"use server";

import crypto from "crypto";

import { getUserByEmail } from "@/services/user";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { EmailVerificationCode } from "@prisma/client";

const CODE_EXPIRY_IN_MINS = 60;

const generateNewCode = async (
  userId: string,
  existingCode: EmailVerificationCode | null
) => {
  const token = crypto.randomInt(1_000, 10_000);
  const expiry = new Date(
    new Date().getTime() + 1000 * 60 * CODE_EXPIRY_IN_MINS
  );

  if (existingCode) {
    await db.emailVerificationCode.delete({
      where: { userId },
    });
  }

  await db.emailVerificationCode.create({
    data: { code: token.toString(), expiry, userId },
  });

  return token;
};

const verifyUser = async (userId: string) => {
  await db.user.update({
    where: { id: userId },
    data: { emailVerified: new Date() },
  });
};

export async function sendEmailVerificationCode(
  email: string,
  resend: boolean = false
) {
  const existingUser = await getUserByEmail(email);
  if (!existingUser) return;
  let isTokenNew = false;

  const existingCode = await db.emailVerificationCode.findFirst({
    where: { userId: existingUser.id },
  });
  let code: number | string | undefined = existingCode?.code;

  if (existingCode && existingCode?.expiry < new Date()) {
    code = await generateNewCode(existingUser.id, existingCode);
    isTokenNew = true;
  }

  if (isTokenNew || resend) {
    sendEmail({
      to: email,
      subject: `Link It Up PIN: ${code}`,
      body: `Welcome to Link It Up. Use this PIN to verify your email Id. PIN: ${code}. It will expire within 60 mins.`,
    });
    if (process.env.NODE_ENV === "development") {
      console.log(`Email sent to: ${email}, with PIN: ${code}`);
    }
    return true;
  }

  return false;
}

export async function verifyOtp(email: string, code: string) {
  const user = await getUserByEmail(email);
  if (!user) return;

  const verification = await db.emailVerificationCode.findFirst({
    where: { userId: user.id, code },
  });
  if (!verification) {
    return { error: "Incorrect OTP!" };
  }

  if (verification.expiry < new Date()) {
    return { error: "OTP has expired!!" };
  }

  await db.emailVerificationCode.delete({ where: { userId: user.id } });
  await verifyUser(user.id);

  return { success: "Email successfully verfied!" };
}
