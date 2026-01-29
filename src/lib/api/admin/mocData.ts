// import {
//   AdminUser,
//   AuditLog,
//   Booking,
//   Driver,
//   EmailNotification,
//   PaymentSession,
//   PriceRule,
//   Route,
// } from "./types"

// export const mockBookings: Booking[] = [
//   {
//     id: "BK001",
//     customerName: "John Smith",
//     email: "john@example.com",
//     phone: "+357 99 123456",
//     airport: "LCA",
//     destination: "Limassol",
//     vehicleType: "Standard Sedan",
//     passengers: 3,
//     date: "2024-12-15",
//     time: "14:30",
//     price: "€45",
//     status: "Pending",
//     paymentStatus: "Paid",
//     driver: null,
//     notes: "",
//     stripeRef: "pi_123456789",
//   },
//   {
//     id: "BK002",
//     customerName: "Maria Garcia",
//     email: "maria@example.com",
//     phone: "+357 99 234567",
//     airport: "PFO",
//     destination: "Paphos Center",
//     vehicleType: "Premium Van",
//     passengers: 6,
//     date: "2024-12-16",
//     time: "10:00",
//     price: "€75",
//     status: "Assigned",
//     paymentStatus: "Paid",
//     driver: "Andreas Michaelidis",
//     notes: "Child seat required",
//     stripeRef: "pi_987654321",
//   },
// ]

// export const mockDrivers: Driver[] = [
//   { id: "D001", name: "Andreas Michaelidis", phone: "+357 99 111111", vehicle: "Mercedes E-Class", status: "Active" },
//   { id: "D002", name: "George Constantinou", phone: "+357 99 222222", vehicle: "Mercedes Vito", status: "Active" },
//   { id: "D003", name: "Christos Pavlou", phone: "+357 99 333333", vehicle: "BMW 5 Series", status: "Active" },
// ]

// export const mockPrices: PriceRule[] = [
//   { id: 1, airport: "LCA", zone: "Limassol", vehicle: "Standard Sedan", dayPrice: 45, nightPrice: 55 },
//   { id: 2, airport: "LCA", zone: "Paphos", vehicle: "Standard Sedan", dayPrice: 75, nightPrice: 85 },
//   { id: 3, airport: "PFO", zone: "Paphos Center", vehicle: "Premium Van", dayPrice: 75, nightPrice: 85 },
// ]

// export const mockRoutes: Route[] = [
//   { id: 1, origin: "Larnaka Airport", destination: "Larnaka City / Finikoudes", distance: "6-10 km", time: "10-15 min", price: 25 },
//   { id: 2, origin: "Larnaka Airport", destination: "Ayia Napa", distance: "~45 km", time: "35-45 min", price: 54 },
//   { id: 3, origin: "Nicosia", destination: "Larnaka Airport (LCA)", distance: "52-60 km", time: "40-50 min", price: 65 },
//   { id: 4, origin: "Limassol", destination: "Larnaka Airport (LCA)", distance: "67-72 km", time: "50-60 min", price: 64 },
//   { id: 5, origin: "Paphos Airport", destination: "Limassol", distance: "~60 km", time: "45-55 min", price: 60 },
// ]

// export const mockPayments: PaymentSession[] = [
//   {
//     id: "PS001",
//     bookingId: "BK001",
//     amount: 4500,
//     currency: "EUR",
//     stripeReference: "pi_123456789",
//     status: "completed",
//     createdAt: "2024-12-15 14:30",
//     completedAt: "2024-12-15 14:35",
//   },
//   {
//     id: "PS002",
//     bookingId: "BK002",
//     amount: 7500,
//     currency: "EUR",
//     stripeReference: "pi_987654321",
//     status: "pending",
//     createdAt: "2024-12-15 14:40",
//     completedAt: null,
//   },
// ]

// export const mockEmailNotifications: EmailNotification[] = [
//   {
//     id: "EMAIL001",
//     to: "john@example.com",
//     type: "booking_confirmation",
//     subject: "Your Booking Confirmation",
//     status: "sent",
//     timestamp: "2024-12-05 10:30",
//   },
//   {
//     id: "EMAIL002",
//     to: "maria@example.com",
//     type: "driver_assigned",
//     subject: "Driver Assigned",
//     status: "sent",
//     timestamp: "2024-12-05 11:00",
//   },
//   {
//     id: "EMAIL003",
//     to: "admin@firstclasstransfers.eu",
//     type: "new_booking_admin",
//     subject: "New Booking Alert",
//     status: "sent",
//     timestamp: "2024-12-05 12:15",
//   },
// ]

// export const mockAuditLogs: AuditLog[] = [
//   {
//     id: "AL001",
//     timestamp: "2024-12-15 14:35",
//     adminName: "Admin User",
//     action: "assign_driver",
//     details: "Assigned driver Andreas to booking BK001",
//     ipAddress: "192.168.1.1",
//   },
//   {
//     id: "AL002",
//     timestamp: "2024-12-15 14:30",
//     adminName: "Admin User",
//     action: "create_booking",
//     details: "Created new booking from customer John Smith",
//     ipAddress: "192.168.1.1",
//   },
// ]

// export const mockAdminUsers: AdminUser[] = [
//   {
//     id: "AU001",
//     name: "Admin User",
//     email: "admin@firstclass.com",
//     role: "super_admin",
//     createdAt: "2024-01-01",
//     lastLogin: "2024-12-15 14:00",
//     status: "active",
//     phone: "",
//     permissions: {
//       bookings: true,
//       drivers: true,
//       payments: true,
//       routes: true,
//       pricing: true,
//       adminUsers: true,
//       settings: true,
//     },
//     loginHistory: [{ date: "2024-12-15", ip: "192.168.1.1", device: "Chrome", location: "Cyprus" }],
//     activityLog: [],
//   },
// ]
