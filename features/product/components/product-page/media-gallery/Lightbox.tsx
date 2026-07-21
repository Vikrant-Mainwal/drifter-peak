"use client";

import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import type { ProductMedia } from "@/features/product/types";

interface LightboxProps {
  media: ProductMedia[];
  productTitle: string;
  startIdx: number;
  onClose: () => void;
}

export default function Lightbox({
  media,
  productTitle,
  startIdx,
  onClose,
}: LightboxProps) {
  const [idx, setIdx] = useState(startIdx);
  const active = media[idx];
  const isVideo = active?.media_type === "video";

  const goPrev = useCallback(() => setIdx((i) => Math.max(0, i - 1)), []);
  const goNext = useCallback(
    () => setIdx((i) => Math.min(media.length - 1, i + 1)),
    [media.length],
  );

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goPrev, goNext]);

  return (
    <div
      className="fixed inset-0 z-[999] bg-white flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-5 md:top-10 md:right-10 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow"
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <button
        onClick={goPrev}
        disabled={idx === 0}
        aria-label="Previous"
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow disabled:opacity-30"
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div className="relative flex items-center justify-center w-full h-screen px-4 md:px-20 pointer-events-none">
        {isVideo ? (
          <video
            src={active.url}
            controls
            className="max-h-[90vh] max-w-[90vw] pointer-events-auto"
          />
        ) : (
          <div className="relative w-full h-full max-w-3xl max-h-[85vh] pointer-events-none">
            <Image
              src={active.url}
              alt={productTitle}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>
        )}
      </div>

      <button
        onClick={goNext}
        disabled={idx === media.length - 1}
        aria-label="Next"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow disabled:opacity-30"
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-white bg-black/50 px-3 py-1 rounded-full">
        {idx + 1} / {media.length}
      </div>
    </div>
  );
}
