"use client";

import React from "react";
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
  const timeSectionRef = React.useRef<HTMLDivElement>(null);

  // Highlight selected vehicle when pre-selected from route page
  React.useEffect(() => {
    if (
      data.vehicleTypeId &&
      VEHICLE_TYPES.some((v) => v.id === data.vehicleTypeId)
    ) {
      onChange("vehicleTypeId", data.vehicleTypeId);
    }
  }, [data.vehicleTypeId, onChange]);

  // Smooth scroll to date/time once vehicle is selected
  React.useEffect(() => {
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

  const handleTimeChange = (value: string) => {
    onChange("time", value);

    if (!value) return;

    // Autofill today if user picks time but no date selected
    if (!data.date) {
      const today = new Date().toISOString().split("T")[0];
      onChange("date", today);
    }

    const hour = Number(value.split(":")[0]);
    onChange("timePeriod", hour >= 6 && hour < 22 ? "day" : "night");
  };

  const handleReturnTimeChange = (value: string) => {
    onChange("returnTime", value);
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

  // Smart hints
  const isAirportToCity = routeDetail?.from?.toLowerCase().includes("airport");
  const isCityToAirport = routeDetail?.to?.toLowerCase().includes("airport");

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-lg shadow-gray-100/70 p-5 sm:p-6 lg:p-7 space-y-6">

      {/* Heading */}
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

        {data.tripType === "return" && (
          <p className="text-[11px] text-emerald-700">
            Return bookings include a <strong>10% discount</strong>.
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
          className="mt-1 block w-full rounded-2xl border border-gray-300 bg-white px-3 py-2.5 text-sm"
        >
          <option value="">Select your route</option>

          <optgroup label="Larnaca">
            {TRANSFER_ROUTES.filter((r) => r.category === "Larnaca").map(
              (o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              )
            )}
          </optgroup>

          <optgroup label="Ayia Napa">
            {TRANSFER_ROUTES.filter((r) => r.category === "Ayia Napa").map(
              (o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              )
            )}
          </optgroup>

          <optgroup label="Limassol">
            {TRANSFER_ROUTES.filter((r) => r.category === "Limassol").map(
              (o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              )
            )}
          </optgroup>

          <optgroup label="Paphos">
            {TRANSFER_ROUTES.filter((r) => r.category === "Paphos").map(
              (o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              )
            )}
          </optgroup>

          <optgroup label="Special services">
            {TRANSFER_ROUTES.filter((r) => r.category === "Special").map(
              (o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
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
          Choose the most comfortable option for your group.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {VEHICLE_TYPES.map((vehicle) => {
            const active = data.vehicleTypeId === vehicle.id;
            const imgSrc = VEHICLE_IMAGE_MAP[vehicle.id as VehicleId] ?? null;

            const routeIndex = VEHICLE_TO_ROUTE_INDEX[vehicle.id as VehicleId];
            const price =
              routeDetail?.vehicleOptions?.[routeIndex]?.fixedPrice ??
              undefined;

            return (
              <button
                key={vehicle.id}
                type="button"
                onClick={() =>
                  handleVehicleChange(vehicle.id as VehicleId)
                }
                className={[
                  "group relative overflow-hidden rounded-2xl border shadow-sm transition-all",
                  active
                    ? "border-[#b07208] shadow-[0_12px_30px_rgba(176,114,8,0.35)] scale-[1.01]"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-md",
                ].join(" ")}
              >
                <div className="relative w-full h-36 sm:h-60 bg-gray-100 overflow-hidden">
                  {imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={vehicle.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full text-3xl">
                      🚘
                    </div>
                  )}

                  {price && (
                    <div
                      aria-hidden
                      className="absolute top-3 right-3 z-30 rounded-xl px-4 py-2 shadow-lg"
                      style={{
                        background: active
                          ? "linear-gradient(135deg, #000000, #333333)"
                          : "linear-gradient(135deg, #b07208, #d08a10)",
                        color: "#ffffff",
                      }}
                    >
                      {active && (
                        <div className="text-[10px] mb-1 uppercase">
                          Selected
                        </div>
                      )}
                      <div className="text-xl sm:text-2xl font-extrabold">
                        {price}
                      </div>
                      <div className="text-[10px] opacity-80">per vehicle</div>
                    </div>
                  )}
                </div>

                <div className="p-4">
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
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Date / time */}
      <section ref={timeSectionRef} className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-800">
          Date and time <span className="text-red-500">*</span>
        </h2>

        {/* Smart hints */}
        {isAirportToCity && (
          <p className="text-[11px] text-blue-700">
            For airport arrivals: choose the time your flight lands.
          </p>
        )}

        {isCityToAirport && (
          <p className="text-[11px] text-blue-700">
            For departures: we recommend pickup <strong>2–3 hours</strong>{" "}
            before your flight time.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Pickup date */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Pickup date
            </label>

            <input
              type="date"
              value={data.date}
              onChange={(e) => onChange("date", e.target.value)}
              className="mt-1 block w-full rounded-2xl border border-gray-300 bg-white px-3 py-2.5 text-sm"
            />
          </div>

          {/* Pickup time */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Pickup time
            </label>

            <input
              type="time"
              step={900}
              value={data.time}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="mt-1 block w-full rounded-2xl border border-gray-300 bg-white px-3 py-2.5 text-sm"
            />

            {/* Quick select */}
            <div className="flex gap-2 mt-2">
              {["09:00", "12:00", "15:00", "20:00"].map((t) => (
                <button
                  key={t}
                  type="button"
                  className="px-2 py-1 rounded-full bg-gray-100 text-[11px] hover:bg-gray-200"
                  onClick={() => handleTimeChange(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Night warning */}
            {data.timePeriod === "night" && (
              <p className="text-[11px] text-red-600 mt-1">
                Night fare applies (22:00–06:00)
              </p>
            )}
          </div>
        </div>

        {/* Time Period Buttons */}
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
                  className={`flex flex-col px-3 py-1.5 rounded-2xl transition-all ${
                    active ? "shadow-sm scale-[1.03]" : "hover:bg-white"
                  }`}
                  style={{
                    backgroundColor: active ? BRAND_PRIMARY : "transparent",
                    color: active ? "#ffffff" : "#111827",
                  }}
                >
                  <span className="text-xs font-semibold">{tp.label}</span>
                  <span className="text-[10px] opacity-80">{tp.range}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Return trip */}
      {data.tripType === "return" && (
        <section className="space-y-3 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/60 p-4">

          <h2 className="text-sm font-semibold text-emerald-900">
            Return trip details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Return date */}
            <div>
              <label className="block text-xs font-medium text-emerald-900">
                Return date
              </label>
              <input
                type="date"
                value={data.returnDate}
                onChange={(e) => onChange("returnDate", e.target.value)}
                className="mt-1 block w-full rounded-2xl border border-emerald-200 px-3 py-2.5 text-sm"
              />
            </div>

            {/* Return time */}
            <div>
              <label className="block text-xs font-medium text-emerald-900">
                Return pickup time
              </label>
              <input
                type="time"
                step={900}
                value={data.returnTime}
                onChange={(e) => handleReturnTimeChange(e.target.value)}
                className="mt-1 block w-full rounded-2xl border border-emerald-200 px-3 py-2.5 text-sm"
              />
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="pt-2 flex justify-end">
        <div className="text-right">
          {!canContinue && (
            <p className="text-sm text-gray-500 mb-2">
              Please select route, vehicle, date and time to continue.
            </p>
          )}

          <button
            type="button"
            disabled={!canContinue}
            onClick={onNext}
            className="px-5 py-2.5 rounded-full text-sm font-semibold shadow-md disabled:opacity-50"
            style={{
              background: `linear-gradient(135deg, ${BRAND_ACCENT}, ${BRAND_PRIMARY})`,
              color: "#ffffff",
            }}
          >
            Continue to passengers & confirmation →
          </button>
        </div>
      </div>
    </div>
  );
}
