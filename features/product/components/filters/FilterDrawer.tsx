"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { FilterCategory } from "../../types";

const FILTERS: { label: string; value: FilterCategory }[] = [
  { label: "All", value: "all" },
  { label: "Men", value: "men" },
  { label: "Women", value: "women" },
  { label: "Accessories", value: "accessories" },
];

type Props = {
  open: boolean;
  onClose: () => void;
  activeCategory: FilterCategory;
  onCategoryChange: (category: FilterCategory) => void;
};

export function FilterDrawer({ open, onClose, activeCategory, onCategoryChange }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!open || !mounted) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />

      <div
        className="fixed z-50 bg-white shadow-xl overflow-y-auto
          inset-x-0 bottom-0 rounded-t-2xl max-h-[80vh]
          md:inset-y-0 md:right-0 md:left-auto md:rounded-none md:w-96 md:max-h-none"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h3 className="text-base font-semibold text-gray-900">Filters</h3>
          <button onClick={onClose} aria-label="Close filters" className="p-1 text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-4 space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Category</h4>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => onCategoryChange(filter.value)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-150 ${
                    activeCategory === filter.value
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4">
          <button
            onClick={onClose}
            className="w-full bg-gray-900 text-white text-sm font-medium py-3 rounded-full hover:bg-gray-800 transition-colors duration-150"
          >
            Show results
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}