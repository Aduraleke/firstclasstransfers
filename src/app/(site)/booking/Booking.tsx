"use client";

import React, { useCallback, useEffect, useState } from "react";
import BookingStepper from "@/components/booking/BookingStepper";
import Step1Trip from "@/components/booking/Step1Trip";
import Step2Details from "@/components/booking/Step2Details";
import type { BookingDraft } from "@/lib/booking/types";
import Link from "next/link";

type BookingProps = {
  initialRouteId?: string;
  initialVehicleTypeId?: string;
};

type ApiRoute = { id: string; title: string };

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

  const [showCardModal, setShowCardModal] = useState(false);

  const topRef = React.useRef<HTMLDivElement | null>(null);
  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/routes");
        const json = await res.json();
        if (!res.ok || !json?.ok) throw new Error();
        if (!mounted) return;
        setRouteList(json.routes || []);
      } catch {
        setRouteFetchError("Failed to load routes");
      } finally {
        if (mounted) setRoutesLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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

  /* ============================
     CONFIRM BOOKING (SINGLE FLOW)
  ============================ */
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

    // CARD → show modal only
    if (draft.paymentMethod === "card") {
      setShowCardModal(true);
      return;
    }

    // CASH → submit directly
    await submitBooking(false);
  };

  const submitBooking = async (payByCard: boolean) => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(
        payByCard ? "/api/bookings?pay=true" : "/api/bookings",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        }
      );

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json?.error || "Booking failed");
      }

      // CARD → backend returns HTML
      if (payByCard) {
        const html = await res.text();
        document.open();
        document.write(html);
        document.close();
        return;
      }

      // CASH → success UI
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Booking failed"
      );
      setSubmitting(false);
    }
  };

  /* ============================
     SUCCESS UI
  ============================ */
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
          style={{
            background: "linear-gradient(135deg,#b07208,#162c4b)",
          }}
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
          <div className="mt-3 text-sm text-red-600">
            {routeFetchError}
          </div>
        )}

        {step === 1 && (
          <Step1Trip
            data={draft}
            onChange={updateDraft}
            onNext={goToStep2}
            routeList={routeList}
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

        {submitError && (
          <div className="mt-4 text-sm text-red-600">{submitError}</div>
        )}
        {submitting && (
          <div className="mt-2 text-sm text-gray-500">Processing…</div>
        )}
      </div>

      {/* CARD CONFIRMATION MODAL */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold">Pay by card</h3>
            <p className="mt-2 text-sm text-gray-600">
              You’ll be redirected to our secure payment provider.
            </p>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowCardModal(false)}
                className="px-4 py-2 border rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={() => submitBooking(true)}
                className="px-4 py-2 rounded-full text-white"
                style={{
                  background:
                    "linear-gradient(135deg,#b07208,#162c4b)",
                }}
              >
                Continue to payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
