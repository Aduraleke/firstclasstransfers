// app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Components (make sure these exist at these paths)
import GTMPageView from "@/components/GTMPageView";
import AntiCopyClient from "@/components/AntiCopyClient";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://firstclasstransfers.eu"),
  title: {
    default: "First Class Transfers Cyprus",
    template: "%s | First Class Transfers Cyprus",
  },
  description:
    "Fixed-price private airport transfers in Cyprus from Larnaca and Paphos Airports to Ayia Napa, Protaras, Nicosia, Limassol and more. 24/7 service, modern vehicles, English-speaking drivers.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    url: "https://firstclasstransfers.eu/",
    title: "First Class Transfers Cyprus",
    description:
      "Book fixed-price private Cyprus airport taxis from Larnaca (LCA) and Paphos (PFO). Sedans and Mercedes V-Class minivans, 24/7, child seats on request.",
    siteName: "First Class Transfers Cyprus",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "First Class Transfers – Cyprus airport taxi and minivan service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "First Class Transfers Cyprus",
    description:
      "Private, fixed-price Cyprus airport transfers from Larnaca and Paphos Airports.",
    images: ["/og-home.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Confirm GTM ID matches what you want to use.
const GTM_ID = "GTM-5D5XWZG9";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager - load as early as possible */}
        <Script
          id="gtm-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* noscript iframe immediately after body open */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* Anti-copy client (JS deterrents + watermark overlay) */}
        {/* <AntiCopyClient
          enableOverlay={true}
          watermarkText="© First Class Transfers Cyprus"
        /> */}

        {/* Push pageview events for client navigation */}
       <Suspense fallback={null}>
          <GTMPageView />
        </Suspense>

        {/* Your app content */}
        {children}
      </body>
    </html>
  );
}
