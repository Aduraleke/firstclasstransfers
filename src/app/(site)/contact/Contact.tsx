// app/(site)/contact/page.tsx

import { Icon } from "@iconify/react";
import phoneIcon from "@iconify/icons-mdi/phone";
import whatsappIcon from "@iconify/icons-mdi/whatsapp";
import emailIcon from "@iconify/icons-mdi/email-outline";
import mapMarkerIcon from "@iconify/icons-mdi/map-marker";
import airplaneIcon from "@iconify/icons-mdi/airplane";

const BRAND = {
  primary: "#162c4b",
  accent: "#b07208",
};


export default function Contact() {
  return (
    <main className="relative mx-auto mt-32 max-w-6xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      {/* background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-slate-50"
      />

      {/* HEADER */}
      <header className="mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-500">
          <span>Contact</span>
          <span className="h-px w-6 bg-slate-300" />
          <span className="font-extrabold text-slate-700">
            First Class Transfers Cyprus
          </span>
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
          Contact Us
        </h1>

        <p className="max-w-2xl text-sm text-slate-600 sm:text-[15px]">
          Have a question about your booking, a custom route or group transfer?
          Send us a message and we’ll get back to you as soon as possible.
          You can also reach us directly by phone, WhatsApp or email.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)] md:items-start">
        {/* LEFT – contact form */}
        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <h2 className="text-base font-semibold text-slate-900">
            Send us a message
          </h2>
          <div className="mt-2 h-px w-10 rounded-full bg-slate-200" />

          {/* NOTE: hook this form to your API route later */}
          <form className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-500"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-500"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="phone"
                  className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-500"
                >
                  Phone / WhatsApp
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
              <div>
                <label
                  htmlFor="topic"
                  className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-500"
                >
                  What is this about?
                </label>
                <select
                  id="topic"
                  name="topic"
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option>General question</option>
                  <option>Existing booking</option>
                  <option>New booking / quote</option>
                  <option>Group / event transfer</option>
                  <option>Business / corporate</option>
                  <option>Feedback or complaint</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="message"
                className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-500"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                placeholder="Tell us about your route, travel dates, number of passengers or any questions you have."
              />
            </div>

            <p className="text-[11px] text-slate-500">
              By submitting this form you agree that we may contact you about
              your enquiry. We never share your details with third parties
              unless required to provide the service.
            </p>

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-slate-400/40"
              style={{
                background: `linear-gradient(135deg, ${BRAND.accent}, ${BRAND.primary})`,
              }}
            >
              Send message
            </button>
          </form>
        </section>

        {/* RIGHT – direct contact info */}
        <aside className="space-y-6">
          <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <h2 className="text-base font-semibold text-slate-900">
              Talk to us directly
            </h2>
            <div className="mt-2 h-px w-10 rounded-full bg-slate-200" />

            <ul className="mt-4 space-y-3 text-[13px] text-slate-700 sm:text-[14px]">
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-slate-50">
                  <Icon icon={phoneIcon} width={16} height={16} />
                </span>
                <div>
                  <p className="font-semibold text-slate-900">Phone (Cyprus)</p>
                  <p className="text-slate-600">
                    Add your main phone number here, available for urgent
                    booking questions and support.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-slate-50">
                  <Icon icon={whatsappIcon} width={16} height={16} />
                </span>
                <div>
                  <p className="font-semibold text-slate-900">
                    WhatsApp (24/7 for arrivals)
                  </p>
                  <p className="text-slate-600">
                    Add your WhatsApp number or link here. Many guests prefer to
                    share live updates when they land.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-slate-50">
                  <Icon icon={emailIcon} width={16} height={16} />
                </span>
                <div>
                  <p className="font-semibold text-slate-900">Email</p>
                  <p className="text-slate-600">
                    Add your main booking/support email here, for confirmations,
                    invoices and non-urgent questions.
                  </p>
                </div>
              </li>
            </ul>
          </section>

          <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <h2 className="text-base font-semibold text-slate-900">
              Service area & operating hours
            </h2>
            <div className="mt-2 h-px w-10 rounded-full bg-slate-200" />
            <ul className="mt-4 space-y-3 text-[13px] text-slate-700 sm:text-[14px]">
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-slate-50">
                  <Icon icon={airplaneIcon} width={16} height={16} />
                </span>
                <div>
                  <p className="font-semibold text-slate-900">
                    Larnaka &amp; Paphos Airports
                  </p>
                  <p className="text-slate-600">
                    Fixed-price private transfers from Larnaka (LCA) and Paphos
                    (PFO) to major resorts, cities and selected cross-border
                    destinations.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-slate-50">
                  <Icon icon={mapMarkerIcon} width={16} height={16} />
                </span>
                <div>
                  <p className="font-semibold text-slate-900">
                    Operating hours
                  </p>
                  <p className="text-slate-600">
                    Pre-booked transfers operate 24/7. Office response times may
                    be slightly slower overnight, but urgent arrival support is
                    always available.
                  </p>
                </div>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </main>
  );
}
