"use client";

import { FilterCategory } from "../../types";

const FILTERS: { label: string; value: FilterCategory }[] = [
  { label: "All", value: "all" },
  { label: "Men", value: "men" },
  { label: "Women", value: "women" },
  { label: "Accessories", value: "accessories" },
];

type Props = {
  active: FilterCategory;
  onChange: (category: FilterCategory) => void;
};

export function CategoryFilter({ active, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto scrollbar-none px-4 md:px-0">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onChange(filter.value)}
          className={`
            flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full transition-colors duration-150
            ${
              active === filter.value
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }
          `}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
