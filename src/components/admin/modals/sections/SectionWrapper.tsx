// sections/SectionWrapper.tsx

import React from "react";

export const SectionWrapper = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-2xl bg-slate-900/80 backdrop-blur border border-slate-700 p-6 space-y-4 shadow-xl">
    <div>
      <h3 className="text-white font-semibold text-lg">{title}</h3>
      {subtitle && (
        <p className="text-slate-400 text-sm">{subtitle}</p>
      )}
    </div>
    {children}
  </section>
);
