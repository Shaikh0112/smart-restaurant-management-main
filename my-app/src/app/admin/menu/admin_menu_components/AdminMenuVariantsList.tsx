"use client";

import { Plus, Trash2 } from "lucide-react";
import type { UseFieldArrayReturn, UseFormRegister } from "react-hook-form";
import type { AdminMenuFormValues } from "@/app/admin/admin_types/AdminTypes";

// RESPONSIBILITY: Renders the variants list for the Menu Item Form.

interface AdminMenuVariantsListProps {
  fields: UseFieldArrayReturn<AdminMenuFormValues, "variants", "id">["fields"];
  append: UseFieldArrayReturn<AdminMenuFormValues, "variants", "id">["append"];
  remove: UseFieldArrayReturn<AdminMenuFormValues, "variants", "id">["remove"];
  register: UseFormRegister<AdminMenuFormValues>;
}

export function AdminMenuVariantsList({ fields, append, remove, register }: AdminMenuVariantsListProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-[12px] font-semibold text-text-secondary">Variants</label>
        <button
          type="button"
          onClick={() => append({ name: "", price: 0 })}
          className="flex items-center gap-1 text-[12px] font-medium text-primary hover:opacity-70"
        >
          <Plus size={13} /> Add Variant
        </button>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <input
            {...register(`variants.${index}.name` as const)}
            placeholder="e.g. Half"
            className="flex-1 rounded-lg border border-border bg-input px-3 py-2 text-[12px] text-text-primary placeholder:text-text-disabled focus:border-border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          <input
            {...register(`variants.${index}.price` as const, { valueAsNumber: true })}
            type="number"
            min={0}
            placeholder="Price"
            className="w-24 rounded-lg border border-border bg-input px-3 py-2 text-[12px] text-text-primary placeholder:text-text-disabled focus:border-border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              onKeyDown={(e) => { if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault(); }} />
          <button
            type="button"
            onClick={() => remove(index)}
            className="rounded-lg p-1.5 text-text-secondary hover:bg-danger-bg hover:text-danger motion-safe:transition-colors"
            aria-label="Remove variant"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
