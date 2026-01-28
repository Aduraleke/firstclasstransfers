"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

import BookingStepper from "@/components/booking/BookingStepper";
import Step1Trip from "@/components/booking/Step1Trip";
import Step2Details from "@/components/booking/Step2Details";
import type { BookingRoute } from "@/lib/booking/bookingRoute";

import type { BookingDraft } from "@/lib/booking/types";
import { bookTrip } from "@/lib/api/bookTrip";


type BookingProps = {
  initialRouteId?: string;
  initialVehicleTypeId?: string;
};

function createInitialDraft(initialRouteSlug?: string): BookingDraft {
  return {
    routeId: "",                     // backend ID (unknown yet)
    routeSlug: initialRouteSlug ?? "",

    vehicleTypeId: "",
    timePeriod: "Day Tariff",
    date: "",
    time: "",

    tripType: "One Way",
    returnDate: "",
    returnTime: "",
    returnTimePeriod: "Day Tariff",

    flightNumber: "",
    adults: 1,
    children: 0,
    baggageType: "Hand",
    totalPrice: 0,
    name: "",
    phone: "",
    email: "",
    notes: "",

    paymentMethod: "Cash",
  };
}

export default function Booking({
  initialRouteId = "",
  initialVehicleTypeId = "",
}: BookingProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [submitted, setSubmitted] = useState(false);

  const [draft, setDraft] = useState<BookingDraft>(() => ({
    ...createInitialDraft(initialRouteId),
    vehicleTypeId: initialVehicleTypeId || "",
  }));

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [routeList, setRouteList] = useState<BookingRoute[]>([]);
  const [, setRoutesLoading] = useState(true);
  const [routeFetchError, setRouteFetchError] = useState<string | null>(null);

  const [paymentLoading, setPaymentLoading] = useState(false);

  const topRef = useRef<HTMLDivElement | null>(null);
  const scrollToTop = () =>
    topRef.current?.scrollIntoView({ behavior: "smooth" });

  /* ---------- analytics ---------- */
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "lead", page: "booking" });
  }, []);

  /* ---------- load routes ---------- */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetch("http://92.113.29.160:1805/routes/");
        if (!res.ok) throw new Error("Failed to load routes");
        const routes = await res.json();

        console.log("BOOKING: raw API response", routes);
        console.log("BOOKING: route count", routes.length);

        if (mounted) setRouteList(routes);
      } catch (err) {
        console.error(err);
        if (mounted) setRouteFetchError("Failed to load routes");
      } finally {
        if (mounted) setRoutesLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
  if (!draft.routeSlug || draft.routeId || routeList.length === 0) return;

  const route = routeList.find(r => r.slug === draft.routeSlug);
  if (!route) return;

  setDraft(prev => ({
    ...prev,
    routeId: route.routeId,   // fct2cp1e1 ✅
  }));
}, [draft.routeSlug, draft.routeId, routeList]);


  /* ---------- update draft ---------- */
  const updateDraft = useCallback(
    <K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) => {
      setDraft((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  /* ---------- confirm ---------- */
const handleConfirm = async () => {
  if (submitting) return;

  setSubmitError(null);

  if (!draft.name || !draft.phone || !draft.email) {
    setSubmitError("Please complete all required fields.");
    scrollToTop();
    return;
  }

  try {
    setSubmitting(true);
    await bookTrip(draft);
    setSubmitted(true);
  } catch (error) {
    console.error("Booking failed:", error);
    setSubmitError("Booking failed. Please try again or contact support.");
  } finally {
    setSubmitting(false);
  }
};

  /* ---------- success ---------- */
  if (submitted) {
    return (
      <div className="bg-white min-h-screen pt-32 text-center">
        <h1 className="text-2xl font-semibold">Booking request sent</h1>
        <p className="mt-2 text-gray-600">
          We’ve emailed you and our office. We’ll confirm shortly.
        </p>

        <Link
          href="/"
          className="inline-block mt-6 px-5 py-2.5 rounded-full text-white"
          style={{ background: "linear-gradient(135deg,#b07208,#162c4b)" }}
        >
          Back to homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div ref={topRef} className="pt-32 pb-12 max-w-6xl mx-auto px-4">
        <BookingStepper currentStep={step} />

        {routeFetchError && (
          <div className="mt-3 text-sm text-red-600">{routeFetchError}</div>
        )}

        {step === 1 && (
          <Step1Trip
            data={draft}
            onChange={updateDraft}
            onNext={() => setStep(2)}
            routeList={routeList}
          />
        )}

        {step === 2 && (
          <Step2Details
            data={draft}
            routeList={routeList} // ✅ THIS WAS MISSING
            onChange={updateDraft}
            onBack={() => setStep(1)}
            onConfirm={handleConfirm}
            paymentLoading={paymentLoading}
            onPaymentSuccess={async () => {
              try {
                const res = await fetch("/api/bookings", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    ...draft,
                    paymentMethod: "card",
                  }),
                });

                if (!res.ok) {
                  throw new Error("Booking creation failed after payment");
                }

                setSubmitted(true);
              } catch (err) {
                console.error("Card booking finalization failed:", err);
                setSubmitError(
                  "Payment succeeded but booking failed. Contact support.",
                );
              } finally {
                setPaymentLoading(false);
              }
            }}
            onPaymentCancel={() => setPaymentLoading(false)}
          />
        )}

        {submitError && (
          <div className="mt-4 text-sm text-red-600">{submitError}</div>
        )}
      </div>
    </div>
  );
}
