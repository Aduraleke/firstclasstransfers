// app/routes/RouteCard.tsx

import Link from "next/link";
import Image from "next/image";
import { RouteDetail } from "@/lib/routes/types";

type RouteCardProps = {
  route: RouteDetail;
};

export default function RouteCard({ route }: RouteCardProps) {
  const description = route.metaDescription || route.body;

  // --- price helpers (safe, backend-driven) ---
  const sedanPrice =
    route.vehicleOptions?.[0]?.fixedPrice ?? route.sedanPrice ?? "—";

  const vanPrice =
    route.vehicleOptions?.[1]?.fixedPrice ?? route.vanPrice ?? "—";

  return (
    <Link
      href={`/routes/${route.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.16)]"
    >
      {/* IMAGE */}
      <div className="relative h-32 w-full overflow-hidden">
        <Image
          src={route.image}
          alt={`${route.fromLocation} to ${route.toLocation} taxi transfer`}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent" />

        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between text-[11px] text-white">
          <span className="rounded-full bg-black/55 px-2 py-0.5 backdrop-blur-sm">
            From {route.fromLocation}
          </span>
          <span className="rounded-full bg-black/45 px-2 py-0.5 text-[10px]">
            To {route.toLocation}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col px-4 py-4 sm:px-5 sm:py-5">
        {/* TITLE */}
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold text-slate-900 sm:text-[17px]">
            {route.fromLocation} → {route.toLocation}
          </h2>
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Private transfer · Fixed fare
          </p>
        </div>

        {/* DESCRIPTION */}
        <p className="mt-4 line-clamp-3 text-[13px] text-slate-600">
          {description}
        </p>

        {/* PRICE RIBBON */}
        <div className="relative mt-3">
          <div className="flex flex-col gap-1 rounded-2xl bg-linear-to-r from-[#b07208] via-[#e0b15a] to-[#b07208] px-4 py-3 shadow-lg shadow-black/15">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#162c4b]">
              Fixed fare · Per vehicle
            </p>

            <div className="flex flex-wrap items-baseline justify-between gap-3 text-[#162c4b]">
              <div className="flex items-baseline gap-1">
                <span className="text-[10px] uppercase tracking-[0.16em] opacity-80">
                  Sedan
                </span>
                <span className="text-[18px] font-extrabold sm:text-[20px]">
                  €{sedanPrice}
                </span>
              </div>

              <span className="hidden h-5 w-px bg-white/40 sm:block" />

              <div className="flex items-baseline gap-1">
                <span className="text-[10px] uppercase tracking-[0.16em] opacity-80">
                  Mercedes V-Class
                </span>
                <span className="text-[18px] font-extrabold sm:text-[20px]">
                  €{vanPrice}
                </span>
              </div>
            </div>
          </div>

          {/* Ribbon tail */}
          <div className="absolute inset-x-6 -bottom-2 h-2 rounded-b-2xl bg-[#8b5a03]/70 blur-[3px]" />
        </div>

        {/* FOOTER */}
        <div className="mt-4 flex items-center justify-between text-[12px] text-slate-500">
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            No hidden fees
          </span>
          <span className="group-hover:text-slate-900">View route ↗</span>
        </div>
      </div>
    </Link>
  );
}
