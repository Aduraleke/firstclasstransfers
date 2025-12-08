// app/(site)/routes/[slug]/page.tsx

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRouteDetailBySlug, ROUTE_DETAILS } from "@/lib/routes";

const BRAND = {
  primary: "#162c4b",
  accent: "#b07208",
};

type RouteParams = {
  slug: string;
};

const VEHICLE_IMAGE_MAP: Record<string, string> = {
  "Standard Car": "/capri.jpg",
  Sedan: "/capri.jpg",
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

export async function generateStaticParams() {
  return ROUTE_DETAILS.map((r) => ({ slug: r.slug }));
}

export default async function RouteDetailsPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const route = getRouteDetailBySlug(slug);

  if (!route) {
    return notFound();
  }

  const subheadlineLines = route.subheadline.split("\n").filter(Boolean);
  const bodyParagraphs = route.body
    .split(/\n{2,}/)
    .filter((p) => p.trim().length);

  const recommendedRoutes = ROUTE_DETAILS.filter((r) => r.slug !== slug).slice(
    0,
    3
  );

  // 👇 build booking URL based on bookingRouteId / slug
  const bookingRouteId = route.bookingRouteId ?? route.slug;
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
          {route.to}
        </span>
      </nav>

      {/* HERO */}
      <section className="overflow-hidden rounded-3xl bg-slate-950 text-slate-50 shadow-2xl ring-1 ring-slate-900/70">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          {/* LEFT */}
          <div className="flex flex-col justify-between gap-6 p-5 sm:p-7 lg:p-8">
            <div className="space-y-5">
              {/* top labels */}
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#b07208]/15 px-2.5 py-1 font-medium uppercase tracking-[0.16em] text-[#b07208]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#b07208]" />
                  Airport &amp; city transfer
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-1 text-slate-200">
                  Fixed price · Private
                </span>
                <span className="hidden items-center gap-1 rounded-full bg-slate-900/80 px-2 py-1 text-slate-200 sm:inline-flex">
                  24/7 service
                </span>
              </div>

              {/* route pill */}
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-50/10 px-3 py-1 text-[11px] font-medium text-slate-100">
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#b07208]" />
                  {route.from}
                </span>
                <span className="text-slate-400">→</span>
                <span className="font-semibold">{route.to}</span>
              </div>

              {/* title + subheadline */}
              <div className="space-y-4">
                <h1 className="text-2xl font-semibold leading-tight sm:text-3xl lg:text-[32px]">
                  {route.heroTitle}
                </h1>
                {subheadlineLines.length > 0 && (
                  <div className="space-y-1 text-[13px] text-slate-200/90 sm:text-sm">
                    {subheadlineLines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                )}
                {bodyParagraphs[0] && (
                  <p className="text-[13px] leading-relaxed text-slate-200/90 sm:text-[14px]">
                    {bodyParagraphs[0]}
                  </p>
                )}
              </div>

              {/* stats */}
              <dl className="mt-2 grid gap-3 text-[11px] text-slate-200/90 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-900/60 px-3 py-2.5 ring-1 ring-slate-800/80">
                  <dt className="text-slate-400">Distance</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-slate-50">
                    {route.distance}
                  </dd>
                </div>
                <div className="rounded-2xl bg-slate-900/60 px-3 py-2.5 ring-1 ring-slate-800/80">
                  <dt className="text-slate-400">Average journey</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-slate-50">
                    {route.time}
                  </dd>
                </div>
                <div className="rounded-2xl bg-slate-900/60 px-3 py-2.5 ring-1 ring-slate-800/80">
                  <dt className="text-slate-400">Best for</dt>
                  <dd className="mt-0.5 truncate text-sm font-semibold text-slate-50">
                    {route.idealFor?.[0] || "Airport to city"}
                  </dd>
                </div>
              </dl>

              {/* chips */}
              {route.idealFor && route.idealFor.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Popular with
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {route.idealFor.slice(0, 4).map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-slate-900/75 px-2.5 py-1 text-[11px] text-slate-100 ring-1 ring-slate-700/80"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTA row */}
            <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-slate-800/70 pt-4 text-[12px]">
              <Link
                href={bookingHref}
                className="inline-flex items-center justify-center rounded-full bg-[#b07208] px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-[#b07208]/40 hover:bg-[#b07208]"
              >
                {route.bookCtaLabel || "Book this route"}
              </Link>
              <p className="text-slate-300">
                Flight tracking · Meet &amp; greet · Fixed fare · No meter
              </p>
            </div>
          </div>

          {/* RIGHT – hero image */}
          <div className="relative min-h-[260px] overflow-hidden bg-slate-950">
            <Image
              src={route.image}
              alt={`${route.from} to ${route.to}`}
              fill
              className="object-cover"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
            <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-slate-950/75 px-3 py-2 text-[11px] text-slate-100 backdrop-blur">
              <div>
                <p className="font-medium">
                  {route.from} → {route.to}
                </p>
                <p className="text-[10px] text-slate-300">
                  Private airport transfer · {route.time}
                </p>
              </div>
              <div className="text-right text-[10px] text-slate-300">
                <p>From</p>
                <p className="text-sm font-semibold text-slate-50">
                  {route.sedanPrice}
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
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Sedan · up to 4</span>
                  <span className="font-semibold text-slate-50">
                    {route.sedanPrice}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                  <span className="text-slate-300">
                    V-Class / Minivan · up to 6
                  </span>
                  <span className="font-semibold text-slate-50">
                    {route.vanPrice}
                  </span>
                </div>
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
              const imgSrc = getVehicleImage(vehicle.type);
              const isPrimary = idx === 0;

              return (
                <article
                  key={vehicle.type}
                  className={[
                    "group flex flex-col overflow-hidden rounded-2xl border backdrop-blur-sm transition",
                    "bg-slate-900/70 hover:-translate-y-1 hover:shadow-2xl hover:border-[#b07208]/40 hover:bg-slate-900/90",
                    isPrimary
                      ? "border-[#b07208]/60 shadow-[0_18px_45px_rgba(15,23,42,0.7)]"
                      : "border-slate-800/80 shadow-[0_14px_35px_rgba(15,23,42,0.7)]",
                  ].join(" ")}
                >
                  {/* IMAGE FULL-WIDTH */}
                  <div className="relative h-40 w-full overflow-hidden sm:h-44 md:h-48">
                    <div className="absolute inset-0 bg-linear-to-tr from-slate-950 via-slate-900/90 to-slate-800" />
                    <div className="absolute -left-16 top-0 h-40 w-40 rounded-full bg-[#b07208]/25 blur-3xl" />
                    <div className="absolute -right-16 bottom-0 h-40 w-40 rounded-full bg-sky-400/15 blur-3xl" />

                    {imgSrc ? (
                      <Image
                        src={imgSrc}
                        alt={vehicle.type}
                        fill
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
                      <span className="text-slate-300">From</span>{" "}
                      <span className="font-semibold">
                        {vehicle.fixedPrice}
                      </span>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-3 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="line-clamp-1 text-[14px] font-semibold text-slate-50">
                        {vehicle.type}
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
                        {vehicle.maxPassengers}
                      </span>
                      {vehicle.idealFor && (
                        <span className="inline-flex items-center rounded-full bg-slate-800/80 px-2 py-1 text-slate-300">
                          {vehicle.idealFor}
                        </span>
                      )}
                    </div>

                    <div className="mt-1 space-y-2 text-[11px] text-slate-300">
                      <ul className="space-y-1">
                        <li>• Fixed fare, no meter</li>
                        <li>• Meet &amp; greet at arrivals</li>
                        <li>• Luggage assistance included</li>
                      </ul>

                      <div className="mt-2 flex items-center justify-between border-t border-slate-800 pt-2 text-[11px]">
                        <span className="text-slate-400">
                          Ideal for{" "}
                          <span className="font-medium text-slate-100">
                            {isPrimary ? "most travellers" : "specific needs"}
                          </span>
                        </span>
                        <span className="text-[11px] font-semibold text-[#b07208]">
                          Instant confirmation
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
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
                <p className="font-semibold text-slate-900">
                  {item.question}
                </p>
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
                    alt={`${r.from} to ${r.to}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1 px-3.5 py-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                    {r.from} → {r.to}
                  </p>
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {r.heroTitle}
                  </p>
                  <p className="text-[12px] text-slate-600">
                    From <span className="font-semibold">{r.sedanPrice}</span>
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
