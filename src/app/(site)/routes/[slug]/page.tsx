import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchAllRoutes, fetchRouteBySlug } from "@/lib/api/routes";

const BRAND = {
  primary: "#162c4b",
  accent: "#b07208",
};

type RouteParams = {
  slug: string;
};

/* =========================================================
   STATIC PARAMS (SSG)
========================================================= */
export async function generateStaticParams() {
  const routes = await fetchAllRoutes();

  return routes.map((r) => ({
    slug: r.slug,
  }));
}

/* =========================================================
   PER-ROUTE SEO (THIS IS THE KEY PART)
========================================================= */
export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const route = await fetchRouteBySlug(slug);

  if (!route) {
    return {};
  }

  const title =
    route.metaTitle ||
    `${route.fromLocation} to ${route.toLocation} Taxi Transfer | Fixed Price`;

  const description =
    route.metaDescription ||
    `Book a private taxi from ${route.fromLocation} to ${route.toLocation} with a fixed price per vehicle. 24/7 service, no hidden fees, professional drivers.`;

  const canonical = `https://firstclasstransfers.eu/routes/${route.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "First Class Transfers Cyprus",
      images: [
        {
          url: route.image,
          width: 1200,
          height: 630,
          alt: `${route.fromLocation} to ${route.toLocation} private transfer`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [route.image],
    },
  };
}

/* =========================================================
   PAGE
========================================================= */
export default async function RouteDetailsPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const route = await fetchRouteBySlug(slug);

  if (!route) {
    return notFound();
  }

  const VEHICLE_IMAGE_MAP: Record<string, string> = {
    "Standard Car": "/ford-carpri.jpg",
    Sedan: "/ford-carpri.jpg",
    Minivan: "/mercedesVclass.jpg",
    "V-Class": "/mercedesVclass.jpg",
  };

  function getVehicleImage(type: string): string | null {
    if (VEHICLE_IMAGE_MAP[type]) return VEHICLE_IMAGE_MAP[type];

    const lower = type.toLowerCase();
    if (
      lower.includes("minivan") ||
      lower.includes("v-class") ||
      lower.includes("van")
    ) {
      return "/mercedesVclass.jpg";
    }
    if (lower.includes("car") || lower.includes("sedan")) {
      return "/capri.jpg";
    }
    return null;
  }

  const sedanPrice = route.vehicleOptions?.[0]?.fixedPrice ?? route.sedanPrice;

  const vanPrice = route.vehicleOptions?.[1]?.fixedPrice ?? route.vanPrice;

  const vehicleOptions = route.vehicleOptions ?? [];

const sortedVehicleOptions = [...vehicleOptions].sort(
  (a, b) => Number(a.fixedPrice) - Number(b.fixedPrice)
);


  /* -----------------------------
     helpers
  ------------------------------ */
  const subheadlineLines = route.subheadline
    ? route.subheadline.split("\n").filter(Boolean)
    : [];

  const bodyParagraphs = route.body
    ? route.body.split(/\n{2,}/).filter((p) => p.trim().length)
    : [];

  const allRoutes = await fetchAllRoutes();

  const recommendedRoutes = allRoutes
    .filter((r) => r.slug !== slug)
    .slice(0, 3);

  const bookingRouteId = route.slug ?? route.slug;
  const bookingHref = `/booking?routeId=${encodeURIComponent(bookingRouteId)}`;

  return (
    <main className="relative mx-auto mt-24 max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      {/* BACKGROUND */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-slate-50"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px]"
        style={{
          background: `radial-gradient(circle at 0% 0%, ${BRAND.primary}18 0, transparent 55%), radial-gradient(circle at 100% 0%, ${BRAND.accent}18 0, transparent 55%)`,
        }}
      />

      {/* BREADCRUMB */}
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-[11px] text-slate-500">
        <Link
          href="/"
          className="rounded-full bg-white/80 px-3 py-1 shadow-sm ring-1 ring-slate-200 hover:text-slate-700 hover:ring-slate-300"
        >
          Home
        </Link>
        <span className="mx-1 text-slate-400">/</span>
        <Link
          href="/routes"
          className="rounded-full px-2 py-0.5 hover:text-slate-700"
        >
          Routes
        </Link>
        <span className="mx-1 text-slate-400">/</span>
        <span className="max-w-[150px] truncate font-medium text-slate-700 sm:max-w-xs">
          {route.toLocation}
        </span>
      </nav>

      {/* HERO */}
      <section className="overflow-hidden rounded-3xl bg-slate-950 text-slate-50 shadow-2xl ring-1 ring-slate-900/70">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          {/* LEFT */}
          <div className="w-full mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col justify-between gap-8">
            {/* TOP LABELS */}
            <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px]">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#b07208]/15 px-2.5 py-1 font-medium uppercase tracking-wider text-[#b07208]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#b07208]" />
                Airport &amp; city transfer
              </span>

              <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2.5 py-1 text-slate-200">
                Fixed price · Private
              </span>

              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2.5 py-1 text-slate-200">
                24/7 service
              </span>
            </div>

            {/* ROUTE PILL */}
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full bg-slate-50/10 px-3 py-1.5 text-[11px] text-slate-100">
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#b07208]" />
                {route.fromLocation}
              </span>
              <span className="text-slate-400">→</span>
              <span className="font-semibold">{route.toLocation}</span>
            </div>

            {/* TITLE + SUBHEADLINE */}
            <div className="space-y-4">
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-semibold leading-tight text-white wrap-break-word">
                {route.heroTitle}
              </h1>

              {subheadlineLines.length > 0 && (
                <div className="space-y-1 text-[12px] sm:text-[13px] text-slate-200/90">
                  {subheadlineLines.map((line) => (
                    <p key={line} className="wrap-break-word">
                      {line}
                    </p>
                  ))}
                </div>
              )}

              {bodyParagraphs[0] && (
                <p className="text-[13px] sm:text-[14px] leading-relaxed text-slate-200/90 wrap-break-word">
                  {bodyParagraphs[0]}
                </p>
              )}
            </div>

            {/* PRICE RIBBON */}
            <div>
              <div className="inline-flex w-full sm:w-auto flex-col gap-2 rounded-2xl bg-linear-to-r from-[#b07208] via-[#e0b15a] to-[#b07208] px-4 py-3 shadow-xl shadow-black/30">
                <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-white/85 text-center sm:text-left">
                  Fixed fare · Per vehicle · Not per person
                </p>

                <div className="flex flex-wrap items-baseline gap-3 sm:gap-5 text-white justify-center sm:justify-start">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[10px] font-medium uppercase tracking-wider opacity-90">
                      From · Sedan
                    </span>
                    <span className="text-[20px] sm:text-[22px] font-extrabold">
                      €{sedanPrice}
                    </span>
                  </div>

                  <span className="hidden sm:block h-4 w-px bg-white/40" />

                  <div className="flex items-baseline gap-1">
                    <span className="text-[10px] font-medium uppercase tracking-wider opacity-90">
                      Mercedes V-Class
                    </span>
                    <span className="text-[20px] sm:text-[22px] font-extrabold">
                      €{vanPrice}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* STATS GRID */}
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-slate-200/90 w-full">
              <div className="rounded-2xl bg-slate-900/60 px-3 py-2 ring-1 ring-slate-800/80">
                <dt className="text-slate-400 text-[10px]">Distance</dt>
                <dd className="mt-0.5 text-sm font-semibold text-slate-50 wrap-break-word">
                  ~{route.distance}
                </dd>
              </div>

              <div className="rounded-2xl bg-slate-900/60 px-3 py-2 ring-1 ring-slate-800/80">
                <dt className="text-slate-400 text-[10px]">Average journey</dt>
                <dd className="mt-0.5 text-sm font-semibold text-slate-50 wrap-break-word">
                  {route.time}
                </dd>
              </div>
            </dl>

            {/* POPULAR WITH CHIPS */}
            {route.idealFor && route.idealFor.length > 0 && (
              <div className="space-y-2 w-full">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Popular with
                </p>

                <div className="flex flex-wrap gap-2">
                  {route.idealFor.slice(0, 4).map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-slate-900/75 px-3 py-1 text-[10px] sm:text-[11px] text-slate-100 ring-1 ring-slate-700/80 wrap-break-word"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA ROW */}
            <div className="border-t border-slate-800/70 pt-4 flex flex-wrap items-center gap-3 text-[11px] sm:text-[12px]">
              <Link
                href={bookingHref}
                className="inline-flex items-center justify-center rounded-full bg-[#b07208] px-5 py-2.5 text-[12px] sm:text-sm font-semibold text-slate-900 shadow-lg shadow-[#b07208]/40 hover:bg-[#cc8a10] transition"
              >
                {route.bookCtaLabel || "Book this route"}
              </Link>

              <p className="text-slate-300 wrap-break-word w-full sm:w-auto">
                Flight tracking · Meet &amp; greet · Fixed fare
              </p>
            </div>
          </div>

          {/* RIGHT – hero image */}
          <div className="relative min-h-[260px] overflow-hidden bg-slate-950">
            <Image
              src={route.image}
              alt={`${route.fromLocation} to ${route.toLocation}`}
              fill
              className="object-cover"
              unoptimized
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
            <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-slate-950/75 px-3 py-2 text-[11px] text-slate-100 backdrop-blur">
              <div>
                <p className="font-medium">
                  {route.fromLocation} → {route.toLocation}
                </p>
                <p className="text-[10px] text-slate-300">
                  Private airport transfer · {route.time}
                </p>
              </div>
              {/* 🔄 Removed price from image overlay to keep all pricing on the ribbon & sidebar */}
              <div className="text-right text-[10px] text-slate-300">
                <p className="uppercase tracking-[0.16em] text-slate-400">
                  Fixed fare
                </p>
                <p className="mt-0.5 text-[11px] text-slate-200">
                  Sedan &amp; Mercedes V-Class
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT + SIDEBAR */}
      <section className="mt-10 grid gap-8 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.1fr)]">
        {/* LEFT – narrative */}
        <div className="space-y-8 text-sm text-slate-700">
          {/* About section (rest of body) */}
          {bodyParagraphs.length > 1 && (
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-base font-semibold text-slate-900">
                About this transfer
              </h2>
              <div className="mt-2 h-px w-10 rounded-full bg-slate-200" />
              <div className="mt-3 space-y-3">
                {bodyParagraphs.slice(1).map((p, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          )}

          {/* Why travellers choose this transfer */}
          {route.whatMakesBetter && route.whatMakesBetter.length > 0 && (
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-base font-semibold text-slate-900">
                Why travellers choose this route
              </h2>
              <div
                className="mt-2 h-px w-10 rounded-full"
                style={{ backgroundColor: `${BRAND.accent}99` }}
              />
              <ul className="mt-3 space-y-2 list-disc pl-5 text-sm">
                {route.whatMakesBetter.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Destination highlights */}
          {route.destinationHighlights &&
            route.destinationHighlights.length > 0 && (
              <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-base font-semibold text-slate-900">
                  Destination highlights
                </h2>
                <div className="mt-2 h-px w-10 rounded-full bg-slate-200" />
                <ul className="mt-3 space-y-2 list-disc pl-5 text-sm">
                  {route.destinationHighlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            )}

          {/* Ideal for full list */}
          {route.idealFor && route.idealFor.length > 0 && (
            <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-base font-semibold text-slate-900">
                This route is perfect for
              </h2>
              <div className="mt-2 h-px w-10 rounded-full bg-slate-200" />
              <ul className="mt-3 space-y-2 list-disc pl-5 text-sm">
                {route.idealFor.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* RIGHT – sidebar */}
        <aside className="space-y-6 self-start md:sticky md:top-24">
          {/* Booking card */}
          <section className="overflow-hidden rounded-2xl bg-slate-950 text-slate-50 shadow-[0_18px_45px_rgba(15,23,42,0.6)] ring-1 ring-slate-900/70">
            <div className="relative p-5">
              <div className="pointer-events-none absolute inset-0 opacity-60">
                <div className="absolute -right-10 top-0 h-32 w-32 rounded-full bg-[#b07208]/20 blur-3xl" />
                <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-sky-400/15 blur-3xl" />
              </div>

              {/* mini "from price" pill to echo hero ribbon */}
              <div className="relative mb-3 inline-flex rounded-full bg-linear-to-r from-[#b07208] via-[#e0b15a] to-[#b07208] px-3 py-1 text-[11px] font-semibold text-slate-950 shadow-md">
                <span className="uppercase tracking-[0.18em] text-slate-900/80">
                  From
                </span>
                <span className="mx-2 h-3 w-px bg-slate-900/20" />
                <span className="text-[12px] font-extrabold">
                  €{sedanPrice}
                </span>
                <span className="ml-2 text-[10px] uppercase tracking-[0.16em] text-slate-900/75">
                  Sedan · Per vehicle
                </span>
              </div>

              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-50">
                    Ready to book?
                  </h3>
                  <p className="mt-1 text-xs text-slate-300">
                    Reserve your private vehicle in a few clicks. Instant
                    confirmation for every booking.
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-[#b07208] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-950 shadow-md">
                  24/7
                </span>
              </div>

              <div className="relative mt-4 space-y-2 rounded-2xl bg-slate-900/80 px-3 py-3 text-[12px] ring-1 ring-slate-800">
                {sortedVehicleOptions.map((vehicle, idx) => (
                  <div
                    key={vehicle.vehicleType}
                    className={[
                      "flex items-center justify-between",
                      idx > 0 ? "border-t border-slate-800 pt-2" : "",
                    ].join(" ")}
                  >
                    <span className="text-slate-300">
                      {vehicle.vehicleType}
                      {vehicle.maxPassengers
                        ? ` · up to ${vehicle.maxPassengers} Passengers`
                        : ""}
                    </span>

                    <span className="text-sm font-extrabold text-[#fbbf24]">
                      €{vehicle.fixedPrice}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href={bookingHref}
                className="relative mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#b07208] px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-[#b07208]/40 hover:bg-[#b07208]"
              >
                {route.bookCtaLabel || "Book this route"}
              </Link>

              <p className="relative mt-3 text-[11px] text-slate-300">
                {route.bookCtaSupport ||
                  "Flight tracking, meet & greet in arrivals, and all taxes & normal waiting time included."}
              </p>
            </div>
          </section>

          {/* What's included */}
          {route.whatsIncluded && route.whatsIncluded.length > 0 && (
            <section className="rounded-2xl bg-white p-5 text-[13px] shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  What&apos;s included
                </h3>
                <span
                  className="h-6 w-px rounded-full"
                  style={{ backgroundColor: `${BRAND.accent}55` }}
                />
              </div>
              <ul className="mt-3 space-y-2 text-slate-700">
                {route.whatsIncluded.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#b07208]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </section>

      {/* VEHICLE OPTIONS */}
      {route.vehicleOptions && route.vehicleOptions.length > 0 && (
        <section className="mt-12 rounded-3xl bg-slate-950 text-slate-50 p-5 sm:p-6 shadow-[0_22px_60px_rgba(15,23,42,0.65)] ring-1 ring-slate-900/70">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-50">
                Vehicle options for this route
              </h3>
              <p className="mt-1 text-[11px] text-slate-300">
                Private transfers with fixed fares. Choose the space and comfort
                that suits you.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#b07208]/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[#b07208] ring-1 ring-[#b07208]/40">
              Compare &amp; choose
            </span>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
            {route.vehicleOptions.map((vehicle, idx) => {
              const imgSrc = getVehicleImage(vehicle.vehicleType);
              const isPrimary = idx === 0;

              // --- NEW: map displayed type → booking vehicleTypeId
              function mapVehicleTypeToId(type: string): "sedan" | "vclass" {
                const t = type.toLowerCase();
                if (t.includes("sedan") || t.includes("car")) return "sedan";
                if (
                  t.includes("v-class") ||
                  t.includes("van") ||
                  t.includes("minivan")
                )
                  return "vclass";
                return "sedan";
              }

              const vehicleTypeId = mapVehicleTypeToId(vehicle.vehicleType);
              const bookingHref = `/booking?routeId=${route.slug}&vehicleTypeId=${vehicleTypeId}`;

              return (
                <Link
                  key={vehicle.vehicleType}
                  href={bookingHref}
                  className={[
                    "group flex flex-col overflow-hidden rounded-2xl border backdrop-blur-sm transition cursor-pointer",
                    "bg-slate-900/70 hover:-translate-y-1 hover:shadow-2xl hover:border-[#b07208]/40 hover:bg-slate-900/90",
                    isPrimary
                      ? "border-[#b07208]/60 shadow-[0_18px_45px_rgba(15,23,42,0.7)]"
                      : "border-slate-800/80 shadow-[0_14px_35px_rgba(15,23,42,0.7)]",
                  ].join(" ")}
                >
                  {/* IMAGE */}
                  <div className="relative h-40 w-full overflow-hidden sm:h-54 md:h-68">
                    <div className="absolute inset-0 bg-linear-to-tr from-slate-950 via-slate-900/90 to-slate-800" />
                    <div className="absolute -left-16 top-0 h-40 w-40 rounded-full bg-[#b07208]/25 blur-3xl" />
                    <div className="absolute -right-16 bottom-0 h-40 w-40 rounded-full bg-sky-400/15 blur-3xl" />

                    {imgSrc ? (
                      <Image
                        src={imgSrc}
                        alt={vehicle.vehicleType}
                        fill
                        unoptimized
                        className="relative z-10 object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        priority={isPrimary}
                      />
                    ) : (
                      <div className="relative z-10 flex h-full w-full items-center justify-center text-4xl">
                        🚗
                      </div>
                    )}

                    {isPrimary && (
                      <span className="absolute left-3 top-3 z-20 inline-flex items-center rounded-full bg-[#b07208] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-950 shadow-lg">
                        Most chosen
                      </span>
                    )}

                    <div className="absolute bottom-3 right-3 z-20 rounded-full bg-slate-950/90 px-4 py-1.5 text-[11px] text-slate-50 shadow-md backdrop-blur-sm ring-1 ring-slate-800">
                      <span className="mr-2 text-[9px] uppercase tracking-[0.16em] text-slate-300">
                        Fixed fare
                      </span>
                      <span className="text-sm font-extrabold text-[#fbbf24]">
                        €{vehicle.fixedPrice}
                      </span>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="flex flex-col flex-1 px-3.5 pb-3.5 pt-3 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="line-clamp-1 text-[14px] font-semibold text-slate-50">
                        {vehicle.vehicleType}
                      </p>
                      {!isPrimary && (
                        <span className="rounded-full bg-slate-800/90 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-slate-300">
                          Private
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 text-[11px]">
                      <span className="inline-flex items-center rounded-full bg-slate-800/80 px-2 py-1 text-slate-200">
                        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#b07208]" />
                        Up to {vehicle.maxPassengers} Passengers
                      </span>
                      {vehicle.idealFor && (
                        <span className="inline-flex items-center rounded-full bg-slate-800/80 px-2 py-1 text-slate-300">
                          {vehicle.idealFor}
                        </span>
                      )}
                    </div>

                    <ul className="space-y-1 text-[11px] text-slate-300">
                      <li>• Fixed fare</li>
                      <li>• Meet &amp; greet at arrivals</li>
                      <li>• Luggage assistance included</li>
                    </ul>

                    <div className="pt-2 flex justify-end">
                      <span className="rounded-full bg-[#b07208] px-4 py-1.5 text-[12px] font-semibold text-slate-950 shadow-md">
                        Select &amp; Book →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* FAQ */}
      {route.faq && route.faq.length > 0 && (
        <section className="mt-12 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-900">
              Frequently asked questions
            </h2>
            <div className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600 ring-1 ring-slate-200">
              <span className="h-1.5 w-1.5 rounded-full bg-[#b07208]" />
              <span>Most asked for this route</span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {route.faq.map((item) => (
              <div
                key={item.question}
                className="rounded-2xl bg-slate-50 px-3 py-3 text-sm ring-1 ring-slate-200"
              >
                <p className="font-semibold text-slate-900">{item.question}</p>
                <p className="mt-1 text-slate-700">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* OTHER ROUTES */}
      {recommendedRoutes.length > 0 && (
        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">
              Other popular routes
            </h2>
            <Link
              href="/routes"
              className="text-[12px] font-medium text-slate-600 hover:text-slate-900"
            >
              View all routes →
            </Link>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendedRoutes.map((r) => (
              <Link
                key={r.slug}
                href={`/routes/${r.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 hover:ring-slate-300"
              >
                <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={r.image}
                    alt={`${r.fromLocation} to ${r.toLocation}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1 px-3.5 py-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                    {r.fromLocation} → {r.toLocation}
                  </p>
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {r.heroTitle}
                  </p>
                  <p className="text-[12px] text-slate-600">
                    From{" "}
                    <span className="text-[13px] font-extrabold text-[#b07208]">
                      €{r.sedanPrice}
                    </span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
