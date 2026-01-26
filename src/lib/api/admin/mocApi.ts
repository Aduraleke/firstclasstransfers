// src/lib/admin/mockApi.ts

import {
  AdminUser,
  AuditLog,
  Booking,
  BookingStatus,
  Driver,
  EmailNotification,
  PaymentSession,
  PriceRule,
  Route,
} from "./types"
import {
  mockAdminUsers,
  mockAuditLogs,
  mockBookings,
  mockDrivers,
  mockEmailNotifications,
  mockPayments,
  mockPrices,
  mockRoutes,
} from "./mocData"

const bookings: Booking[] = [...mockBookings]
let drivers: Driver[] = [...mockDrivers]
let prices: PriceRule[] = [...mockPrices]
let routes: Route[] = [...mockRoutes]
let payments: PaymentSession[] = [...mockPayments]
let emails: EmailNotification[] = [...mockEmailNotifications]
const admins: AdminUser[] = [...mockAdminUsers]
let audits: AuditLog[] = [...mockAuditLogs]

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms))

/* BOOKINGS */

export async function getBookings(): Promise<Booking[]> {
  await delay()
  return [...bookings]
  
}

export async function assignDriverToBooking(bookingId: string, driverName: string): Promise<Booking | null> {
  await delay()
  const idx = bookings.findIndex((b) => b.id === bookingId)
  if (idx === -1) return null
  bookings[idx] = { ...bookings[idx], driver: driverName, status: "Assigned" }
  return bookings[idx]
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<Booking | null> {
  await delay()
  const idx = bookings.findIndex((b) => b.id === id)
  if (idx === -1) return null
  bookings[idx] = { ...bookings[idx], status }
  return bookings[idx]
}

/* DRIVERS */

export async function getDrivers(p0: { status: string | undefined; search: string | undefined }): Promise<Driver[]> {
  await delay()
  return [...drivers]
}

export async function createDriver(input: Omit<Driver, "id" | "status">): Promise<Driver> {
  await delay()
  const driver: Driver = {
    id: `D${String(drivers.length + 1).padStart(3, "0")}`,
    status: "Active",
    ...input,
  }
  drivers.push(driver)
  return driver
}

export async function deleteDriverById(id: string): Promise<void> {
  await delay()
  drivers = drivers.filter((d) => d.id !== id)
}

/* PRICING */

export async function getPrices(): Promise<PriceRule[]> {
  await delay()
  return [...prices]
}

export async function createPriceRule(input: Omit<PriceRule, "id">): Promise<PriceRule> {
  await delay()
  const rule: PriceRule = { id: prices.length + 1, ...input }
  prices.push(rule)
  return rule
}

export async function updatePriceRule(id: number, input: Omit<PriceRule, "id">): Promise<PriceRule | null> {
  await delay()
  const idx = prices.findIndex((p) => p.id === id)
  if (idx === -1) return null
  prices[idx] = { ...prices[idx], ...input }
  return prices[idx]
}

export async function deletePriceRule(id: number): Promise<void> {
  await delay()
  prices = prices.filter((p) => p.id !== id)
}

/* ROUTES */

export async function getRoutes(): Promise<Route[]> {
  await delay()
  return [...routes]
}

export async function createRoute(input: Omit<Route, "id">): Promise<Route> {
  await delay()
  const route: Route = { id: routes.length + 1, ...input }
  routes.push(route)
  return route
}

export async function updateRoute(id: number, input: Omit<Route, "id">): Promise<Route | null> {
  await delay()
  const idx = routes.findIndex((r) => r.id === id)
  if (idx === -1) return null
  routes[idx] = { ...routes[idx], ...input }
  return routes[idx]
}

export async function deleteRouteById(id: number): Promise<void> {
  await delay()
  routes = routes.filter((r) => r.id !== id)
}

/* PAYMENTS */

export async function getPaymentSessions(): Promise<PaymentSession[]> {
  await delay()
  return [...payments]
}

export async function createPaymentSessionForBooking(bookingId: string): Promise<PaymentSession | null> {
  await delay()
  const booking = bookings.find((b) => b.id === bookingId)
  if (!booking) return null
  const amount = parseInt(booking.price.replace(/[^0-9]/g, ""), 10) * 100
  const session: PaymentSession = {
    id: `PS${String(payments.length + 1).padStart(3, "0")}`,
    bookingId,
    amount,
    currency: "EUR",
    stripeReference: `pi_${Math.random().toString(36).slice(2, 10)}`,
    status: "pending",
    createdAt: new Date().toISOString(),
    completedAt: null,
  }
  payments = [session, ...payments]
  return session
}

export async function updatePaymentStatus(
  id: string,
  status: PaymentSession["status"],
): Promise<PaymentSession | null> {
  await delay()
  const idx = payments.findIndex((p) => p.id === id)
  if (idx === -1) return null
  payments[idx] = {
    ...payments[idx],
    status,
    completedAt: status === "completed" ? new Date().toISOString() : null,
  }
  return payments[idx]
}

/* EMAILS */

export async function getEmailNotifications(): Promise<EmailNotification[]> {
  await delay()
  return [...emails]
}

export async function sendCustomEmail(to: string, subject: string): Promise<EmailNotification> {
  await delay()
  const email: EmailNotification = {
    id: `EMAIL${String(emails.length + 1).padStart(3, "0")}`,
    to,
    type: "custom",
    subject,
    status: "sent",
    timestamp: new Date().toISOString(),
  }
  emails = [email, ...emails]
  return email
}

export async function sendBookingEmail(
  bookingId: string,
  type: EmailNotification["type"],
): Promise<EmailNotification | null> {
  await delay()
  const booking = bookings.find((b) => b.id === bookingId)
  if (!booking) return null
  const to = type === "new_booking_admin" ? "admin@firstclass.com" : booking.email
  const email: EmailNotification = {
    id: `EMAIL${String(emails.length + 1).padStart(3, "0")}`,
    to,
    type,
    status: "sent",
    timestamp: new Date().toISOString(),
  }
  emails = [email, ...emails]
  return email
}

/* ADMIN USERS & AUDIT */

export async function getAdminUsers(): Promise<AdminUser[]> {
  await delay()
  return [...admins]
}

export async function createAdminUser(
  input: Omit<AdminUser, "id" | "createdAt" | "lastLogin" | "status" | "loginHistory" | "activityLog">,
): Promise<AdminUser> {
  await delay()
  const admin: AdminUser = {
    id: `AU${String(admins.length + 1).padStart(3, "0")}`,
    createdAt: new Date().toISOString().split("T")[0],
    lastLogin: "Never",
    status: "active",
    loginHistory: [],
    activityLog: [],
    ...input,
  }
  admins.push(admin)
  return admin
}

export async function deactivateAdmin(id: string): Promise<AdminUser | null> {
  await delay()
  const idx = admins.findIndex((a) => a.id === id)
  if (idx === -1) return null
  admins[idx] = { ...admins[idx], status: "inactive" }
  return admins[idx]
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  await delay()
  return [...audits]
}

export async function addAuditLog(
  entry: Omit<AuditLog, "id" | "timestamp">,
): Promise<AuditLog> {
  await delay()
  const log: AuditLog = {
    id: `AL${String(audits.length + 1).padStart(3, "0")}`,
    timestamp: new Date().toISOString(),
    ...entry,
  }
  audits = [log, ...audits]
  return log
}
