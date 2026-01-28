import { NextResponse } from "next/server";


export async function GET() {

  const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://92.113.29.160:1805";

  try {
    const res = await fetch(`${API_BASE_URL}/routes/`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch routes" },
        { status: res.status }
      );
    }

    const routes = await res.json();
    return NextResponse.json(routes);
  } catch (err) {
    console.error("Booking routes proxy error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
