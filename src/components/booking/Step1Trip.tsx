"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  TRANSFER_ROUTES,
  VEHICLE_TYPES,
  TIME_PERIODS,
} from "@/lib/booking/options";
import type { BookingDraft } from "@/lib/booking/types";
import { getRouteDetailBySlug } from "@/lib/routes";

type Props = {
  data: BookingDraft;
  onChange: <K extends keyof BookingDraft>(
    key: K,
    value: BookingDraft[K]
  ) => void;
  onNext: () => void;
  routeList: Array<{ id: string; title: string }>;
};

const BRAND_PRIMARY = "#162c4b";
const BRAND_ACCENT = "#b07208";

type VehicleId = "sedan" | "vclass";

function getTodayISO() {
  return new Date().toISOString().split("T")[0];
}

function isTimeInPast(dateISO: string, time: string) {
  const now = new Date();
  const selected = new Date(`${dateISO}T${time}`);
  return selected.getTime() < now.getTime();
}

function getTomorrowISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

const VEHICLE_IMAGE_MAP: Record<VehicleId, string> = {
  sedan: "/ford-carpri.jpg",
  vclass: "/mercedesVclass.jpg",
};

// Map vehicle ids to route.vehicleOptions index
const VEHICLE_TO_ROUTE_INDEX: Record<VehicleId, number> = {
  sedan: 0,
  vclass: 1,
};

