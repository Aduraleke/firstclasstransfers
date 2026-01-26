import { DriverStatus } from "./driverUsers"

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
  paymentMethod?: "card" | "cash"
  revolutOrderId?: string
  driver: string | null
  notes: string
  stripeRef: string
}

export interface Driver {
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


export interface PriceRule {
  id: number
  airport: string
  zone: string
  vehicle: string
  dayPrice: number
  nightPrice: number
}

export interface Route {
  id?: string
  routeId: string
  slug: string

  fromLocation: string
  toLocation: string

  distance: string
  time: string

  sedanPrice: number
  vanPrice: number

  metaTitle: string
  metaDescription: string
  heroTitle: string
  subHeadline: string
  body: string

  whatMakesBetter: string[]
  whatsIncluded: string[]
  destinationHighlights: string[]
  idealFor: string[]

  vehicleOptions: VehicleOption[]
  faqs: FAQItem[]

  image: string
  bookCtaLabel: string
  bookCtaSupport: string
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
  dp: string | null
  createdAt: string
  lastLogin: string
  status: "active" | "inactive"
  phone: string
  permissions: {
    bookings: boolean
    drivers: boolean
    routes: boolean
    adminUsers: boolean
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

export interface AuthAdmin {
  email: string;
  isSuperuser: boolean;
  permissions: {
    bookings: boolean;
    drivers: boolean;
    routes: boolean;
    adminUsers: boolean;
  };
}

// src/components/admin/routes/types.ts

export interface VehicleOption {
  id?: number;
  vehicleType: string;
  maxPassengers: number;
  idealFor: string;
  fixedPrice: number;
}


export type FAQItem = {
  question: string;
  answer: string;
};

export type RouteFormInput = {
  fromLocation: string;
  toLocation: string;

  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  subHeadline: string;
  body: string;

  distance: string;
  time: string;

  sedanPrice: number;
  vanPrice: number;

  whatMakesBetter: string[];
  whatsIncluded: string[];
  destinationHighlights: string[];
  idealFor: string[];

  vehicleOptions: VehicleOption[];
  faqs: FAQItem[];

  image: File | null;
  bookCtaLabel: string;
  bookCtaSupport: string;
};

