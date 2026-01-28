import { RouteDetail } from "@/lib/routes/types";



export async function fetchAllRoutes(): Promise<RouteDetail[]> {
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://92.113.29.160:1805";
  const res = await fetch(`${API_BASE_URL}/routes/`, {
    next: { revalidate: 60 }, // ISR
  });

  if (!res.ok) {
    throw new Error("Failed to fetch routes");
  }

  return res.json();
}

export async function fetchRouteBySlug(
  slug: string
): Promise<RouteDetail | null> {
  const routes = await fetchAllRoutes();
  return routes.find((r) => r.slug === slug) ?? null;
}
