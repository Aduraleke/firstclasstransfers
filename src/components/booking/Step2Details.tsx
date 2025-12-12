"use client";

import React, { useMemo } from "react";
import type { BookingDraft } from "@/lib/booking/types";
import {
  BAGGAGE_OPTIONS,
  TRANSFER_ROUTES,
  VEHICLE_TYPES,
  TIME_PERIODS,
} from "@/lib/booking/options";
import { getRouteDetailBySlug, RouteDetail } from "@/lib/routes";

type Props = {
  data: BookingDraft;
  onChange: <K extends keyof BookingDraft>(
    key: K,
    value: BookingDraft[K]
  ) => void;
  onBack: () => void;
  onConfirm: () => void;
};

const BRAND_PRIMARY = "#162c4b";
const BRAND_ACCENT = "#b07208";

// Vehicle capacity rules
const VEHICLE_CAPACITY: Record<string, number> = {
  sedan: 4,
  vclass: 6,
};

function parsePriceToNumber(price?: string): number | null {
  if (!price) return null;
  const match = price.replace(",", ".").match(/(\d+(\.\d+)?)/);
  if (!match) return null;
  return Number(match[1]);
}

function formatEuro(n: number | null): string {
  if (n == null || Number.isNaN(n)) return "—";
  return `€${n.toFixed(0)}`;
}

// Map vehicle ids to route.vehicleOptions index
const VEHICLE_TO_ROUTE_INDEX: Record<string, number> = {
  sedan: 0,
  vclass: 1,
};

