import { Metadata } from 'next';
import ServiceGuide from './ServiceGuide';


export const metadata: Metadata = {
  title: "How Your Cyprus Airport Transfer Works | First Class Transfers",
  description:
    "Step-by-step guide to how our Cyprus airport taxi service works: from instant quote and booking to flight monitoring, meet & greet at arrivals and private transfer to your hotel or villa.",
  alternates: {
    canonical: "https://firstclasstransfers.eu/service-guide",
  },
};

export default function page() {
  return <ServiceGuide/>
}
