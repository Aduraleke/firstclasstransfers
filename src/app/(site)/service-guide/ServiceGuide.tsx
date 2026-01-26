// app/(site)/service-guide/page.tsx
import Link from "next/link";
import { Icon } from "@iconify/react";
import calendarCheck from "@iconify/icons-mdi/calendar-check";
import radarIcon from "@iconify/icons-mdi/radar";
import carPassenger from "@iconify/icons-mdi/car-sports";
import airplaneTakeoff from "@iconify/icons-mdi/airplane-takeoff";

const BRAND = {
  primary: "#162c4b",
  accent: "#b07208",
};

const STEPS = [
  {
    icon: calendarCheck,
    title: "Step 1 – Get Your Fixed Price & Book",
    text: "Choose your route, travel date, time, number of passengers and vehicle type (sedan or Mercedes V-Class). You’ll see your fixed fare before you confirm, no night surcharges and no extra charges for standard luggage.",
  },
  {
    icon: radarIcon,
    title: "Step 2 – We Confirm & Track Your Flight",
    text: "You receive instant confirmation by email (and WhatsApp if you wish) with all your booking details. For airport pickups, we monitor your flight in real time and adjust your pickup time if there are delays.",
  },
  {
    icon: carPassenger,
    title: "Step 3 – Meet Your Driver & Enjoy the Ride",
    text: "Your driver meets you at arrivals or the agreed pickup point, helps with your luggage and takes you directly to your destination. All transfers are private – just you and your group in the vehicle.",
  },
];

