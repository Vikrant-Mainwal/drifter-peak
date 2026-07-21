"use client";

import { useState } from "react";
import { Plus, ShieldCheck, RotateCcw, ShoppingBag, Headphones, Minus } from "lucide-react";
import type { Product } from "@/features/product/types";

type SectionKey = "description" | "specifications" | "shipping" | "reviews";

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: "description", label: "Description" },
  { key: "shipping", label: "Shipping Policy, Return & Exchange" },
  { key: "specifications", label: "Information" },
  { key: "reviews", label: "Reviews" }, // append " (count)" once review data exists
];

// const PERKS = [
//   { icon: RotateCcw, title: "Free Returns & Exchanges", subtitle: "Easy returns & exchanges within 15 days of delivery." },
//   { icon: ShieldCheck, title: "3 Month Guarantee", subtitle: "90-day guarantee against manufacturing defect products." },
// ];

function formatSpecLabel(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ProductAccordionMobile({ product }: { product: Product }) {
  const [openSections, setOpenSections] = useState<Set<SectionKey>>(new Set());

  const toggle = (key: SectionKey) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const specs = product.specs ?? {};
  const specEntries = Object.entries(specs).filter(
    ([, v]) => v != null && v !== "",
  );

  function renderContent(key: SectionKey) {
    switch (key) {
      case "description":
        return product.description ? (
          <p className="text-sm text-neutral-600 leading-relaxed">
            {product.description}
          </p>
        ) : (
          <p className="text-sm text-neutral-400">No description available.</p>
        );

      case "specifications":
        return specEntries.length > 0 ? (
          <div className="space-y-2.5 text-sm">
            {specEntries.map(([k, v]) => (
              <p key={k} className="text-neutral-700 leading-relaxed">
                <span className="font-medium text-neutral-900">
                  {formatSpecLabel(k)}:
                </span>{" "}
                {String(v)}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-400">No information listed.</p>
        );

      case "shipping":
        return (
          <div className="space-y-2.5 text-sm text-neutral-600 leading-relaxed">
            <p>Delivery in 2-4 days. Free shipping on orders above ₹999.</p>
            <p>
              {product.is_returnable
                ? `Returnable within ${product.exchange_window_days ?? 7} days of delivery.`
                : "This item is not eligible for return."}
            </p>
            <p>
              {product.is_exchangeable
                ? `Exchangeable within ${product.exchange_window_days ?? 7} days of delivery.`
                : "This item is not eligible for exchange."}
            </p>
          </div>
        );

      case "reviews":
        return (
          <p className="text-sm text-neutral-400">
            No reviews yet.
          </p>
        );
    }
  }

  return (
    <div className="mt-0 p-2">
      {/* Perks */}
      {/* <div className="space-y-4 pb-5 border-b border-neutral-200">
        {PERKS.map((perk) => {
          const Icon = perk.icon;
          return (
            <div key={perk.title} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-neutral-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">
                  {perk.title}
                </p>
                <p className="text-sm text-neutral-400 leading-snug mt-0.5">
                  {perk.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div> */}

      {/* Accordion sections */}
      <div className="divide-y divide-neutral-200">
        {SECTIONS.map((section) => {
          const isOpen = openSections.has(section.key);
          return (
            <div key={section.key}>
              <button
                onClick={() => toggle(section.key)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between py-4 text-left"
              >
                <span className="text-[15px] font-semibold text-neutral-900">
                  {section.label}
                </span>
                {isOpen ? (
                  <span className="w-6 h-6 rounded-full border border-neutral-300 flex items-center justify-center shrink-0">
                    <Minus className="w-3.5 h-3.5 text-neutral-600" />
                  </span>
                ) : (
                  <Plus className="w-4 h-4 text-neutral-400 shrink-0" />
                )}
              </button>

              <div
                className={`grid overflow-hidden transition-all duration-200 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="pb-5">
                    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                      {renderContent(section.key)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}