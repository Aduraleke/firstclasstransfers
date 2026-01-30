import { RouteDetail } from "@/lib/routes/types";



export async function fetchAllRoutes(): Promise<RouteDetail[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/routes/`, {
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
