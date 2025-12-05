import type { Metadata } from "next";
import HeroSection from "@/components/Home/HomeHeroSection";
import PopularRoutesSection from "@/components/Home/PopularRoutesSection";
import WhyChooseSection from "@/components/Home/WhyChooseSection";
import HowTransferWorks from "@/components/Home/HowTransferWorks";
import WhereWeOperateSection from "@/components/Home/WhereWeOperateSection";
import CustomerReviews from "@/components/Home/CustomerReviews";
import FleetSection from "@/components/Home/FleetSection";
import FaqTeaser from "@/components/Home/FaqTeaser";
// import PopularRoutesSection from "@/components/home/PopularRoutesSection";
// import PaphosAndCitiesTeaser from "@/components/home/PaphosAndCitiesTeaser";
// import WhyChooseSection from "@/components/home/WhyChooseSection";
// import HowItWorksSection from "@/components/home/HowItWorksSection";
// import ServiceAreaSection from "@/components/home/ServiceAreaSection";
// import ReviewsSection from "@/components/home/ReviewsSection";
// import FleetSection from "@/components/home/FleetSection";
// import FaqTeaserSection from "@/components/home/FaqTeaserSection";

export const metadata: Metadata = {
  title: "Cyprus Airport Taxi Transfers – Fixed Price Larnaca & Paphos",
  description:
    "Book private, fixed-price Cyprus airport transfers from Larnaca and Paphos Airports to Ayia Napa, Protaras, Nicosia, Limassol and more. Modern vehicles, licensed English-speaking drivers, 24/7 support, child seats on request.",
  alternates: {
    canonical: "https://firstclasstransfers.eu/",
  },
  openGraph: {
    title: "Cyprus Airport Taxi Transfers – Fixed Price Larnaca & Paphos",
    description:
      "Private Cyprus airport transfers with fixed prices, sedans and Mercedes V-Class minivans, free water & Wi-Fi, and 24/7 service.",
    url: "https://firstclasstransfers.eu/",
  },
};
export default function page() {
  return (
    <div>
      <main className="pt-(--nav-height)">
        <HeroSection />
        <PopularRoutesSection/>
        <WhyChooseSection/>
        <HowTransferWorks/>
        <WhereWeOperateSection/>
        <CustomerReviews/>
        <FleetSection/>
        <FaqTeaser/>
      </main>
    </div>
  );
}
