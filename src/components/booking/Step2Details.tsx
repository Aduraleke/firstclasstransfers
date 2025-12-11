"use client";

import React, { useMemo } from "react";
import type { BookingDraft } from "@/lib/booking/types";
import {
  BAGGAGE_OPTIONS,
  TRANSFER_ROUTES,
  VEHICLE_TYPES,
  TIME_PERIODS,
} from "@/lib/booking/options";

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

  const routeDetail = useMemo(
    () =>
      // We only know about RouteDetail via TRANSFER_ROUTES (there's no direct link here),
      // so this summary will just use TRANSFER_ROUTES origin/destination.
      route,
    [route]
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

  const totalPassengers = (data.adults || 0) + (data.children || 0);

  const emailValid = data.email.includes("@");

  const hasReturnDetails =
    data.tripType === "one-way" ||
    (data.returnDate && data.returnTime && data.returnTimePeriod);

  const canConfirm =
    !!data.name &&
    !!data.phone &&
    !!data.email &&
    emailValid &&
    data.adults > 0 &&
    !!data.baggageType &&
    !!data.paymentMethod &&
    hasReturnDetails;

  // --- fare estimate with 10% discount for returns ---

  const isReturn = data.tripType === "return";
  const discountText = isReturn
    ? "10% discount will be applied to your round-trip fare in our confirmation."
    : "Return trips booked together receive a 10% discount.";

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-lg shadow-gray-100/70 p-5 sm:p-6 lg:p-7 space-y-6">
      {/* Summary */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-[#111827]">
          Review your trip
        </h2>

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
                ? `${routeDetail.origin} → ${routeDetail.destination}`
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
        <h2 className="text-sm font-semibold text-gray-800">
          Payment method
        </h2>
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

      {/* Actions */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-full text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-800 transition"
        >
          ← Back to trip details
        </button>

        <div className="flex flex-col items-end gap-1">
          <p className="text-xs text-gray-500 mb-1">
            You&apos;ll see the final confirmation on the next screen. For card
            payments, we&apos;ll charge you now to secure your booking.
          </p>
          <button
            type="button"
            disabled={!canConfirm}
            onClick={onConfirm}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-semibold shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(135deg, ${BRAND_ACCENT}, ${BRAND_PRIMARY})`,
              color: "#ffffff",
            }}
          >
            Confirm booking request
          </button>
        </div>
      </div>
    </div>
  );
}
