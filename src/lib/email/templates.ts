type BookingData = {
  name: string;
  email: string;
  phone: string;
  route: string;
  vehicle: string;
  tripType: string;
  date?: string;
  time?: string;
  adults?: number;
  children?: number;
  baggage?: string;
  amount: number;
};

/* =======================
   CUSTOMER – CASH CONFIRMED
======================= */
export function customerCashConfirmed(data: BookingData) {
  return {
    subject: "Your Airport Transfer Is Confirmed – First Class Transfers",
    html: `
      <p>Dear ${data.name},</p>

      <p>
        Thank you for choosing <strong>First Class Transfers</strong>.
        Your airport transfer booking has been
        <strong>successfully confirmed</strong>.
      </p>

      <hr/>

      <p><strong>Booking Details</strong></p>
      <ul>
        <li><strong>Route:</strong> ${data.route}</li>
        <li><strong>Vehicle:</strong> ${data.vehicle}</li>
        <li><strong>Trip Type:</strong> ${data.tripType}</li>
        ${data.date ? `<li><strong>Date:</strong> ${data.date}</li>` : ""}
        ${data.time ? `<li><strong>Pickup Time:</strong> ${data.time}</li>` : ""}
        <li><strong>Total Fare:</strong> €${data.amount} (Cash)</li>
      </ul>

      <p>
        Please be ready at the pickup point on time.
        For airport pickups, your driver will monitor your flight.
      </p>

      <p>
        If you need assistance or changes, simply reply to this email.
      </p>

      <p>
        Kind regards,<br/>
        <strong>First Class Transfers</strong><br/>
        Cyprus
      </p>
    `,
  };
}

/* =======================
   CUSTOMER – CARD PENDING
======================= */
export function customerCardPending(data: BookingData) {
  return {
    subject: "Booking Received – Payment Pending",
    html: `
      <p>Dear ${data.name},</p>

      <p>
        We have successfully received your booking request.
        <strong>Your booking is pending payment.</strong>
      </p>

      <hr/>

      <p><strong>Booking Summary</strong></p>
      <ul>
        <li><strong>Route:</strong> ${data.route}</li>
        <li><strong>Vehicle:</strong> ${data.vehicle}</li>
        <li><strong>Trip Type:</strong> ${data.tripType}</li>
        <li><strong>Amount:</strong> €${data.amount}</li>
      </ul>

      <p>
        Please complete the secure card payment to confirm your booking.
      </p>

      <p>
        Kind regards,<br/>
        <strong>First Class Transfers</strong><br/>
        Cyprus
      </p>
    `,
  };
}

/* =======================
   OFFICE – CASH BOOKING
======================= */
export function officeCashBooking(data: BookingData) {
  return {
    subject: "🚕 New Cash Booking Received",
    html: `
      <h2>New Cash Booking</h2>
      <hr/>

      <h3>Customer</h3>
      <ul>
        <li><strong>Name:</strong> ${data.name}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        <li><strong>Phone:</strong> ${data.phone}</li>
      </ul>

      <h3>Trip</h3>
      <ul>
        <li><strong>Route:</strong> ${data.route}</li>
        <li><strong>Vehicle:</strong> ${data.vehicle}</li>
        <li><strong>Trip Type:</strong> ${data.tripType}</li>
        ${data.date ? `<li><strong>Date:</strong> ${data.date}</li>` : ""}
        ${data.time ? `<li><strong>Time:</strong> ${data.time}</li>` : ""}
      </ul>

      <h3>Passengers & Luggage</h3>
      <ul>
        <li><strong>Adults:</strong> ${data.adults ?? 0}</li>
        <li><strong>Children:</strong> ${data.children ?? 0}</li>
        <li><strong>Baggage:</strong> ${data.baggage ?? "N/A"}</li>
      </ul>

      <h3>Payment</h3>
      <ul>
        <li><strong>Method:</strong> Cash</li>
        <li><strong>Amount:</strong> €${data.amount}</li>
      </ul>

      <p>⚠️ Action required: Assign driver and vehicle.</p>
    `,
  };
}

/* =======================
   OFFICE – CARD PENDING
======================= */
export function officeCardPending(data: BookingData) {
  return {
    subject: "💳 New Card Booking – Payment Pending",
    html: `
      <h2>New Card Booking (Pending Payment)</h2>
      <hr/>

      <h3>Customer</h3>
      <ul>
        <li><strong>Name:</strong> ${data.name}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        <li><strong>Phone:</strong> ${data.phone}</li>
      </ul>

      <h3>Trip</h3>
      <ul>
        <li><strong>Route:</strong> ${data.route}</li>
        <li><strong>Vehicle:</strong> ${data.vehicle}</li>
        <li><strong>Trip Type:</strong> ${data.tripType}</li>
      </ul>

      <h3>Payment</h3>
      <ul>
        <li><strong>Status:</strong> Awaiting myPOS payment</li>
        <li><strong>Amount:</strong> €${data.amount}</li>
      </ul>

      <p>⚠️ Do not assign driver until payment is confirmed.</p>
    `,
  };
}
