"use client";

import React, { useMemo, useEffect } from "react";
import type { BookingDraft } from "@/lib/booking/types";
import type { BookingRoute } from "@/lib/booking/bookingRoute";
import { BAGGAGE_OPTIONS, TIME_PERIODS } from "@/lib/booking/options";

type Props = {
  data: BookingDraft;
  routeList: BookingRoute[]; // ✅ NEW (same as Step 1)
  onChange: <K extends keyof BookingDraft>(
    key: K,
    value: BookingDraft[K],
  ) => void;
  onBack: () => void;
  onConfirm: () => void;
  revolutOrderId?: string | null;
  paymentLoading: boolean;
  onPaymentSuccess: () => void;
  onPaymentCancel: () => void;
};

const BRAND_PRIMARY = "#162c4b";
const BRAND_ACCENT = "#b07208";

function parsePriceToNumber(price?: string | number | null): number | null {
  if (price == null) return null;

  // Already a number → return directly
  if (typeof price === "number") {
    return Number.isFinite(price) ? price : null;
  }

  // String → normalize and extract number
  const normalized = price.replace(",", ".");
  const match = normalized.match(/(\d+(\.\d+)?)/);

  if (!match) return null;

  const n = Number(match[1]);
  return Number.isFinite(n) ? n : null;
}

export default function Step2Details({
  data,
  routeList, // ✅ ADD THIS
  onChange,
  onBack,
  onConfirm,
  revolutOrderId,
  paymentLoading,
  onPaymentSuccess,
  onPaymentCancel,
}: Props) {
  // ---------------------------------------
  // FIXED: These must come BEFORE any usage
  // ---------------------------------------

  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);
  const [checkoutMounted, setCheckoutMounted] = React.useState(false);

