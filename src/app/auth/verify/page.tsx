import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserByEmail } from "@/services/user";
import { redirect } from "next/navigation";
import VerifyForm from "./verify-form";
import { sendEmailVerificationCode } from "@/actions/auth/verify";
import { LOGIN_PATH } from "@/routes";

interface VerifyPageProps {
  searchParams: {
    email?: string;
  };
}

export default async function VerifyPage(props: VerifyPageProps) {
  const {
    searchParams: { email },
  } = props;

  if (!email) redirect(LOGIN_PATH);

  const existingUser = await getUserByEmail(email);
  if (!existingUser) redirect(LOGIN_PATH);

  const emailSent = await sendEmailVerificationCode(email);

  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>One-Time Password</CardTitle>
        <CardDescription>
          Please enter the one-time password sent to your email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VerifyForm email={email} emailSent={emailSent} />
      </CardContent>
    </Card>
  );
}
