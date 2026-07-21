"use client";

import Image from "next/image";
import { useState } from "react";
import { ZoomIn } from "lucide-react";
import type { ProductMedia } from "@/features/product/types";

interface DesktopStackProps {
  media: ProductMedia[];
  productTitle: string;
  onImageClick: (index: number) => void;
}

export default function DesktopStack({
  media,
  productTitle,
  onImageClick,
}: DesktopStackProps) {
  const [activeIdx, setActiveIdx] = useState(0);

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
      <div className="relative flex-1 aspect-[4/5] bg-neutral-100 rounded-lg overflow-hidden" onClick={() => onImageClick(activeIdx)}>
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
          onClick={() => onImageClick(activeIdx)}
          aria-label="Zoom image"
          className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center hover:bg-neutral-50"
        >
          <ZoomIn className="w-4 h-4 text-neutral-700" />
        </button>
      </div>
    </div>
  );
}