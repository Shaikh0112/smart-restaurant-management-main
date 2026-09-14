// RESPONSIBILITY: Presentation component for AdminAddInventoryModal.
// DATA FLOW: Props -> Component -> UI

import React from "react";
import { X, Plus } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { AppInventoryItem, StockUnit } from "@/types/appTypes";
import { SearchableDropdown } from "@/components/ui/SearchableDropdown";

interface AdminAddInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<AppInventoryItem, "id">) => void;
}

const inventorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.string().min(1, "Category is required"),
  unit: z.enum(["kg", "ltr", "pcs", "gm", "ml"]),
  currentStock: z.number().min(0, "Stock cannot be negative"),
  threshold: z.number().min(0, "Threshold cannot be negative"),
  expiryDate: z.string().min(1, "Expiry date is required"),
});

type InventoryFormValues = z.infer<typeof inventorySchema>;

const CATEGORY_OPTIONS = [
  { value: "RAW_MATERIALS", label: "Raw Materials" },
  { value: "DAIRY", label: "Dairy" },
  { value: "PRODUCE", label: "Produce" },
  { value: "MEAT", label: "Meat" },
  { value: "BEVERAGES", label: "Beverages" },
  { value: "PACKAGING", label: "Packaging" },
];

const UNIT_OPTIONS = [
  { value: "kg", label: "kg" },
  { value: "ltr", label: "ltr" },
  { value: "pcs", label: "pcs" },
  { value: "gm", label: "gm" },
  { value: "ml", label: "ml" },
];

export function AdminAddInventoryModal({ isOpen, onClose, onAdd }: AdminAddInventoryModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      name: "",
      category: "RAW_MATERIALS",
      unit: "kg",
      currentStock: 0,
      threshold: 0,
      expiryDate: "",
    },
  });

  if (!isOpen) return null;

  const onSubmit = (data: InventoryFormValues) => {
    onAdd({
      name: data.name,
      unit: data.unit as StockUnit,
      currentStock: data.currentStock,
      threshold: data.threshold,
      expiryDate: data.expiryDate,
      category: data.category,
    } as Omit<AppInventoryItem, "id">);
    
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-page/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-bold text-text-primary">Add New Inventory Item</h2>
          <button type="button" onClick={handleClose} className="rounded-lg p-2 text-text-secondary hover:bg-page hover:text-text-primary">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Item Name</label>
            <input
              type="text"
              {...register("name")}
              placeholder="e.g. Fresh Paneer"
              className="w-full rounded-xl border border-border bg-page px-4 py-2.5 text-sm text-text-primary focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Category</label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <SearchableDropdown
                    options={CATEGORY_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select Category"
                  />
                )}
              />
              {errors.category && <p className="mt-1 text-xs text-danger">{errors.category.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Unit</label>
              <Controller
                name="unit"
                control={control}
                render={({ field }) => (
                  <SearchableDropdown
                    options={UNIT_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select Unit"
                  />
                )}
              />
              {errors.unit && <p className="mt-1 text-xs text-danger">{errors.unit.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Current Stock</label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("currentStock", { valueAsNumber: true })}
                onKeyDown={(e) => { if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault(); }}
                placeholder="e.g. 5"
                className="w-full rounded-xl border border-border bg-page px-4 py-2.5 text-sm text-text-primary focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
              {errors.currentStock && <p className="mt-1 text-xs text-danger">{errors.currentStock.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Low Stock Alert at</label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("threshold", { valueAsNumber: true })}
                onKeyDown={(e) => { if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault(); }}
                placeholder="e.g. 2"
                className="w-full rounded-xl border border-border bg-page px-4 py-2.5 text-sm text-text-primary focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
              {errors.threshold && <p className="mt-1 text-xs text-danger">{errors.threshold.message}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Expiry Date</label>
            <input
              type="date"
              {...register("expiryDate")}
              className="w-full rounded-xl border border-border bg-page px-4 py-2.5 text-sm text-text-primary focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            {errors.expiryDate && <p className="mt-1 text-xs text-danger">{errors.expiryDate.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-md hover:bg-primary-hover active:scale-95 disabled:opacity-50 motion-safe:transition-all"
          >
            <Plus size={18} />
            <span>Add Item</span>
          </button>
        </form>
      </div>
    </div>
  );
}
