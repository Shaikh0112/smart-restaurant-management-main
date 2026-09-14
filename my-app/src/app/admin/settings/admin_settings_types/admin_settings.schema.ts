// RESPONSIBILITY: Utility or types for admin_settings.schema.ts.
// DATA FLOW: N/A

import { z } from "zod";

export const adminSettingsSchema = z.object({
  restaurantName: z.string().min(1, "Restaurant name is required"),
  logoUrl: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  gstin: z.string().min(15, "GSTIN must be 15 characters").max(15, "GSTIN must be 15 characters").optional().or(z.literal("")),
  currency: z.string().min(1, "Currency symbol is required"),
  invoicePrefix: z.string().min(1, "Invoice prefix is required"),
  kotPrefix: z.string().min(1, "KOT prefix is required"),
  upiVpa: z.string().min(1, "UPI VPA is required"),
  cgstPercent: z.number().min(0, "CGST cannot be negative"),
  sgstPercent: z.number().min(0, "SGST cannot be negative"),
  vatPercent: z.number().min(0, "VAT cannot be negative"),
  serviceChargePercent: z.number().min(0, "Service charge cannot be negative"),
  loyaltyRupeesPerPoint: z.number().min(1, "Must be at least 1"),
  defaultPrepTimeMins: z.number().min(1, "Must be at least 1"),
  businessHours: z.string().min(1, "Business hours are required"),
  receiptFooter: z.string().optional(),
  kdsSlaWarningMins: z.number().min(1, "Must be at least 1"),
  kdsSlaDangerMins: z.number().min(1, "Must be at least 1"),
}).refine(data => data.kdsSlaWarningMins < data.kdsSlaDangerMins, {
  message: "Warning SLA must be less than Danger SLA",
  path: ["kdsSlaWarningMins"]
});

export type AdminSettingsFormValues = z.infer<typeof adminSettingsSchema>;
