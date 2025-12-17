import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | First Class Transfers Cyprus",
  description:
    "Read the terms and conditions governing bookings, payments and services provided by First Class Transfers.",
  alternates: {
    canonical: "https://firstclasstransfers.eu/terms",
  },
};

export default function TermsPage() {
  return (
    <main className="relative mx-auto mt-24 max-w-4xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">
      {/* BACKGROUND */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-slate-50"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[280px]"
        style={{
          background:
            "radial-gradient(circle at 0% 0%, rgba(22,44,75,0.12), transparent 55%), radial-gradient(circle at 100% 0%, rgba(176,114,8,0.15), transparent 55%)",
        }}
      />

      {/* HERO */}
      <section className="mb-10 space-y-4">
        <span className="inline-flex rounded-full bg-slate-900/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-700">
          Legal Information
        </span>

        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
          Terms & Conditions
        </h1>

        <p className="max-w-2xl text-sm text-slate-600 sm:text-[15px]">
          These terms outline the conditions under which our transport services
          are provided. Please read them carefully before booking.
        </p>
      </section>

      {/* CONTENT */}
      <section className="space-y-6 text-[15px] text-slate-700 leading-relaxed">
        {[
          {
            title: "1. Bookings",
            body:
              "All bookings are subject to availability and confirmation. You are responsible for providing accurate booking information, including pickup times and locations.",
          },
          {
            title: "2. Pricing & Payments",
            body:
              "All prices are quoted per vehicle and include applicable taxes, tolls and normal waiting time unless otherwise stated. Payments may be made by cash or card as indicated during booking.",
          },
          {
            title: "3. Cancellations",
            body:
              "Cancellation policies may vary depending on the booking type. Please contact us as soon as possible if you need to cancel or amend a booking.",
          },
          {
            title: "4. Waiting Time",
            body:
              "Reasonable waiting time is included in the fare. Extended delays may result in additional charges, which will be communicated where applicable.",
          },
          {
            title: "5. Passenger Responsibilities",
            body:
              "Passengers must comply with safety regulations, including seatbelt use. Damage to vehicles caused by passengers may result in additional charges.",
          },
          {
            title: "6. Liability",
            body:
              "We are not liable for delays caused by circumstances beyond our control, including traffic conditions, weather or force majeure events.",
          },
          {
            title: "7. Governing Law",
            body:
              "These terms are governed by the laws of the Republic of Cyprus. Any disputes shall be subject to the exclusive jurisdiction of Cyprus courts.",
          },
        ].map((section) => (
          <div
            key={section.title}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
          >
            <h2 className="text-base font-semibold text-slate-900">
              {section.title}
            </h2>
            <p className="mt-2">{section.body}</p>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="mt-10 text-[13px] text-slate-500">
        By using our website, you agree to these terms. If you have questions,
        please{" "}
        <Link
          href="/contact"
          className="font-medium text-[#b07208] hover:underline"
        >
          contact us
        </Link>
        .
      </footer>
    </main>
  );
}
