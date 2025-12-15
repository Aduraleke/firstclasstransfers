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
  // 🔐 Server-trusted pricing
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
    date: booking.date,
    time: booking.time,
    adults: booking.adults,
    children: booking.children,
    baggage: booking.baggageType,
    amount: price.total,
  };

  const officeEmail =
    process.env.BOOKING_EMAIL || "booking@firstclasstransfers.eu";

  // 📧 EMAILS ALWAYS SENT FIRST
  if (payByCard) {
    const customerMail = customerCardPending(bookingData);
    const officeMail = officeCardPending(bookingData);

    await sendEmail({
      to: booking.email,
      subject: customerMail.subject,
      html: customerMail.html,
    });

    await sendEmail({
      to: officeEmail,
      subject: officeMail.subject,
      html: officeMail.html,
    });
  } else {
    const customerMail = customerCashConfirmed(bookingData);
    const officeMail = officeCashBooking(bookingData);

    await sendEmail({
      to: booking.email,
      subject: customerMail.subject,
      html: customerMail.html,
    });

    await sendEmail({
      to: officeEmail,
      subject: officeMail.subject,
      html: officeMail.html,
    });
  }

  return { amount: price.total };
}
