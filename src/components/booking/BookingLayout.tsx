// components/booking/BookingLayout.tsx

"use client";

import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function BookingLayout({ children }: Props) {
  return (
    <div className="min-h-[calc(100vh-120px)] bg-white flex items-center justify-center py-10 sm:py-14">
      <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
