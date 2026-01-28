

/* ───────────────── TYPES ───────────────── */

import { authFetch } from "./auth/client";

/**
 * Vehicle as returned by backend
 */
export interface Vehicle {
  id: number;
  licensePlate: string;
  make: string;
  model: string;
  year: string;
  color: string;
  type: "sedan" | "vclass";
  maxPassengers: number;
}


// Raw API vehicle (what the backend sends)
export interface VehicleApi {
  id: number;
  licensePlate: string;
  make: string;
  model: string;
  year?: string | null;
  color?: string | null;
  type: "sedan"  | "vclass";
  maxPassengers: number;
}



/**
 * Vehicle form input (frontend-friendly)
 */
export interface VehicleFormInput {
  licensePlate: string;
  make: string;
  model: string;
  year: string;          // ✅ remove optional
  color: string;         // ✅ remove optional
  type: "sedan"  | "vclass";
  maxPassengers: number;
}


/* ───────────────── MAPPERS ───────────────── */

function mapFormToPayload(input: VehicleFormInput) {
  return {
    license_plate: input.licensePlate,
    make: input.make,
    model: input.model,
    year: input.year,
    color: input.color,
    type: input.type,
    max_passengers: input.maxPassengers,
  };
}

export function mapApiToVehicle(api: VehicleApi): Vehicle {
  return {
    id: api.id,
    licensePlate: api.licensePlate,
    make: api.make,
    model: api.model,
    year: api.year ?? "", // ✅ normalize null
    color: api.color ?? "",
    type: api.type,
    maxPassengers: api.maxPassengers,
  };
}






/* ───────────────── API CALLS ───────────────── */

/**
 * GET /vehicles/
 */
export async function getVehicles(): Promise<Vehicle[]> {
  const data = await authFetch<VehicleApi[]>("/vehicles/");
  console.log("Raw Vehicles",data)
  return data.map(mapApiToVehicle);
}


/**
 * GET /vehicles/{id}/
 */
export async function getVehicleById(id: number): Promise<Vehicle> {
  const data = await authFetch<VehicleApi>(`/vehicles/${id}/`);
  return mapApiToVehicle(data);
}


/**
 * POST /vehicles/
 */

export async function createVehicle(
  input: VehicleFormInput,
): Promise<Vehicle> {
  const data = await authFetch<VehicleApi>("/vehicles/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mapFormToPayload(input)),
  });

  return mapApiToVehicle(data);
}

/**
 * PUT /vehicles/{id}/
 */
export async function updateVehicle(
  id: number,
  input: VehicleFormInput,
): Promise<Vehicle> {
  const data = await authFetch<VehicleApi>(`/vehicles/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mapFormToPayload(input)),
  });

  return mapApiToVehicle(data);
}

/**
 * PATCH /vehicles/{id}/
 */
export async function patchVehicle(
  id: number,
  input: Partial<VehicleFormInput>,
): Promise<Vehicle> {
  const payload: Partial<VehicleApi> = {};

  if (input.licensePlate !== undefined)
    payload.licensePlate = input.licensePlate;
  if (input.make !== undefined) payload.make = input.make;
  if (input.model !== undefined) payload.model = input.model;
  if (input.year !== undefined) payload.year = input.year;
  if (input.color !== undefined) payload.color = input.color;
  if (input.type !== undefined) payload.type = input.type;
  if (input.maxPassengers !== undefined)
    payload.maxPassengers = input.maxPassengers;

  const data = await authFetch<VehicleApi>(`/vehicles/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return mapApiToVehicle(data);
}


/**
 * DELETE /vehicles/{id}/
 */
export async function deleteVehicle(id: number): Promise<void> {
  await authFetch<void>(`/vehicles/${id}/`, {
    method: "DELETE",
  });
}
