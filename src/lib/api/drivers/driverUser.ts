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
  booking_id: string;
  status: BookingStatus;
  price: number;
  vehicle_type: string;
  payment_type: string;
  payment_status: string;
  trip_type: string;

  pickup_date: string;
  pickup_time: string;

  route: {
    from_location: string;
    to_location: string;
    distance: string;
    time: string;
  };

  passenger_information: {
    full_name: string;
    phone_number: string;
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

