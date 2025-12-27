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

/* --------------------------------
   INITIAL DRAFT
-------------------------------- */
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

/* ============================================
   BOOKING COMPONENT (CLIENT ONLY)
============================================ */
export default function Booking({
  initialRouteId = "",
  initialVehicleTypeId = "",
}: BookingProps) {
  /* ---------- step control ---------- */
  const [step, setStep] = useState<1 | 2>(1);
  const [submitted, setSubmitted] = useState(false);

  /* ---------- draft ---------- */
  const [draft, setDraft] = useState<BookingDraft>(() => ({
    ...createInitialDraft(initialRouteId),
    vehicleTypeId: initialVehicleTypeId || "",
  }));

  /* ---------- ui state ---------- */
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  /* ---------- routes ---------- */
  const [routeList, setRouteList] = useState<ApiRoute[]>([]);
  const [routesLoading, setRoutesLoading] = useState(true);
  const [routeFetchError, setRouteFetchError] = useState<string | null>(null);

  /* ---------- card payment ---------- */
  const [showCardModal, setShowCardModal] = useState(false);
  const [revolutOrderId, setRevolutOrderId] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  /* ---------- scroll ---------- */
  const topRef = useRef<HTMLDivElement | null>(null);
  const scrollToTop = () =>
    topRef.current?.scrollIntoView({ behavior: "smooth" });

  /* ============================================
     ANALYTICS (SAFE)
  ============================================ */
  useEffect(() => {
    if (typeof window !== "undefined") {

      window.dataLayer = window.dataLayer || [];

      window.dataLayer.push({ event: "lead", page: "booking" });
    }
  }, []);

  /* ============================================
     LOAD ROUTES
  ============================================ */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await fetch("/api/routes");
        const json = await res.json();

        if (!res.ok || !json?.ok) {
          throw new Error("Failed to load routes");
        }

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

  /* ============================================
     DRAFT UPDATE
  ============================================ */
  const updateDraft = useCallback(
    <K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) => {
      setDraft((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  /* ============================================
     STEP CONTROL
  ============================================ */
  const goToStep2 = () => {
    setStep(2);
    scrollToTop();
  };

  const goBackToStep1 = () => {
    setStep(1);
    scrollToTop();
  };

  /* ============================================
     CONFIRM BOOKING
  ============================================ */
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

    if (draft.paymentMethod === "card") {
      setShowCardModal(true);
      return;
    }

    await submitCashBooking();
  };

  /* ============================================
     CASH BOOKING
  ============================================ */
  const submitCashBooking = async () => {
    try {
      setSubmitting(true);

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Booking failed");

      if (typeof window !== "undefined") {

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "purchase",
          bookingValue: json.amount,
          currency: "EUR",
          paymentMethod: "cash",
        });
      }

      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  /* ============================================
     CARD (REVOLUT)
  ============================================ */
  const startCardPayment = async () => {
    try {
      setSubmitting(true);
      setPaymentLoading(true);
      setShowCardModal(false);

      const res = await fetch("/api/payments/revolut/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Payment init failed");

      setRevolutOrderId(json.publicId);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Payment failed");
      setPaymentLoading(false);
    } finally {
      setSubmitting(false);
    }
  };

  const closeRevolutModal = useCallback(() => {
    setRevolutOrderId(null);
    setPaymentLoading(false);
    setSubmitting(false);
  }, []);

  /* ============================================
     SUCCESS STATE
  ============================================ */
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

  /* ============================================
     RENDER
  ============================================ */
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
            revolutOrderId={revolutOrderId}
            paymentLoading={paymentLoading}
            onPaymentSuccess={() => setSubmitted(true)}
            onPaymentCancel={closeRevolutModal}
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
              You’ll complete payment securely via Revolut.
            </p>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setShowCardModal(false)}
                className="px-4 py-2 border rounded-full"
              >
                Cancel
              </button>
              <button
                onClick={startCardPayment}
                className="px-4 py-2 rounded-full text-white"
                style={{
                  background: "linear-gradient(135deg,#b07208,#162c4b)",
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
