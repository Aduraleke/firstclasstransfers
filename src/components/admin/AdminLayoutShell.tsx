"use client";

import React from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";

type Props = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
};

export const AdminLayoutShell: React.FC<Props> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="min-h-screen bg-[#020513] text-white">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <div className="flex-1 flex flex-col">
          <AdminTopBar title={title} subtitle={subtitle} />

          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5">
            <div className="max-w-6xl mx-auto space-y-4">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};
