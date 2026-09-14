// RESPONSIBILITY: Presentation component for AdminComboRow.
// DATA FLOW: Props -> Component -> UI

import { Clock, Pencil, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import type { AppCombo } from "@/types/appTypes";

export interface ComboRowProps {
  combo:     AppCombo;
  itemNames: string;
  onEdit:    () => void;
  onDelete:  () => void;
}

export function AdminComboRow({ combo, itemNames, onEdit, onDelete }: ComboRowProps) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
      <div className="flex flex-col gap-0.5">
        <p className="text-[13px] font-semibold text-text-primary">{combo.name}</p>
        <p className="text-[11px] text-text-secondary">{itemNames}</p>
        <p className="text-[12px] font-medium text-primary">{formatCurrency(combo.comboPrice)}</p>
        {combo.happyHourStart && combo.happyHourEnd && (
          <div className="flex items-center gap-1 text-[11px] text-warning">
            <Clock size={11} />
            <span>Happy Hours: {combo.happyHourStart} --- {combo.happyHourEnd}</span>
          </div>
        )}
      </div>
      <div className="flex gap-1.5 shrink-0">
        <button
          onClick={onEdit}
          className="rounded-lg p-1.5 text-text-secondary hover:bg-info-bg hover:text-info motion-safe:transition-colors"
          aria-label={`Edit ${combo.name}`}
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={onDelete}
          className="rounded-lg p-1.5 text-text-secondary hover:bg-danger-bg hover:text-danger motion-safe:transition-colors"
          aria-label={`Delete ${combo.name}`}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
