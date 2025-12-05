// app/(site)/layout.tsx
import type { ReactNode } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Global Header */}
      <NavBar />

      {/* Page Content */}
      <main className="">
        {children}
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
