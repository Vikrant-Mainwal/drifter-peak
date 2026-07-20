"use client";

import { useState } from "react";
import { ShieldCheck, RotateCcw, ShoppingBag, Headphones } from "lucide-react";
import type { Product } from "@/features/product/types";

type TabKey = "description" | "specifications" | "shipping" | "reviews";

const TABS: { key: TabKey; label: string }[] = [
  { key: "description", label: "Description" },
  { key: "specifications", label: "Specifications" },
  { key: "shipping", label: "Shipping & Returns" },
  { key: "reviews", label: "Reviews" }, // append " (count)" once review data exists
];

const PERKS = [
  {
    icon: ShieldCheck,
    title: "100% Original Products",
    subtitle: "Quality guaranteed",
  },
  { icon: RotateCcw, title: "7 Days Return", subtitle: "No questions asked" },
  {
    icon: ShoppingBag,
    title: "Secure Payment",
    subtitle: "100% secure checkout",
  },
  { icon: Headphones, title: "24x7 Support", subtitle: "We're here to help" },
];

function formatSpecLabel(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ProductTabs({ product }: { product: Product }) {
  const [active, setActive] = useState<TabKey>("description");
  const specs = product.specs ?? {};
  const specEntries = Object.entries(specs).filter(
    ([, v]) => v != null && v !== "",
  );

  return (
    <div className="mt-12">
      <div className="flex gap-8 border-b border-neutral-200 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`relative pb-3 whitespace-nowrap text-sm font-medium transition-colors duration-150 ${
              active === tab.key
                ? "text-neutral-900"
                : "text-neutral-400 hover:text-neutral-600"
            }`}
          >
            {tab.label}
            {active === tab.key && (
              <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-neutral-900" />
            )}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-[1fr,300px] gap-10 pt-6">
        <div>
          {active === "description" && (
            <>
              {product.description && (
                <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                  {product.description}
                </p>
              )}
              {specEntries.length > 0 && (
                <ul className="space-y-1.5 text-sm text-neutral-700">
                  {specEntries.map(([key, value]) => (
                    <li key={key}>
                      <span className="font-medium">
                        {formatSpecLabel(key)}:
                      </span>{" "}
                      {String(value)}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {active === "specifications" && (
            <>
              {specEntries.length > 0 ? (
                <table className="w-full text-sm max-w-xl">
                  <tbody>
                    {specEntries.map(([key, value]) => (
                      <tr key={key} className="border-b border-neutral-100">
                        <td className="py-2.5 pr-6 text-neutral-400 w-40">
                          {formatSpecLabel(key)}
                        </td>
                        <td className="py-2.5 text-neutral-800">
                          {String(value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-neutral-400">
                  No specifications listed.
                </p>
              )}
            </>
          )}

          {active === "shipping" && (
            <div className="max-w-xl space-y-3 text-sm text-neutral-600 leading-relaxed">
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
          )}

          {active === "reviews" && (
            <p className="text-sm text-neutral-400">
              No reviews yet.
              {/* Replace with real reviews once that table is queried in here */}
            </p>
          )}
        </div>

        <div className="hidden md:block bg-neutral-50 rounded-lg p-5 space-y-5 h-fit">
          {PERKS.map((perk) => {
            const Icon = perk.icon;
            return (
              <div key={perk.title} className="flex items-start gap-3">
                <Icon className="w-5 h-5 text-neutral-700 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    {perk.title}
                  </p>
                  <p className="text-xs text-neutral-400">{perk.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}