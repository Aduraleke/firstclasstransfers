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
type ApiRoute = { id: string; title: string };

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
  const [submitted, setSubmitted] = useState(false);
  const [draft, setDraft] = useState<BookingDraft>(() =>
    createInitialDraft(initialRouteId)
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // route metadata fetched from server
  const [routeList, setRouteList] = useState<
    Array<{ id: string; title: string }>
  >([]);
  const [routeFetchError, setRouteFetchError] = useState<string | null>(null);
  const [routesLoading, setRoutesLoading] = useState(true);

  // modal state for card redirect confirmation
  const [showCardModal, setShowCardModal] = useState(false);

  useEffect(() => {
    if (initialRouteId && initialRouteId !== draft.routeId) {
      setDraft((prev) => ({ ...prev, routeId: initialRouteId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRouteId]);

  // Fetch canonical routes from server so client & server share IDs
  useEffect(() => {
    let mounted = true;
    (async () => {
      setRoutesLoading(true);
      try {
        const res = await fetch("/api/routes");
        const json = await res.json();
        if (!res.ok || !json?.ok) {
          throw new Error(json?.error ?? "Failed to fetch routes");
        }
        if (!mounted) return;
        const routes = (json.routes || []).map((r: ApiRoute) => ({
          id: r.id,
          title: r.title,
        }));
        setRouteList(routes);
        setRouteFetchError(null);
      } catch (err: unknown) {
        console.error("Failed to load routes list:", err);
        setRouteFetchError((err as Error)?.message ?? "Failed to load routes");
      } finally {
        if (mounted) setRoutesLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const topRef = React.useRef<HTMLDivElement | null>(null);
  const scrollToTop = () => {
    if (topRef.current)
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    else if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  const allowedRouteIds = routeList.map((r) => r.id);

  const handleConfirm = async () => {
    if (submitting) return;
    setSubmitError(null);

    // minimal client-side validations
    if (!draft.name || !draft.phone || !draft.email) {
      setSubmitError(
        "Please complete name, phone and email before confirming."
      );
      scrollToTop();
      return;
    }

    // Ensure routes are loaded
    if (routesLoading) {
      setSubmitError(
        "Route data is still loading — please wait a moment and try again."
      );
      scrollToTop();
      return;
    }

    // Validate routeId against server-provided list
    if (!draft.routeId || !allowedRouteIds.includes(draft.routeId)) {
      // helpful message showing nearest matches (title list) to help user/admin debug
      const available = routeList
        .slice(0, 10)
        .map((r) => `${r.title} (${r.id})`)
        .join(", ");
      setSubmitError(
        `Invalid route selection. The server doesn't recognise "${draft.routeId}". Available routes: ${available}`
      );
      scrollToTop();
      return;
    }

    // CARD flow -> show modal to confirm redirect (or directly redirect if you prefer)
    if (draft.paymentMethod === "card") {
      setShowCardModal(true);
      return;
    }

    // CASH flow -> call the JSON API
    setSubmitting(true);
    try {
      const resp = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });

      const contentType = resp.headers.get("content-type") ?? "";

      // If server returned JSON
      if (contentType.includes("application/json")) {
        const json = await resp.json();
        if (!resp.ok) {
          const msg =
            json?.error ??
            json?.message ??
            `Booking failed (status ${resp.status})`;
          setSubmitError(String(msg));
          setSubmitting(false);
          scrollToTop();
          return;
        }
        // success
        setSubmitted(true);
        setSubmitting(false);
        scrollToTop();
        return;
      }

      // If server returned HTML (most likely a Next error page or 404)
      const text = await resp.text();
      console.error(
        "Server returned non-JSON response for /api/bookings:",
        text
      );
      setSubmitError(
        `Unexpected server response. Received HTML instead of JSON. Status ${resp.status}. Check server logs or open network tab for response HTML.`
      );
      setSubmitting(false);
      scrollToTop();
    } catch (err: unknown) {
      console.error("Booking submission error:", err);
      setSubmitError(
        (err as Error)?.message ??
          "An unexpected error occurred. Please try again."
      );
      setSubmitting(false);
      scrollToTop();
    }
  };

  // invoked from the modal: proceed to myPOS by submitting a hidden form (browser navigates)
  const confirmCardAndRedirect = () => {
    // build form and submit to endpoint that returns myPOS HTML
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/api/bookings?pay=true";
    form.style.display = "none";

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
    // do not set submitting here — navigation will occur
  };

  // After confirm – thank you UI (same as before)
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
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold shadow-md transition"
                    style={{
                      background: "linear-gradient(135deg, #b07208, #162c4b)",
                      color: "#ffffff",
                    }}
                  >
                    Back to homepage
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal 2-step flow (show modal when showCardModal === true)
  return (
    <div className="bg-white min-h-screen">
      <div ref={topRef} className="pt-32 sm:pt-36 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <BookingStepper currentStep={step} />

            {/* Show route-loading or error banner so admin/dev can see mismatch early */}
            {routesLoading && (
              <div className="mb-3 text-sm text-gray-600">Loading routes…</div>
            )}
            {routeFetchError && (
              <div className="mb-3 rounded-md bg-yellow-50 border border-yellow-100 p-3 text-sm text-yellow-700">
                Warning: failed to load routes from server: {routeFetchError}
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

            {/* inline submission status / error area */}
            {submitError && (
              <div className="mt-4 rounded-md bg-red-50 border border-red-100 p-3 text-sm text-red-700">
                {submitError}
              </div>
            )}
            {submitting && (
              <div className="mt-3 text-sm text-gray-600">Processing…</div>
            )}
          </div>
        </div>
      </div>

      {/* Card confirmation modal */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowCardModal(false)}
          />
          <div className="relative max-w-md w-full bg-white rounded-2xl shadow-lg p-6 z-10">
            <h3 className="text-lg font-semibold">Pay by card</h3>
            <p className="mt-2 text-sm text-gray-600">
              You will be redirected to our secure payment provider to complete
              the card payment. The payment page will open in your current tab.
              Do you want to continue?
            </p>

            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCardModal(false)}
                className="px-4 py-2 rounded-full border"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmCardAndRedirect}
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
