"use client";

export {}; // make this file a module so `declare global` augments the global scope

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
  // allow any other custom fields (string|number|boolean|undefined)
  [key: string]: string | number | boolean | undefined;
};

/**
 * Simple GTM pageview pusher for Next.js app router.
 * Place <GTMPageView /> once (e.g. in app/layout.tsx inside body).
 */
export default function GTMPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initialize dataLayer if missing (typed)
    if (!window.dataLayer) {
      window.dataLayer = [];
    }

    const page = pathname + (searchParams ? `?${searchParams.toString()}` : "");

    const payload: DataLayerEvent = {
      event: "pageview",
      page,
      page_location: window.location.href,
      page_path: pathname,
      page_title: typeof document !== "undefined" ? document.title : undefined,
    };

    window.dataLayer.push(payload);
  }, [pathname, searchParams]);

  return null;
}
