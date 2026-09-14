import React from "react";
import type { CustomerDietaryFilter } from "@/app/customer/customer_types/CustomerTypes";
import { DIETARY_TABS } from "@/app/customer/customer_hooks/useCustomerMenuFilter";

interface CustomerMenuCategoryTabsProps {
  categoriesList: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  dietaryFilter: CustomerDietaryFilter;
  setDietaryFilter: (filter: CustomerDietaryFilter) => void;
}

export function CustomerMenuCategoryTabs({
  categoriesList,
  selectedCategory,
  setSelectedCategory,
  dietaryFilter,
  setDietaryFilter,
}: CustomerMenuCategoryTabsProps) {
  return (
    <>
      {/* Category Carousel Pills */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1 pb-0.5">
        {categoriesList.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                isSelected
                  ? "bg-text-primary text-page shadow-xs"
                  : "border border-border/70 bg-card text-text-secondary hover:border-text-primary hover:text-text-primary"
              }`}
            >
              {cat === "ALL" ? "All Categories" : cat}
            </button>
          );
        })}
      </div>

      {/* Dietary Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {DIETARY_TABS.map((tab) => {
          const isSelected = dietaryFilter === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setDietaryFilter(tab.value)}
              className={`shrink-0 rounded-full px-3.5 py-1 text-xs font-bold transition-all active:scale-95 ${
                isSelected
                  ? "bg-success text-white shadow-xs"
                  : "border border-border/70 bg-card text-text-secondary hover:border-success hover:text-success"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
