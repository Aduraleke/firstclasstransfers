import type { Metadata } from "next";
import FAQs from "./Faqs";

export const metadata: Metadata = {
  title: "Cyprus Airport Transfers FAQ | First Class Transfers",
  description:
    "Answers to the most common questions about Cyprus airport taxis: fixed prices, payments, night fares, child seats, luggage, safety, cross-border transfers, long-distance routes and more.",
  alternates: {
    canonical: "https://firstclasstransfers.eu/faq",
  },
};


export default function page() {
  return <FAQs/>
}
