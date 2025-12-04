"use client";

import React from "react";
import { Icon } from "@iconify/react";
import airplaneIcon from "@iconify/icons-mdi/airplane";
import bellIcon from "@iconify/icons-mdi/bell-outline";

type Props = {
  title: string;
  subtitle?: string;
};

export const AdminTopBar: React.FC<Props> = ({ title, subtitle }) => {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 bg-black/40 backdrop-blur">
      <div className="flex flex-col gap-0.5">
        <div className="inline-flex items-center gap-2">
          <span className="text-xs uppercase tracking-[0.22em] text-white/50">
            Admin · {title}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-white/65">
            <Icon icon={airplaneIcon} width={13} height={13} />
            City ↔ Airport
          </span>
        </div>
        {subtitle && (
          <p className="text-[11px] text-white/60">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
          <Icon icon={bellIcon} width={16} height={16} />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400" />
        </button>
        <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-2.5 py-1.5">
          <div className="h-6 w-6 rounded-full bg-linear-to-br from-[#162c4b] to-[#b07208]" />
          <div className="flex flex-col">
            <span className="text-[11px] text-white/80">Admin</span>
            <span className="text-[10px] text-white/55">
              Dispatch Operator
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
