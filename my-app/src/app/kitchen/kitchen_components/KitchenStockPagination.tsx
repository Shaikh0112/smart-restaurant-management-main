// RESPONSIBILITY: Pagination controls for the Kitchen Stock Toggle grid.

import { ChevronLeft, ChevronRight } from "lucide-react";

interface KitchenStockPaginationProps {
  startIndex: number;
  endIndex: number;
  totalItems: number;
  pageSize: number;
  setPageSize: (size: number) => void;
  currentPage: number;
  setCurrentPage: (updater: (p: number) => number) => void;
  totalPages: number;
}

export function KitchenStockPagination({
  startIndex,
  endIndex,
  totalItems,
  pageSize,
  setPageSize,
  currentPage,
  setCurrentPage,
  totalPages,
}: KitchenStockPaginationProps) {
  if (totalItems === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3 shadow-xs">
      <div className="flex items-center gap-3">
        <span className="text-xs text-text-secondary">
          Showing <strong className="text-text-primary">{startIndex + 1}</strong> –{" "}
          <strong className="text-text-primary">{endIndex}</strong> of{" "}
          <strong className="text-text-primary">{totalItems}</strong> items
        </span>

        {/* Items Per Page Selector */}
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <span>Per page:</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="rounded-lg border border-border bg-input px-2 py-1 text-xs font-semibold text-text-primary focus:border-primary focus:outline-none"
          >
            <option value={6}>6</option>
            <option value={8}>8</option>
            <option value={12}>12</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
            currentPage === 1
              ? "border-border/40 bg-page text-text-disabled cursor-not-allowed"
              : "border-border bg-surface text-text-primary hover:bg-surface-hover shadow-xs active:scale-95"
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        <span className="text-xs font-bold text-text-primary px-2">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage >= totalPages}
          className={`flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
            currentPage >= totalPages
              ? "border-border/40 bg-page text-text-disabled cursor-not-allowed"
              : "border-border bg-surface text-text-primary hover:bg-surface-hover shadow-xs active:scale-95"
          }`}
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
