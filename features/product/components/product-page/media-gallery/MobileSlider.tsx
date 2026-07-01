"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  memo,
  TouchEvent,
} from "react";
import Image from "next/image";
import { Heart, Share2, ChevronRight, ChevronLeft } from "lucide-react";

// Types

interface ProductMedia {
  id: string;
  url: string;
  media_type: "image" | "video";
}

interface MobileSliderProps {
  media: ProductMedia[];
  productTitle: string;
  loop?: boolean;
  isWishlisted?: boolean;
  onSlideChange?: (index: number) => void;
  onImageClick?: (index: number) => void;
  onWishlistToggle?: () => void;
  onShare?: () => void;
}

// Constants

const SWIPE_THRESHOLD = 50;
const TRANSITION_MS = 280;
const SLIDE_GAP_PX = 1;

// Swipe gesture hook
function useSwipe({
  slideCount,
  activeIdx,
  onCommit,
}: {
  slideCount: number;
  activeIdx: number;
  onCommit: (nextIdx: number) => void;
}) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startX = useRef(0);
  const startY = useRef(0);
  const currentX = useRef(0);
  const axisLocked = useRef<"x" | "y" | null>(null);

  const onTouchStart = useCallback((e: TouchEvent) => {
    const t = e.touches[0];
    startX.current = t.clientX;
    startY.current = t.clientY;
    currentX.current = t.clientX;
    axisLocked.current = null;
    setIsDragging(true);
  }, []);

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      const t = e.touches[0];
      const dx = t.clientX - startX.current;
      const dy = t.clientY - startY.current;

      if (axisLocked.current === null) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        axisLocked.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }

      if (axisLocked.current === "y") return;

      e.preventDefault();
      currentX.current = t.clientX;

      const atStart = activeIdx === 0 && dx > 0;
      const atEnd = activeIdx === slideCount - 1 && dx < 0;
      const resisted = atStart || atEnd ? dx / 3 : dx;

      setDragOffset(resisted);
    },
    [activeIdx, slideCount],
  );

  const onTouchEnd = useCallback(() => {
    setIsDragging(false);

    if (axisLocked.current !== "x") {
      setDragOffset(0);
      return;
    }

    const dx = currentX.current - startX.current;

    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      const direction = dx < 0 ? 1 : -1;
      onCommit(activeIdx + direction);
    }
    setDragOffset(0);
  }, [activeIdx, onCommit]);

  return {
    dragOffset,
    isDragging,
    handlers: { onTouchStart, onTouchMove, onTouchEnd },
  };
}

// Single slide
const Slide = memo(function Slide({
  item,
  index,
  isActive,
  isAdjacent,
  productTitle,
  onClick,
}: {
  item: ProductMedia;
  index: number;
  isActive: boolean;
  isAdjacent: boolean;
  productTitle: string;
  onClick: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isActive) videoRef.current?.pause();
  }, [isActive]);

  const shouldLoad = isActive || isAdjacent;

  return (
    <div
      className="relative w-full flex-shrink-0 bg-neutral-100"
      style={{
        aspectRatio: "4 / 5",
        marginLeft: index === 0 ? 0 : SLIDE_GAP_PX / 2,
        marginRight: SLIDE_GAP_PX / 2,
      }}
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of slide`}
      aria-hidden={!isActive}
      onClick={onClick}
    >
      {!shouldLoad ? null : item.media_type === "video" ? (
        <video
          ref={videoRef}
          src={item.url}
          controls
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        item.url && (
          <Image
            src={item.url}
            alt={`${productTitle} — view ${index + 1}`}
            fill
            priority={index === 0}
            className="object-cover"
            sizes="100vw"
            draggable={false}
          />
        )
      )}
    </div>
  );
});

// Main slider
function MobileSlider({
  media,
  productTitle,
  loop = false,
  isWishlisted = false,
  onSlideChange,
  onImageClick,
  onWishlistToggle,
  onShare,
}: MobileSliderProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  const commitSlide = useCallback(
    (nextIdx: number) => {
      let clamped = nextIdx;
      if (loop) {
        clamped = (nextIdx + media.length) % media.length;
      } else {
        clamped = Math.max(0, Math.min(media.length - 1, nextIdx));
      }
      setActiveIdx(clamped);
      onSlideChange?.(clamped);
    },
    [loop, media.length, onSlideChange],
  );

  const { dragOffset, isDragging, handlers } = useSwipe({
    slideCount: media.length,
    activeIdx,
    onCommit: commitSlide,
  });

  const goTo = useCallback((idx: number) => commitSlide(idx), [commitSlide]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") commitSlide(activeIdx + 1);
      if (e.key === "ArrowLeft") commitSlide(activeIdx - 1);
    },
    [activeIdx, commitSlide],
  );

  if (!media.length) {
    return (
      <div className="md:hidden flex aspect-[4/5] w-full items-center justify-center bg-neutral-100 text-sm text-neutral-400">
        No media
      </div>
    );
  }

  const containerWidth = trackRef.current?.clientWidth || 1;
  const dragPercent = (dragOffset / containerWidth) * 100;
  const translateX = -(activeIdx * 100) + dragPercent;

  const canGoPrev = loop || activeIdx > 0;
  const canGoNext = loop || activeIdx < media.length - 1;

  return (
    <div
      className="md:hidden relative h-[500px] overflow-hidden"
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${productTitle} image gallery`}
      onKeyDown={onKeyDown}
    >
      <div
        ref={trackRef}
        className="flex"
        style={{
          transform: `translate3d(${translateX}%, 0, 0)`,
          transition:
            isDragging || prefersReducedMotion.current
              ? "none"
              : `transform ${TRANSITION_MS}ms ease-out`,
          willChange: "transform",
        }}
        {...handlers}
      >
        {media.map((item, i) => (
          <Slide
            key={item.id}
            item={item}
            index={i}
            isActive={i === activeIdx}
            isAdjacent={Math.abs(i - activeIdx) === 1}
            productTitle={productTitle}
            onClick={() => onImageClick?.(i)}
          />
        ))}
      </div>

      {/* Top-right action icons: share + wishlist */}
      <div className="absolute -top-2 -right-0 flex flex-col gap-2 z-10">
        <button
          aria-label="Share product"
          onClick={onShare}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm active:scale-95 transition-transform"
        >
          <Share2 className="h-4 w-4 text-neutral-700" strokeWidth={2} />
        </button>
        <button
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={onWishlistToggle}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm active:scale-95 transition-transform"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-neutral-700"
            }`}
            strokeWidth={2}
          />
        </button>
      </div>

      {/* Small next/prev chevrons, e.g. for tap-to-advance on larger screens */}
      <div className="">
        {media.length > 1 && (
          <div className="flex gap-3">
            <div>
              {canGoPrev && (
                <button
                  aria-label="Previous image"
                  onClick={() => commitSlide(activeIdx - 1)}
                  className="absolute -right-3 -translate-y-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm active:scale-95 transition-transform"
                >
                  <ChevronLeft className="h-4 w-4 text-neutral-800" />
                </button>
              )}
            </div>
            <div>
              {canGoNext && (
                <button
                  aria-label="Next image"
                  onClick={() => commitSlide(activeIdx + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm active:scale-95 transition-transform"
                >
                  <ChevronRight className="h-4 w-4 text-neutral-800" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Numeric counter - modern, minimal, stays out of the way */}
      <div className="w-full flex justify-center">
        {media.length > 1 && (
          <div className="absolute z-10 rounded-full px-2.5 py-1 text-xs font-medium text-gray-800 backdrop-blur-sm">
            {activeIdx + 1} / {media.length}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(MobileSlider);
