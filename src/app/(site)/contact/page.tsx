// app/(site)/contact/page.tsx
import { Metadata } from "next";
import Contact from "./Contact";

export const metadata: Metadata = {
  title: "Contact Us | First Class Transfers Cyprus",
  description:
    "Contact First Class Transfers for Cyprus airport taxi bookings, custom transfers and support. Email, phone or WhatsApp available.",
  alternates: {
    canonical: "https://firstclasstransfers.eu/contact",
  },
};

export default function ContactPage() {
  return <Contact />;
}
