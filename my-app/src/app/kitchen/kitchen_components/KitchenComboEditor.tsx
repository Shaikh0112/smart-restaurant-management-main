// @ts-nocheck
"use client";

// RESPONSIBILITY: Combo and Happy Hours editor for the Kitchen Menu page.
// Lists existing combos with edit/delete. Add combo form: name + multi-select items + comboPrice.
// Happy Hours toggle: start + end time inputs per combo.
// DATA FLOW: useKitchenMenu → admin/menu/page.tsx → KitchenComboEditor → onAdd/onUpdate/onDelete

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Clock, Pencil } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import type { AppCombo } from "@/types/appTypes";
import type { KitchenComboEditorProps } from "@/app/kitchen/kitchen_types/KitchenTypes";
import { KitchenComboFormSchema, KitchenComboFormValues } from "../kitchen_types/kitchenCombo.form.schema";

// ─── Constants (Rule 35: No magic strings) ────────────────────────────────────

const EMPTY_COMBO_FORM = {
  name:           "",
  requiredItemIds: [] as string[],
  comboPrice:     0,
  happyHourStart: null as string | null,
  happyHourEnd:   null as string | null,
} as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

// RESPONSIBILITY: Single combo row with edit/delete actions.
interface ComboRowProps {
  combo:     AppCombo;
  itemNames: string;
  onEdit:    () => void;
  onDelete:  () => void;
}

function ComboRow({ combo, itemNames, onEdit, onDelete }: ComboRowProps) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
      <div className="flex flex-col gap-0.5">
        <p className="text-[13px] font-semibold text-text-primary">{combo.name}</p>
        <p className="text-[11px] text-text-secondary">{itemNames}</p>
        <p className="text-[12px] font-medium text-primary">{formatCurrency(combo.comboPrice)}</p>
        {combo.happyHourStart && combo.happyHourEnd && (
          <div className="flex items-center gap-1 text-[11px] text-warning">
            <Clock size={11} />
            <span>Happy Hours: {combo.happyHourStart} – {combo.happyHourEnd}</span>
          </div>
        )}
      </div>
      <div className="flex gap-1.5 shrink-0">
        <button
          onClick={onEdit}
          className="rounded-lg p-1.5 text-text-secondary hover:bg-info-bg hover:text-info transition-colors"
          aria-label={`Edit ${combo.name}`}
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={onDelete}
          className="rounded-lg p-1.5 text-text-secondary hover:bg-danger-bg hover:text-danger transition-colors"
          aria-label={`Delete ${combo.name}`}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * Combo + Happy Hours editor.
 * Add form at bottom, existing combos listed above.
 * Multi-select for required items, optional happy hour time range.
 */
