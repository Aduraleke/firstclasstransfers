// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
