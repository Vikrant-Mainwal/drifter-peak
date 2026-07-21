'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const goPrev = () => setSelectedIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const goNext = () => setSelectedIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  const handleTouchStart = (e: React.TouchEvent) => setTouchStartX(e.touches[0].clientX);

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) > 50) {
      deltaX > 0 ? goPrev() : goNext();
    }
    setTouchStartX(null);
  };

  return (
    <>
      <div className="flex flex-col-reverse md:flex-row gap-4">
        {/* Thumbnails */}
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto">
          {images.map((img, index) => (
            <button
              key={img + index}
              onClick={() => setSelectedIndex(index)}
              className={`relative shrink-0 w-16 h-20 md:w-20 md:h-24 rounded-md overflow-hidden border-2 transition-colors ${
                selectedIndex === index ? 'border-black' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image src={img} alt={`${productName} thumbnail ${index + 1}`} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>

        {/* Main image — click opens lightbox */}
        <div
          className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 cursor-zoom-in"
          onClick={() => setIsLightboxOpen(true)}
        >
          <Image
            src={images[selectedIndex]}
            alt={`${productName} - image ${selectedIndex + 1}`}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-white/90 flex items-center justify-center"
          onClick={() => setIsLightboxOpen(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white z-10"
            aria-label="Close"
          >
            <X size={28} />
          </button>

          {/* Arrows — desktop/pointer devices only */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="hidden md:flex absolute left-4 text-white"
            aria-label="Previous image"
          >
            <ChevronLeft size={32} />
          </button>

          <div
            className="relative w-[85vw] md:w-[80vw] max-w-md aspect-[3/4]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedIndex]}
              alt={`${productName} - image ${selectedIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="hidden md:flex absolute right-4 text-white"
            aria-label="Next image"
          >
            <ChevronRight size={32} />
          </button>

          {/* Dots — shown on all screen sizes */}
          <div className="absolute bottom-6 flex gap-1.5">
            {images.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${i === selectedIndex ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}