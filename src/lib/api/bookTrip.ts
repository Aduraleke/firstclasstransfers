

import type { BookingDraft } from "@/lib/booking/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
}

export async function bookTrip(draft: BookingDraft) {
  const formData = new FormData();

  // ─────────────────────────────
  // REQUIRED TOP-LEVEL FIELDS
  // ─────────────────────────────
  formData.append("route", draft.routeId);
  formData.append("tripType", draft.tripType);
  formData.append("pickupDate", draft.date);
  formData.append("pickupTime", draft.time);
  formData.append("timePeriod", draft.timePeriod);
  formData.append("paymentType", draft.paymentMethod);

  // ✅ NEW: VEHICLE + PRICE
  formData.append("vehicleType", draft.vehicleTypeId); // "sedan" | "vclass"

  if (draft.totalPrice != null) {
    formData.append("price", String(draft.totalPrice)); // ALWAYS string
  }

  // ─────────────────────────────
  // NESTED OBJECTS (JSON)
  // ─────────────────────────────
  formData.append(
    "transferInformation",
    JSON.stringify({
      flightNumber: draft.flightNumber,
      luggage: draft.baggageType,
      notes: draft.notes || "",
    }),
  );

  formData.append(
    "passengerInformation",
    JSON.stringify({
      adults: draft.adults,
      children: draft.children,
      fullName: draft.name,
      phoneNumber: draft.phone,
      emailAddress: draft.email,
    }),
  );

  // DEBUG
  console.log("[bookTrip] multipart payload:");
  for (const [k, v] of formData.entries()) {
    console.log(k, v);
  }

  const res = await fetch(`${BASE_URL}/booking/create/`, {
    method: "POST",
    body: formData, // ✅ DO NOT set Content-Type
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Booking failed (${res.status}): ${text}`);
  }

  return res.json();
}


