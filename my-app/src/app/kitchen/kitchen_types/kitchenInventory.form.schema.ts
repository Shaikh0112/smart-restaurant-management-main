import { z } from "zod";

export const KitchenInventoryFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  category: z.string().min(1, "Category is required"),
  unit: z.enum(["kg", "g", "L", "ml", "pcs", "box"]),
  currentStock: z.number().min(0, "Stock cannot be negative"),
  threshold: z.number().min(1, "Threshold must be at least 1"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  station: z.enum(["Kitchen", "Bar", "Bakery"]),
});

export type KitchenInventoryFormValues = z.infer<typeof KitchenInventoryFormSchema>;
