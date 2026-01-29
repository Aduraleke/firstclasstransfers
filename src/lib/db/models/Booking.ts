import mongoose, { Schema, Document, Model } from "mongoose";

export type PaymentStatus =
  | "pending_payment"
  | "paid"
  | "failed"
  | "cash_confirmed";

export interface BookingDoc extends Document {
  orderId: string;
  routeId: string;
  vehicleTypeId: string;
  tripType: "one-way" | "return";

  // 💰 Pricing
  expectedAmount: number;     // full trip price
  chargedAmount: number;      // what was charged online
  depositAmount?: number;     // only for cash bookings
  amountDue?: number;         // remaining cash due

  currency: "EUR";

  // 💳 Payment
  paymentMethod: "card" | "cash";
  paymentStatus: PaymentStatus;

  myposTrxId?: string;
  revolutOrderId?: string;
  revolutPublicId?: string;

  customer: {
    name: string;
    email: string;
    phone: string;
  };

  createdAt: Date;
}

const BookingSchema = new Schema<BookingDoc>(
  {
    orderId: { type: String, required: true, unique: true },

    routeId: { type: String, required: true },
    vehicleTypeId: { type: String, required: true },
    tripType: { type: String, enum: ["one-way", "return"], required: true },

    // 💰 Pricing
    expectedAmount: { type: Number, required: true },
    chargedAmount: { type: Number, required: true },
    depositAmount: { type: Number },
    amountDue: { type: Number, default: 0 },

    currency: { type: String, default: "EUR" },

    // 💳 Payment
    paymentMethod: { type: String, enum: ["card", "cash"], required: true },
    paymentStatus: {
      type: String,
      enum: ["pending_payment", "paid", "failed", "cash_confirmed"],
      required: true,
    },

    myposTrxId: { type: String },
    revolutOrderId: { type: String },
    revolutPublicId: { type: String },

    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
  },
  { timestamps: true }
);


export const Booking: Model<BookingDoc> =
  mongoose.models.Booking ||
  mongoose.model<BookingDoc>("Booking", BookingSchema);