const routeDetail = useMemo(
  () => routeList.find((r) => r.routeId === data.routeId),
  [routeList, data.routeId],
);

  const vehicleIndex = useMemo(() => {
    if (!routeDetail) return -1;
    return routeDetail.vehicleOptions.findIndex(
      (v, idx) => (idx === 0 ? "sedan" : "vclass") === data.vehicleTypeId,
    );
  }, [routeDetail, data.vehicleTypeId]);

  const vehicleOption =
    vehicleIndex >= 0 ? routeDetail?.vehicleOptions[vehicleIndex] : null;

  const totalPassengers = (data.adults || 0) + (data.children || 0);

  const maxCapacity = vehicleOption?.maxPassengers ?? 0;

  const exceedsCapacity =
    Boolean(vehicleOption) && totalPassengers > maxCapacity;

  const upgradeVehicleOption = useMemo(() => {
    if (!routeDetail || vehicleIndex < 0) return null;

    return routeDetail.vehicleOptions
      .slice(vehicleIndex + 1)
      .find((v) => v.maxPassengers >= totalPassengers);
  }, [routeDetail, vehicleIndex, totalPassengers]);

  useEffect(() => {
    if (revolutOrderId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [revolutOrderId]);

  React.useEffect(() => {
    if (exceedsCapacity && upgradeVehicleOption) {
      setShowUpgradeModal(true);
    }
  }, [exceedsCapacity, upgradeVehicleOption]);

  const timePeriod = useMemo(
    () => TIME_PERIODS.find((tp) => tp.id === data.timePeriod),
    [data.timePeriod],
  );

  const returnTimePeriod = useMemo(
    () => TIME_PERIODS.find((tp) => tp.id === data.returnTimePeriod),
    [data.returnTimePeriod],
  );

  const emailValid = data.email.includes("@");

  const hasReturnDetails =
    data.tripType === "One Way" ||
    (Boolean(data.returnDate) &&
      Boolean(data.returnTime) &&
      Boolean(data.returnTimePeriod));

  const canConfirm =
    Boolean(data.name) &&
    Boolean(data.phone) &&
    Boolean(data.email) &&
    emailValid &&
    Boolean(data.flightNumber) &&
    data.adults > 0 &&
    Boolean(data.baggageType) &&
    Boolean(data.paymentMethod) &&
    hasReturnDetails &&
    !exceedsCapacity;

  // --- fare computation ---
  const perLegPriceNumber = useMemo(() => {
    if (!vehicleOption) return null;
    return parsePriceToNumber(vehicleOption.fixedPrice);
  }, [vehicleOption]);

  const isReturn = data.tripType === "Return";
  const legs = isReturn ? 2 : 1;

  const subtotal = perLegPriceNumber != null ? perLegPriceNumber * legs : null;

  const total = subtotal != null ? Math.round(subtotal) : null;

  const perLegDisplay = formatEuro(perLegPriceNumber);
  const subtotalDisplay = formatEuro(subtotal);
  const totalDisplay = formatEuro(total);

  useEffect(() => {
    if (!paymentLoading || data.paymentMethod !== "Card") return;

    let destroy: (() => void) | undefined;

    document.body.style.overflow = "hidden";

    (async () => {
      const target = document.getElementById("revolut-checkout");
      if (!target) {
        console.error("Revolut target not found");
        return;
      }

      const { default: RevolutCheckout } = await import("@revolut/checkout");
      const revolut = await RevolutCheckout();

      const result = await revolut.embeddedCheckout({
        publicToken: process.env.NEXT_PUBLIC_REVOLUT_PUBLIC_KEY,
        environment: "prod",
        target,

        createOrder: async () => {
          const res = await fetch("/api/payments/revolut/checkout-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          const json = await res.json();

          if (!res.ok || !json?.token) {
            throw new Error("Invalid Revolut order response");
          }

          return { publicId: json.token };
        },

        onSuccess() {
          onPaymentSuccess();
        },

        onCancel() {
          onPaymentCancel();
        },

        onError(err) {
          console.error("[REVOLUT] Checkout error:", err);
        },
      });

      setCheckoutMounted(true);
      destroy = result.destroy;
    })();

    return () => {
      document.body.style.overflow = "";
      destroy?.();
      setCheckoutMounted(false);
    };
  }, [paymentLoading, data, onPaymentCancel, onPaymentSuccess]);

  function formatEuro(value: number | null) {
    if (value == null) return "—";
    return `€${value.toFixed(0)}`;
  }
  useEffect(() => {
  if (total != null) {
    onChange("totalPrice", total);
  }
}, [total, onChange]);


  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-lg shadow-gray-100/70 p-5 sm:p-6 lg:p-7 space-y-6">
      {/* Summary */}
      <section className="space-y-3">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-[#111827]">
              Review your trip
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Confirm passenger details, pricing and payment before sending your
              booking request.
            </p>
          </div>

          {/* PRICE CARD */}
          <div className="w-44 sm:w-56">
            <div
              className="rounded-2xl p-4 shadow-lg text-center"
              style={{
                background: `linear-gradient(135deg, ${BRAND_ACCENT}, ${BRAND_PRIMARY})`,
                color: "#fff",
              }}
            >
              <div className="text-xs opacity-90">Price</div>
              <div className="mt-2 text-2xl sm:text-3xl font-extrabold leading-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
                {totalDisplay}
              </div>
              <div className="text-[11px] opacity-85 mt-1">
                {perLegDisplay} {isReturn ? "· per leg" : "· per vehicle"}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 rounded-2xl border border-gray-200 p-4">
          {/* Trip Type */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                viewBox="0 0 24 24"
              >
                <path d="M3 12h18M3 6h12M3 18h12" />
              </svg>
              <p className="text-xs font-medium text-gray-600">Trip type</p>
            </div>
            <p className="text-sm font-semibold text-gray-900 capitalize">
              {data.tripType === "Return" ? "Return (round trip)" : "One Way"}
            </p>
          </div>

          {/* Route */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                viewBox="0 0 24 24"
              >
                <path d="M12 2v20M5 9l7-7 7 7" />
              </svg>
              <p className="text-xs font-medium text-gray-600">Route</p>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {routeDetail
                ? `${routeDetail.fromLocation} → ${routeDetail.toLocation}`
                : "Route not selected"}
            </p>
          </div>

          {/* Outbound */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
              </svg>
              <p className="text-xs font-medium text-gray-600">Outbound</p>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {data.date || "—"} · {data.time || "—"}
            </p>
            <p className="text-[11px] text-gray-500">
              Tariff:{" "}
              {timePeriod
                ? `${timePeriod.label} (${timePeriod.range})`
                : data.timePeriod || "—"}
            </p>
          </div>

          {/* Return */}
          {data.tripType === "Return" && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 4l7 7-7 7" />
                  <path d="M13 4l7 7-7 7" />
                </svg>
                <p className="text-xs font-medium text-gray-600">Return</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {data.returnDate || "—"} · {data.returnTime || "—"}
              </p>
              <p className="text-[11px] text-gray-500">
                Tariff:{" "}
                {returnTimePeriod
                  ? `${returnTimePeriod.label} (${returnTimePeriod.range})`
                  : data.returnTimePeriod || "—"}
              </p>
            </div>
          )}

          {/* Vehicle */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                viewBox="0 0 24 24"
              >
                <path d="M3 13l2-5h14l2 5M5 13v6M19 13v6M7 19h10" />
                <circle cx="7" cy="17" r="2" />
                <circle cx="17" cy="17" r="2" />
              </svg>
              <p className="text-xs font-medium text-gray-600">Vehicle</p>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {vehicleOption ? vehicleOption.vehicleType : "Not selected"}
            </p>
            {vehicleOption && (
              <p className="text-[11px] text-gray-500">
                {vehicleOption.idealFor} · {vehicleOption.maxPassengers}
              </p>
            )}
          </div>

          {/* Passengers */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="7" r="3" />
                <path d="M5 21v-2a7 7 0 0114 0v2" />
              </svg>
              <p className="text-xs font-medium text-gray-600">Passengers</p>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {totalPassengers || "—"} passenger
              {totalPassengers === 1 ? "" : "s"}
            </p>
            <p className="text-[11px] text-gray-500">
              Adults: {data.adults || 0}, Children: {data.children || 0}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-800">Fare summary</h3>

        {/* ALWAYS VISIBLE CARD */}
        <div className="rounded-2xl bg-white shadow-md overflow-hidden border border-gray-200">
          {/* HEADER STRIP */}
          <div
            className="p-4 flex items-center justify-between"
            style={{
              background: `linear-gradient(135deg, ${BRAND_ACCENT}, ${BRAND_PRIMARY})`,
              color: "white",
            }}
          >
            <div className="flex items-center gap-2">
              {/* Price Tag Icon */}
              <svg
                className="w-4 h-4 opacity-90"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                viewBox="0 0 24 24"
              >
                <path d="M7 7h10v10H7z" />
                <path d="M9 9l6 6M15 9l-6 6" />
              </svg>

              <span className="text-sm font-semibold">Trip total</span>
            </div>

            {/* Animated Total */}
            <span className="text-xl font-extrabold transition-all duration-300">
              {totalDisplay}
            </span>
          </div>

          {/* CONTENT */}
          <div className="p-4 space-y-4">
            {/* Price per leg */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v10M9 9h6" />
                </svg>
                <span className="text-[13px]">Price per vehicle / leg</span>
              </div>
              <span className="font-medium transition-opacity duration-300">
                {perLegDisplay}
              </span>
            </div>

            {/* Legs */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M5 6h14M5 18h14" />
                </svg>
                <span className="text-[13px]">Legs</span>
              </div>
              <span className="font-medium">{legs}</span>
            </div>

            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
                <span className="text-[13px]">Subtotal</span>
              </div>
              <span className="font-semibold">{subtotalDisplay}</span>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8M12 8v8" />
                </svg>
                <span className="text-[14px] font-semibold text-gray-900">
                  Total
                </span>
              </div>

              <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                {totalDisplay}
              </span>
            </div>

            {/* Notes */}
            <p className="text-[11px] text-gray-500 leading-relaxed pt-1">
              All fares are per vehicle. Taxes, airport & road fees included.
            </p>
          </div>
        </div>

        {/* MOBILE FLOATING BAR */}
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-white border-t border-gray-200 shadow-lg p-3 flex items-center justify-between z-50">
          <span className="text-sm font-medium">Total</span>
          <span className="text-xl font-extrabold">{totalDisplay}</span>
        </div>
      </section>

      {/* Transfer info */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-800">
          Transfer information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Flight number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={data.flightNumber}
              onChange={(e) => onChange("flightNumber", e.target.value)}
              placeholder="e.g. BA662"
              className="mt-1 block w-full rounded-2xl border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-[#b07208] focus:ring-[#b07208]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">
              Adults <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              max={6}
              value={data.adults || ""}
              onChange={(e) => onChange("adults", Number(e.target.value))}
              className="mt-1 block w-full rounded-2xl border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-[#b07208] focus:ring-[#b07208]"
            />

            {/* Passenger capacity error (below adults/children) */}
            {exceedsCapacity && (
              <p className="mt-1 text-[11px] text-red-600">
                {vehicleOption?.vehicleType} can take max{" "}
                {vehicleOption?.maxPassengers} passengers. You currently
                selected {totalPassengers}.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">
              Children
            </label>
            <input
              type="number"
              min={0}
              max={6}
              value={data.children || ""}
              onChange={(e) => onChange("children", Number(e.target.value))}
              className="mt-1 block w-full rounded-2xl border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-[#b07208] focus:ring-[#b07208]"
            />
          </div>
        </div>

        <div>
          <p className="block text-xs font-medium text-gray-700 mb-1.5">
            Luggage <span className="text-red-500">*</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {BAGGAGE_OPTIONS.map((option) => {
              const active = data.baggageType === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onChange("baggageType", option.id)}
                  className={`text-left rounded-2xl border px-3 py-2 text-sm transition-all ${
                    active
                      ? "border-transparent shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={{
                    background: active
                      ? `linear-gradient(135deg, ${BRAND_ACCENT}, ${BRAND_PRIMARY})`
                      : "#ffffff",
                    color: active ? "#ffffff" : "#111827",
                  }}
                >
                  <div className="flex flex-col">
                    <span className="font-semibold">{option.label}</span>
                    <span
                      className={`text-[11px] ${
                        active ? "text-white/80" : "text-gray-500"
                      }`}
                    >
                      {option.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Passenger details */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-800">
          Passenger details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Full name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => onChange("name", e.target.value)}
              className="mt-1 block w-full rounded-2xl border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-[#b07208] focus:ring-[#b07208]"
              placeholder="Passenger name"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">
              Phone number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              className="mt-1 block w-full rounded-2xl border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-[#b07208] focus:ring-[#b07208]"
              placeholder="+357..."
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-700">
              Email address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => onChange("email", e.target.value)}
              className="mt-1 block w-full rounded-2xl border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-[#b07208] focus:ring-[#b07208]"
              placeholder="you@example.com"
            />
            {!emailValid && data.email && (
              <p className="mt-1 text-[11px] text-red-500">
                Please enter a valid email address.
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-700">
              Additional information / special requests
            </label>
            <textarea
              rows={3}
              value={data.notes}
              onChange={(e) => onChange("notes", e.target.value)}
              className="mt-1 block w-full rounded-2xl border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-[#b07208] focus:ring-[#b07208]"
              placeholder="e.g. Baby seat required, extra stop, hotel name..."
            />
          </div>
        </div>
      </section>

      {/* Payment method */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-800">Payment method</h2>
        <p className="text-xs text-gray-500 mb-1">
          Choose how you&apos;d like to pay for your transfer.
        </p>

        <div className="inline-flex gap-2 rounded-2xl bg-gray-50 p-1 border border-gray-200">
          {[
            { id: "Cash" as const, label: "Pay cash to driver" },
            { id: "Card" as const, label: "Pay now by card" },
          ].map((method) => {
            const active = data.paymentMethod === method.id;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => onChange("paymentMethod", method.id)}
                className={`flex flex-col px-3 py-1.5 rounded-2xl text-left text-xs sm:text-sm transition-all ${
                  active ? "shadow-sm" : "hover:bg-white hover:shadow-sm"
                }`}
                style={{
                  backgroundColor: active ? BRAND_PRIMARY : "transparent",
                  color: active ? "#ffffff" : "#111827",
                }}
              >
                <span className="font-semibold">
                  {method.id === "Cash" ? "Cash" : "Card"}
                </span>
                <span
                  className={`text-[10px] ${
                    active ? "text-white/85" : "text-gray-500"
                  }`}
                >
                  {method.id === "Cash"
                    ? "Pay the driver in EUR at the end of the trip."
                    : "We’ll send a secure payment link to confirm your booking."}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* -------------------------------- */}
      {/* Actions + capacity error banner */}
      {/* -------------------------------- */}
      <div className="pt-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium bg-white border border-slate-200 text-slate-800 shadow-sm hover:shadow-md hover:bg-slate-50 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-300"
          >
            <span aria-hidden className="text-lg">
              ←
            </span>
            <span>Back to trip details</span>
          </button>
        </div>

        <div className="flex w-full sm:w-auto flex-col items-stretch sm:items-end gap-2">
          {/* RED ERROR BANNER (above confirm button) */}
          {exceedsCapacity && (
            <div className="rounded-md bg-red-50 border border-red-200 text-red-700 text-sm p-3 w-full sm:w-auto">
              Too many passengers for the selected vehicle.
              {vehicleOption?.vehicleType} allows max{" "}
              {vehicleOption?.maxPassengers} passengers.
            </div>
          )}

          <p className="text-xs text-slate-500 max-w-xl text-left sm:text-right">
            You&apos;ll see the final confirmation on the next screen. For card
            payments, we&apos;ll charge you now to secure your booking.
          </p>

          <div className="flex items-center gap-3">
            <div
              role="status"
              aria-hidden={!canConfirm}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-medium text-emerald-800 border border-emerald-100"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a4 4 0 10-8 0v2" />
              </svg>
              <span>Secure payment</span>
            </div>
            <button
              type="button"
              disabled={!canConfirm}
              onClick={canConfirm ? onConfirm : undefined}
              aria-disabled={!canConfirm}
              className={`inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-semibold shadow-md transition transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${
                canConfirm ? "text-white" : "bg-slate-200 text-slate-700"
              }`}
              style={
                canConfirm
                  ? {
                      background: `linear-gradient(135deg, ${BRAND_ACCENT}, ${BRAND_PRIMARY})`,
                    }
                  : undefined
              }
            >
              Confirm booking request
            </button>
          </div>

          <div
            aria-live="polite"
            className="mt-2 text-[12px] text-slate-500"
            id="booking-action-feedback"
          >
            <span>
              Card will be charged to hold the vehicle. Receipt and details sent
              by email.
            </span>
          </div>
        </div>
      </div>

      {showUpgradeModal && upgradeVehicleOption && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900">
              Upgrade vehicle?
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              You selected <strong>{totalPassengers}</strong> passengers, but
              the <strong>{vehicleOption?.vehicleType}</strong> allows only{" "}
              {vehicleOption?.maxPassengers}.
            </p>

            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-medium text-emerald-900">
                Recommended upgrade
              </p>
              <p className="text-sm text-emerald-800">
                Switch to{" "}
                <p className="text-sm text-emerald-800">
                  Switch to <strong>{upgradeVehicleOption.vehicleType}</strong>{" "}
                  to fit your group comfortably.
                </p>{" "}
                to fit your group comfortably.
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Keep current vehicle
              </button>

              <button
                onClick={() => {
                  onChange(
                    "vehicleTypeId",
                    upgradeVehicleOption === routeDetail?.vehicleOptions[0]
                      ? "sedan"
                      : "vclass",
                  );

                  setShowUpgradeModal(false);
                }}
                className="flex-1 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${BRAND_ACCENT}, ${BRAND_PRIMARY})`,
                }}
              >
                Upgrade vehicle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT MODAL */}
      {paymentLoading && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg rounded-2xl min-h-lg py-10 p-4 relative">
            {/* CLOSE */}
            <button
              onClick={onPaymentCancel}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
              aria-label="Close payment"
            >
              ✕
            </button>

            {/* CHECKOUT TARGET (ALWAYS PRESENT) */}
            <div id="revolut-checkout" />

            {/* FALLBACK SPINNER (brief only) */}
            {!checkoutMounted && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#b07208]" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-800">
                    Preparing secure payment
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Please wait…</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
