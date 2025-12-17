// app/(site)/service-guide/page.tsx
import { Metadata } from "next";
import ServiceGuide from "./ServiceGuide";

export const metadata: Metadata = {
  title: "How Our Cyprus Airport Transfers Work",
  description:
    "Learn how our Cyprus airport taxi service works, from booking and flight tracking to meet & greet and hotel drop-off.",
  alternates: {
    canonical: "https://firstclasstransfers.eu/service-guide",
  },
};

export default function Page() {
  return <ServiceGuide />;
}
