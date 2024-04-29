import { createTransport } from "nodemailer";

interface EmailProps {
  to: string;
  subject: string;
  body: string;
}

export async function sendEmail({ to, subject, body }: EmailProps) {
  const transport = createTransport(process.env.EMAIL_SERVER);

  if (process.env.NODE_ENV === "development") {
    to = "ashwincherian.spam@gmail.com";
  }

  transport.sendMail({
    to,
    from: "noreply@linkituptest.com",
    subject,
    text: body,
    priority: "high",
  });
}
