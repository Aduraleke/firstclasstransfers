import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | First Class Transfers Cyprus",
  description:
    "Learn how First Class Transfers collects, uses and protects your personal data. Transparent, GDPR-compliant privacy practices.",
  alternates: {
    canonical: "https://firstclasstransfers.eu/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
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
        <span className="inline-flex rounded-full bg-[#b07208]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b07208]">
          Legal & Privacy
        </span>

        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
          Privacy Policy
        </h1>

        <p className="max-w-2xl text-sm text-slate-600 sm:text-[15px]">
          Your privacy matters to us. This page explains how we collect, use and
          protect your personal data when you use First Class Transfers.
        </p>
      </section>

      {/* CONTENT */}
      <section className="space-y-6 text-[15px] text-slate-700 leading-relaxed">
        {[
          {
            title: "1. Information We Collect",
            body:
              "When you book a transfer or contact us, we may collect personal details such as your name, email address, phone number, pickup and drop-off locations, flight details and payment preferences.",
          },
          {
            title: "2. How We Use Your Information",
            body:
              "Your information is used solely to provide and improve our services. This includes processing bookings, communicating with you about your transfer, meeting legal obligations and enhancing customer experience.",
          },
          {
            title: "3. Data Protection & Security",
            body:
              "We take appropriate technical and organisational measures to protect your personal data against unauthorised access, loss or misuse. Access to data is limited to authorised personnel only.",
          },
          {
            title: "4. Sharing of Information",
            body:
              "We do not sell or rent your personal data. Information may be shared only with drivers or service partners strictly for the purpose of fulfilling your transfer, or where required by law.",
          },
          {
            title: "5. Cookies & Analytics",
            body:
              "Our website may use cookies and analytics tools to improve performance and user experience. You can control cookie preferences through your browser settings.",
          },
          {
            title: "6. Your Rights",
            body:
              "You have the right to access, correct or request deletion of your personal data, as well as to object to certain processing activities. You may contact us at any time regarding your data.",
          },
          {
            title: "7. Policy Updates",
            body:
              "This Privacy Policy may be updated periodically. Any changes will be published on this page with immediate effect.",
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

      {/* FOOTER NOTE */}
      <footer className="mt-10 text-[13px] text-slate-500">
        If you have questions about this policy, please{" "}
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
