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
  expectedAmount: number;
  currency: "EUR";
  paymentMethod: "card" | "cash";
  paymentStatus: PaymentStatus;
  myposTrxId?: string;
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

    expectedAmount: { type: Number, required: true },
    currency: { type: String, default: "EUR" },

    paymentMethod: { type: String, enum: ["card", "cash"], required: true },
    paymentStatus: {
      type: String,
      enum: ["pending_payment", "paid", "failed", "cash_confirmed"],
      required: true,
    },

    myposTrxId: { type: String },

    customer: {
      name: String,
      email: String,
      phone: String,
    },
  },
  { timestamps: true }
);

export const Booking: Model<BookingDoc> =
  mongoose.models.Booking ||
  mongoose.model<BookingDoc>("Booking", BookingSchema);
