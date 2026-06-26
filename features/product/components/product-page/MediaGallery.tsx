"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import type { ProductMedia } from "@/features/product/types";

interface Props {
  media: ProductMedia[]; // already sorted by sort_order ASC from Supabase
  productTitle: string;
}

export default function MediaGallery({ media, productTitle }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // The media array is mixed — images and videos together, ordered by sort_order.
  const active = media[activeIdx];
  const isActiveVideo = active?.media_type === "video";

  // When switching to a new thumb, pause any playing video
  function handleThumbClick(idx: number) {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setActiveIdx(idx);
  }

  if (!media.length) {
    return (
      <div className="w-full aspect-[4/5] bg-neutral-100 flex items-center justify-center text-neutral-400 text-sm">
        No media
      </div>
    );
  }

  return (
    <div>
      {/* Hero viewer */}
      <div className="relative w-full aspect-[4/5] bg-neutral-100 overflow-hidden">
        {isActiveVideo ? (
          <video
            ref={videoRef}
            key={active.url} // remount when url changes so it doesn't play old src
            src={active.url}
            controls
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          active?.url && (
            <Image
              src={active.url}
              alt={`${productTitle} — view ${activeIdx + 1}`}
              fill
              priority={activeIdx === 0}
              className="object-cover transition-opacity duration-200"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
          )
        )}
      </div>

      {/* Thumbnail strip (all media mixed) */}
      {media.length > 1 && (
        <div className="grid grid-cols-4 gap-[3px] mt-[3px]">
          {media.map((item, i) => {
            const isVideo = item.media_type === "video";
            const isActive = activeIdx === i;

            return (
              <button
                key={item.id}
                onClick={() => handleThumbClick(i)}
                aria-label={isVideo ? `Video ${i + 1}` : `Image ${i + 1}`}
                className={`relative aspect-square overflow-hidden border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                  isActive ? "border-black" : "border-transparent hover:border-neutral-300"
                }`}
              >
                {isVideo ? (
                  // For video thumbs: show a dark tile with a play icon.
                  // If you later add a poster/thumbnail_url column you can show that here instead.
                  <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white opacity-80"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                ) : (
                  item.url && (
                    <Image
                      src={item.url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 15vw"
                    />
                  )
                )}

                {/* "VID" badge on video thumbnails */}
                {isVideo && (
                  <span className="absolute bottom-1 left-1 text-[9px] font-semibold text-white bg-black/60 px-1 rounded tracking-widest">
                    VID
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}