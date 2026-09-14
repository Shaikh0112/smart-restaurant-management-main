// RESPONSIBILITY: Modal for adding new inventory items.
// Uses react-hook-form and zod for robust client-side validation.

import React, { useEffect } from "react";
import { X, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AppInventoryItem, StockUnit } from "@/types/appTypes";
import type { KitchenInventoryFormValues } from "../kitchen_types/kitchenInventory.form.schema";
import { KitchenInventoryFormSchema } from "../kitchen_types/kitchenInventory.form.schema";

interface KitchenAddInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<AppInventoryItem, "id"> & { category?: string; station?: string }) => void;
}

export function KitchenAddInventoryModal({ isOpen, onClose, onAdd }: KitchenAddInventoryModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<KitchenInventoryFormValues>({
    resolver: zodResolver(KitchenInventoryFormSchema),
    defaultValues: {
      name: "",
      category: "RAW_MATERIALS",
      unit: "kg",
      currentStock: undefined,
      threshold: undefined,
      expiryDate: "",
      station: "Kitchen",
    },
  });

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    if (isOpen && isDirty) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isOpen, isDirty]);

  if (!isOpen) return null;

  const onSubmit = (data: KitchenInventoryFormValues) => {
    onAdd({
      name: data.name,
      category: data.category,
      unit: data.unit as StockUnit,
      currentStock: data.currentStock,
      threshold: data.threshold,
      expiryDate: data.expiryDate,
      station: data.station,
    } as Omit<AppInventoryItem, "id"> & { category?: string; station?: string });

    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Block e, +, - from number inputs
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-page/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-bold text-text-primary">Add New Inventory Item</h2>
          <button onClick={handleClose} className="rounded-lg p-2 text-text-secondary hover:bg-page hover:text-text-primary">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Item Name</label>
            <input
              {...register("name")}
              type="text"
              placeholder="e.g. Fresh Paneer"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={`w-full rounded-xl border bg-page px-4 py-2.5 text-sm text-text-primary focus:outline-none ${errors.name ? "border-danger focus:border-danger" : "border-border focus:border-primary"}`}
            />
            {errors.name && <span id="name-error" className="mt-1 text-[10px] text-danger">{errors.name.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Category</label>
              <select
                {...register("category")}
                className="w-full rounded-xl border border-border bg-page px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none"
              >
                <option value="RAW_MATERIALS">Raw Materials</option>
                <option value="DAIRY">Dairy</option>
                <option value="PRODUCE">Produce</option>
                <option value="MEAT">Meat</option>
                <option value="BEVERAGES">Beverages</option>
                <option value="PACKAGING">Packaging</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Unit</label>
              <select
                {...register("unit")}
                className="w-full rounded-xl border border-border bg-page px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none"
              >
                <option value="kg">kg</option>
                <option value="ltr">ltr</option>
                <option value="pcs">pcs</option>
                <option value="gm">gm</option>
                <option value="ml">ml</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Current Stock</label>
              <input
                {...register("currentStock", { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0"
                onKeyDown={handleKeyDown}
                placeholder="e.g. 5"
                aria-invalid={!!errors.currentStock}
                aria-describedby={errors.currentStock ? "stock-error" : undefined}
                className={`w-full rounded-xl border bg-page px-4 py-2.5 text-sm text-text-primary focus:outline-none ${errors.currentStock ? "border-danger focus:border-danger" : "border-border focus:border-primary"}`}
              />
              {errors.currentStock && <span id="stock-error" className="mt-1 text-[10px] text-danger">{errors.currentStock.message}</span>}
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Low Stock Alert at</label>
              <input
                {...register("threshold", { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0"
                onKeyDown={handleKeyDown}
                placeholder="e.g. 2"
                aria-invalid={!!errors.threshold}
                aria-describedby={errors.threshold ? "threshold-error" : undefined}
                className={`w-full rounded-xl border bg-page px-4 py-2.5 text-sm text-text-primary focus:outline-none ${errors.threshold ? "border-danger focus:border-danger" : "border-border focus:border-primary"}`}
              />
              {errors.threshold && <span id="threshold-error" className="mt-1 text-[10px] text-danger">{errors.threshold.message}</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Expiry Date</label>
              <input
                {...register("expiryDate")}
                type="date"
                aria-invalid={!!errors.expiryDate}
                aria-describedby={errors.expiryDate ? "expiry-error" : undefined}
                className={`w-full rounded-xl border bg-page px-4 py-2.5 text-sm text-text-primary focus:outline-none ${errors.expiryDate ? "border-danger focus:border-danger" : "border-border focus:border-primary"}`}
              />
              {errors.expiryDate && <span id="expiry-error" className="mt-1 text-[10px] text-danger">{errors.expiryDate.message}</span>}
            </div>
            <div>
               <label className="mb-1 block text-xs font-bold text-text-secondary uppercase">Station</label>
               <select
                {...register("station")}
                className="w-full rounded-xl border border-border bg-page px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:outline-none"
              >
                <option value="Kitchen">Kitchen</option>
                <option value="Bar">Bar</option>
                <option value="Bakery">Bakery</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-md hover:bg-primary-hover active:scale-95 transition-all disabled:opacity-50"
          >
            <Plus size={18} />
            <span>{isSubmitting ? "Adding..." : "Add Item"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