export default function Step1Trip({ data, onChange, onNext }: Props) {
  const timeSectionRef = React.useRef<HTMLDivElement | null>(null);

  const [timeOpen, setTimeOpen] = useState(false);

  // NEW REFS
  const timeDropdownRef = React.useRef<HTMLDivElement | null>(null);
  const timeInputRef = React.useRef<HTMLInputElement | null>(null);

  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        timeDropdownRef.current &&
        !timeDropdownRef.current.contains(event.target as Node) &&
        timeInputRef.current &&
        !timeInputRef.current.contains(event.target as Node)
      ) {
        setTimeOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Highlight vehicle on load (deep link)
  useEffect(() => {
    if (
      data.vehicleTypeId &&
      VEHICLE_TYPES.some((v) => v.id === data.vehicleTypeId)
    ) {
      onChange("vehicleTypeId", data.vehicleTypeId);
    }
  }, [data.vehicleTypeId, onChange]);

  // Auto-scroll to time section
  useEffect(() => {
    if (data.vehicleTypeId && timeSectionRef.current) {
      timeSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [data.vehicleTypeId]);

  const handleRouteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange("routeId", e.target.value);
  };

  const handleVehicleChange = (id: VehicleId) => {
    onChange("vehicleTypeId", id);
  };

  const handleTimePeriodChange = (id: "day" | "night") => {
    onChange("timePeriod", id);
  };

  const handleTripTypeChange = (tripType: "one-way" | "return") => {
    onChange("tripType", tripType);
    if (tripType === "one-way") {
      onChange("returnDate", "");
      onChange("returnTime", "");
      onChange("returnTimePeriod", "day");
    }
  };

  // Auto-set date if time is set first
  const ensureDate = () => {
    if (!data.date) {
      const today = new Date().toISOString().split("T")[0];
      onChange("date", today);
    }
  };

  const handleTimeChange = (value: string) => {
    if (!value) return;

    const todayISO = getTodayISO();

    const selectedDate = data.date || todayISO;

    // If user picked a past time for today → move to tomorrow
    if (selectedDate === todayISO && isTimeInPast(todayISO, value)) {
      const tomorrow = getTomorrowISO();
      onChange("date", tomorrow);
    } else {
      onChange("date", selectedDate);
    }

    onChange("time", value);

    const hour = Number(value.split(":")[0]);
    onChange("timePeriod", hour >= 6 && hour < 22 ? "day" : "night");
  };

  const handleReturnTimeChange = (value: string) => {
    onChange("returnTime", value);
    ensureDate();
    if (!value) return;
    const hour = Number(value.split(":")[0]);
    onChange("returnTimePeriod", hour >= 6 && hour < 22 ? "day" : "night");
  };

  const hasMainTrip =
    Boolean(data.routeId) &&
    Boolean(data.vehicleTypeId) &&
    Boolean(data.date) &&
    Boolean(data.time) &&
    Boolean(data.timePeriod);

  const hasReturnTrip =
    data.tripType === "one-way" ||
    (Boolean(data.returnDate) &&
      Boolean(data.returnTime) &&
      Boolean(data.returnTimePeriod));

  const canContinue = hasMainTrip && hasReturnTrip;

  const routeDetail = data.routeId
    ? getRouteDetailBySlug(data.routeId)
    : undefined;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-lg shadow-gray-100/70 p-5 sm:p-6 lg:p-7 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#111827]">
          Book your airport transfer
        </h1>
        <p className="text-sm text-gray-600">
          Choose your route, vehicle and pickup time. You’ll add passenger
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
            { id: "return" as const, label: "Return · Save 10%" },
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
      </section>

      {/* Route selection */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-800">
          From / To <span className="text-red-500">*</span>
        </h2>

        <select
          value={data.routeId}
          onChange={handleRouteChange}
          className="mt-1 block w-full rounded-2xl border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-[#b07208] focus:ring-[#b07208]"
        >
          <option value="">Select your route</option>

          <optgroup label="Larnaca">
            {TRANSFER_ROUTES.filter((r) => r.category === "Larnaca").map(
              (r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              )
            )}
          </optgroup>

          <optgroup label="Ayia Napa">
            {TRANSFER_ROUTES.filter((r) => r.category === "Ayia Napa").map(
              (r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              )
            )}
          </optgroup>

          <optgroup label="Limassol">
            {TRANSFER_ROUTES.filter((r) => r.category === "Limassol").map(
              (r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              )
            )}
          </optgroup>

          <optgroup label="Paphos">
            {TRANSFER_ROUTES.filter((r) => r.category === "Paphos").map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </optgroup>

          <optgroup label="Special services">
            {TRANSFER_ROUTES.filter((r) => r.category === "Special").map(
              (r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              )
            )}
          </optgroup>
        </select>
      </section>

      {/* Vehicle section */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-800">
          Vehicle type <span className="text-red-500">*</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {VEHICLE_TYPES.map((vehicle) => {
            const active = data.vehicleTypeId === vehicle.id;
            const imgSrc = VEHICLE_IMAGE_MAP[vehicle.id as VehicleId];
            const price =
              routeDetail?.vehicleOptions?.[
                VEHICLE_TO_ROUTE_INDEX[vehicle.id as VehicleId]
              ]?.fixedPrice;

            return (
              <button
                key={vehicle.id}
                type="button"
                onClick={() => handleVehicleChange(vehicle.id as VehicleId)}
                className={`group relative overflow-hidden rounded-2xl border shadow-sm transition-all ${
                  active
                    ? "border-[#b07208] shadow-[0_12px_30px_rgba(176,114,8,0.35)] scale-[1.01]"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                }`}
                style={{
                  background: active
                    ? `linear-gradient(150deg, ${BRAND_ACCENT} 0%, ${BRAND_PRIMARY} 85%)`
                    : "#fff",
                  color: active ? "#fff" : "#111827",
                }}
              >
                <div className="relative w-full h-36 sm:h-60 overflow-hidden">
                  <Image
                    src={imgSrc}
                    alt={vehicle.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {price && (
                    <div
                      className="absolute top-3 right-3 rounded-xl px-4 py-2 shadow-lg text-white"
                      style={{
                        background: active
                          ? "linear-gradient(135deg, #000, #333)"
                          : "linear-gradient(135deg, #b07208, #d08a10)",
                      }}
                    >
                      {active && (
                        <div className="text-[10px] uppercase opacity-80 mb-1">
                          Selected
                        </div>
                      )}
                      <div className="text-xl font-extrabold">{price}</div>
                      <div className="text-[10px] opacity-80">per vehicle</div>
                    </div>
                  )}
                </div>

                <div className="p-4 text-left">
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

      {/* Date & Time */}
      <section ref={timeSectionRef} className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-800">
          Date and time <span className="text-red-500">*</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* DATE */}
          <div>
            <label className="text-xs font-medium text-gray-700">
              Pickup date
            </label>
            <input
              type="date"
              min={getTodayISO()}
              value={data.date}
              onChange={(e) => onChange("date", e.target.value)}
              className="mt-1 w-full rounded-2xl border border-gray-300 bg-white px-3 py-2.5 shadow-sm text-sm focus:border-[#b07208]"
            />
          </div>

          {/* TIME - Native + Dropdown */}
          <div className="relative">
            <label className="text-xs font-medium text-gray-700">
              Pickup time
            </label>

            <input
              ref={timeInputRef}
              type="time"
              value={data.time}
              onChange={(e) => handleTimeChange(e.target.value)}
              onFocus={() => setTimeOpen(true)}
              className="mt-1 w-full rounded-2xl border border-gray-300 bg-white px-3 py-2.5 shadow-sm text-sm"
            />

            {timeOpen && (
              <div
                ref={timeDropdownRef}
                className="absolute z-40 mt-2 w-full max-h-60 overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-xl"
              >
                {Array.from({ length: 24 }, (_, h) =>
                  ["00", "15", "30", "45"].map((m) => {
                    const t = `${String(h).padStart(2, "0")}:${m}`;
                    const todayISO = getTodayISO();
                    const isPast =
                      data.date === todayISO && isTimeInPast(todayISO, t);
                    return (
                      <button
                        key={t}
                        type="button"
                        disabled={isPast}
                        onClick={() => {
                          handleTimeChange(t);
                          setTimeOpen(false);
                        }}
                        className={`block w-full px-4 py-2 text-left text-sm
    ${isPast ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-50"}
    ${data.time === t ? "bg-emerald-50 font-semibold" : ""}
  `}
                      >
                        {t}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* Time period */}
        <div>
          <p className="text-xs font-medium text-gray-700 mb-1">
            Time period (for pricing)
          </p>
          <div className="inline-flex gap-2 bg-gray-50 p-1 border border-gray-200 rounded-2xl">
            {TIME_PERIODS.map((tp) => {
              const active = data.timePeriod === tp.id;
              return (
                <button
                  key={tp.id}
                  onClick={() => handleTimePeriodChange(tp.id)}
                  className={`px-3 py-1.5 rounded-2xl transition-all ${
                    active ? "shadow-sm scale-[1.03]" : "hover:bg-white"
                  }`}
                  style={{
                    backgroundColor: active ? BRAND_PRIMARY : "transparent",
                    color: active ? "#fff" : "#111827",
                  }}
                >
                  <span className="text-xs font-semibold">{tp.label}</span>
                  <span
                    className={`block text-[10px] ${
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

      {/* Return Trip */}
      {data.tripType === "return" && (
        <section className="space-y-3 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 p-4">
          <h2 className="text-sm font-semibold text-emerald-900">
            Return trip details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-emerald-900">
                Return date
              </label>
              <input
                type="date"
                value={data.returnDate}
                onChange={(e) => onChange("returnDate", e.target.value)}
                className="mt-1 w-full rounded-2xl border border-emerald-200 bg-white px-3 py-2.5 shadow-sm text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-emerald-900">
                Return pickup time
              </label>
              <input
                type="time"
                value={data.returnTime}
                onChange={(e) => handleReturnTimeChange(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-emerald-200 bg-white px-3 py-2.5 shadow-sm text-sm"
              />
            </div>
          </div>

          {/* Return time period */}
          <div>
            <p className="text-xs font-medium text-emerald-900 mb-1">
              Return time period
            </p>
            <div className="inline-flex gap-2 bg-emerald-100 p-1 border border-emerald-200 rounded-2xl">
              {TIME_PERIODS.map((tp) => {
                const active = data.returnTimePeriod === tp.id;
                return (
                  <button
                    key={tp.id}
                    onClick={() => onChange("returnTimePeriod", tp.id)}
                    className={`px-3 py-1.5 rounded-2xl transition-all ${
                      active ? "shadow-sm scale-[1.03]" : "hover:bg-white"
                    }`}
                    style={{
                      backgroundColor: active ? BRAND_ACCENT : "transparent",
                      color: active ? "#fff" : "#064e3b",
                    }}
                  >
                    <span className="text-xs font-semibold">{tp.label}</span>
                    <span
                      className={`block text-[10px] ${
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

      {/* Continue */}
      <div className="pt-2 text-right">
        {!canContinue && (
          <p className="text-sm text-gray-500 mb-2">
            Please select route, vehicle, date and time to continue.
          </p>
        )}
        <button
          type="button"
          disabled={!canContinue}
          onClick={onNext}
          className="px-6 py-2.5 rounded-full text-sm font-semibold shadow-md transition disabled:opacity-50"
          style={{
            background: `linear-gradient(135deg, ${BRAND_ACCENT}, ${BRAND_PRIMARY})`,
            color: "#fff",
          }}
        >
          Continue to passengers & confirmation →
        </button>
      </div>
    </div>
  );
}
