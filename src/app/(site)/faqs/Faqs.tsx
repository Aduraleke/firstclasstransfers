// app/(site)/faq/page.tsx

type FAQItem = {
  question: string;
  answer: string;
};

type FAQGroup = {
  id: string;
  title: string;
  items: FAQItem[];
};

const BRAND = {
  primary: "#162c4b",
  accent: "#b07208",
};

const FAQ_GROUPS: FAQGroup[] = [
  {
    id: "general-booking",
    title: "General Booking Questions",
    items: [
      {
        question: "How do I book an airport transfer?",
        answer:
          "You can book online through our website in a few simple steps: choose your route, date, time and number of passengers, see your fixed fare, and submit your details. You’ll receive an email (and optionally WhatsApp) confirmation with all booking information.",
      },
      {
        question: "How far in advance should I book?",
        answer:
          "We recommend booking at least 24 hours in advance, especially during high season. However, we can often accommodate same-day or last-minute bookings depending on availability.",
      },
      {
        question: "Can I book a return transfer at the same time?",
        answer:
          "Yes. When you fill in the booking form, simply add your return details. In many cases we can offer package pricing or a small discount when both legs are booked together.",
      },
      {
        question: "Can I make changes to my booking?",
        answer:
          "Yes. You can reply to your confirmation email or contact us via WhatsApp with your new details. Please send changes at least 12–24 hours before pickup whenever possible so we can update the schedule.",
      },
      {
        question: "Can I cancel my booking?",
        answer:
          "Yes. You can cancel free of charge up to 24 hours before pickup. Cancellations less than 24 hours before pickup may incur a fee, depending on how close to pickup the cancellation occurs and whether the driver has already been dispatched.",
      },
    ],
  },
  {
    id: "prices-payments",
    title: "Prices & Payments",
    items: [
      {
        question: "Are your prices fixed or metered?",
        answer:
          "Our prices are fixed per route and per vehicle and are confirmed before you book. There are no surprises at the end of the trip under normal conditions.",
      },
      {
        question: "Is the price per person or per vehicle?",
        answer:
          "All prices listed are per vehicle, not per person. A standard sedan carries up to 4 passengers and a minivan typically carries up to 6 passengers. You will see the price for each vehicle type during booking.",
      },
      {
        question: "Do you charge extra for night transfers, weekends or holidays?",
        answer:
          "No. Our fares are the same 24/7, including weekends and public holidays, for all standard routes with pre-booking.",
      },
      {
        question: "Do you have different prices for cars and minivans?",
        answer:
          "Yes. The standard car (up to 4 passengers) has one fixed price, and the minivan (up to 6 passengers) has a separate fixed price. You will see both when you select a vehicle type in the booking form.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept online card payments through our website and, in many cases, cash or card directly to the driver (subject to card terminal availability). Available options are shown during booking and in your confirmation email.",
      },
      {
        question: "Are there any hidden fees?",
        answer:
          "No. Our fares include VAT, airport parking fees, tolls and standard waiting time for delayed flights and normal traffic. For cross-border transfers, standard border waiting is included; if there are exceptionally long delays, any additional waiting charge is clearly explained before continuing.",
      },
    ],
  },
  {
    id: "airport-meet-greet",
    title: "At the Airport & Meet & Greet",
    items: [
      {
        question: "Where will I meet my driver at Larnaka or Paphos Airport?",
        answer:
          "Your driver will be waiting inside the arrivals hall, after baggage claim, holding a sign with your name or your company name. Exact details are included in your confirmation email.",
      },
      {
        question: "What if my flight is delayed?",
        answer:
          "We monitor all incoming flights. If your flight is delayed, we automatically adjust the pickup time and your driver will still be there – no extra charge for reasonable delays.",
      },
      {
        question: "What if my flight arrives earlier than expected?",
        answer:
          "If you land earlier, we do our best to have your driver at the meeting point as quickly as possible. In many cases, they are already nearby and monitoring your flight.",
      },
      {
        question: "What happens if I can’t find my driver?",
        answer:
          "Your confirmation email includes a 24/7 contact number and/or WhatsApp. Call or message us, and we’ll connect you with your driver immediately and guide you to the meeting point.",
      },
      {
        question: "How long will the driver wait for me at the airport?",
        answer:
          "For airport pickups we include a free waiting window (typically around 60 minutes) from the moment your flight lands. After that, additional waiting may incur a small charge, which the driver or our office will always explain to you first.",
      },
    ],
  },
  {
    id: "vehicles-luggage",
    title: "Vehicles & Luggage",
    items: [
      {
        question: "What type of vehicles do you use?",
        answer:
          "We use modern, air-conditioned sedans and minivans (for example Mercedes E-Class, V-Class or similar), suitable for airport transfers, long-distance trips and business travel.",
      },
      {
        question: "How many passengers can travel in one vehicle?",
        answer:
          "A standard sedan carries up to 4 passengers. Our minivans typically carry up to 6 passengers. For larger groups, we can organise multiple vehicles or minibuses on request.",
      },
      {
        question: "How much luggage can I bring?",
        answer:
          "A standard sedan usually fits 2–3 large suitcases plus 2–3 smaller bags. A minivan can fit more luggage and bulky items such as strollers. If you have extra luggage, sports equipment or unusually large items, please tell us in advance so we can assign a suitable vehicle.",
      },
      {
        question: "Can I travel with sports equipment (golf bags, bikes, surfboards)?",
        answer:
          "Yes, as long as you inform us in advance. Some items may require a minivan or special arrangement.",
      },
      {
        question: "Is Wi-Fi available in the car?",
        answer:
          "Yes, we provide free Wi-Fi in most vehicles, subject to network coverage and technical conditions.",
      },
    ],
  },
  {
    id: "children-safety",
    title: "Child Seats, Safety & Accessibility",
    items: [
      {
        question: "Do you provide child/baby seats?",
        answer:
          "Yes. Child and baby seats are available free of charge. Please specify the age of your child in the booking form so we can prepare the correct seat type.",
      },
      {
        question: "Is it safe for children to travel in your vehicles?",
        answer:
          "Yes. We follow Cyprus road safety regulations and our drivers are trained to install and use child seats correctly. Children must travel in appropriate seats or with proper restraints.",
      },
      {
        question: "Can you assist passengers with limited mobility?",
        answer:
          "Yes. Our drivers are happy to help with getting in and out of the vehicle and with luggage. If you need special assistance, please mention it when booking so we can allocate extra time and, if possible, a more suitable vehicle.",
      },
      {
        question: "Do you offer wheelchair-accessible vehicles?",
        answer:
          "Availability is limited. Please contact us in advance to check and arrange a suitable vehicle if possible.",
      },
    ],
  },
  {
    id: "routes-destinations",
    title: "Routes & Destinations",
    items: [
      {
        question: "Which areas do you serve from Larnaka Airport?",
        answer:
          "From Larnaka Airport (LCA) we cover most of Cyprus, including Larnaka City, Ayia Napa, Protaras, Pernera, Paralimni, Kapparis, Nicosia, Limassol, Pissouri, Paphos, Polis, Latchi and selected cross-border routes to Kyrenia, Famagusta and Ercan Airport (under legal and practical conditions).",
      },
      {
        question: "Do you also operate from Paphos Airport?",
        answer:
          "Yes. From Paphos Airport (PFO) we provide transfers to Limassol, Nicosia, Larnaka City, Larnaka Airport, Ayia Napa, Famagusta and other destinations on request.",
      },
      {
        question: "Do you offer city-to-city transfers (not including the airport)?",
        answer:
          "Yes. We offer many city-to-city routes, for example Nicosia ↔ Limassol, Nicosia ↔ Larnaka, Limassol ↔ Paphos and Limassol ↔ Troodos. Contact us with your pickup and drop-off locations and we will send you a quote if your route is not listed on the website.",
      },
      {
        question: "Do you offer cross-border transfers to Northern Cyprus?",
        answer:
          "Yes, we provide cross-border transfers to Kyrenia (Girne), Famagusta and Ercan Airport (ECN), subject to legal and practical conditions. These routes include assistance with checkpoint procedures where regulations allow.",
      },
      {
        question: "Do I need a passport or ID for Northern Cyprus transfers?",
        answer:
          "Yes. You must carry a valid passport or ID suitable for crossing the checkpoint. We will remind you about this requirement and guide you through the process as far as regulations allow.",
      },
    ],
  },
  {
    id: "long-distance",
    title: "Long-Distance & Comfort",
    items: [
      {
        question:
          "Are long-distance transfers (e.g. Paphos, Ayia Napa, Polis, Latchi) comfortable?",
        answer:
          "Yes. For longer journeys we assign experienced drivers and suitable vehicles, and we allow short comfort breaks along the way. Many routes are mostly motorway, making them quite smooth.",
      },
      {
        question: "Can we stop for coffee, toilets or photos during the ride?",
        answer:
          "Yes. Short stops are usually included free of charge — just ask your driver. If you plan multiple or extended stops, we can price it as a custom day trip.",
      },
      {
        question: "Is it safe to travel late at night for long routes?",
        answer:
          "Yes. Our drivers frequently operate night routes, and we apply strict safety and rest policies. Fares are the same 24/7 for standard pre-booked transfers.",
      },
    ],
  },
  {
    id: "business-groups",
    title: "Business, Groups & Special Requests",
    items: [
      {
        question: "Can I get an invoice for my company?",
        answer:
          "Yes. We can issue invoices and receipts for corporate or business travel. Please provide your company details when booking or after your trip.",
      },
      {
        question: "Do you handle conference, wedding or event groups?",
        answer:
          "Yes. We can organise multiple vehicles or minibuses for events, weddings, conferences and corporate groups. Contact us with your dates, times and group size.",
      },
      {
        question: "Do you offer VIP or executive transfers?",
        answer:
          "Yes. On request, we can arrange executive vehicles and VIP-level service for special guests, corporate clients or events.",
      },
      {
        question: "Can I request a specific driver?",
        answer:
          "If you’ve travelled with us before and have a preferred driver, let us know in advance and we will do our best to assign them, subject to availability and scheduling.",
      },
    ],
  },
  {
    id: "safety-support",
    title: "Safety, Service Quality & Support",
    items: [
      {
        question: "Are your drivers licensed and insured?",
        answer:
          "Yes. All drivers are fully licensed, insured and vetted under Cyprus law and our internal standards.",
      },
      {
        question: "Do you operate 24/7?",
        answer:
          "Yes. We offer 24/7 service, including holidays and late-night or early-morning arrivals, for all pre-booked routes.",
      },
      {
        question: "What if I have a complaint or feedback?",
        answer:
          "You can contact us by email or WhatsApp. We take feedback seriously and aim to respond to all issues quickly and professionally.",
      },
      {
        question: "Do you ever combine different groups in the same car?",
        answer:
          "No. All our transfers are private. You never share the car with strangers unless you explicitly request a shared arrangement for your own group.",
      },
    ],
  },
];

