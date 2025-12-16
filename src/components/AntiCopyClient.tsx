// app/components/AntiCopyClient.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type Props = {
  enableOverlay?: boolean;
  watermarkText?: string;
};

export default function AntiCopyClient({
  enableOverlay = true,
  watermarkText = "© First Class Transfers",
}: Props) {
  const pathname = usePathname();

  // 🚫 Disable on conversion-critical pages
  const disabled =
    pathname.startsWith("/booking") ||
    pathname.startsWith("/payment");

  useEffect(() => {
    if (disabled) return;

    const onContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
    };

    const onCopyCut = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("copy", onCopyCut);
    document.addEventListener("cut", onCopyCut);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("copy", onCopyCut);
      document.removeEventListener("cut", onCopyCut);
    };
  }, [disabled]);

  if (disabled) return null;

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
/* 🔒 Protect only marked content */
.anticopy-protected {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Allow normal interaction everywhere else */
input, textarea, [contenteditable="true"] {
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
}

img {
  -webkit-user-drag: none;
  user-drag: none;
}

/* Watermark */
.anticopy-watermark {
  position: fixed;
  bottom: 12px;
  right: 12px;
  opacity: 0.12;
  font-size: 12px;
  z-index: 9999;
  pointer-events: none;
  user-select: none;
}
        `,
        }}
      />

      {enableOverlay && (
        <div
          className="anticopy-overlay"
          aria-hidden="true"
        />
      )}

      <div className="anticopy-watermark" aria-hidden="true">
        {watermarkText}
      </div>
    </>
  );
}
