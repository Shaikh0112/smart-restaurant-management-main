"use client";
// RESPONSIBILITY: Generic Pagination Component for all data tables
// DATA FLOW: Parent Component -> TablePagination -> Updates state or URL

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (items: number) => void;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalItems === 0) return null;

  return (
    <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-card">
      <div className="flex items-center gap-4 text-small text-text-secondary">
        <span>
          Showing <span className="font-medium text-text-primary">{startItem}</span> to{" "}
          <span className="font-medium text-text-primary">{endItem}</span> of{" "}
          <span className="font-medium text-text-primary">{totalItems}</span> results
        </span>
        
        {onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="bg-input border border-border rounded px-1.5 py-0.5 text-text-primary outline-none focus:border-primary-hover"
            >
              {[10, 20, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 rounded-md border border-border hover:bg-border/50 disabled:opacity-50 disabled:cursor-not-allowed motion-safe:transition-colors text-text-secondary hover:text-text-primary"
        >
          <ChevronLeft size={16} strokeWidth={2} />
        </button>
        <div className="flex items-center gap-1 text-small">
          <span className="font-medium px-2">{currentPage}</span>
          <span className="text-text-secondary">/ {totalPages || 1}</span>
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1 rounded-md border border-border hover:bg-border/50 disabled:opacity-50 disabled:cursor-not-allowed motion-safe:transition-colors text-text-secondary hover:text-text-primary"
        >
          <ChevronRight size={16} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};
