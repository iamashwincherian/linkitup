"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { EmailVerifySchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Repeat } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useCountdown from "./useCountdown";
import { verifyOtp } from "@/actions/auth/verify";
import { sendEmailVerificationCode } from "../../../actions/auth/verify";
import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LOGIN_PATH } from "@/routes";

const OTP_RESEND_TIMEOUT = 30;

export default function VerifyForm({
  email,
  emailSent = false,
}: {
  email: string;
  emailSent: boolean | undefined;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { countdown, isOver, restart } = useCountdown(
    emailSent ? OTP_RESEND_TIMEOUT : 0
  );

  const form = useForm<z.infer<typeof EmailVerifySchema>>({
    resolver: zodResolver(EmailVerifySchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = (values: z.infer<typeof EmailVerifySchema>) => {
    startTransition(() => {
      verifyOtp(email, values.otp).then((data) => {
        if (data?.success) router.push("/");
      });
    });
  };

  const onResend = async () => {
    await sendEmailVerificationCode(email, true);
    restart(OTP_RESEND_TIMEOUT);
  };

  const resetOtp = () => {
    form.setValue("otp", "");
  };

  if (!email) return;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputOTP maxLength={4} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                <span className="cursor-pointer" onClick={resetOtp}>
                  Reset
                </span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            Submit
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!isOver || isPending}
            onClick={onResend}
          >
            <Repeat size={15} className="mr-2" />
            Resend OTP {countdown > 0 && <>in {countdown}s</>}
          </Button>
        </div>
      </form>

      <Link href={LOGIN_PATH}>
        <div className="cursor-pointer mt-2" onClick={resetOtp}>
          <small>Login with another account</small>
        </div>
      </Link>
    </Form>
  );
}
