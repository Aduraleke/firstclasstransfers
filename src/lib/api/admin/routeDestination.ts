import { authFetch } from "./auth/client";
import { FAQItem, VehicleOption } from "./types";

/* ───────────────── FRONTEND TYPES ───────────────── */

export interface Route {
  id?: string;
  routeId: string;
  slug: string;

  fromLocation: string;
  toLocation: string;

  distance: string;
  time: string;

  sedanPrice: number;
  vanPrice: number;
  duration_minutes: number
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  subHeadline: string;
  body: string;

  whatMakesBetter: string[];
  whatsIncluded: string[];
  destinationHighlights: string[];
  idealFor: string[];

  faqs: FAQItem[];
  vehicleOptions: VehicleOption[];

  image: string; // URL from backend
  bookCtaLabel: string;
  bookCtaSupport: string;
}

/* ───────────────── BACKEND TYPES ───────────────── */

interface BackendRoute {
  duration_minutes: number;
  id?: number;
  route_id: string;
  slug: string;

  from_location: string;
  to_location: string;

  meta_title: string;
  meta_description: string;
  hero_title: string;
  sub_headline: string;
  body: string;

  distance: string;
  time: string;

  sedan_price: number;
  van_price: number;

  what_makes_better: string | string[];
  whats_included: string | string[];
  destination_highlights: string | string[];
  ideal_for: string | string[];

  faqs: FAQItem[];
  vehicle_options: VehicleOption[];

  image: string;
  book_cta_label: string;
  book_cta_support: string;
}

/* ───────────────── HELPERS ───────────────── */

