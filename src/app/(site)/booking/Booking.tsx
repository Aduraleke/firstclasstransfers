"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

import BookingStepper from "@/components/booking/BookingStepper";
import Step1Trip from "@/components/booking/Step1Trip";
import Step2Details from "@/components/booking/Step2Details";

import type { BookingDraft } from "@/lib/booking/types";

type BookingProps = {
  initialRouteId?: string;
  initialVehicleTypeId?: string;
};

type ApiRoute = {
  id: string;
  title: string;
};

function createInitialDraft(initialRouteId?: string): BookingDraft {
  return {
    routeId: initialRouteId ?? "",
    vehicleTypeId: "",
    timePeriod: "day",
    date: "",
    time: "",

    tripType: "one-way",
    returnDate: "",
    returnTime: "",
    returnTimePeriod: "day",

    flightNumber: "",
    adults: 1,
    children: 0,
    baggageType: "hand",

    name: "",
    phone: "",
    email: "",
    notes: "",

    paymentMethod: "cash",
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

  const [routeList, setRouteList] = useState<ApiRoute[]>([]);
  const [routesLoading, setRoutesLoading] = useState(true);
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
        const res = await fetch("/api/routes");
        const json = await res.json();
        if (!res.ok || !json?.ok) {
          throw new Error(`Failed to load routes: ${res.status} ${res.statusText}`);
        }
        if (mounted) setRouteList(json.routes || []);
      } catch (error) {
        console.error("Error while loading routes:", error);
        setRouteFetchError("Failed to load routes");
      } finally {
        if (mounted) setRoutesLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  /* ---------- update draft ---------- */
  const updateDraft = useCallback(
    <K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) => {
      setDraft((prev) => ({ ...prev, [key]: value }));
    },
    []
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

    if (routesLoading) {
      setSubmitError("Routes are still loading.");
      return;
    }

    // 💳 CARD → handled fully by Step2Details
    if (draft.paymentMethod === "card") {
      setPaymentLoading(true);
      return;
    }

    // 💶 CASH
    try {
      setSubmitting(true);
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });

      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setSubmitError("Booking failed");
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
            onChange={updateDraft}
            onBack={() => setStep(1)}
            onConfirm={handleConfirm}
            paymentLoading={paymentLoading}
            onPaymentSuccess={() => setSubmitted(true)}
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
