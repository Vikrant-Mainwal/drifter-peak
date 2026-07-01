"use client";

import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import type { ProductMedia } from "@/features/product/types";
import MobileSlider from "./media-gallery/MobileSlider";

interface Props {
  media: ProductMedia[];
  productTitle: string;
}

export default function MediaGallery({ media, productTitle }: Props) {
  console.log(media);
  return (
    <div>
      <DesktopStack media={media} productTitle={productTitle} />
      <MobileSlider media={media} productTitle={productTitle} />
    </div>
  );
}

function DesktopStack({
  media,
  productTitle,
}: {
  media: ProductMedia[];
  productTitle: string;
}) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  if (!media.length) {
    return (
      <div className="hidden md:flex w-full aspect-[4/5] bg-neutral-100 items-center justify-center text-neutral-400 text-sm">
        No media
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block">
        {media.map((item, i) => {
          const isVideo = item.media_type === "video";
          return (
            <button
              key={item.id}
              onClick={() => setLightboxIdx(i)}
              aria-label={`Open ${isVideo ? "video" : "image"} ${i + 1} full screen`}
              className="relative w-full flex-shrink-0 snap-center bg-neutral-100"
              style={{ paddingTop: "125%" }}
            >
              {isVideo ? (
                <video
                  src={item.url}
                  muted
                  playsInline
                  className="w-full h-full object-cover pointer-events-none"
                />
              ) : (
                <Image
                  src={item.url}
                  alt={`${productTitle} — view ${i + 1}`}
                  fill
                  priority={i === 0}
                  className="object-cover"
                  sizes="60vw"
                />
              )}
            </button>
          );
        })}
      </div>

      {lightboxIdx !== null && (
        <Lightbox
          media={media}
          productTitle={productTitle}
          startIdx={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </>
  );
}

function Lightbox({
  media,
  productTitle,
  startIdx,
  onClose,
}: {
  media: ProductMedia[];
  productTitle: string;
  startIdx: number;
  onClose: () => void;
}) {
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
      className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow"
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

      <div className="flex items-center justify-center w-full h-screen px-20">
        {isVideo ? (
          <video
            src={active.url}
            controls
            className="max-h-[90vh] max-w-[90vw]"
          />
        ) : (
          <Image
            src={active.url}
            alt={productTitle}
            width={1200}
            height={1800}
            className="max-h-[90vh] w-auto h-auto object-contain"
            priority
          />
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