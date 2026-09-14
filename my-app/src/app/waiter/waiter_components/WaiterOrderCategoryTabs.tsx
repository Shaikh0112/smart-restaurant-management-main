// RESPONSIBILITY: Category tabs navigation for the Order Modal.
"use client";
import { CATEGORY_TABS } from "../waiter_utils/waiter_constants";

export function WaiterOrderCategoryTabs({
  activeCategory,
  onSelectCategory,
}: {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORY_TABS.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelectCategory(cat)}
          className={[
            "whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold transition-all",
            activeCategory === cat
              ? "bg-primary text-white shadow-sm"
              : "border border-border bg-page text-text-secondary hover:border-primary/50 hover:text-text-primary",
          ].join(" ")}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