export default function ServiceGuide() {
  return (
    <main className="relative mx-auto mt-32 max-w-6xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      {/* soft background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-slate-50 via-slate-50 to-white"
      />

      {/* MAIN CARD */}
      <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
        {/* HERO */}
        <div className="grid gap-0 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* left: copy */}
          <div className="p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-500">
              <span>Service Guide</span>
              <span className="h-px w-6 bg-slate-300" />
              <span className="font-extrabold text-slate-700">
                How Your Transfer Works
              </span>
            </div>

            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              From airport to villa, without the guesswork.
            </h1>

            <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-[15px]">
              Here’s exactly what happens once you book a fixed-price transfer
              with First Class Transfers. No mystery, no “we&apos;ll let you
              know later” — just a clear, predictable journey from the moment
              you get your quote to the moment you arrive.
            </p>

            <div className="mt-5 flex flex-wrap gap-3 text-[11px] sm:text-xs">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                Fixed price.
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                Flight monitored 24/7.
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                Private car, just your group.
              </div>
            </div>
          </div>

          {/* right: brand block */}
          <div
            className="flex flex-col justify-between p-6 text-slate-50 sm:p-8"
            style={{
              background: `radial-gradient(circle at 0% 0%, ${BRAND.accent} 0, ${BRAND.primary} 45%, #050814 100%)`,
            }}
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">
                Designed for travellers, not taxis.
              </p>
              <h2 className="mt-2 text-lg font-semibold sm:text-xl">
                One smooth flow from &quot;Book now&quot; to check-in.
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-100/90 sm:text-[13px]">
                Whether it&apos;s a 2&nbsp;am arrival or a family trip with
                strollers and golf bags, we build the logistics around you:
                timing, vehicle, stops and special requests.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-[11px] sm:text-xs">
              <div className="rounded-2xl bg-white/5 p-3 backdrop-blur-sm">
                <p className="text-slate-200">Most bookings</p>
                <p className="text-sm font-semibold text-white">
                  under 2 minutes
                </p>
                <p className="mt-1 text-[11px] text-slate-200/80">
                  Instant confirmation, no calls needed.
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 p-3 backdrop-blur-sm">
                <p className="text-slate-200">Coverage</p>
                <p className="text-sm font-semibold text-white">
                  Larnaka &amp; Paphos
                </p>
                <p className="mt-1 text-[11px] text-slate-200/80">
                  Plus major resorts &amp; city-to-city.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="border-t border-slate-100" />

        <div className="grid gap-10 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1.1fr)]">
          {/* LEFT – 3-step journey as a mini-timeline */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Your journey, broken into three clear moments
                </h2>
                <p className="mt-1 text-[13px] text-slate-600 sm:text-[14px]">
                  Not just “book and hope” — each step has a specific job, both
                  for you and for us.
                </p>
              </div>
              <span
                className="hidden rounded-full px-3 py-1 text-[11px] font-medium text-slate-50 md:inline-flex"
                style={{ backgroundColor: BRAND.primary }}
              >
                3 defined stages
              </span>
            </div>

            <ol className="mt-4 space-y-5">
              {STEPS.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  {/* timeline spine */}
                  <div className="flex flex-col items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-slate-50 shadow-sm">
                      <Icon icon={step.icon} width={18} height={18} />
                    </div>
                    {index < STEPS.length - 1 && (
                      <div className="mt-1 h-full w-px bg-slate-200" />
                    )}
                  </div>

                  {/* card */}
                  <div className="flex-1 rounded-2xl bg-slate-50/80 px-4 py-3.5 sm:px-5 sm:py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {String(index + 1).padStart(2, "0")} · Airport transfer
                      phase
                    </p>
                    <h3 className="mt-1 text-sm font-semibold text-slate-900 sm:text-[15px]">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600 sm:text-[14px]">
                      {step.text}
                    </p>
                    {index === 0 && (
                      <p className="mt-2 text-[11px] text-slate-500">
                        Tip: most guests book as soon as flights are confirmed.
                      </p>
                    )}
                    {index === 1 && (
                      <p className="mt-2 text-[11px] text-slate-500">
                        We track delays automatically, so you don&apos;t need
                        to update us for every small schedule change.
                      </p>
                    )}
                    {index === 2 && (
                      <p className="mt-2 text-[11px] text-slate-500">
                        Want to stop for coffee or photos on a long route? Just
                        ask your driver — short comfort stops are usually fine.
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-[12px] text-slate-700 sm:text-[13px]">
              <p>
                Short version:{" "}
                <span className="font-semibold">
                  you decide the route and time, we handle the logistics and
                  timing around your flight.
                </span>{" "}
                No taxi ranks, no guesswork, no haggling.
              </p>
            </div>
          </section>

          {/* RIGHT – what you need vs what we handle */}
          <section className="space-y-6">
            {/* What you bring */}
            <article className="rounded-3xl bg-slate-900 px-5 py-5 text-slate-50 sm:px-6 sm:py-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                Before you book
              </p>
              <h2 className="mt-2 text-base font-semibold sm:text-lg">
                What we need from you (it&apos;s not much)
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-100/90 sm:text-[14px]">
                With a few pieces of information, we can lock in your price, the
                right vehicle and a realistic timing plan.
              </p>
              <ul className="mt-3 space-y-2 text-[13px] sm:text-[14px]">
                <li>• Arrival airport (Larnaka or Paphos) and final address</li>
                <li>• Date, preferred pickup time and flight number</li>
                <li>
                  • Number of passengers, luggage and any sports equipment
                </li>
                <li>• Ages of children for correct child/baby seats</li>
                <li>
                  • Any extra notes — late-night arrival, mobility support, extra
                  stops, etc.
                </li>
              </ul>
              <p className="mt-3 text-[11px] text-slate-300">
                Don&apos;t have everything yet? You can still book and update
                us later for most details.
              </p>
            </article>

            {/* On the day */}
            <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
              <h2 className="text-base font-semibold text-slate-900">
                On the day of travel – what this actually feels like
              </h2>
              <div className="mt-2 h-px w-10 rounded-full bg-slate-200" />
              <ul className="mt-3 space-y-2 text-[13px] text-slate-700 sm:text-[14px]">
                <li>
                  • Your driver waits at the agreed point (usually inside the
                  arrivals hall with your name sign).
                </li>
                <li>
                  • A generous waiting window is built in for airport pickups,
                  covering normal delays and baggage.
                </li>
                <li>
                  • Your vehicle is a modern sedan or Mercedes V-Class with air
                  conditioning and space for your luggage.
                </li>
                <li>
                  • All transfers are{" "}
                  <span className="font-semibold">completely private</span> —
                  never shared with other groups.
                </li>
                <li>
                  • For longer drives (Paphos, Ayia Napa, Polis, Latchi, etc.),
                  short comfort breaks are usually no problem.
                </li>
              </ul>
            </article>

            {/* Changes & delays */}
            <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
              <h2 className="text-base font-semibold text-slate-900">
                Changes, delays &amp; cancellations – the rules in plain
                language
              </h2>
              <div className="mt-2 h-px w-10 rounded-full bg-slate-200" />
              <ul className="mt-3 space-y-2 text-[13px] text-slate-700 sm:text-[14px]">
                <li>
                  • You can usually{" "}
                  <span className="font-semibold">
                    change your booking up to 12–24 hours
                  </span>{" "}
                  before pickup — just reply to your confirmation or message us
                  on WhatsApp.
                </li>
                <li>
                  • Cancellations are{" "}
                  <span className="font-semibold">free up to 24 hours</span>{" "}
                  before pickup. Closer than that, a fee may apply if a driver
                  is already allocated.
                </li>
                <li>
                  • Flight delayed? We&apos;re already watching arrivals and
                  adjust your pickup time. Normal delays don&apos;t cost extra.
                </li>
              </ul>
            </article>
          </section>
        </div>
      </section>

      {/* CTA STRIP */}
      <div className="mt-10">
        <div
          className="flex flex-col items-center justify-between gap-4 rounded-3xl px-5 py-4 text-slate-50 shadow-md sm:flex-row sm:px-6 sm:py-5"
          style={{
            background: `linear-gradient(135deg, ${BRAND.accent}, ${BRAND.primary})`,
          }}
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">
              Ready when your flights are
            </p>
            <p className="mt-1 text-sm font-semibold sm:text-base">
              Lock in your price now, no surprises at arrivals.
            </p>
            <p className="mt-1 text-[12px] text-slate-100/90 sm:text-[13px]">
              Share your flight, destination and group size and we&apos;ll do
              the rest. Perfect for late-night arrivals, families and business
              trips.
            </p>
          </div>

          <Link
            href="/booking"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-100"
          >
            Get your instant quote
            <Icon icon={airplaneTakeoff} width={18} height={18} />
          </Link>
        </div>
      </div>
    </main>
  );
}
