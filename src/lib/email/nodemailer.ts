import nodemailer from "nodemailer";

export type SendArgs = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

let transporter: nodemailer.Transporter | null = null;

function ensureEnv() {
  const required = [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "FROM_EMAIL",
  ];

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }
}

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;

  ensureEnv();

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });



  return transporter;
}

export async function sendEmail({ to, subject, text, html }: SendArgs) {
  const t = getTransporter();

  try {
    const info = await t.sendMail({
      from: `${process.env.FROM_LABEL ?? "First Class Transfers"} <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      text,
      html,
    });


    return info;
  } catch (err) {
    console.error("❌ Email send failed:", err);
    throw err;
  }
}
