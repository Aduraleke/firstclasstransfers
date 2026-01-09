/* =====================================================
   SHARED TYPES
===================================================== */
export type BookingData = {
  name: string;
  email: string;
  phone: string;

  route: string;
  vehicle: string;
  tripType: string;

  flightNumber: string;

  date?: string;
  time?: string;
  timePeriod?: string;

  returnDate?: string;
  returnTime?: string;
  returnTimePeriod?: string;

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
              <h1 style="margin:0;color:#ffffff;font-size:20px;">
                First Class Transfers
              </h1>
              <p style="margin:6px 0 0;color:#e5e7eb;font-size:12px;">
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
              text-align:center;
            ">
              <strong>First Class Transfers Cyprus</strong><br/>
              📧 <a href="mailto:booking@firstclasstransfers.eu">booking@firstclasstransfers.eu</a><br/>
              📞 +357 94 005511 · +357 99 240868 · +357 96 565385<br/>
              💬 WhatsApp:
              <a href="https://wa.me/35796565385">+357 96 565385</a><br/>
              🌐 <a href="https://firstclasstransfers.eu">firstclasstransfers.eu</a>
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

<hr />

<h3>Booking Details</h3>
<table width="100%" cellpadding="6" style="font-size:14px;">
  <tr><td><strong>Route</strong></td><td>${data.route}</td></tr>
  <tr><td><strong>Vehicle</strong></td><td>${data.vehicle}</td></tr>
  <tr><td><strong>Trip type</strong></td><td>${data.tripType}</td></tr>
  <tr>
  <td><strong>Flight number</strong></td>
  <td>${data.flightNumber}</td>
</tr>

  ${
    data.date
      ? `<tr><td><strong>Pickup date</strong></td><td>${data.date}</td></tr>`
      : ""
  }
  ${
    data.time
      ? `<tr><td><strong>Pickup time</strong></td><td>${data.time}</td></tr>`
      : ""
  }

  ${
    data.tripType === "return"
      ? `
        <tr><td colspan="2"><strong>Return Trip</strong></td></tr>


        <tr><td><strong>Return date</strong></td><td>${data.returnDate}</td></tr>
        <tr><td><strong>Return time</strong></td><td>${data.returnTime}</td></tr>
        <tr><td><strong>Return period</strong></td><td>${data.returnTimePeriod}</td></tr>
      `
      : ""
  }

  <tr>
    <td><strong>Total fare</strong></td>
    <td><strong>€${data.amount} (Cash)</strong></td>
  </tr>
</table>

<p style="margin-top:16px;">
  Please be ready at the pickup point on time.
</p>

<p>
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
    subject: "Booking Received – Payment Confirmed",
    html: emailLayout(
      "Payment Confirmed",
      `
<p>Dear <strong>${data.name}</strong>,</p>

<p>
  Your booking has been received and
  <strong>your payment is confirmed</strong>.
</p>

<hr />

<h3>Booking Summary</h3>
<ul>
  <li><strong>Route:</strong> ${data.route}</li>
  <li><strong>Vehicle:</strong> ${data.vehicle}</li>
  <li><strong>Trip type:</strong> ${data.tripType}</li>
<li><strong>Flight number:</strong> ${data.flightNumber}</li>
  ${
    data.tripType === "return"
      ? `
      

        <li><strong>Return date:</strong> ${data.returnDate}</li>
        <li><strong>Return time:</strong> ${data.returnTime}</li>
      `
      : ""
  }

  <li><strong>Amount:</strong> €${data.amount}</li>
</ul>

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

  <h3>Flight</h3>
<ul>
  <li><strong>Flight number:</strong> ${data.flightNumber}</li>
</ul>


  ${data.date ? `<li><strong>Pickup date:</strong> ${data.date}</li>` : ""}
  ${data.time ? `<li><strong>Pickup time:</strong> ${data.time}</li>` : ""}

  ${
    data.tripType === "return"
      ? `
        <li><strong>Return date:</strong> ${data.returnDate}</li>
        <li><strong>Return time:</strong> ${data.returnTime}</li>
        <li><strong>Return period:</strong> ${data.returnTimePeriod}</li>
      `
      : ""
  }
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
    subject: "New Card Booking – Payment Confirmed",
    html: emailLayout(
      "Card Booking Confirmed",
      `
<h2>New Card Booking (Confirmed Payment)</h2>
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
  <h3>Flight</h3>
<ul>
  <li><strong>Flight number:</strong> ${data.flightNumber}</li>
</ul>


  ${
    data.tripType === "return"
      ? `

        <li><strong>Return date:</strong> ${data.returnDate}</li>
        <li><strong>Return time:</strong> ${data.returnTime}</li>
        <li><strong>Return period:</strong> ${data.returnTimePeriod}</li>
      `
      : ""
  }
</ul>

<h3>Payment</h3>
<ul>
  <li><strong>Status:</strong> Payment Confirmed</li>
  <li><strong>Amount:</strong> €${data.amount}</li>
</ul>

`
    ),
  };
}
