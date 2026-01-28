"use client";

import { authFetch } from "../authFetch";



export interface DriverDashboardResponse {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  licenseNumber: string;
  dp?: string;
  isActive: boolean;
  disabled: boolean;
  dateJoined: string;
}



export async function getDriverDashboard() {
  const data = await authFetch<DriverDashboardResponse>(
    "/drivers/dashboard/",
    { method: "GET" },
  );

  console.log("🚗 Driver dashboard data:", data);
  return data;
}
/* ───────────────── TYPES ───────────────── */

export type BookingStatus =
  | "Pending"
  | "Cancelled"
  | "Completed"
  | "Assigned";

export interface AssignedBooking {
  bookingId: string;
  status: BookingStatus;

  pickupDate: string;
  pickupTime: string;
  returnDate?: string | null;
  returnTime?: string | null;

  price: number;
  paymentType: string;
  paymentStatus: string;

  route: {
    fromLocation: string;
    toLocation: string;
    distance: string;
    time: string;
    durationMinutes?: number;
  };

  passengerInformation?: {
    fullName: string;
    phoneNumber?: string;
    emailAddress?: string;
  };
}

export interface AssignedBookingsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AssignedBooking[];
}

/* ───────────────── API ───────────────── */

export async function getAssignedBookingsByDriver(
  driverId: number,
  params?: {
    status?: BookingStatus;
    page?: number;
    pageSize?: number;
  },
): Promise<AssignedBookingsResponse> {
  const query = new URLSearchParams();

  if (params?.status) query.append("status", params.status);
  if (params?.page) query.append("page", String(params.page));
  if (params?.pageSize)
    query.append("page_size", String(params.pageSize));

  const response = await authFetch<AssignedBookingsResponse>(
    `/booking/assigned-bookings/${driverId}?${query.toString()}`,
    { method: "GET" },
  );

  console.log("🚗 Driver Assigned bookings:", response);
  return response;
}
