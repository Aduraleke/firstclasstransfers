export type BookingStatus = "Pending" | "Assigned" | "Completed" | "Cancelled"

export interface Booking {
  id: string
  customerName: string
  email: string
  phone: string
  airport: string
  destination: string
  vehicleType: string
  passengers: number
  date: string // YYYY-MM-DD
  time: string // HH:mm
  price: string // e.g. "€45"
  status: BookingStatus
  paymentStatus: "Paid" | "Unpaid" | "Refunded"
  driver: string | null
  notes: string
  stripeRef: string
}

export interface Driver {
  id: string
  name: string
  phone: string
  vehicle: string
  status: "Active" | "Suspended"
}

export interface PriceRule {
  id: number
  airport: string
  zone: string
  vehicle: string
  dayPrice: number
  nightPrice: number
}

export interface Route {
  id: number
  origin: string
  destination: string
  distance: string
  time: string
  price: number
}

export type PaymentStatus = "pending" | "completed" | "failed"

export interface PaymentSession {
  id: string
  bookingId: string
  amount: number // cents
  currency: string
  stripeReference: string
  status: PaymentStatus
  createdAt: string
  completedAt: string | null
}

export type EmailType = "booking_confirmation" | "driver_assigned" | "new_booking_admin" | "custom"
export type EmailState = "sent" | "pending" | "failed"

export interface EmailNotification {
  id: string
  to: string
  type: EmailType
  subject?: string
  status: EmailState
  timestamp: string
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: "super_admin" | "admin"
  createdAt: string
  lastLogin: string
  status: "active" | "inactive"
  phone: string
  permissions: {
    bookings: boolean
    drivers: boolean
    payments: boolean
    routes: boolean
    pricing: boolean
    adminUsers: boolean
    settings: boolean
  }
  loginHistory: { date: string; ip: string; device: string; location: string }[]
  activityLog: { date: string; action: string; type: string }[]
}

export interface AuditLog {
  id: string
  timestamp: string
  adminName: string
  action: string
  details: string
  ipAddress: string
}

export interface DashboardStats {
  totalBookings: number
  pendingBookings: number
  completedToday: number
  revenue: string
}
