"use client";

import { useState } from "react";
import type { ProductMedia } from "@/features/product/types";
import DesktopStack from "./media-gallery/DesktopStack";
import MobileSlider from "./media-gallery/MobileSlider";
import Lightbox from "./media-gallery/Lightbox";
import { createPortal } from "react-dom";

interface Props {
  media: ProductMedia[];
  productTitle: string;
}

export default function MediaGallery({ media, productTitle }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  return (
    <div>
      <DesktopStack
        media={media}
        productTitle={productTitle}
        onImageClick={setLightboxIdx}
      />
      <MobileSlider
        media={media}
        productTitle={productTitle}
        onImageClick={setLightboxIdx}
      />

      {lightboxIdx !== null &&
        typeof document !== "undefined" &&
        createPortal(                        // ← this wrapping call
          <Lightbox
            media={media}
            productTitle={productTitle}
            startIdx={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
          />,
          document.body
        )}
    </div>
  );
}