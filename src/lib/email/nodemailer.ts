import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

export type SendArgs = { to: string; subject: string; text?: string; html?: string };

/**
 * Cached transporter singleton
 */
let transporter: nodemailer.Transporter | null = null;

function ensureEnv() {
  const missing: string[] = [];
  if (!process.env.SMTP_HOST) missing.push("SMTP_HOST");
  if (!process.env.SMTP_USER) missing.push("SMTP_USER");
  if (!process.env.SMTP_PASS) missing.push("SMTP_PASS");

  if (missing.length) {
    // Still throw here — callers (route) will often handle/report this.
    throw new Error(`Missing SMTP env vars: ${missing.join(", ")}`);
  }

  if (!process.env.SMTP_PORT) {
    console.warn("SMTP_PORT not set; defaulting to 587 (STARTTLS).");
  }

  if (!process.env.FROM_EMAIL) {
    console.warn("FROM_EMAIL not set — defaulting to no-reply@firstclasstransfers.eu");
  }
  if (!process.env.BOOKING_EMAIL) {
    console.warn("BOOKING_EMAIL not set — emails will go to booking@firstclasstransfers.eu");
  }
}

/**
 * Create and cache a nodemailer transporter. Verifies the transporter after creation,
 * and logs verification results (does not throw on verification failure to avoid crashing on cold start).
 */
function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;

  ensureEnv();

  const host = process.env.SMTP_HOST!;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER!;
  const pass = process.env.SMTP_PASS!;

  const opts: SMTPTransport.Options = {
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
    // sensible timeouts
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 10_000,
  };

  transporter = nodemailer.createTransport(opts);

  // verify immediately (log result) — do not throw to avoid crashing on cold start
  transporter
    .verify()
    .then(() => {
      console.info("SMTP transporter verified OK");
    })
    .catch((err) => {
      console.error("SMTP transporter verification failed:", err && err.message ? err.message : err);
    });

  return transporter;
}

/**
 * Send an email for bookings. Returns the nodemailer "info" on success or throws.
 *
 * NOTE: this function returns a structured result on failure instead of leaking secrets.
 */
export async function sendBookingEmail({ to, subject, text, html }: SendArgs) {
  let t: nodemailer.Transporter;
  try {
    t = getTransporter();
  } catch (err) {
    // Explicit, structured error when env is missing.
    const message = err instanceof Error ? err.message : String(err);
    console.error("sendBookingEmail: transporter creation failed:", message);
    // Re-throw so callers (route) can decide how to respond. Route uses devOnly to add details.
    throw new Error(`Email configuration error: ${message}`);
  }

  const fromAddress = process.env.FROM_EMAIL || "no-reply@firstclasstransfers.eu";
  const fromLabel = process.env.FROM_LABEL || "First Class Transfers";

  try {
    const info = await t.sendMail({
      from: `${fromLabel} <${fromAddress}>`,
      to,
      subject,
      text,
      html,
    });

    return info;
  } catch (err: unknown) {
    // Provide maximum debug info without leaking secrets
    if (err instanceof Error) {
      console.error("sendBookingEmail error:", err.message);
      // include stack for server logs (do not put stack into client responses in production)
      console.error(err.stack);
    } else {
      console.error("sendBookingEmail unknown error:", err);
    }
    // rethrow so callers can respond appropriately (route handles this and returns 502)
    throw err;
  }
}
