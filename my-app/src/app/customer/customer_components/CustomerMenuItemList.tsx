import React from "react";
import { LayoutGrid, Search, ChevronLeft, ChevronRight } from "lucide-react";
import type { AppMenuItem } from "@/types/appTypes";
import { MenuItemCardBox } from "@/app/customer/customer_components/MenuItemCardBox";

interface CustomerMenuItemListProps {
  selectedCategory: string;
  filteredItems: AppMenuItem[];
  paginatedItems: AppMenuItem[];
  cartQtyMap: Map<string, number>;
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  onAddToCart: (itemId: string) => void;
  onUpdateQty?: (itemId: string, delta: number) => void;
  resetFilters: () => void;
  isLoading?: boolean;
}

export function CustomerMenuItemList({
  selectedCategory,
  filteredItems,
  paginatedItems,
  cartQtyMap,
  currentPage,
  totalPages,
  setCurrentPage,
  onAddToCart,
  onUpdateQty,
  resetFilters,
  isLoading,
}: CustomerMenuItemListProps) {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex items-center justify-between border-b border-border/50 pb-2">
        <div className="flex items-center gap-2 text-text-primary">
          <LayoutGrid size={18} className="text-success" />
          <h2 className="font-extrabold text-sm sm:text-base">
            {selectedCategory === "ALL" ? "All Dishes" : selectedCategory}
          </h2>
        </div>
        <span className="text-xs font-bold text-text-muted">
          Showing {filteredItems.length} dish{filteredItems.length !== 1 ? "es" : ""}
        </span>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col rounded-3xl border border-border bg-card p-3 shadow-xs h-[180px]">
              <div className="skeleton h-28 w-full rounded-2xl"></div>
              <div className="skeleton h-4 w-3/4 mt-3 rounded"></div>
              <div className="skeleton h-4 w-1/2 mt-2 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-text-muted">
          <Search size={18} className="mb-3 opacity-40" />
          <h3 className="font-bold text-base text-text-primary">No Menu Items Found</h3>
          <p className="text-xs text-text-muted mt-1 max-w-xs">
            Try resetting your search query or dietary filters to view the full menu.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-text-primary hover:bg-page transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          {/* Grid Box Cards Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {paginatedItems.map((item) => (
              <MenuItemCardBox
                key={item.id}
                item={item}
                cartQty={cartQtyMap.get(item.id) || 0}
                onAdd={onAddToCart}
                onUpdateQty={onUpdateQty}
              />
            ))}
          </div>

          {/* Pagination Controls Bar */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card p-3 sm:p-4 shadow-xs mt-4">
              <span className="text-xs font-bold text-text-secondary">
                Page <strong className="text-text-primary">{currentPage}</strong> of{" "}
                <strong className="text-text-primary">{totalPages}</strong> ({filteredItems.length} total items)
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 text-xs font-bold text-text-primary hover:bg-page disabled:opacity-40 disabled:pointer-events-none transition-all"
                >
                  <ChevronLeft size={18} />
                  <span>Prev</span>
                </button>

                {/* Page Number Buttons */}
                <div className="flex items-center gap-1 overflow-x-auto">
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pNum = idx + 1;
                    return (
                      <button
                        key={pNum}
                        type="button"
                        onClick={() => setCurrentPage(pNum)}
                        className={`h-7 w-7 rounded-lg text-xs font-extrabold transition-all ${
                          currentPage === pNum
                            ? "bg-success text-white shadow-xs"
                            : "border border-border text-text-secondary hover:text-text-primary hover:border-success"
                        }`}
                      >
                        {pNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 text-xs font-bold text-text-primary hover:bg-page disabled:opacity-40 disabled:pointer-events-none transition-all"
                >
                  <span>Next</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
