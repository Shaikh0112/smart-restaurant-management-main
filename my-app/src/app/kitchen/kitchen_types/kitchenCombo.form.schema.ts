import { z } from "zod";

export const KitchenComboFormSchema = z.object({
  name: z.string().min(1, "Combo name is required"),
  requiredItemIds: z.array(z.string()).min(1, "Select at least one item"),
  comboPrice: z.number().min(0.01, "Price must be greater than 0"),
  happyHourEnabled: z.boolean(),
  happyHourStart: z.string().nullable(),
  happyHourEnd: z.string().nullable(),
}).refine(data => {
  if (data.happyHourEnabled) {
    return data.happyHourStart !== null && data.happyHourEnd !== null;
  }
  return true;
}, {
  message: "Start and End times are required when Happy Hours are enabled",
  path: ["happyHourEnabled"],
});

export type KitchenComboFormValues = z.infer<typeof KitchenComboFormSchema>;
