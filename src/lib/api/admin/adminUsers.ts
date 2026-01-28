import { authFetch } from "./auth/client"
import { AdminUser } from "./types"

/* ───────────────── SHARED TYPES ───────────────── */

const permissionMap: Record<keyof AdminUser["permissions"], string> = {
  bookings: "booking",
  drivers: "drivers",
  routes: "routes",
  adminUsers: "adminUsers",
  vehicles: "vehicles",
}

function mapPermissionsToBackend(
  perms: AdminUser["permissions"],
): string[] {
  return Object.entries(perms)
    .filter(([, enabled]) => enabled)
    .map(([key]) => permissionMap[key as keyof AdminUser["permissions"]])
}

/* ───────────────── CREATE ADMIN ───────────────── */

export interface CreateAdminInput {
  name: string
  email: string
  phone?: string
  permissions: AdminUser["permissions"]
  dp?: File | null
}

/**
 * /account/signup/
 * multipart/form-data
 * snake_case input
 * camelCase output (django-camel-case)
 */
interface BackendCreateAdmin {
  id: number
  email: string
  phoneNumber: string | null
  dp: string | null
  fullName: string
  dateJoined?: string
  userPermissions?: string[]
  isStaff: boolean
}

function mapCreateAdminToFrontend(
  admin: BackendCreateAdmin,
): AdminUser {
  return {
    id: String(admin.id),
    name: admin.fullName,
    email: admin.email,
    phone: admin.phoneNumber ?? "",
    dp: admin.dp ?? "",
    role: admin.isStaff ? "super_admin" : "admin",
    createdAt: admin.dateJoined
      ? admin.dateJoined.split("T")[0]
      : new Date().toISOString().split("T")[0],
    lastLogin: "Never",
    status: "active",
    permissions: {
      bookings: admin.userPermissions?.includes("booking") ?? false,
      drivers: admin.userPermissions?.includes("drivers") ?? false,
      routes: admin.userPermissions?.includes("routes") ?? false,
      adminUsers: admin.userPermissions?.includes("adminUsers") ?? false,
      vehicles: admin.userPermissions?.includes("vehicles") ?? false,
    },
    loginHistory: [],
    activityLog: [],
  }
}

export async function createAdmin(
  input: CreateAdminInput,
): Promise<AdminUser> {
  const formData = new FormData()

  // REQUIRED FIELDS (snake_case)
  formData.append("email", input.email)
  formData.append("full_name", input.name)

  // OPTIONAL FIELDS
  if (input.phone) {
    formData.append("phone_number", input.phone)
  }

  if (input.dp) {
    formData.append("dp", input.dp)
  }

  // PERMISSIONS
  const permissions = mapPermissionsToBackend(input.permissions)
  if (permissions.length === 0) {
    throw new Error("At least one permission must be selected.")
  }

  permissions.forEach((perm) => {
    formData.append("permissions", perm)
  })

  // STAFF LOGIC (matches Django behavior)
  const allEnabled = Object.values(input.permissions).every(Boolean)
  if (allEnabled) {
    formData.append("is_staff", "true")
  }

  const response = await authFetch<BackendCreateAdmin>(
    "/account/signup/",
    {
      method: "POST",
      body: formData,
    },
  )

  return mapCreateAdminToFrontend(response)
}

/* ───────────────── LIST / GET ADMINS ───────────────── */

/**
 * /account/users/
 * snake_case input/output
 */
interface BackendAdmin {
  id: number
  email: string
  phoneNumber: string | null
  dp: string | null
  fullName: string
  dateJoined: string
  userPermissions: string[]
  isStaff: boolean
  disabled: boolean
  addedBy: string | null
}


function mapAdminToFrontend(admin: BackendAdmin): AdminUser {
  return {
    id: String(admin.id),
    name: admin.fullName,
    email: admin.email,
    phone: admin.phoneNumber ?? "",
    dp: admin.dp,
    role: admin.isStaff ? "super_admin" : "admin",
    createdAt: admin.dateJoined
      ? admin.dateJoined.split("T")[0]
      : new Date().toISOString().split("T")[0],
    lastLogin: "Never",
    status: admin.disabled ? "inactive" : "active",
    permissions: {
      bookings: admin.userPermissions?.includes("booking") ?? false,
      drivers: admin.userPermissions?.includes("drivers") ?? false,
      routes: admin.userPermissions?.includes("routes") ?? false,
      adminUsers: admin.userPermissions?.includes("adminUsers") ?? false,
      vehicles: admin.userPermissions?.includes("vehicles") ?? false,
    },
    loginHistory: [],
    activityLog: [],
  }
}


export async function getAdminUsers(): Promise<AdminUser[]> {
  const response = await authFetch<BackendAdmin[]>(
    "/account/users/",
    { method: "GET" },
  )


  return response.map(mapAdminToFrontend)
}

export async function getAdminById(
  id: string,
): Promise<AdminUser> {
  const response = await authFetch<BackendAdmin>(
    `/account/users/${id}/`,
    { method: "GET" },
  )

  return mapAdminToFrontend(response)
}

/* ───────────────── UPDATE ADMIN ───────────────── */

export interface UpdateAdminInput {
  name?: string
  email?: string
  phone?: string
  permissions?: AdminUser["permissions"]
  isStaff?: boolean
  disabled?: boolean
  dp?: File | null
}

export async function updateAdmin(
  id: string,
  input: UpdateAdminInput,
): Promise<AdminUser> {
  const formData = new FormData()

  // IMPORTANT: PATCH uses snake_case
  if (input.email) formData.append("email", input.email)
  if (input.name) formData.append("full_name", input.name)
  if (input.phone) formData.append("phone_number", input.phone)

  if (typeof input.isStaff === "boolean") {
    formData.append("is_staff", String(input.isStaff))
  }

  if (typeof input.disabled === "boolean") {
    formData.append("disabled", String(input.disabled))
  }

  if (input.dp) {
    formData.append("dp", input.dp)
  }

if (input.permissions) {
  const perms = mapPermissionsToBackend(input.permissions)

  perms.forEach((perm) => {
    formData.append("permissions", perm)
  })
}



  const response = await authFetch<BackendAdmin>(
    `/account/users/${id}/update/`,
    {
      method: "PATCH",
      body: formData,
    },
  )

  return mapAdminToFrontend(response)
}

/* ───────────────── DELETE ADMIN ───────────────── */

export async function deleteAdmin(
  id: string,
): Promise<void> {
  await authFetch<void>(
    `/account/users/${id}/`,
    { method: "DELETE" },
  )
}
