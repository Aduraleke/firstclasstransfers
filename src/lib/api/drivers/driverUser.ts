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



export type BookingStatus =
  | "Pending"
  | "Cancelled"
  | "Completed"
  | "Assigned";

export interface AssignedBooking {
  bookingId: string;
  status: string;

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

export async function getAssignedBookingsByDriver(
  driverId: number,
  page = 1,
  pageSize = 10,
): Promise<AssignedBookingsResponse> {
  const response = await authFetch<AssignedBookingsResponse>(
    `/booking/assigned-bookings/${driverId}?page=${page}&page_size=${pageSize}`,
    { method: "GET" },
  );

  console.log("🚗 Driver Assigned bookings:", response);
  return response;
}

