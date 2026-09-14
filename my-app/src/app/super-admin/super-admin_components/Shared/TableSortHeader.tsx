// RESPONSIBILITY: Sortable Table Header cell
// DATA FLOW: Parent Table -> TableSortHeader -> Triggers sort function

import React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

interface TableSortHeaderProps {
  label: string;
  field: string;
  currentSortField?: string;
  currentSortDirection?: "asc" | "desc" | null;
  onSort: (field: string) => void;
  className?: string;
}

export const TableSortHeader: React.FC<TableSortHeaderProps> = ({
  label,
  field,
  currentSortField,
  currentSortDirection,
  onSort,
  className = "",
}) => {
  const isActive = currentSortField === field;

  return (
    <th
      className={`px-6 py-4 cursor-pointer hover:bg-border/30 motion-safe:transition-colors group select-none ${className}`}
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1.5">
        <span>{label}</span>
        <div className="flex flex-col text-text-disabled group-hover:text-text-secondary motion-safe:transition-colors">
          {isActive ? (
            currentSortDirection === "asc" ? (
              <ArrowUp size={12} strokeWidth={2} className="text-text-primary" />
            ) : (
              <ArrowDown size={12} strokeWidth={2} className="text-text-primary" />
            )
          ) : (
            <ArrowUpDown size={12} strokeWidth={2} />
          )}
        </div>
      </div>
    </th>
  );
};
