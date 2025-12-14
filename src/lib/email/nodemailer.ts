import nodemailer from "nodemailer";
import type SendmailTransport from "nodemailer/lib/sendmail-transport";

export type SendArgs = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

let transporter: nodemailer.Transporter | null = null;

function ensureEnv() {
  if (!process.env.FROM_EMAIL) {
    console.warn(
      "FROM_EMAIL not set — defaulting to booking@firstclasstransfers.eu"
    );
  }
  if (!process.env.BOOKING_EMAIL) {
    console.warn(
      "BOOKING_EMAIL not set — defaulting to booking@firstclasstransfers.eu"
    );
  }
}

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;

  ensureEnv();

  const sendmailPath = process.env.SENDMAIL_PATH || "/usr/sbin/sendmail";

  // ✅ Properly typed sendmail config
  const transportOptions: SendmailTransport.Options = {
    sendmail: true,
    newline: "unix",
    path: sendmailPath,
  };

  transporter = nodemailer.createTransport(transportOptions);

  console.info(`📧 Sendmail transporter ready (${sendmailPath})`);

  return transporter;
}

export async function sendEmail({ to, subject, text, html }: SendArgs) {
  const t = getTransporter();

  const fromAddress =
    process.env.FROM_EMAIL || "booking@firstclasstransfers.eu";
  const fromLabel = process.env.FROM_LABEL || "First Class Transfers";

  return await t.sendMail({
    from: `${fromLabel} <${fromAddress}>`,
    to,
    subject,
    text,
    html,
  });
}
