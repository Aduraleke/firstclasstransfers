import { authFetch } from "./auth/client";

/* ───────────────── TYPES ───────────────── */

export interface BookingApiResponse {
  bookingId: string;

  passengerInformation: {
    fullName: string;
    emailAddress: string;
    phoneNumber?: string;
    additionalInformation?: string;
  };

  route: {
    routeId: string;
    fromLocation: string;
    toLocation: string;
    distance?: string;
    time?: string;
    durationMinutes?: number;
  };

  pickupDate: string;
  pickupTime: string;

  returnDate?: string;
  returnTime?: string;

  vehicleType?: string;
  tripType: string;
  timePeriod?: string;
  status: string

  paymentType: "Cash" | "Card";
  paymentStatus: string;
  paymentId?: string | null;
  price?: number;

  driver?: {
    fullName: string;
    email?: string;
    phoneNumber?: string;
  } | null;

  vehicle?: {
    make: string;
    model: string;
    type: string;
    licensePlate: string;
    maxPassengers?: number;
  } | null;

  transferInformation?: {
    flightNumber?: string;
    adults?: number;
    children?: number;
    luggage?: string;
  };
}

/* ───────────────── BOOKINGS LIST ───────────────── */

export async function getBookings(
  params: Record<string, string | undefined> = {},
): Promise<BookingApiResponse[]> {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) query.append(key, value);
  });

  const response = authFetch<BookingApiResponse[]>(
    `/booking/list/${query.toString() ? `?${query}` : ""}`,
  );

  return response
}

/* ───────────────── AVAILABLE DRIVERS ───────────────── */

export interface AvailableDriver {
  id: string;
  fullName: string;
}

export async function getAvailableDrivers(
  bookingId: string,
): Promise<AvailableDriver[]> {
  const response = authFetch<AvailableDriver[]>(
    `/booking/${bookingId}/available-drivers/`,
  );
  console.log("Driver",response)
  return response
}

/* ───────────────── AVAILABLE VEHICLES ───────────────── */

export interface AvailableVehicle {
  id: string;
  name: string;
}

export async function getAvailableVehicles(
  bookingId: string,
  vehicleType: string,
): Promise<AvailableVehicle[]> {
  if (!vehicleType) {
    throw new Error("vehicleType is required");
  }

  const query = new URLSearchParams({
    vehicle_type: vehicleType,
  }).toString();

  return authFetch<AvailableVehicle[]>(
    `/booking/${bookingId}/available-vehicles/?${query}`,
  );
}

/* ───────────────── ASSIGN DRIVER + VEHICLE ───────────────── */

export async function assignBooking(
  bookingId: string,
  payload: {
    driver_id: string;
    vehicle_id: string;
  },
) {
  return authFetch(`/booking/${bookingId}/assign/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/* ───────────────── UPDATE STATUS ───────────────── */

export async function updateBookingStatus(
  bookingId: string,
  status: "Completed" | "Cancelled",
) {
 const response =  authFetch(`/booking/${bookingId}/update/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
console.log("Backend update", response)
  return response
}

/* ───────────────── RESCHEDULE ───────────────── */

export interface ReschedulePayload {
  pickup_date?: string;
  pickup_time?: string;
  return_date?: string;
  return_time?: string;
}

export async function rescheduleBooking(
  bookingId: string,
  payload: ReschedulePayload,
) {
  return authFetch(`/booking/${bookingId}/reschedule/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
