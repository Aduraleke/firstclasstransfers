import { authFetch } from "./auth/client"
import { Driver } from "./types"

/* ───────────────── FRONTEND TYPES ───────────────── */

export type DriverStatus = "Available" | "On Trip" | "Off Duty"

export interface DriverUser {
  id: string
  name: string
  email: string
  phone: string
  licenseNumber: string
  profilePicture: string
  status: DriverStatus
  createdAt: string
  isActive: boolean
}

export interface DriverCounts {
  total: number
  available: number
  unavailable: number
}

export interface DriverFormInput {
  name: string
  email: string
  phone: string
  licenseNumber: string
  profilePicture?: File | null
}


interface BackendDriverListResponse {
  count: number;
  all: number;
  available: number;
  unavailable: number;
  next: string | null;
  previous: string | null;
  results: BackendDriver[];
}



/* ───────────────── BACKEND TYPES ───────────────── */

/**
 * /drivers/
 * snake_case input/output
 */
interface BackendDriver {
  id: number
  email: string
  phoneNumber: string
  dp: string | null
  fullName: string
  licenseNumber: string
  status: DriverStatus
  dateJoined: string
  isActive: boolean
  disabled: boolean
}

/* ───────────────── MAPPERS ───────────────── */

export interface GetDriversParams {
  status?: "available" | "unavailable"
  search?: string
}


function mapDriverToFrontend(driver: BackendDriver): DriverUser {
  return {
    id: String(driver.id),
    name: driver.fullName,
    email: driver.email,
    phone: driver.phoneNumber ?? "",
    licenseNumber: driver.licenseNumber,
    profilePicture: driver.dp ?? "",
    status: driver.status,
    createdAt: driver.dateJoined
      ? driver.dateJoined.split("T")[0]
      : "",
    isActive: driver.isActive && !driver.disabled,
  }
}



/* ───────────────── CREATE DRIVER ───────────────── */

export interface CreateDriverPayload {
  name: string
  email: string
  phone: string
  licenseNumber: string
  profilePicture?: File | null
}


export async function createDriver(
  input: CreateDriverPayload,
): Promise<DriverUser> {
  const formData = new FormData()

  // REQUIRED BY BACKEND
  formData.append("full_name", input.name)
  formData.append("email", input.email)
  formData.append("phone_number", input.phone)
  formData.append("license_number", input.licenseNumber)

  // 🔒 HIDDEN / FORCED FIELD
  formData.append("is_driver", "true")

  // OPTIONAL IMAGE
  if (input.profilePicture) {
    formData.append("dp", input.profilePicture)
  }

  const response = await authFetch<BackendDriver>(
    "/drivers/create/",
    {
      method: "POST",
      body: formData,
    },
  )

  return mapDriverToFrontend(response)
}


/* ───────────────── LIST DRIVERS ───────────────── */

export interface DriverListResponse {
  drivers: DriverUser[]
  counts: DriverCounts
  next: string | null
  previous: string | null
}

export async function getDrivers(
  params: GetDriversParams = {},
): Promise<{
  drivers: Driver[];
  counts: {
    total: number;
    available: number;
    unavailable: number;
  };
  next: string | null;
  previous: string | null;
}> {
  const query = new URLSearchParams();

  if (params.status) query.append("status", params.status);
  if (params.search) query.append("search", params.search);

  const response = await authFetch<BackendDriverListResponse>(
    `/drivers/?${query.toString()}`,
    { method: "GET" },
  );

  return {
    drivers: response.results.map(mapDriverToFrontend),

    counts: {
      total: Number(
        response.all ??
        response.count ??
        response.results.length
      ),
      available: Number(response.available ?? 0),
      unavailable: Number(response.unavailable ?? 0),
    },

    next: response.next,
    previous: response.previous,
  };
}



/* ───────────────── GET DRIVER BY ID ───────────────── */

export async function getDriverById(
  id: string,
): Promise<DriverUser> {
  const response = await authFetch<BackendDriver>(
    `/drivers/${id}/`,
    { method: "GET" },
  )

  return mapDriverToFrontend(response)
}

/* ───────────────── UPDATE DRIVER (PUT / PATCH) ───────────────── */

export interface UpdateDriverInput {
  name?: string
  email?: string
  phone?: string
  licenseNumber?: string
  profilePicture?: File | null
  status?: DriverStatus
  isActive?: boolean
}

export async function updateDriver(
  id: string,
  input: UpdateDriverInput,
  method: "PUT" | "PATCH" = "PATCH",
): Promise<DriverUser> {
  const formData = new FormData()

  if (input.name) formData.append("full_name", input.name)
  if (input.email) formData.append("email", input.email)
  if (input.phone) formData.append("phone_number", input.phone)
  if (input.licenseNumber) {
    formData.append("license_number", input.licenseNumber)
  }

  if (input.profilePicture) {
  formData.append("dp", input.profilePicture)
}


  if (input.status) {
    formData.append("status", input.status)
  }

  if (typeof input.isActive === "boolean") {
    formData.append("is_active", String(input.isActive))
  }

  const response = await authFetch<BackendDriver>(
    `/drivers/${id}/`,
    {
      method,
      body: formData,
    },
  )

  return mapDriverToFrontend(response)
}

/* ───────────────── DELETE DRIVER ───────────────── */

export async function deleteDriver(
  id: string,
): Promise<void> {
  await authFetch<void>(
    `/drivers/${id}/`,
    { method: "DELETE" },
  )
}
