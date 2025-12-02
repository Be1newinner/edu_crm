import { ENV_CONFIGS } from "../../shared/config/envs.config";
import nodemailer from "nodemailer";

// export const transporter = nodemailer.createTransport({
//   host: ENV_CONFIGS.SMTP_HOST,
//   port: ENV_CONFIGS.SMTP_PORT,
//   secure: true,
//   auth: {
//     user: ENV_CONFIGS.SMTP_USER,
//     pass: ENV_CONFIGS.SMTP_PASS,
//   },
// });
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMailService(
  to: string,
  username: string,
  otpSendingTemplate: (
    username: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...rest: any[]
  ) => {
    subject: string;
    html: string;
    text: string;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  other: any[]
) {
  const { subject, html, text } = otpSendingTemplate(username, ...other);

  await transporter.sendMail({
    from: `"${ENV_CONFIGS.ORG_NAME}" <${ENV_CONFIGS.SMTP_USER}>`,
    to,
    subject,
    html,
    text,
  });
}
