"use client";

import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { ZoomIn } from "lucide-react";
import type { ProductMedia } from "@/features/product/types";
import MobileSlider from "./media-gallery/MobileSlider";

interface Props {
  media: ProductMedia[];
  productTitle: string;
}

export default function MediaGallery({ media, productTitle }: Props) {
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
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  if (!media.length) {
    return (
      <div className="hidden md:flex w-full aspect-[4/5] bg-neutral-100 items-center justify-center text-neutral-400 text-sm">
        No media
      </div>
    );
  }

  const active = media[activeIdx];
  const isActiveVideo = active.media_type === "video";

  return (
    <>
      <div className="hidden md:flex gap-4">
        {/* Thumbnail rail */}
        <div className="flex flex-col gap-3 w-20 shrink-0 max-h-[520px] overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          {media.map((item, i) => {
            const thumbIsVideo = item.media_type === "video";
            return (
              <button
                key={item.id}
                onClick={() => setActiveIdx(i)}
                aria-label={`View ${thumbIsVideo ? "video" : "image"} ${i + 1}`}
                className={`relative w-full aspect-square rounded-md overflow-hidden bg-neutral-100 border shrink-0 transition-colors duration-150 ${
                  i === activeIdx
                    ? "border-neutral-900"
                    : "border-neutral-200 hover:border-neutral-400"
                }`}
              >
                {thumbIsVideo ? (
                  <video
                    src={item.url}
                    muted
                    playsInline
                    className="w-full h-full object-cover pointer-events-none"
                  />
                ) : (
                  <Image
                    src={item.url}
                    alt={`${productTitle} thumbnail ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Main image */}
        <div className="relative flex-1 aspect-[4/5] bg-neutral-100 rounded-lg overflow-hidden">
          {isActiveVideo ? (
            <video
              src={active.url}
              muted
              playsInline
              controls
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={active.url}
              alt={`${productTitle} — view ${activeIdx + 1}`}
              fill
              priority
              className="object-cover"
              sizes="55vw"
            />
          )}

          <button
            onClick={() => setLightboxIdx(activeIdx)}
            aria-label="Zoom image"
            className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center hover:bg-neutral-50"
          >
            <ZoomIn className="w-4 h-4 text-neutral-700" />
          </button>
        </div>
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
        className="absolute top-20 right-10 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow"
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