function parseList(value: string | string[] | null | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

function parseObjectList<T>(value: string | T[] | null | undefined): T[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

/* ───────────────── MAPPER ───────────────── */

function mapRouteToFrontend(route: BackendRoute): Route {
  return {
    id: route.id ? String(route.id) : undefined,
    routeId: route.route_id,
    slug: route.slug,

    fromLocation: route.from_location,
    toLocation: route.to_location,

    metaTitle: route.meta_title,
    metaDescription: route.meta_description,
    heroTitle: route.hero_title,
    subHeadline: route.sub_headline,
    body: route.body,

    distance: route.distance,
    time: route.time,
    duration_minutes: route.duration_minutes,
    sedanPrice: Number(route.sedan_price),
    vanPrice: Number(route.van_price),

    whatMakesBetter: parseList(route.what_makes_better),
    whatsIncluded: parseList(route.whats_included),
    destinationHighlights: parseList(route.destination_highlights),
    idealFor: parseList(route.ideal_for),

    // ✅ REQUIRED FIELDS (THE FIX)
    faqs: parseObjectList(route.faqs),
    vehicleOptions: parseObjectList(route.vehicle_options),

    image: route.image,
    bookCtaLabel: route.book_cta_label,
    bookCtaSupport: route.book_cta_support,
  };
}

/* ───────────────── LIST ROUTES ───────────────── */

export async function getRoutes(): Promise<Route[]> {
  const response = await authFetch<Route[]>("/control/routes/", {
    method: "GET",
  });

  console.log("Get routee details", response);
  return response;
}

/* ───────────────── GET ROUTE BY ID ───────────────── */

export async function getRouteById(routeId: string): Promise<Route> {
  const response = await authFetch<BackendRoute>(
    `/control/routes/${routeId}/detail/`,
    { method: "GET" },
  );

  return mapRouteToFrontend(response);
}

/* ───────────────── CREATE ROUTE ───────────────── */

export interface CreateRouteInput {
  fromLocation: string;
  toLocation: string;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  subHeadline: string;
  body: string;
  distance: string;
  time: string;
  sedanPrice: number;
  vanPrice: number;
  whatMakesBetter: string[];
  whatsIncluded: string[];
  destinationHighlights: string[];
  idealFor: string[];
  duration_minutes: number;
  faqs: FAQItem[];
  vehicleOptions: VehicleOption[];
  image: File | null;
  bookCtaLabel: string;
  bookCtaSupport: string;
}

export async function createRoute(input: CreateRouteInput): Promise<Route> {
  const formData = new FormData();



  formData.append(
  "duration_minutes",
  String(input.duration_minutes)
);


  formData.append("from_location", input.fromLocation);
  formData.append("to_location", input.toLocation);
  formData.append("meta_title", input.metaTitle);
  formData.append("meta_description", input.metaDescription);
  formData.append("hero_title", input.heroTitle);
  formData.append("sub_headline", input.subHeadline);
  formData.append("body", input.body);
  formData.append("distance", input.distance);
  formData.append("time", input.time);
  formData.append("sedan_price", String(input.sedanPrice));
  formData.append("van_price", String(input.vanPrice));
  formData.append("faqs", JSON.stringify(input.faqs));
  formData.append("vehicle_options", JSON.stringify(input.vehicleOptions));

  if (input.image) {
    formData.append("image", input.image);
  }

  formData.append("book_cta_label", input.bookCtaLabel);
  formData.append("book_cta_support", input.bookCtaSupport);

  formData.append("what_makes_better", JSON.stringify(input.whatMakesBetter));
  formData.append("whats_included", JSON.stringify(input.whatsIncluded));
  formData.append(
    "destination_highlights",
    JSON.stringify(input.destinationHighlights),
  );
  formData.append("ideal_for", JSON.stringify(input.idealFor));
  for (const [key, value] of formData.entries()) {
    console.log(`FormData → ${key}:`, value);
  }
  const response = await authFetch<BackendRoute>("/control/routes/create/", {
    method: "POST",
    body: formData,
  });

  return mapRouteToFrontend(response);
}

/* ───────────────── UPDATE ROUTE ───────────────── */

export interface UpdateRouteInput {
  fromLocation?: string;
  toLocation?: string;
  metaTitle?: string;
  metaDescription?: string;
  heroTitle?: string;
  subHeadline?: string;
  body?: string;
  distance?: string;
  time?: string;
  sedanPrice?: number;
  vanPrice?: number;
  duration_minutes: number;
  whatMakesBetter?: string[];
  whatsIncluded?: string[];
  destinationHighlights?: string[];
  idealFor?: string[];
  faqs?: FAQItem[];
  vehicleOptions?: VehicleOption[];

  image?: File | null;
  bookCtaLabel?: string;
  bookCtaSupport?: string;
}

export async function updateRoute(
  routeId: string,
  input: UpdateRouteInput,
  method: "PUT" | "PATCH" = "PATCH",
): Promise<Route> {
  const formData = new FormData();

  if (input.fromLocation) formData.append("from_location", input.fromLocation);

  if (input.toLocation) formData.append("to_location", input.toLocation);

  if (input.metaTitle) formData.append("meta_title", input.metaTitle);

  if (input.metaDescription)
    formData.append("meta_description", input.metaDescription);

  if (input.heroTitle) formData.append("hero_title", input.heroTitle);

  if (input.subHeadline) formData.append("sub_headline", input.subHeadline);
  if (typeof input.duration_minutes === "number") {
    formData.append("duration_minutes", String(input.duration_minutes));
  }

  if (input.body) formData.append("body", input.body);
  if (input.distance) formData.append("distance", input.distance);
  if (input.time) formData.append("time", input.time);

  if (typeof input.sedanPrice === "number")
    formData.append("sedan_price", String(input.sedanPrice));

  if (typeof input.vanPrice === "number")
    formData.append("van_price", String(input.vanPrice));

  if (input.whatMakesBetter)
    formData.append("what_makes_better", JSON.stringify(input.whatMakesBetter));

  if (input.whatsIncluded)
    formData.append("whats_included", JSON.stringify(input.whatsIncluded));

  if (input.destinationHighlights)
    formData.append(
      "destination_highlights",
      JSON.stringify(input.destinationHighlights),
    );

  if (input.faqs) {
    formData.append("faqs", JSON.stringify(input.faqs));
  }

  if (input.vehicleOptions) {
    formData.append("vehicle_options", JSON.stringify(input.vehicleOptions));
  }
  console.log("📤 Sending vehicle options:", input.vehicleOptions);

  if (input.idealFor)
    formData.append("ideal_for", JSON.stringify(input.idealFor));

  if (input.image) formData.append("image", input.image);

  if (input.bookCtaLabel) formData.append("book_cta_label", input.bookCtaLabel);

  if (input.bookCtaSupport)
    formData.append("book_cta_support", input.bookCtaSupport);

  const response = await authFetch<BackendRoute>(`/control/routes/${routeId}`, {
    method,
    body: formData,
  });

  return mapRouteToFrontend(response);
}

/* ───────────────── DELETE ROUTE ───────────────── */

export async function deleteRoute(routeId: string): Promise<void> {
  await authFetch<void>(`/control/routes/${routeId}`, {
    method: "DELETE",
  });
}
