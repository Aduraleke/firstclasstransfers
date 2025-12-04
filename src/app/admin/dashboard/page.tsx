"use client";

import React from "react";
import { AdminLayoutShell } from "@/components/admin/AdminLayoutShell";
import { BookingsTable } from "@/components/admin/BookingTable";
import { mockBookings } from "@/lib/admin/mocBookings";

export default function AdminDashboardPage() {
  // Simple derived numbers for the top summary
  const totalBookings = mockBookings.length;
  const pending = mockBookings.filter((b) => b.status === "Pending").length;
  const today = mockBookings.filter(
    (b) => b.date === "2025-12-03" // static for now; later use current date
  ).length;

  return (
    <AdminLayoutShell
      title="Dashboard"
      subtitle="Static MVP view · connect to real Admin APIs later in the sprint."
    >
      {/* Summary cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/40 px-3 py-3 sm:px-4 sm:py-4">
          <p className="text-[11px] text-white/55">Today&apos;s bookings</p>
          <p className="mt-1 text-2xl font-semibold text-white">{today}</p>
          <p className="mt-1 text-[11px] text-white/50">
            Based on static sample data
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/40 px-3 py-3 sm:px-4 sm:py-4">
          <p className="text-[11px] text-white/55">Pending approvals</p>
          <p className="mt-1 text-2xl font-semibold text-amber-300">
            {pending}
          </p>
          <p className="mt-1 text-[11px] text-white/50">
            Confirm manually after payment check
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/40 px-3 py-3 sm:px-4 sm:py-4">
          <p className="text-[11px] text-white/55">Total in view</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-300">
            {totalBookings}
          </p>
          <p className="mt-1 text-[11px] text-white/50">
            Admin MVP snapshot for Dec 3 sprint
          </p>
        </div>
      </div>

      {/* Bookings table */}
      <BookingsTable bookings={mockBookings} />
    </AdminLayoutShell>
  );
}
