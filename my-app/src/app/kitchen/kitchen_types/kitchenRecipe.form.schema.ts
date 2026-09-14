import { z } from "zod";

export const KitchenRecipeIngredientSchema = z.object({
  ingredientId: z.string().min(1, "Required"),
  qty: z.number().min(0.01, "Quantity must be > 0"),
});

export const KitchenRecipeFormSchema = z.object({
  ingredients: z.array(KitchenRecipeIngredientSchema),
});

export type KitchenRecipeIngredientValues = z.infer<typeof KitchenRecipeIngredientSchema>;
export type KitchenRecipeFormValues = z.infer<typeof KitchenRecipeFormSchema>;
