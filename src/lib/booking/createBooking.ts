import { computePrice, RouteId, VehicleId } from "@/lib/pricing";
import { sendEmail } from "@/lib/email/nodemailer";
import type { BookingBase } from "@/lib/booking/schema";
import {
  customerCashConfirmed,
  customerCardPending,
  officeCashBooking,
  officeCardPending,
} from "@/lib/email/templates";

export async function createBooking(
  booking: BookingBase,
  payByCard: boolean
): Promise<{ amount: number }> {
  const price = computePrice(
    booking.routeId as RouteId,
    booking.vehicleTypeId as VehicleId,
    booking.tripType
  );

  const bookingData = {
    name: booking.name,
    email: booking.email,
    phone: booking.phone,

    route: booking.routeId,
    vehicle: booking.vehicleTypeId,
    tripType: booking.tripType,

    // outbound
    flightNumber: booking.flightNumber.trim(),
    date: booking.date,
    time: booking.time,
    timePeriod: booking.timePeriod,

    // return
    returnDate:
      booking.tripType === "return" ? booking.returnDate || undefined : undefined,
    returnTime:
      booking.tripType === "return" ? booking.returnTime || undefined : undefined,
    returnTimePeriod:
      booking.tripType === "return"
        ? booking.returnTimePeriod || undefined
        : undefined,

    adults: booking.adults,
    children: booking.children,
    baggage: booking.baggageType,

    amount: price.total,
  };

  const officeEmail =
    process.env.BOOKING_EMAIL || "booking@firstclasstransfers.eu";

  if (payByCard) {
    await sendEmail({
      to: booking.email,
      subject: customerCardPending(bookingData).subject,
      html: customerCardPending(bookingData).html,
    });

    await sendEmail({
      to: officeEmail,
      subject: officeCardPending(bookingData).subject,
      html: officeCardPending(bookingData).html,
    });
  } else {
    await sendEmail({
      to: booking.email,
      subject: customerCashConfirmed(bookingData).subject,
      html: customerCashConfirmed(bookingData).html,
    });

    await sendEmail({
      to: officeEmail,
      subject: officeCashBooking(bookingData).subject,
      html: officeCashBooking(bookingData).html,
    });
  }

  return { amount: price.total };
}
