"use client";
// RESPONSIBILITY: Presentation component for AdminRecipeEditor.
// DATA FLOW: Props -> Component -> UI


import { useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { AppMenuRecipeItem } from "@/types/appTypes";
import type { AdminRecipeEditorProps } from "@/app/admin/admin_types/AdminTypes";
import { SearchableDropdown } from "@/components/ui/SearchableDropdown";

const recipeItemSchema = z.object({
  ingredientId: z.string().min(1, "Select ingredient"),
  qty: z.number().min(0.01, "Quantity must be > 0"),
});

const recipeSchema = z.object({
  rows: z.array(recipeItemSchema),
});

type RecipeFormValues = z.infer<typeof recipeSchema>;

export function AdminRecipeEditor({
  currentRecipe,
  inventoryItems,
  onSave,
}: AdminRecipeEditorProps) {
  const { control, handleSubmit, watch, reset } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      rows: currentRecipe.length > 0 ? currentRecipe : [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rows",
  });

  // Re-sync if currentRecipe changes externally
  useEffect(() => {
    reset({ rows: currentRecipe.length > 0 ? currentRecipe : [] });
  }, [currentRecipe, reset]);

  const watchedRows = watch("rows") || [];

  function onSubmit(data: RecipeFormValues) {
    onSave(data.rows);
  }

  const ingredientOptions = inventoryItems.map(inv => ({
    value: inv.id,
    label: inv.name,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 rounded-xl border border-border bg-page p-4">
      <p className="text-[12px] font-semibold uppercase tracking-wide text-text-secondary">
        Recipe Ingredients
      </p>

      {fields.length === 0 && (
        <p className="text-[12px] text-text-disabled">No ingredients linked yet.</p>
      )}

      {fields.map((field, index) => {
        const ingredientId = watchedRows[index]?.ingredientId;
        const ingredient = inventoryItems.find((i) => i.id === ingredientId);

        return (
          <div key={field.id} className="flex items-center gap-2">
            {/* Ingredient dropdown */}
            <div className="flex-1">
              <Controller
                name={`rows.${index}.ingredientId`}
                control={control}
                render={({ field, fieldState }) => (
                  <div>
                    <SearchableDropdown
                      options={ingredientOptions}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select ingredient"
                    />
                    {fieldState.error && <p className="text-[10px] text-danger">{fieldState.error.message}</p>}
                  </div>
                )}
              />
            </div>

            {/* Qty input */}
            <div className="w-24">
              <Controller
                name={`rows.${index}.qty`}
                control={control}
                render={({ field, fieldState }) => (
                  <div>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      onKeyDown={(e) => { if (e.key === "-" || e.key === "e" || e.key === "E") e.preventDefault(); }}
                      placeholder="Qty"
                      className="w-full rounded-lg border border-border bg-input px-3 py-2 text-[12px] text-text-primary focus:border-border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    />
                    {fieldState.error && <p className="text-[10px] text-danger">{fieldState.error.message}</p>}
                  </div>
                )}
              />
            </div>

            {/* Unit --- read-only */}
            <span className="w-8 text-[11px] text-text-secondary">
              {ingredient?.unit ?? "---"}
            </span>

            {/* Remove row */}
            <button
              type="button"
              onClick={() => remove(index)}
              className="rounded-lg p-1.5 text-text-secondary hover:bg-danger-bg hover:text-danger motion-safe:transition-colors"
              aria-label="Remove ingredient"
            >
              <Trash2 size={13} />
            </button>
          </div>
        );
      })}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => append({ ingredientId: "", qty: 0 })}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[12px] font-medium text-text-secondary hover:bg-card motion-safe:transition-colors"
        >
          <Plus size={13} />
          Add Ingredient
        </button>
        <button
          type="submit"
          className="rounded-lg bg-primary px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-primary-hover motion-safe:transition-colors"
        >
          Save Recipe
        </button>
      </div>
    </form>
  );
}
