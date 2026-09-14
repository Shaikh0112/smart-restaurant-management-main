// RESPONSIBILITY: Modal form to log spoiled/damaged ingredients for waste tracking.
// Uses react-hook-form and zod for validation.

import React, { useEffect } from "react";
import { X, Trash2, Plus, Minus, AlertTriangle, Flame, Clock, Ban, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { KitchenWasteLogFormValues } from "../kitchen_types/kitchenWaste.form.schema";
import { KitchenWasteLogSchema } from "../kitchen_types/kitchenWaste.form.schema";
import { useKitchenStock } from "@/app/kitchen/kitchen_hooks/useKitchenStock";
import { showToast } from "@/lib/toastService";
import type { KitchenWasteLogModalProps } from "@/app/kitchen/kitchen_types/KitchenTypes";
import { WASTE_REASON_CHIPS } from "@/app/kitchen/kitchen_constants/kitchen_shared_constants";

// Map shared text chips to their respective icons/colors
const REASON_CHIPS = WASTE_REASON_CHIPS.map((reason) => {
  if (reason === "Spoiled") return { label: reason, icon: AlertTriangle, color: "border-amber-500/40 bg-amber-500/10 text-amber-500" };
  if (reason === "Burnt") return { label: reason, icon: Flame, color: "border-orange-500/40 bg-orange-500/10 text-orange-500" };
  if (reason === "Expired") return { label: reason, icon: Clock, color: "border-red-500/40 bg-red-500/10 text-red-500" };
  if (reason === "Order Cancelled") return { label: reason, icon: Ban, color: "border-blue-500/40 bg-blue-500/10 text-blue-500" };
  return { label: reason, icon: AlertTriangle, color: "border-gray-500/40 bg-gray-500/10 text-gray-500" };
});


export function KitchenWasteLogModal({ isOpen, onClose }: KitchenWasteLogModalProps) {
  const { inventoryItems, logWaste } = useKitchenStock();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<KitchenWasteLogFormValues>({
    resolver: zodResolver(KitchenWasteLogSchema),
    defaultValues: {
      ingredientId: "",
      qty: 1,
      selectedReason: "",
      notes: "",
    },
  });

  const watchIngredientId = watch("ingredientId");
  const watchQty = watch("qty");
  const watchReason = watch("selectedReason");

  useEffect(() => {
    if (isOpen) {
      reset({
        ingredientId: "",
        qty: 1,
        selectedReason: "Spoiled",
        notes: "",
      });
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const selectedIngredient = inventoryItems.find((i) => i.id === watchIngredientId);
  const unit = selectedIngredient?.unit ?? "pcs";

  const handleIncrement = () => setValue("qty", parseFloat((watchQty + 1).toFixed(1)));
  const handleDecrement = () => setValue("qty", Math.max(0.1, parseFloat((watchQty - 1).toFixed(1))));

  const onSubmit = (data: KitchenWasteLogFormValues) => {
    const fullReason = data.notes ? `${data.selectedReason} - ${data.notes}` : data.selectedReason;
    logWaste(data.ingredientId, data.qty, fullReason);

    showToast({
      type: "success",
      title: "Waste Logged",
      message: `Logged ${data.qty} ${unit} of ${selectedIngredient?.name ?? data.ingredientId}.`,
    });

    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-page/80 backdrop-blur-sm backdrop-blur-sm p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-danger/10 text-danger">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">Log Waste Entry</h2>
              <p className="text-xs text-text-secondary">Record damaged or spoiled ingredients</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-muted hover:bg-page hover:text-text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Ingredient Select */}
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              Select Ingredient <span className="text-danger">*</span>
            </label>
            <select
              {...register("ingredientId")}
              className={`w-full rounded-xl border bg-input px-3.5 py-2.5 text-sm text-text-primary font-semibold focus:outline-none ${errors.ingredientId ? "border-danger focus:border-danger" : "border-border focus:border-primary"}`}
            >
              <option value="">— Select ingredient / item —</option>
              {inventoryItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.unit}) — Current Stock: {item.currentStock}
                </option>
              ))}
            </select>
            {errors.ingredientId && <span className="text-[10px] text-danger">{errors.ingredientId.message}</span>}
          </div>

          {/* Quantity Counter with Touch Buttons */}
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              Wasted Quantity ({unit})
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDecrement}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-page text-text-primary font-extrabold text-xl hover:bg-surface-hover active:scale-95 transition-all shadow-xs"
              >
                <Minus className="h-5 w-5" />
              </button>

              <div className="flex-1">
                <input
                  {...register("qty", { valueAsNumber: true })}
                  type="number"
                  step="0.1"
                  min="0.1"
                  className={`w-full rounded-xl border bg-input py-2.5 text-center text-xl font-black text-text-primary focus:outline-none ${errors.qty ? "border-danger focus:border-danger" : "border-border focus:border-primary"}`}
                />
              </div>

              <button
                type="button"
                onClick={handleIncrement}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-page text-text-primary font-extrabold text-xl hover:bg-surface-hover active:scale-95 transition-all shadow-xs"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            {errors.qty && <span className="text-[10px] text-danger">{errors.qty.message}</span>}
          </div>

          {/* Reason Selector Chips */}
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              Reason Selector
            </label>
            <div className="grid grid-cols-2 gap-2">
              {REASON_CHIPS.map((chip) => {
                const Icon = chip.icon;
                const isSelected = watchReason === chip.label;
                return (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => setValue("selectedReason", chip.label)}
                    className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs font-bold transition-all ${
                      isSelected
                        ? "border-primary bg-primary text-white shadow-sm"
                        : `${chip.color} hover:opacity-80`
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{chip.label}</span>
                  </button>
                );
              })}
            </div>
            {errors.selectedReason && <span className="text-[10px] text-danger">{errors.selectedReason.message}</span>}
          </div>

          {/* Notes Input */}
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              Additional Notes (Optional)
            </label>
            <input
              {...register("notes")}
              type="text"
              placeholder="e.g. dropped during dinner rush..."
              className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-xs text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-2.5 text-xs font-bold text-text-secondary hover:bg-page"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-danger px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-danger/80 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting && <Loader2 size={13} className="animate-spin" />}
              Confirm Log Waste
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
