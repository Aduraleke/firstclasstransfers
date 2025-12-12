// app/(site)/booking/Booking.tsx

"use client";

import React, { useCallback, useEffect, useState } from "react";
import BookingStepper from "@/components/booking/BookingStepper";
import Step1Trip from "@/components/booking/Step1Trip";
import Step2Details from "@/components/booking/Step2Details";
import type { BookingDraft } from "@/lib/booking/types";
import Link from "next/link";

type BookingProps = {
  initialRouteId?: string;
};


function createInitialDraft(initialRouteId?: string): BookingDraft {
  return {
    // main route
    routeId: initialRouteId ?? "",
    vehicleTypeId: "",
    timePeriod: "day",
    date: "",
    time: "",

    // return trip
    tripType: "one-way",
    returnDate: "",
    returnTime: "",
    returnTimePeriod: "day",

    // flight / pax / baggage
    flightNumber: "",
    adults: 1,
    children: 0,
    baggageType: "hand",

    // contact
    name: "",
    phone: "",
    email: "",
    notes: "",

    // payment
    paymentMethod: "cash",
  };
}

export default function Booking({ initialRouteId = "" }: BookingProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [submitted] = useState(false);

  // initialize draft using incoming initialRouteId
  const [draft, setDraft] = useState<BookingDraft>(() =>
    createInitialDraft(initialRouteId)
  );

  // Ensure that if initialRouteId changes (client navigation / hydration) we sync it into state.
  useEffect(() => {
    if (initialRouteId && initialRouteId !== draft.routeId) {
      // Debug log - remove later if you want
       
      console.log("Booking: applying initialRouteId ->", initialRouteId);
      setDraft((prev) => ({ ...prev, routeId: initialRouteId }));
    }
    // If incoming initialRouteId is empty string and draft.routeId is set,
    // we intentionally do nothing to avoid overwriting user selection.
    // Depend on initialRouteId only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRouteId]);

  const topRef = React.useRef<HTMLDivElement | null>(null);

  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const updateDraft = useCallback(
    <K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) => {
      setDraft((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const goToStep2 = () => {
    setStep(2);
    scrollToTop();
  };

  const goBackToStep1 = () => {
    setStep(1);
    scrollToTop();
  };

// client-side in Booking component (use client)
const handleConfirm = () => {
  // Build a native POST form so server returns the myPOS HTML page (auto-submits)
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "/api/bookings?pay=true";
  form.style.display = "none";

  // Use the same fields validated by server — do not include client-side amount
  const payload = { ...draft };

  Object.entries(payload).forEach(([k, v]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = k;
    input.value = v == null ? "" : String(v);
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};


  // After confirm – thank you state
  if (submitted) {
    return (
      <div className="bg-white min-h-screen">
        <div ref={topRef} className="pt-32 sm:pt-36 pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative max-w-xl mx-auto overflow-hidden rounded-3xl border border-gray-100 bg-white/95 shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
              <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#162c4b] via-[#b07208] to-[#162c4b]" />

              <div className="px-6 sm:px-8 py-7 sm:py-8 text-center space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 border border-emerald-100">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.35)]" />
                  <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-700">
                    Request received
                  </span>
                </div>

                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-semibold text-[#111827]">
                    Booking request sent
                  </h1>
                  <p className="text-sm text-gray-600 max-w-md mx-auto">
                    Thank you for choosing First Class Transfers. Our dispatch
                    team is reviewing your request and will confirm your pickup
                    by email or WhatsApp shortly.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-[13px] text-gray-600">
                  <div className="space-y-1.5">
                    <p className="font-medium text-gray-800">
                      What happens next?
                    </p>
                    <ul className="space-y-1.5">
                      <li>• We verify your route and pickup time.</li>
                      <li>• A driver is assigned from our fleet.</li>
                      <li>• You receive a confirmation message.</li>
                    </ul>
                  </div>

                  <div className="space-y-1.5">
                    <p className="font-medium text-gray-800">
                      Need it urgently?
                    </p>
                    <p className="text-[13px] text-gray-600">
                      For transfers within the next{" "}
                      <span className="font-semibold text-[#162c4b]">
                        12 hours
                      </span>
                      , please also contact our 24/7 dispatch line for priority
                      handling.
                    </p>
                    <p className="text-[12px] text-gray-500">
                      Phone:{" "}
                      <span className="font-medium text-[#162c4b]">
                        +357 99 240868
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center px-4 py-2.5 rounded-full text-sm font-medium border border-gray-200 text-gray-800 hover:bg-gray-50 transition"
                  >
                    Back to homepage
                  </Link>
                  <Link
                    href="/booking"
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold shadow-md transition"
                    style={{
                      background: "linear-gradient(135deg, #b07208, #162c4b)",
                      color: "#ffffff",
                    }}
                  >
                    Make another booking
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal 2-step flow
  return (
    <div className="bg-white min-h-screen">
      <div ref={topRef} className="pt-32 sm:pt-36 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <BookingStepper currentStep={step} />

            {step === 1 && (
              <Step1Trip
                data={draft}
                onChange={updateDraft}
                onNext={goToStep2}
              />
            )}

            {step === 2 && (
              <Step2Details
                data={draft}
                onChange={updateDraft}
                onBack={goBackToStep1}
                onConfirm={handleConfirm}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
