"use client";

// RESPONSIBILITY: Combo and Happy Hours editor for the Admin Menu page.
// Lists existing combos with edit/delete. Add combo form: name + multi-select items + comboPrice.
// Happy Hours toggle: start + end time inputs per combo.
// DATA FLOW: useAdminMenu -> admin/menu/page.tsx -> AdminComboEditor -> onAdd/onUpdate/onDelete

import { useState, useEffect } from "react";
import { Plus, Trash2, Clock, Pencil } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { formatCurrency } from "@/lib/formatters";
import type { AppCombo } from "@/types/appTypes";
import type { AdminComboEditorProps } from "@/app/admin/admin_types/AdminTypes";
import { AdminActionDialog } from "@/app/admin/admin_components/AdminActionDialog";
import { AdminComboRow } from "./AdminComboRow";
import { SearchableDropdown } from "@/components/ui/SearchableDropdown";

// --------- Validation Schema ------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const comboSchema = z.object({
  name: z.string().min(2, "Combo name is required"),
  requiredItemIds: z.array(z.string()).min(1, "Select at least one item"),
  comboPrice: z.number().min(0, "Price cannot be negative"),
  happyHourStart: z.string().nullable().optional(),
  happyHourEnd: z.string().nullable().optional(),
});

type ComboFormValues = z.infer<typeof comboSchema>;

// --------- Main Component ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export function AdminComboEditor({
  combos,
  menuItems,
  onAdd,
  onUpdate,
  onDelete,
}: AdminComboEditorProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ComboFormValues>({
    resolver: zodResolver(comboSchema),
    defaultValues: {
      name: "",
      requiredItemIds: [],
      comboPrice: 0,
      happyHourStart: null,
      happyHourEnd: null,
    },
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [happyHoursEnabled, setHappyHoursEnabled] = useState<boolean>(false);

  // Sync happy hours fields when toggle changes
  useEffect(() => {
    if (!happyHoursEnabled) {
      setValue("happyHourStart", null);
      setValue("happyHourEnd", null);
    }
  }, [happyHoursEnabled, setValue]);

  function handleEditClick(combo: AppCombo) {
    setEditingId(combo.id);
    setHappyHoursEnabled(combo.happyHourStart !== null);
    reset({
      name: combo.name,
      requiredItemIds: combo.requiredItemIds,
      comboPrice: combo.comboPrice,
      happyHourStart: combo.happyHourStart,
      happyHourEnd: combo.happyHourEnd,
    });
  }

  function onSubmit(data: ComboFormValues) {
    const payload = {
      name: data.name.trim(),
      requiredItemIds: data.requiredItemIds,
      comboPrice: data.comboPrice,
      happyHourStart: happyHoursEnabled ? (data.happyHourStart ?? null) : null,
      happyHourEnd: happyHoursEnabled ? (data.happyHourEnd ?? null) : null,
    };

    if (editingId) {
      onUpdate(editingId, payload);
    } else {
      onAdd(payload);
    }

    reset();
    setEditingId(null);
    setHappyHoursEnabled(false);
  }

  function handleCancel() {
    reset();
    setEditingId(null);
    setHappyHoursEnabled(false);
  }

  const menuItemOptions = menuItems.map(item => ({
    value: item.id,
    label: `${item.name} (${formatCurrency(item.price)})`,
  }));

  return (
    <div className="flex flex-col gap-5">
      {/* Existing combos list */}
      {combos.length === 0 ? (
        <p className="text-[12px] text-text-disabled">No combos created yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {combos.map((combo) => {
            const itemNames = combo.requiredItemIds
              .map((id) => menuItems.find((m) => m.id === id)?.name ?? id)
              .join(" + ");
            return (
              <AdminComboRow
                key={combo.id}
                combo={combo}
                itemNames={itemNames}
                onEdit={() => handleEditClick(combo)}
                onDelete={() => setDeleteTarget({ id: combo.id, name: combo.name })}
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
            type="text"
            {...register("name")}
            placeholder="Combo name e.g. Thali Combo"
            className="w-full rounded-lg border border-border bg-input px-3 py-2 text-[13px] text-text-primary placeholder:text-text-disabled focus:border-border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
        </div>

        {/* Combo price */}
        <div>
          <input
            type="number"
            min="0"
            step="0.01"
            {...register("comboPrice", { valueAsNumber: true })}
            onKeyDown={(e) => { if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault(); }}
            placeholder="Combo price (---)"
            className="w-full rounded-lg border border-border bg-input px-3 py-2 text-[13px] text-text-primary placeholder:text-text-disabled focus:border-border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          {errors.comboPrice && <p className="mt-1 text-xs text-danger">{errors.comboPrice.message}</p>}
        </div>

        {/* Item multi-select using SearchableDropdown */}
        <div className="flex flex-col gap-1">
          <p className="text-[11px] text-text-secondary">Select Items *</p>
          <Controller
            name="requiredItemIds"
            control={control}
            render={({ field }) => (
              <SearchableDropdown
                options={menuItemOptions}
                value={field.value}
                onChange={field.onChange}
                isMulti={true}
                placeholder="Select menu items..."
              />
            )}
          />
          {errors.requiredItemIds && <p className="text-xs text-danger">{errors.requiredItemIds.message}</p>}
        </div>

        {/* Happy Hours toggle */}
        <label className="mt-2 flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={happyHoursEnabled}
            onChange={(e) => setHappyHoursEnabled(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          <Clock size={13} className="text-warning" />
          <span className="text-[13px] text-text-primary">Enable Happy Hours</span>
        </label>

        {happyHoursEnabled && (
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1 w-full">
              <label className="text-[11px] text-text-secondary">Start</label>
              <input
                type="time"
                {...register("happyHourStart")}
                className="rounded-lg border border-border bg-input px-3 py-2 text-[12px] text-text-primary focus:border-border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label className="text-[11px] text-text-secondary">End</label>
              <input
                type="time"
                {...register("happyHourEnd")}
                className="rounded-lg border border-border bg-input px-3 py-2 text-[12px] text-text-primary focus:border-border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
          </div>
        )}

        <div className="mt-2 flex gap-2">
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="w-full rounded-lg border border-border bg-page px-3 py-2.5 text-[13px] font-semibold text-text-secondary hover:text-text-primary motion-safe:transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2.5 text-[13px] font-bold text-white hover:bg-primary-hover active:scale-95 motion-safe:transition-all"
          >
            <Plus size={15} />
            {editingId ? "Save Changes" : "Add Combo"}
          </button>
        </div>
      </form>

      {deleteTarget && (
        <AdminActionDialog
          itemName={deleteTarget.name}
          title="Delete Combo"
          actionWord="DELETE"
          onConfirm={() => {
            onDelete(deleteTarget.id, deleteTarget.name);
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
