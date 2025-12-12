// lib/email/nodemailer.ts
import nodemailer from "nodemailer";

export type SendArgs = { to: string; subject: string; text?: string; html?: string };

// Cached transporter (singleton)
let transporter: nodemailer.Transporter | null = null;

function ensureEnv() {
  const missing: string[] = [];
  if (!process.env.SMTP_HOST) missing.push("SMTP_HOST");
  if (!process.env.SMTP_USER) missing.push("SMTP_USER");
  if (!process.env.SMTP_PASS) missing.push("SMTP_PASS");
  if (missing.length) {
    throw new Error(`Missing SMTP env vars: ${missing.join(", ")}`);
  }
}

function getTransporter() {
  if (transporter) return transporter;
  ensureEnv();

  const host = process.env.SMTP_HOST!;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER!;
  const pass = process.env.SMTP_PASS!;

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return transporter;
}

export async function sendBookingEmail({ to, subject, text, html }: SendArgs) {
  const t = getTransporter();
  const fromAddress = process.env.FROM_EMAIL || "no-reply@firstclasstransfers.eu";
  const fromLabel = process.env.FROM_LABEL || "First Class Transfers";

  const info = await t.sendMail({
    from: `${fromLabel} <${fromAddress}>`,
    to,
    subject,
    text,
    html,
  });

  // you can hook your logger here instead of console
  console.info("sendBookingEmail: messageId=", info.messageId);
}
