// app/(site)/contact/page.tsx
import { Metadata } from "next";
import Contact from "./Contact";

export const metadata: Metadata = {
  title: "Contact First Class Transfers Cyprus",
  description:
    "Contact First Class Transfers for Cyprus airport taxi bookings, custom routes, group transfers and support. Reach us by email, phone, WhatsApp or the enquiry form.",
  alternates: {
    canonical: "https://firstclasstransfers.eu/contact",
  },
};

export default function ContactPage() {
  return <Contact />;
}
