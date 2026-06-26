"use client";

// Shown only on mobile (md:hidden via Tailwind).
// On tap it scrolls to the size selector so user can pick a size,
// then the real CTA inside ProductDetails handles the cart action.
// Remove this file and the pb-32 padding once cart is wired up
// and you replace this with an actual add-to-cart call.

export default function MobileStickyBar() {
  function handleTap() {
    const el = document.getElementById("size-selector");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      // no size selector — scroll to CTA directly
      const cta = document.getElementById("product-cta");
      cta?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 px-4 py-3 z-30">
      <button
        onClick={handleTap}
        className="w-full bg-neutral-900 text-white py-4 rounded text-sm font-semibold tracking-[0.1em]"
      >
        ADD TO CART
      </button>
    </div>
  );
}