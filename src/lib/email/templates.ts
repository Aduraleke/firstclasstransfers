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

/* =====================================================
   BASE EMAIL LAYOUT (REUSED BY ALL EMAILS)
===================================================== */
function emailLayout(title: string, content: string) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body style="
    margin:0;
    padding:0;
    background:#f4f6f8;
    font-family:Arial, Helvetica, sans-serif;
    color:#111827;
  ">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="
            max-width:600px;
            background:#ffffff;
            border-radius:16px;
            overflow:hidden;
            box-shadow:0 20px 45px rgba(0,0,0,0.12);
          ">

            <!-- HEADER -->
            <tr>
              <td style="
                background:linear-gradient(135deg,#162c4b,#b07208);
                padding:26px;
                text-align:center;
              ">
                <h1 style="
                  margin:0;
                  color:#ffffff;
                  font-size:20px;
                  letter-spacing:0.6px;
                ">
                  First Class Transfers
                </h1>
                <p style="
                  margin:6px 0 0;
                  color:#e5e7eb;
                  font-size:12px;
                ">
                  Premium Airport Transfers · Cyprus
                </p>
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding:30px;">
                ${content}
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
  <td style="
    background:#f9fafb;
    padding:24px;
    font-size:12px;
    color:#6b7280;
  ">
    <table width="100%" cellpadding="0" cellspacing="0" style="text-align:center;">
      <tr>
        <td style="padding-bottom:8px;">
          <strong style="color:#111827;">
            First Class Transfers Cyprus
          </strong>
        </td>
      </tr>

      <tr>
        <td style="padding-bottom:6px;">
          📧
          <a
            href="mailto:booking@firstclasstransfers.eu"
            style="color:#162c4b;text-decoration:none;"
          >
            booking@firstclasstransfers.eu
          </a>
        </td>
      </tr>

      <tr>
        <td style="padding-bottom:6px;">
          📞 +357 94 005511 &nbsp;|&nbsp;
          +357 99 240868 &nbsp;|&nbsp;
          +357 96 565385
        </td>
      </tr>

      <tr>
        <td style="padding-bottom:6px;">
          💬 WhatsApp:
          <a
            href="https://wa.me/35796565385"
            style="color:#162c4b;text-decoration:none;font-weight:bold;"
          >
            +357 96 565385
          </a>
        </td>
      </tr>

      <tr>
        <td style="padding-bottom:8px;">
          🌐
          <a
            href="https://firstclasstransfers.eu"
            style="color:#162c4b;text-decoration:none;"
          >
            firstclasstransfers.eu
          </a>
        </td>
      </tr>

      <tr>
        <td style="padding-top:10px;color:#9ca3af;font-size:11px;">
          This is an automated message. Please do not share payment details by email.
        </td>
      </tr>
    </table>
  </td>
</tr>


          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
}

/* =====================================================
   CUSTOMER – CASH CONFIRMED
===================================================== */
export function customerCashConfirmed(data: BookingData) {
  return {
    subject: "Your Airport Transfer Is Confirmed",
    html: emailLayout(
      "Booking Confirmed",
      `
<p>Dear <strong>${data.name}</strong>,</p>

<p>
  Your airport transfer booking has been
  <strong style="color:#059669;">successfully confirmed</strong>.
</p>

<hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />

<h3>Booking Details</h3>
<table width="100%" cellpadding="6" style="font-size:14px;">
  <tr><td><strong>Route</strong></td><td>${data.route}</td></tr>
  <tr><td><strong>Vehicle</strong></td><td>${data.vehicle}</td></tr>
  <tr><td><strong>Trip type</strong></td><td>${data.tripType}</td></tr>
  ${
    data.date
      ? `<tr><td><strong>Date</strong></td><td>${data.date}</td></tr>`
      : ""
  }
  ${
    data.time
      ? `<tr><td><strong>Pickup time</strong></td><td>${data.time}</td></tr>`
      : ""
  }
  <tr>
    <td><strong>Total fare</strong></td>
    <td><strong>€${data.amount} (Cash)</strong></td>
  </tr>
</table>

<p style="margin-top:16px;">
  Please be ready at the pickup point on time.
  For airport pickups, your driver will monitor your flight.
</p>

<p>
  If you need changes or assistance, simply reply to this email.
</p>

<p style="margin-top:24px;">
  Kind regards,<br/>
  <strong>First Class Transfers Team</strong>
</p>
`
    ),
  };
}

/* =====================================================
   CUSTOMER – CARD PENDING
===================================================== */
export function customerCardPending(data: BookingData) {
  return {
    subject: "Booking Received – Payment Required",
    html: emailLayout(
      "Payment Pending",
      `
<p>Dear <strong>${data.name}</strong>,</p>

<p>
  We have received your booking request.
  <strong>Your booking is pending payment.</strong>
</p>

<hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;" />

<h3>Booking Summary</h3>
<ul style="padding-left:18px;font-size:14px;">
  <li><strong>Route:</strong> ${data.route}</li>
  <li><strong>Vehicle:</strong> ${data.vehicle}</li>
  <li><strong>Trip type:</strong> ${data.tripType}</li>
  <li><strong>Amount:</strong> €${data.amount}</li>
</ul>

<p>
  You will be redirected to our secure card payment provider (myPOS)
  to complete the payment and confirm your booking.
</p>

<p>
  Thank you for choosing First Class Transfers.
</p>
`
    ),
  };
}

/* =====================================================
   OFFICE – CASH BOOKING
===================================================== */
export function officeCashBooking(data: BookingData) {
  return {
    subject: "New Cash Booking Received",
    html: emailLayout(
      "New Cash Booking",
      `
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
  <li><strong>Trip type:</strong> ${data.tripType}</li>
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

<p style="color:#b91c1c;font-weight:bold;">
  Action required: Assign driver and vehicle.
</p>
`
    ),
  };
}

/* =====================================================
   OFFICE – CARD BOOKING (PENDING)
===================================================== */
export function officeCardPending(data: BookingData) {
  return {
    subject: "New Card Booking – Payment Pending",
    html: emailLayout(
      "Card Booking Pending",
      `
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
  <li><strong>Trip type:</strong> ${data.tripType}</li>
</ul>

<h3>Payment</h3>
<ul>
  <li><strong>Status:</strong> Awaiting myPOS confirmation</li>
  <li><strong>Amount:</strong> €${data.amount}</li>
</ul>

<p style="color:#92400e;font-weight:bold;">
  Do NOT assign driver until payment is confirmed.
</p>
`
    ),
  };
}
