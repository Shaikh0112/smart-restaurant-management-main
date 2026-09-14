// @ts-nocheck
﻿"use client";

// RESPONSIBILITY: Inline recipe ingredient linker for a menu item.
// Renders a list of ingredient rows (dropdown + qty input) that map to
// AppMenuRecipeItem[]. Add/remove rows, save writes to parent via onSave.
// Pure display component — no localStorage access.
// DATA FLOW: KitchenMenuFormModal → KitchenRecipeEditor → onSave(recipe) → useKitchenMenu.saveRecipe

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import type { AppMenuRecipeItem } from "@/types/appTypes";
import type { KitchenRecipeEditorProps } from "@/app/kitchen/kitchen_types/KitchenTypes";
import { KitchenRecipeFormSchema, KitchenRecipeFormValues } from "../kitchen_types/kitchenRecipe.form.schema";

export function KitchenRecipeEditor({
  currentRecipe,
  inventoryItems,
  onSave,
}: KitchenRecipeEditorProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<KitchenRecipeFormValues>({
    resolver: zodResolver(KitchenRecipeFormSchema),
    defaultValues: {
      ingredients: currentRecipe.length > 0 ? currentRecipe : [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  const onSubmit = (data: KitchenRecipeFormValues) => {
    onSave(data.ingredients as AppMenuRecipeItem[]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 rounded-xl border border-border bg-page p-4">
      <p className="text-[12px] font-semibold uppercase tracking-wide text-text-secondary">
        Recipe Ingredients
      </p>

      {fields.length === 0 && (
        <p className="text-[12px] text-text-disabled">No ingredients linked yet.</p>
      )}

      {fields.map((field, index) => {
        // Find selected item to show its unit
        const rowErrors = errors.ingredients?.[index];
        // Cannot easily watch every single dropdown to show unit without `watch`,
        // but we can just use RHF's generic approach, or leave unit empty if not selected
        return (
          <div key={field.id} className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <select
                {...register(`ingredients.${index}.ingredientId`)}
                className={`flex-1 rounded-lg border bg-input px-3 py-2 text-[12px] text-text-primary focus:outline-none ${rowErrors?.ingredientId ? "border-danger focus:border-danger" : "border-border focus:border-primary"}`}
              >
                <option value="">Select ingredient</option>
                {inventoryItems.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.name} ({inv.unit})
                  </option>
                ))}
              </select>

              <input
                {...register(`ingredients.${index}.qty`, { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Qty"
                className={`w-24 rounded-lg border bg-input px-3 py-2 text-[12px] text-text-primary focus:outline-none ${rowErrors?.qty ? "border-danger focus:border-danger" : "border-border focus:border-primary"}`}
              />

              <button
                type="button"
                onClick={() => remove(index)}
                className="rounded-lg p-1.5 text-text-secondary hover:bg-danger/10 hover:text-danger transition-colors"
                aria-label="Remove ingredient"
              >
                <Trash2 size={13} />
              </button>
            </div>
            {(rowErrors?.ingredientId || rowErrors?.qty) && (
              <span className="text-[10px] text-danger">
                {rowErrors.ingredientId?.message || rowErrors.qty?.message}
              </span>
            )}
          </div>
        );
      })}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => append({ ingredientId: "", qty: 0 })}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[12px] font-medium text-text-secondary hover:bg-card transition-colors"
        >
          <Plus size={13} />
          Add Ingredient
        </button>
        <button
          type="submit"
          className="rounded-lg bg-primary px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-primary-hover transition-colors"
        >
          Save Recipe
        </button>
      </div>
    </form>
  );
}
