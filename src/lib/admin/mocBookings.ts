// lib/admin/mockBookings.ts

export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";
export type PaymentStatus = "Unpaid" | "Paid" | "Refunded";

export type BookingRow = {
  id: string;
  ref: string;
  createdAt: string;
  date: string;
  time: string;
  route: string;
  airport: "LCA" | "PFO";
  passengerName: string;
  flightNumber: string;
  vehicle: "Sedan" | "Minivan";
  passengers: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  amountEUR: number;
};

export const mockBookings: BookingRow[] = [
  {
    id: "1",
    ref: "FCT-2025-0012",
    createdAt: "2025-12-02 09:14",
    date: "2025-12-03",
    time: "13:30",
    route: "Larnaca → Ayia Napa",
    airport: "LCA",
    passengerName: "John Carter",
    flightNumber: "BA662",
    vehicle: "Sedan",
    passengers: 2,
    status: "Confirmed",
    paymentStatus: "Paid",
    amountEUR: 65,
  },
  {
    id: "2",
    ref: "FCT-2025-0013",
    createdAt: "2025-12-02 10:02",
    date: "2025-12-03",
    time: "17:45",
    route: "Larnaca → Protaras",
    airport: "LCA",
    passengerName: "Anna Schmidt",
    flightNumber: "LH1760",
    vehicle: "Minivan",
    passengers: 5,
    status: "Pending",
    paymentStatus: "Unpaid",
    amountEUR: 90,
  },
  {
    id: "3",
    ref: "FCT-2025-0014",
    createdAt: "2025-12-02 11:28",
    date: "2025-12-04",
    time: "09:10",
    route: "Larnaca → Limassol",
    airport: "LCA",
    passengerName: "Mark Lee",
    flightNumber: "EK109",
    vehicle: "Sedan",
    passengers: 1,
    status: "Confirmed",
    paymentStatus: "Paid",
    amountEUR: 80,
  },
  {
    id: "4",
    ref: "FCT-2025-0015",
    createdAt: "2025-12-02 13:02",
    date: "2025-12-03",
    time: "23:55",
    route: "Paphos → Paphos City",
    airport: "PFO",
    passengerName: "Sophia Rossi",
    flightNumber: "FR1234",
    vehicle: "Minivan",
    passengers: 6,
    status: "Pending",
    paymentStatus: "Unpaid",
    amountEUR: 70,
  },
];
