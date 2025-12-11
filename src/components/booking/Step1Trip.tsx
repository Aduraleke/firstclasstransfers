"use client";

import React from "react";
import Image from "next/image";
import {
  TRANSFER_ROUTES,
  VEHICLE_TYPES,
  TIME_PERIODS,
} from "@/lib/booking/options";
import type { BookingDraft } from "@/lib/booking/types";

type Props = {
  data: BookingDraft;
  onChange: <K extends keyof BookingDraft>(
    key: K,
    value: BookingDraft[K]
  ) => void;
  onNext: () => void;
};

const BRAND_PRIMARY = "#162c4b";
const BRAND_ACCENT = "#b07208";

const VEHICLE_IMAGE_MAP: Record<string, string> = {
  sedan: "/ford-carpri.jpg",
  vclass: "/mercedesVclass.jpg",
};

export default function Step1Trip({ data, onChange, onNext }: Props) {
  const handleRouteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange("routeId", e.target.value);
  };

  const handleVehicleChange = (id: string) => {
    onChange("vehicleTypeId", id as BookingDraft["vehicleTypeId"]);
  };

  const handleTimePeriodChange = (id: "day" | "night") => {
    onChange("timePeriod", id);
  };

  const handleTripTypeChange = (tripType: "one-way" | "return") => {
    onChange("tripType", tripType);
    // If switching back to one-way, we can safely clear return fields
    if (tripType === "one-way") {
      onChange("returnDate", "");
      onChange("returnTime", "");
      onChange("returnTimePeriod", "day");
    }
  };

  const handleTimeChange = (value: string) => {
    onChange("time", value);

    if (!value) return;
    const [hourStr] = value.split(":");
    const hour = Number(hourStr);
    if (Number.isNaN(hour)) return;

    const nextPeriod: "day" | "night" =
      hour >= 6 && hour < 22 ? "day" : "night";

    if (nextPeriod !== data.timePeriod) {
      onChange("timePeriod", nextPeriod);
    }
  };

  const handleReturnTimeChange = (value: string) => {
    onChange("returnTime", value);

    if (!value) return;
    const [hourStr] = value.split(":");
    const hour = Number(hourStr);
    if (Number.isNaN(hour)) return;

    const nextPeriod: "day" | "night" =
      hour >= 6 && hour < 22 ? "day" : "night";

    if (nextPeriod !== data.returnTimePeriod) {
      onChange("returnTimePeriod", nextPeriod);
    }
  };

  const hasMainTrip =
    data.routeId && data.vehicleTypeId && data.date && data.time && data.timePeriod;

  const hasReturnTrip =
    data.tripType === "one-way" ||
    (data.returnDate && data.returnTime && data.returnTimePeriod);

  const canContinue = !!(hasMainTrip && hasReturnTrip);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-lg shadow-gray-100/70 p-5 sm:p-6 lg:p-7 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#111827]">
          Book your airport transfer
        </h1>
        <p className="text-sm text-gray-600">
          Choose your route, vehicle and pickup time. You&apos;ll add passenger
          details, payment method and confirm in the next step.
        </p>
      </div>

      {/* Trip type */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-800">
          Trip type <span className="text-red-500">*</span>
        </h2>
        <div className="inline-flex gap-2 rounded-2xl bg-gray-50 p-1 border border-gray-200">
          {[
            { id: "one-way" as const, label: "One-way" },
            {
              id: "return" as const,
              label: "Return · Save 10%",
            },
          ].map((tp) => {
            const active = data.tripType === tp.id;
            return (
              <button
                key={tp.id}
                type="button"
                onClick={() => handleTripTypeChange(tp.id)}
                className={`px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-medium transition-all ${
                  active ? "shadow-sm" : "hover:bg-white hover:shadow-sm"
                }`}
                style={{
                  backgroundColor: active ? BRAND_PRIMARY : "transparent",
                  color: active ? "#ffffff" : "#111827",
                }}
              >
                {tp.label}
              </button>
            );
          })}
        </div>
        {data.tripType === "return" && (
          <p className="text-[11px] text-emerald-700">
            Book your return with us now and get{" "}
            <span className="font-semibold">10% discount</span> on the total.
          </p>
        )}
      </section>

      {/* Route selection */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-800">
          From / To <span className="text-red-500">*</span>
        </h2>
        <p className="text-xs text-gray-500">
          Fixed routes between Nicosia, Larnaca, Paphos and other key locations.
        </p>

        <select
          value={data.routeId}
          onChange={handleRouteChange}
          className="mt-1 block w-full rounded-2xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:border-[#b07208] focus:ring-[#b07208]"
        >
          <option value="">Select your route</option>

          <optgroup label="Larnaca">
            {TRANSFER_ROUTES.filter((r) => r.category === "Larnaca").map(
              (route) => (
                <option key={route.id} value={route.id}>
                  {route.label}
                </option>
              )
            )}
          </optgroup>

          <optgroup label="Ayia Napa">
            {TRANSFER_ROUTES.filter((r) => r.category === "Ayia Napa").map(
              (route) => (
                <option key={route.id} value={route.id}>
                  {route.label}
                </option>
              )
            )}
          </optgroup>

          <optgroup label="Limassol">
            {TRANSFER_ROUTES.filter((r) => r.category === "Limassol").map(
              (route) => (
                <option key={route.id} value={route.id}>
                  {route.label}
                </option>
              )
            )}
          </optgroup>

          <optgroup label="Paphos">
            {TRANSFER_ROUTES.filter((r) => r.category === "Paphos").map(
              (route) => (
                <option key={route.id} value={route.id}>
                  {route.label}
                </option>
              )
            )}
          </optgroup>

          <optgroup label="Special services">
            {TRANSFER_ROUTES.filter((r) => r.category === "Special").map(
              (route) => (
                <option key={route.id} value={route.id}>
                  {route.label}
                </option>
              )
            )}
          </optgroup>
        </select>
      </section>

      {/* Vehicle options */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-800">
          Vehicle type <span className="text-red-500">*</span>
        </h2>
        <p className="text-xs text-gray-500">
          Choose the vehicle that best fits your group and luggage.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {VEHICLE_TYPES.map((vehicle) => {
            const active = data.vehicleTypeId === vehicle.id;
            const imgSrc = VEHICLE_IMAGE_MAP[vehicle.id] ?? null;

            return (
              <button
                key={vehicle.id}
                type="button"
                onClick={() => handleVehicleChange(vehicle.id)}
                className={[
                  "group overflow-hidden rounded-2xl border shadow-sm transition-all",
                  active
                    ? "border-[#b07208] shadow-[0_12px_30px_rgba(176,114,8,0.35)] scale-[1.01]"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-md",
                ].join(" ")}
                style={{
                  background: active
                    ? `linear-gradient(150deg, ${BRAND_ACCENT} 0%, ${BRAND_PRIMARY} 85%)`
                    : "#ffffff",
                  color: active ? "#ffffff" : "#111827",
                }}
              >
                <div className="relative w-full h-36 sm:h-60 bg-gray-100 overflow-hidden">
                  {imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={vehicle.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority={active}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-3xl">
                      🚘
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-start p-4 gap-1.5 text-left">
                  <p className="text-sm font-semibold">{vehicle.name}</p>
                  <p
                    className={`text-xs ${
                      active ? "text-white/80" : "text-gray-600"
                    }`}
                  >
                    {vehicle.subtitle}
                  </p>
                  <p
                    className={`text-[11px] ${
                      active ? "text-white/70" : "text-gray-500"
                    }`}
                  >
                    {vehicle.luggage}
                  </p>
                  <p
                    className={`text-[11px] ${
                      active ? "text-white/85" : "text-gray-500"
                    }`}
                  >
                    {vehicle.recommendedFor}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Date / time / time period */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-800">
          Date and time <span className="text-red-500">*</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Pickup date
            </label>
            <input
              type="date"
              value={data.date}
              onChange={(e) => onChange("date", e.target.value)}
              className="mt-1 block w-full rounded-2xl border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-[#b07208] focus:ring-[#b07208]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700">
              Pickup time
            </label>
            <input
              type="time"
              step={900} // 15-minute steps for nicer input
              value={data.time}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="mt-1 block w-full rounded-2xl border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-[#b07208] focus:ring-[#b07208]"
            />
            <p className="mt-1 text-[11px] text-gray-500">
              We&apos;ll plan around your flight and traffic – don&apos;t worry
              if you&apos;re not sure about the exact minute.
            </p>
          </div>
        </div>

        <div>
          <p className="block text-xs font-medium text-gray-700 mb-1">
            Time period (for pricing) <span className="text-red-500">*</span>
          </p>
          <div className="inline-flex gap-2 rounded-2xl bg-gray-50 p-1 border border-gray-200">
            {TIME_PERIODS.map((tp) => {
              const active = data.timePeriod === tp.id;
              return (
                <button
                  key={tp.id}
                  type="button"
                  onClick={() => handleTimePeriodChange(tp.id)}
                  className={`flex flex-col px-3 py-1.5 rounded-2xl text-left transition-all ${
                    active ? "shadow-sm" : "hover:bg-white hover:shadow-sm"
                  }`}
                  style={{
                    backgroundColor: active ? BRAND_PRIMARY : "transparent",
                    color: active ? "#ffffff" : "#111827",
                  }}
                >
                  <span className="text-xs font-semibold">{tp.label}</span>
                  <span
                    className={`text-[10px] ${
                      active ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    {tp.range}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Return trip fields */}
      {data.tripType === "return" && (
        <section className="space-y-3 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/60 p-4">
          <h2 className="text-sm font-semibold text-emerald-900">
            Return trip details
          </h2>
          <p className="text-[11px] text-emerald-800">
            Book your return now and we&apos;ll apply a{" "}
            <span className="font-semibold">10% discount</span> on the round
            trip fare.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-emerald-900">
                Return date
              </label>
              <input
                type="date"
                value={data.returnDate}
                onChange={(e) => onChange("returnDate", e.target.value)}
                className="mt-1 block w-full rounded-2xl border border-emerald-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-emerald-900">
                Return pickup time
              </label>
              <input
                type="time"
                step={900}
                value={data.returnTime}
                onChange={(e) => handleReturnTimeChange(e.target.value)}
                className="mt-1 block w-full rounded-2xl border border-emerald-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <p className="block text-xs font-medium text-emerald-900 mb-1">
              Return time period (for pricing)
            </p>
            <div className="inline-flex gap-2 rounded-2xl bg-emerald-100/80 p-1 border border-emerald-200">
              {TIME_PERIODS.map((tp) => {
                const active = data.returnTimePeriod === tp.id;
                return (
                  <button
                    key={tp.id}
                    type="button"
                    onClick={() => onChange("returnTimePeriod", tp.id)}
                    className={`flex flex-col px-3 py-1.5 rounded-2xl text-left transition-all ${
                      active ? "shadow-sm" : "hover:bg-white hover:shadow-sm"
                    }`}
                    style={{
                      backgroundColor: active ? BRAND_ACCENT : "transparent",
                      color: active ? "#ffffff" : "#064e3b",
                    }}
                  >
                    <span className="text-xs font-semibold">{tp.label}</span>
                    <span
                      className={`text-[10px] ${
                        active ? "text-white/80" : "text-emerald-700"
                      }`}
                    >
                      {tp.range}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <div className="pt-2 flex justify-end">
        <button
          type="button"
          disabled={!canContinue}
          onClick={onNext}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(135deg, ${BRAND_ACCENT}, ${BRAND_PRIMARY})`,
            color: "#ffffff",
          }}
        >
          Continue to passengers & confirmation →
        </button>
      </div>
    </div>
  );
}
