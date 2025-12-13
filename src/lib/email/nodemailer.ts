import nodemailer from "nodemailer";

export type SendArgs = { to: string; subject: string; text?: string; html?: string };

/**
 * Cached transporter singleton
 */
let transporter: nodemailer.Transporter | null = null;

function ensureEnv() {
  if (!process.env.FROM_EMAIL) {
    console.warn("FROM_EMAIL not set — defaulting to no-reply@firstclasstransfers.eu");
  }
  if (!process.env.BOOKING_EMAIL) {
    console.warn("BOOKING_EMAIL not set — emails will go to booking@firstclasstransfers.eu");
  }
}

/**
 * Create and cache a nodemailer transporter using local sendmail.
 * Logs initialization for debugging purposes.
 */
function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;

  ensureEnv();

  // Use sendmail transport for local mail delivery
  transporter = nodemailer.createTransport({
    sendmail: true,
    newline: "unix",
    path: "/usr/sbin/sendmail",
  });

  console.info("Sendmail transporter initialized");

  return transporter;
}

/**
 * Send an email for bookings using the local sendmail transport.
 * Returns the nodemailer "info" on success or throws.
 */
export async function sendBookingEmail({ to, subject, text, html }: SendArgs) {
  const t = getTransporter();

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