export default function FAQPage() {
  const totalQuestions = FAQ_GROUPS.reduce(
    (sum, group) => sum + group.items.length,
    0
  );

  return (
    <main className="relative mx-auto mt-32 max-w-6xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      {/* subtle background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-slate-50 via-slate-50 to-white"
      />

      {/* HERO */}
      <section className="mb-10 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-slate-500">
              <span>FAQ</span>
              <span className="h-px w-6 bg-slate-300" />
              <span className="font-extrabold text-slate-700">
                Cyprus Airport Transfers
              </span>
            </div>

            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              Frequently Asked Questions
            </h1>

            <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-[15px]">
              Everything you need to know about booking, prices, luggage, child
              seats, routes, cross-border transfers and more. If you still
              can&apos;t find your answer, our team is just a message away.
            </p>

            <div className="mt-5 flex flex-wrap gap-3 text-[11px] sm:text-xs">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                {FAQ_GROUPS.length} topics
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                {totalQuestions}+ answers
              </div>
            </div>
          </div>

          {/* right side gradient / CTA */}
          <div
            className="flex flex-col justify-between p-6 text-slate-50 sm:p-7"
            style={{
              background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.accent})`,
            }}
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">
                Still need help?
              </p>
              <h2 className="mt-2 text-lg font-semibold">
                Speak with our reservations team
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-100/90 sm:text-[13px]">
                Send us your flight details, hotel or villa address and any
                special requests. We&apos;ll reply with a clear quote and
                tailored recommendations for your route.
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-[12px] sm:text-[13px]">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-slate-900 shadow-sm hover:bg-slate-100"
              >
                Contact us
              </a>
              <span className="text-slate-100/80">
                Available 24/7 for flight arrivals.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="grid gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)]">
        {/* LEFT – sticky quick nav */}
        <aside className="md:sticky md:top-36 self-start">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Browse by topic
            </p>
            <p className="mt-1 text-[12px] text-slate-500">
              Jump straight to questions that match your situation.
            </p>

            <nav className="mt-4 space-y-1 text-[13px]">
              {FAQ_GROUPS.map((group) => (
                <a
                  key={group.id}
                  href={`#${group.id}`}
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <span>{group.title}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
                    {group.items.length}
                  </span>
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* RIGHT – FAQ groups */}
        <div className="space-y-6">
          {FAQ_GROUPS.map((group) => (
            <section
              key={group.id}
              id={group.id}
              className="scroll-mt-28 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-slate-900">
                  {group.title}
                </h2>
                <span
                  className="hidden rounded-full px-3 py-1 text-[11px] font-medium text-slate-50 sm:inline-flex"
                  style={{ backgroundColor: BRAND.primary }}
                >
                  {group.items.length} questions
                </span>
              </div>

              <div
                className="mt-3 h-1 w-16 rounded-full"
                style={{ backgroundColor: BRAND.accent }}
              />

              <div className="mt-4 divide-y divide-slate-100">
                {group.items.map((item) => (
                  <article
                    key={item.question}
                    className="py-4 first:pt-0 last:pb-0"
                  >
                    <h3 className="text-[14px] font-semibold text-slate-900">
                      {item.question}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-slate-700">
                      {item.answer}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
