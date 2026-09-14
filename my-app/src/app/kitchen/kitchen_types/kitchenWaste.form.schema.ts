import { z } from "zod";

export const KitchenWasteLogSchema = z.object({
  ingredientId: z.string().min(1, "Please select an ingredient"),
  qty: z.number().min(0.1, "Quantity must be greater than 0"),
  selectedReason: z.string().min(1, "Please select a reason"),
  notes: z.string().optional(),
});

export type KitchenWasteLogFormValues = z.infer<typeof KitchenWasteLogSchema>;
