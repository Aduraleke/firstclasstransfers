"use client";

import React, { useState } from "react";
import { Booking } from "@/lib/api/admin/types";
import { Icon } from "@iconify/react";
import {
  updateBookingStatus,
  rescheduleBooking,
} from "@/lib/api/admin/bookingDetails";

interface Props {
  open: boolean;
  booking: Booking;
  onClose: () => void;
}

export const BookingDetailsModal: React.FC<Props> = ({
  open,
  booking,
  onClose,
}) => {
  const [submitting, setSubmitting] = useState(false);

  const [actionModal, setActionModal] = useState<
    | { type: "status" }
    | { type: "confirm"; status: "Completed" | "Cancelled" }
    | { type: "reschedule" }
    | null
  >(null);

  if (!open) return null;

  const raw = booking.raw;
  const vehicle = raw?.vehicle;
  const driver = raw?.driver;
  const transfer = raw?.transferInformation;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur px-4">
      <div className="relative w-full max-w-6xl max-h-[90vh] bg-[#050814] rounded-[28px] shadow-[0_40px_120px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col">
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-20 text-slate-500 hover:text-white"
        >
          <Icon icon="mdi:close" className="h-6 w-6" />
        </button>

        {/* ───────── HEADER (STICKY) ───────── */}
        <div className="sticky top-0 z-10 px-10 pt-10 pb-8 bg-[#050814] border-b border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white">
                Booking
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-white">
                {booking.airport}
                <span className="mx-4 text-[#b07208]">→</span>
                {booking.destination}
              </h1>
              <p className="mt-2 text-sm text-white">
                {booking.date} · {booking.time}
                {booking.timePeriod && ` (${booking.timePeriod})`}
              </p>
            </div>

            <StatusSignal status={booking.status} />
          </div>
        </div>

        {/* ───────── BODY (SCROLLABLE) ───────── */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-12">
            {/* COMMAND STRIP */}
            <aside className="col-span-12 md:col-span-3 border-r border-white/5 px-8 py-10 space-y-8">
              <Signal label="Status" value={booking.status} />
              <Signal label="Trip" value={booking.tripType} />
              {transfer?.flightNumber && (
                <Signal label="Flight" value={transfer.flightNumber} />
              )}
              <Signal label="Payment" value={booking.paymentStatus} />
              {booking.price && (
                <Signal label="Amount" value={`€${booking.price}`} accent />
              )}

              <div className="pt-10 space-y-3">
                <button
                  onClick={() => setActionModal({ type: "status" })}
                  className="w-full rounded-lg bg-[#b07208] px-4 py-2 text-sm font-semibold text-black hover:opacity-90 transition"
                >
                  Change Status
                </button>

                <button
                  onClick={() => setActionModal({ type: "reschedule" })}
                  className="w-full rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5 transition"
                >
                  Reschedule
                </button>
              </div>
            </aside>

            {/* CONTEXT FIELD */}
            <section className="col-span-12 md:col-span-9 px-10 py-10 space-y-12">
              <ContextBlock title="Passenger">
                <ContextRow label="Name" value={booking.customerName} strong />
                <ContextRow label="Email" value={booking.email} />
                <ContextRow label="Phone" value={booking.phone ?? "—"} />
                {booking.passengers != null && (
                  <ContextRow label="Passengers" value={booking.passengers} />
                )}
              </ContextBlock>

              <ContextBlock title="Assignment">
                <ContextRow
                  label="Driver"
                  value={booking.driver ?? "Unassigned"}
                  highlight={!booking.driver}
                />

                {driver && (
                  <>
                    <ContextRow
                      label="Driver Email"
                      value={driver.email ?? "—"}
                    />
                    <ContextRow
                      label="Driver Phone"
                      value={driver.phoneNumber ?? "—"}
                    />
                  </>
                )}
              </ContextBlock>

              {vehicle && (
                <ContextBlock title="Vehicle">
                  <ContextRow
                    label="Vehicle"
                    value={`${vehicle.make} ${vehicle.model}`}
                    strong
                  />
                  <ContextRow label="Type" value={vehicle.type} />
                  <ContextRow label="Plate" value={vehicle.licensePlate} />
                  {vehicle.maxPassengers && (
                    <ContextRow
                      label="Capacity"
                      value={`${vehicle.maxPassengers} passengers`}
                    />
                  )}
                </ContextBlock>
              )}

              {booking.notes && (
                <ContextBlock title="Notes">
                  <p className="text-sm leading-relaxed text-slate-300 max-w-2xl">
                    {booking.notes}
                  </p>
                </ContextBlock>
              )}
            </section>
          </div>
        </div>
      </div>

      {actionModal?.type === "status" && (
        <ConfirmShell
          title="Change Booking Status"
          onClose={() => setActionModal(null)}
        >
          <button
            onClick={() =>
              setActionModal({ type: "confirm", status: "Completed" })
            }
            className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black"
          >
            Mark as Completed
          </button>

          <button
            onClick={() =>
              setActionModal({ type: "confirm", status: "Cancelled" })
            }
            className="w-full rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Cancel Booking
          </button>
        </ConfirmShell>
      )}

      {actionModal?.type === "confirm" && (
        <ConfirmShell
          title="Please Confirm"
          onClose={() => setActionModal(null)}
        >
          <p className="text-sm text-slate-300">
            Are you sure you want to mark this booking as{" "}
            <span className="font-semibold text-white">
              {actionModal.status}
            </span>
            ?
          </p>

          <button
            disabled={submitting}
            onClick={async () => {
              try {
                setSubmitting(true);
                await updateBookingStatus(booking.id, actionModal.status);
                setActionModal(null);
                onClose();
              } finally {
                setSubmitting(false);
              }
            }}
            className="
    mt-4 w-full rounded-lg px-4 py-2 text-sm font-semibold
    bg-[#b07208] text-black
    disabled:opacity-50 disabled:cursor-not-allowed
  "
          >
            {submitting ? "Updating…" : "Yes, Confirm"}
          </button>
        </ConfirmShell>
      )}

      {actionModal?.type === "reschedule" && (
        <RescheduleModal
          booking={booking}
          onClose={() => setActionModal(null)}
          onSubmit={async (payload) => {
            // 🔥 CALL API
            await rescheduleBooking(booking.id, payload);
            setActionModal(null);
            onClose();
          }}
        />
      )}
    </div>
  );
};

/* ───────────────────────── COMPONENTS ───────────────────────── */

function StatusSignal({ status }: { status: string }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full bg-[#b07208]/15 px-5 py-2 ring-1 ring-[#b07208]/30">
      <span className="h-2 w-2 rounded-full bg-[#b07208]" />
      <span className="text-xs font-semibold tracking-wide text-[#b07208]">
        {status}
      </span>
    </div>
  );
}

function Signal({
  label,
  value,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <p className="text-[13px] uppercase font-bold tracking-widest text-white">
        {label}
      </p>
      <p className={`mt-1 text-sm text-[#b07208]`}>{value}</p>
    </div>
  );
}

function ContextBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-5 text-sm uppercase font-bold tracking-widest text-white">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function ContextRow({
  label,
  value,
  strong = false,
  highlight = false,
}: {
  label: string;
  value: React.ReactNode;
  strong?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between border-b border-white/5 pb-2">
      <span className="text-sm text-slate-400">{label}</span>
      <span
        className={`text-right ${
          strong ? "text-base text-white" : "text-sm text-slate-300"
        } ${highlight ? "text-[#b07208]" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

type ReschedulePayload = {
  pickup_date?: string;
  pickup_time?: string;
  return_date?: string;
  return_time?: string;
};

function RescheduleModal({
  booking,
  onClose,
  onSubmit,
}: {
  booking: Booking;
  onClose: () => void;
  onSubmit: (payload: ReschedulePayload) => void;
}) {
  const isRoundTrip = booking.tripType === "Round Trip";

  const [mode, setMode] = React.useState<"both" | "return-only">("both");
  const [saving, setSaving] = React.useState(false);

  const [pickupDate, setPickupDate] = React.useState(booking.date);
  const [pickupTime, setPickupTime] = React.useState(booking.time);

  const [returnDate, setReturnDate] = React.useState(
    booking.raw?.returnDate ?? "",
  );
  const [returnTime, setReturnTime] = React.useState(
    booking.raw?.returnTime ?? "",
  );

  return (
    <ConfirmShell title="Reschedule Booking" onClose={onClose}>
      {isRoundTrip && (
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setMode("both")}
            className={`px-3 py-1 rounded ${
              mode === "both"
                ? "bg-[#b07208] text-black"
                : "bg-white/5 text-white"
            }`}
          >
            Both Trips
          </button>
          <button
            onClick={() => setMode("return-only")}
            className={`px-3 py-1 rounded ${
              mode === "return-only"
                ? "bg-[#b07208] text-black"
                : "bg-white/5 text-white"
            }`}
          >
            Return Only
          </button>
        </div>
      )}

      {mode !== "return-only" && (
        <>
          <input
            type="date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            className="w-full mb-2 bg-black/40 p-2 rounded text-white"
          />
          <input
            type="time"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            className="w-full mb-4 bg-black/40 p-2 rounded text-white"
          />
        </>
      )}

      {isRoundTrip && (
        <>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className="w-full mb-2 bg-black/40 p-2 rounded text-white"
          />
          <input
            type="time"
            value={returnTime}
            onChange={(e) => setReturnTime(e.target.value)}
            className="w-full mb-4 bg-black/40 p-2 rounded text-white"
          />
        </>
      )}

      <button
        onClick={async () => {
          try {
            setSaving(true);
            await onSubmit(
              mode === "return-only"
                ? {
                    return_date: returnDate,
                    return_time: returnTime,
                  }
                : {
                    pickup_date: pickupDate,
                    pickup_time: pickupTime,
                    ...(isRoundTrip && {
                      return_date: returnDate,
                      return_time: returnTime,
                    }),
                  },
            );
          } finally {
            setSaving(false);
          }
        }}
        disabled={saving}
        className="
    w-full rounded-lg px-4 py-2 text-sm font-semibold
    bg-[#b07208] text-black
    disabled:opacity-50 disabled:cursor-not-allowed
  "
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </ConfirmShell>
  );
}

function ConfirmShell({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-md rounded-xl bg-[#050814] p-6 border border-white/10">
        <h3 className="mb-4 text-lg font-semibold text-white">{title}</h3>
        <div className="space-y-3">{children}</div>
        <button
          onClick={onClose}
          className="mt-4 text-sm text-slate-400 hover:text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}
