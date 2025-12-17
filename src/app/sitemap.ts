import { ROUTE_DETAILS } from "@/lib/routes";

const BASE_URL = "https://firstclasstransfers.eu";

export default function sitemap() {
  const staticPages = [
    "",
    "/booking",
    "/contact",
    "/faqs",
    "/payment",
    "/privacy-policy",
    "/terms",
    "/service-guide",
    "/routes",
  ];

  const staticUrls = staticPages.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1.0 : 0.8,
  }));

  const routeUrls = ROUTE_DETAILS.map((route) => ({
    url: `${BASE_URL}/routes/${route.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticUrls, ...routeUrls];
}