export function KitchenComboEditor({
  combos,
  menuItems,
  onAdd,
  onUpdate,
  onDelete,
}: KitchenComboEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<KitchenComboFormValues>({
    resolver: zodResolver(KitchenComboFormSchema),
    defaultValues: {
      name: "",
      requiredItemIds: [],
      comboPrice: 0,
      happyHourEnabled: false,
      happyHourStart: null,
      happyHourEnd: null,
    },
  });

  const watchRequiredItemIds = watch("requiredItemIds");
  const watchHappyHourEnabled = watch("happyHourEnabled");

  function handleItemToggle(itemId: string) {
    const current = watchRequiredItemIds || [];
    if (current.includes(itemId)) {
      setValue("requiredItemIds", current.filter((id) => id !== itemId), { shouldValidate: true });
    } else {
      setValue("requiredItemIds", [...current, itemId], { shouldValidate: true });
    }
  }

  function handleEditClick(combo: AppCombo) {
    setEditingId(combo.id);
    reset({
      name: combo.name,
      requiredItemIds: combo.requiredItemIds,
      comboPrice: combo.comboPrice,
      happyHourEnabled: combo.happyHourStart !== null,
      happyHourStart: combo.happyHourStart,
      happyHourEnd: combo.happyHourEnd,
    });
  }

  const onSubmit = (data: KitchenComboFormValues) => {
    const payload = {
      name: data.name.trim(),
      requiredItemIds: data.requiredItemIds,
      comboPrice: data.comboPrice,
      happyHourStart: data.happyHourEnabled ? data.happyHourStart : null,
      happyHourEnd: data.happyHourEnabled ? data.happyHourEnd : null,
    };

    if (editingId) {
      onUpdate(editingId, payload);
    } else {
      onAdd(payload);
    }

    reset();
    setEditingId(null);
  };

  function handleCancel() {
    reset();
    setEditingId(null);
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Existing combos list */}
      {combos.length === 0 ? (
        <p className="text-[12px] text-text-disabled">No combos created yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {combos.map((combo) => {
            const itemNames = combo.requiredItemIds
              .map((id: string) => menuItems.find((m) => m.id === id)?.name ?? id)
              .join(" + ");
            return (
              <ComboRow
                key={combo.id}
                combo={combo}
                itemNames={itemNames}
                onEdit={() => handleEditClick(combo)}
                onDelete={() => onDelete(combo.id, combo.name)}
              />
            );
          })}
        </div>
      )}

      {/* Add / Edit form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-text-secondary">
          {editingId ? "Edit Combo" : "New Combo"}
        </p>

        {/* Combo name */}
        <div>
          <input
            {...register("name")}
            placeholder="Combo name e.g. Thali Combo"
            className={`w-full rounded-lg border bg-input px-3 py-2 text-[13px] text-text-primary placeholder:text-text-disabled focus:outline-none ${errors.name ? "border-danger focus:border-danger" : "border-border focus:border-primary"}`}
          />
          {errors.name && <span className="text-[10px] text-danger">{errors.name.message}</span>}
        </div>

        {/* Combo price */}
        <div>
          <input
            {...register("comboPrice", { valueAsNumber: true })}
            type="number"
            min={0}
            step="0.01"
            placeholder="Combo price (₹)"
            className={`w-full rounded-lg border bg-input px-3 py-2 text-[13px] text-text-primary placeholder:text-text-disabled focus:outline-none ${errors.comboPrice ? "border-danger focus:border-danger" : "border-border focus:border-primary"}`}
          />
          {errors.comboPrice && <span className="text-[10px] text-danger">{errors.comboPrice.message}</span>}
        </div>

        {/* Item multi-select */}
        <div className="flex flex-col gap-1">
          <p className="text-[11px] text-text-secondary">Select Items *</p>
          <div className={`flex max-h-36 flex-col gap-1 overflow-y-auto rounded-lg border bg-input p-2 ${errors.requiredItemIds ? "border-danger" : "border-border"}`}>
            {menuItems.map((item) => (
              <label key={item.id} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={watchRequiredItemIds?.includes(item.id) || false}
                  onChange={() => handleItemToggle(item.id)}
                  className="h-3.5 w-3.5 accent-primary"
                />
                <span className="text-[12px] text-text-primary">{item.name}</span>
                <span className="ml-auto text-[11px] text-text-secondary">
                  {formatCurrency(item.price)}
                </span>
              </label>
            ))}
          </div>
          {errors.requiredItemIds && <span className="text-[10px] text-danger">{errors.requiredItemIds.message}</span>}
        </div>

        {/* Happy Hours toggle */}
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            {...register("happyHourEnabled")}
            className="h-4 w-4 accent-primary"
          />
          <Clock size={13} className="text-warning" />
          <span className="text-[13px] text-text-primary">Enable Happy Hours</span>
        </label>
        {errors.happyHourEnabled && <span className="text-[10px] text-danger">{errors.happyHourEnabled.message}</span>}

        {watchHappyHourEnabled && (
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-text-secondary">Start</label>
              <input
                type="time"
                {...register("happyHourStart")}
                className={`rounded-lg border bg-input px-3 py-2 text-[12px] text-text-primary focus:outline-none ${errors.happyHourStart ? "border-danger" : "border-border"}`}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-text-secondary">End</label>
              <input
                type="time"
                {...register("happyHourEnd")}
                className={`rounded-lg border bg-input px-3 py-2 text-[12px] text-text-primary focus:outline-none ${errors.happyHourEnd ? "border-danger" : "border-border"}`}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 rounded-xl border border-border py-2.5 text-[13px] font-semibold text-text-secondary hover:bg-page transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-[13px] font-semibold text-white hover:bg-primary-hover transition-colors"
          >
            <Plus size={14} />
            {editingId ? "Update Combo" : "Add Combo"}
          </button>
        </div>
      </form>
    </div>
  );
}