export default function Step2Details({
  data,
  onChange,
  onBack,
  onConfirm,
}: Props) {
  const route = useMemo(
    () => TRANSFER_ROUTES.find((r) => r.id === data.routeId),
    [data.routeId]
  );

  const routeDetail: RouteDetail | undefined = useMemo(
    () => (data.routeId ? getRouteDetailBySlug(data.routeId) : undefined),
    [data.routeId]
  );

  const vehicle = useMemo(
    () => VEHICLE_TYPES.find((v) => v.id === data.vehicleTypeId),
    [data.vehicleTypeId]
  );

  const timePeriod = useMemo(
    () => TIME_PERIODS.find((tp) => tp.id === data.timePeriod),
    [data.timePeriod]
  );

  const returnTimePeriod = useMemo(
    () => TIME_PERIODS.find((tp) => tp.id === data.returnTimePeriod),
    [data.returnTimePeriod]
  );

  // Passenger capacity logic
  const totalPassengers = (data.adults || 0) + (data.children || 0);
  const maxCapacity =
    VEHICLE_CAPACITY[data.vehicleTypeId || ""] || 0;
  const exceedsCapacity =
    data.vehicleTypeId && totalPassengers > maxCapacity;

  const emailValid = data.email.includes("@");

  const hasReturnDetails =
    data.tripType === "one-way" ||
    (Boolean(data.returnDate) &&
      Boolean(data.returnTime) &&
      Boolean(data.returnTimePeriod));

  // Updated canConfirm (capacity added)
  const canConfirm =
    Boolean(data.name) &&
    Boolean(data.phone) &&
    Boolean(data.email) &&
    emailValid &&
    data.adults > 0 &&
    Boolean(data.baggageType) &&
    Boolean(data.paymentMethod) &&
    hasReturnDetails &&
    !exceedsCapacity;

  // --- fare computation ---
  const perLegPriceNumber = useMemo(() => {
    if (!routeDetail || !data.vehicleTypeId) return null;
    const idx = VEHICLE_TO_ROUTE_INDEX[data.vehicleTypeId] ?? 0;
    const priceStr = routeDetail.vehicleOptions?.[idx]?.fixedPrice;
    return parsePriceToNumber(priceStr ?? undefined);
  }, [routeDetail, data.vehicleTypeId]);

  const isReturn = data.tripType === "return";
  const legs = isReturn ? 2 : 1;
  const subtotal =
    perLegPriceNumber != null ? perLegPriceNumber * legs : null;
  const discount =
    isReturn && subtotal != null ? Math.round(subtotal * 0.1) : 0;
  const total =
    subtotal != null ? Math.round(subtotal - discount) : null;

  const perLegDisplay = formatEuro(perLegPriceNumber);
  const subtotalDisplay = formatEuro(subtotal);
  const discountDisplay = discount ? formatEuro(discount) : null;
  const totalDisplay = formatEuro(total);

  const discountText = isReturn
    ? "10% discount applied for booking return together."
    : "Return trips booked together receive a 10% discount.";

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
              {isReturn && discount > 0 && (
                <div className="mt-2 text-[11px] text-emerald-100/90">
                  −{discountDisplay} discount
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 rounded-2xl border border-gray-200 p-4">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-gray-600">Trip type</p>
            <p className="text-sm text-gray-900 capitalize">
              {data.tripType === "return" ? "Return (round trip)" : "One-way"}
            </p>
            <p className="text-[11px] text-emerald-700">{discountText}</p>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-gray-600">Route</p>
            <p className="text-sm text-gray-900">
              {routeDetail
                ? `${routeDetail.from} → ${routeDetail.to}`
                : route
                ? `${route.origin} → ${route.destination}`
                : "Route not selected"}
            </p>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-gray-600">Outbound</p>
            <p className="text-sm text-gray-900">
              {data.date || "—"} · {data.time || "—"}
            </p>
            <p className="text-[11px] text-gray-500">
              Tariff:{" "}
              {timePeriod
                ? `${timePeriod.label} (${timePeriod.range})`
                : data.timePeriod || "—"}
            </p>
          </div>

          {data.tripType === "return" && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-gray-600">Return</p>
              <p className="text-sm text-gray-900">
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

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-gray-600">Vehicle</p>
            <p className="text-sm text-gray-900">
              {vehicle ? vehicle.name : "Not selected"}
            </p>
            {vehicle && (
              <p className="text-[11px] text-gray-500">
                {vehicle.subtitle} · {vehicle.luggage}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-gray-600">Passengers</p>
            <p className="text-sm text-gray-900">
              {totalPassengers || "—"} passenger
              {totalPassengers === 1 ? "" : "s"}
            </p>
            <p className="text-[11px] text-gray-500">
              Adults: {data.adults || 0}, Children: {data.children || 0}
            </p>
          </div>
        </div>
      </section>

      {/* Fare breakdown */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-800">Fare summary</h3>

        <div className="rounded-lg border bg-white p-3 text-sm text-gray-700">
          <div className="flex items-center justify-between">
            <div>Price per vehicle / leg</div>
            <div className="font-medium">{perLegDisplay}</div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div>Legs</div>
            <div>{legs}</div>
          </div>

          <div className="flex items-center justify-between mt-2 border-t pt-2">
            <div>Subtotal</div>
            <div className="font-medium">{subtotalDisplay}</div>
          </div>

          {isReturn && discount > 0 && (
            <div className="flex items-center justify-between mt-2 text-emerald-700">
              <div>Return discount (10%)</div>
              <div>-{discountDisplay}</div>
            </div>
          )}

          <div className="flex items-center justify-between mt-3 border-t pt-3">
            <div className="font-semibold">Total</div>
            <div className="text-lg font-extrabold">{totalDisplay}</div>
          </div>

          <p className="mt-2 text-[11px] text-gray-500">
            All prices are per vehicle. Taxes and tolls included where
            applicable. Final confirmation will show full invoice details.
          </p>
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
              Flight number (optional)
            </label>
            <input
              type="text"
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
                {vehicle?.name} can take max {maxCapacity} passengers.  
                You currently selected {totalPassengers}.
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
            { id: "cash" as const, label: "Pay cash to driver" },
            { id: "card" as const, label: "Pay now by card" },
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
                  {method.id === "cash" ? "Cash" : "Card"}
                </span>
                <span
                  className={`text-[10px] ${
                    active ? "text-white/85" : "text-gray-500"
                  }`}
                >
                  {method.id === "cash"
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
            <span aria-hidden className="text-lg">←</span>
            <span>Back to trip details</span>
          </button>
        </div>

        <div className="flex w-full sm:w-auto flex-col items-stretch sm:items-end gap-2">

          {/* RED ERROR BANNER (above confirm button) */}
          {exceedsCapacity && (
            <div className="rounded-md bg-red-50 border border-red-200 text-red-700 text-sm p-3 w-full sm:w-auto">
              Too many passengers for the selected vehicle.  
              {vehicle?.name} allows max {maxCapacity} passengers.
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
              onClick={onConfirm}
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
    </div>
  );
}
