"use client";

import { useState } from "react";
import { CategoryFilter } from "./CategoryFilter";
import { SortDropdown } from "./SortDropdown";
import { FilterDrawer } from "./FilterDrawer";
import { FilterCategory, SortOption } from "../../types";

type Props = {
  activeCategory: FilterCategory;
  onCategoryChange: (category: FilterCategory) => void;
  activeSort: SortOption;
  onSortChange: (sort: SortOption) => void;
};

export function FilterBar({ activeCategory, onCategoryChange, activeSort, onSortChange }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex items-center justify-between gap-3">
      {/* <CategoryFilter active={activeCategory} onChange={onCategoryChange} /> */}

      <div className="flex items-center gap-2 flex-shrink-0">
        <SortDropdown active={activeSort} onChange={onSortChange} />

        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="More filters"
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-150"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 8h12M10 12h4M11 16h2" />
          </svg>
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeCategory={activeCategory}
        onCategoryChange={onCategoryChange}
      />
    </div>
  );
}