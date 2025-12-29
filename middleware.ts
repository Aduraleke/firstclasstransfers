// middleware.ts
import { NextResponse } from "next/server";

export function middleware() {
  // Moved all CSP to webserver conf instead for easier maintenance.
  return NextResponse.next();
}
