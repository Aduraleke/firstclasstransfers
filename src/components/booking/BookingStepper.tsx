// components/booking/BookingStepper.tsx

"use client";

import React from "react";

type Props = {
  currentStep: 1 | 2;
};

const BRAND_PRIMARY = "#162c4b";
const BRAND_ACCENT = "#b07208";

export default function BookingStepper({ currentStep }: Props) {
  const steps = [
    { id: 1, label: "Trip details" },
    { id: 2, label: "Passengers & confirmation" },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const active = currentStep === step.id;
          const completed = currentStep > step.id;

          return (
            <div
              key={step.id}
              className="flex-1 flex items-center gap-2 sm:gap-3"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold border transition-colors`}
                  style={{
                    backgroundColor: active
                      ? BRAND_PRIMARY
                      : completed
                      ? BRAND_ACCENT
                      : "#ffffff",
                    borderColor: active || completed ? "transparent" : "#e5e7eb",
                    color: active || completed ? "#ffffff" : "#4b5563",
                  }}
                >
                  {step.id}
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-[11px] uppercase tracking-[0.18em] ${
                      active ? "text-[#111827]" : "text-gray-500"
                    }`}
                  >
                    Step {step.id}
                  </span>
                  <span
                    className={`text-xs sm:text-sm ${
                      active ? "text-[#111827]" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden sm:block flex-1 h-px bg-linear-to-r from-gray-200 via-gray-300 to-gray-200" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
