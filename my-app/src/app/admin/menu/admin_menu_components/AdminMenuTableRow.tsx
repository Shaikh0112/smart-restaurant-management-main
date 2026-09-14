// RESPONSIBILITY: Presentation component for AdminMenuTableRow.
// DATA FLOW: Props -> Component -> UI

import { Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import type { AppMenuItem } from "@/types/appTypes";

export interface AdminMenuTableRowProps {
  item: AppMenuItem;
  onEdit: (item: AppMenuItem) => void;
  onDeleteClick: (id: string, name: string) => void;
  onToggleAvailability: (id: string) => void;
}

const STATION_COLORS = {
  Kitchen: "bg-info-bg text-info",
  Bar:     "bg-pay-upi-bg text-pay-upi",
  Bakery:  "bg-warning-bg text-warning",
} as const;

export function AdminMenuTableRow({
  item,
  onEdit,
  onDeleteClick,
  onToggleAvailability,
}: AdminMenuTableRowProps) {
  const stationStyle = STATION_COLORS[item.station] ?? "bg-card text-text-secondary";

  return (
    <tr
      key={item.id}
      className="border-b border-border last:border-0 odd:bg-card even:bg-page hover:bg-primary/5 motion-safe:transition-colors"
    >
      {/* Name */}
      <td className="px-4 py-3">
        <p className="text-[13px] font-medium text-text-primary">{item.name}</p>
        {item.isSpecial && (
          <span className="text-[10px] font-semibold text-warning">--- Special</span>
        )}
      </td>

      {/* Category */}
      <td className="px-4 py-3 text-[12px] text-text-secondary">{item.category}</td>

      {/* Station */}
      <td className="px-4 py-3">
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${stationStyle}`}>
          {item.station}
        </span>
      </td>

      {/* Price */}
      <td className="px-4 py-3 text-[13px] font-medium text-text-primary">
        {formatCurrency(item.price)}
      </td>

      {/* Variants */}
      <td className="px-4 py-3 text-[12px] text-text-secondary">
        {item.variants.length > 0
          ? item.variants.map((v) => v.name).join(", ")
          : "---"}
      </td>

      {/* Available toggle */}
      <td className="px-4 py-3">
        <button
          onClick={() => onToggleAvailability(item.id)}
          aria-label={item.isAvailable ? "Mark unavailable" : "Mark available"}
          className="flex items-center gap-1 text-[12px] font-medium transition-opacity hover:opacity-70"
        >
          {item.isAvailable ? (
            <>
              <CheckCircle size={15} className="text-success" />
              <span className="text-success">Yes</span>
            </>
          ) : (
            <>
              <XCircle size={15} className="text-danger" />
              <span className="text-danger">No</span>
            </>
          )}
        </button>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(item)}
            aria-label={`Edit ${item.name}`}
            className="rounded-lg p-1.5 text-text-secondary hover:bg-info-bg hover:text-info motion-safe:transition-colors"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDeleteClick(item.id, item.name)}
            aria-label={`Delete ${item.name}`}
            className="rounded-lg p-1.5 text-text-secondary hover:bg-danger-bg hover:text-danger motion-safe:transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
