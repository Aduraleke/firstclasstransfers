// middleware.ts

import { NextResponse } from "next/server";

export function middleware() {
  const res = NextResponse.next();

  // Security headers - tuned to allow GTM, Google Fonts & your inline styles/scripts
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "no-referrer-when-downgrade");
  res.headers.set("X-XSS-Protection", "1; mode=block");

  // Content-Security-Policy - conservative, allows GTM, Google Fonts and common CDNs
  // NOTE: adjust if you add other external scripts or CDNs.
  const csp = [
    "default-src 'self' https:",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
    "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com",
    "frame-src https://www.googletagmanager.com",
  ].join("; ");

  res.headers.set("Content-Security-Policy", csp);

  return res;
}
