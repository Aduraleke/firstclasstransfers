// components/booking/Step1Trip.tsx

"use client";

import React from "react";
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

  const canContinue =
    data.routeId &&
    data.vehicleTypeId &&
    data.date &&
    data.time &&
    data.timePeriod;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-lg shadow-gray-100/70 p-5 sm:p-6 lg:p-7 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#111827]">
          Book your airport transfer
        </h1>
        <p className="text-sm text-gray-600">
          Choose your route, vehicle and pickup time. You&apos;ll add passenger
          details and confirm in the next step.
        </p>
      </div>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {VEHICLE_TYPES.map((vehicle) => {
            const active = data.vehicleTypeId === vehicle.id;
            return (
              <button
                key={vehicle.id}
                type="button"
                onClick={() => handleVehicleChange(vehicle.id)}
                className={`text-left rounded-2xl border px-3.5 py-3 shadow-sm transition-all ${
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
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold">
                    {vehicle.name}
                  </span>
                  <span
                    className={`text-xs ${
                      active ? "text-white/80" : "text-gray-600"
                    }`}
                  >
                    {vehicle.subtitle}
                  </span>
                  <span
                    className={`text-[11px] ${
                      active ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    {vehicle.luggage}
                  </span>
                  <span
                    className={`text-[11px] ${
                      active ? "text-white/90" : "text-gray-500"
                    }`}
                  >
                    {vehicle.recommendedFor}
                  </span>
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
              value={data.time}
              onChange={(e) => onChange("time", e.target.value)}
              className="mt-1 block w-full rounded-2xl border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-[#b07208] focus:ring-[#b07208]"
            />
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
                    active
                      ? "shadow-sm"
                      : "hover:bg-white hover:shadow-sm"
                  }`}
                  style={{
                    backgroundColor: active ? BRAND_PRIMARY : "transparent",
                    color: active ? "#ffffff" : "#111827",
                  }}
                >
                  <span className="text-xs font-semibold">
                    {tp.label}
                  </span>
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
