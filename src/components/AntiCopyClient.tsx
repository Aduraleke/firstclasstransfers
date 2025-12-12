// app/components/AntiCopyClient.tsx
"use client";

import { useEffect } from "react";

export default function AntiCopyClient({
  enableOverlay = true,
  watermarkText = "© First Class Transfers",
}: {
  enableOverlay?: boolean;
  watermarkText?: string;
}) {
  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const onSelectStart = (e: Event) => {
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

    const onCopyCutPaste = (e: ClipboardEvent) => {
      const target = e?.target as HTMLElement | null;
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

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F12") {
        e.preventDefault();
      }
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key.toLowerCase() === "u" ||
          e.key.toLowerCase() === "s" ||
          (e.shiftKey && e.key.toLowerCase() === "i"))
      ) {
        e.preventDefault();
      }
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("selectstart", onSelectStart);
    document.addEventListener("copy", onCopyCutPaste);
    document.addEventListener("cut", onCopyCutPaste);
    document.addEventListener("paste", onCopyCutPaste);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("selectstart", onSelectStart);
      document.removeEventListener("copy", onCopyCutPaste);
      document.removeEventListener("cut", onCopyCutPaste);
      document.removeEventListener("paste", onCopyCutPaste);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
html, body, #__next {
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;
}

input, textarea, [contenteditable="true"] {
  -webkit-user-select: text !important;
  -moz-user-select: text !important;
  -ms-user-select: text !important;
  user-select: text !important;
}

img {
  -webkit-user-drag: none !important;
  user-drag: none !important;
  pointer-events: auto;
}

/* Overlay and watermark */
.anticopy-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 99998;
}

.anticopy-watermark {
  position: fixed;
  bottom: 12px;
  right: 12px;
  opacity: 0.12;
  font-size: 12px;
  z-index: 99999;
  pointer-events: none;
  user-select: none;
}
      `,
        }}
      />

      {enableOverlay && <div className="anticopy-overlay" aria-hidden="true" />}

      <div className="anticopy-watermark" aria-hidden="true">
        {watermarkText}
      </div>
    </>
  );
}
