// src/components/GTMPageView.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Local global augmentation so we don't need a separate .d.ts file.
 * This tells TypeScript that window.dataLayer may exist and what shape it has.
 */
declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

/** A simple, flexible shape for dataLayer events. Extend as needed. */
type DataLayerEvent = {
  event: string;
  page?: string;
  page_location?: string;
  page_path?: string;
  page_title?: string;
  [key: string]: string | number | boolean | undefined;
};

/**
 * Simple GTM pageview pusher for Next.js app router.
 * Place <GTMPageView /> once (e.g. in app/layout.tsx inside body).
 */
export default function GTMPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // derive a stable string for the query so the effect does not re-run
  // due to object identity changes on ReadonlyURLSearchParams
  const queryString = searchParams ? searchParams.toString() : "";

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Ensure dataLayer exists
    window.dataLayer = window.dataLayer || [];

    const page = pathname + (queryString ? `?${queryString}` : "");

    const payload: DataLayerEvent = {
      event: "pageview",
      page,
      page_location: window.location.href,
      page_path: pathname,
      page_title: typeof document !== "undefined" ? document.title : undefined,
    };

    window.dataLayer.push(payload);
  }, [pathname, queryString]);

  return null;
}
