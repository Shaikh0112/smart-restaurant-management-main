import * as z from "zod";

export const voidRequestSchema = z.object({
  reason: z.string().min(5, "Reason must be at least 5 characters"),
  managerPin: z.string().regex(/^\d{4}$/, "Manager PIN must be exactly 4 digits").optional(),
});

export const tableTransferSchema = z.object({
  targetTableId: z.string().min(1, "Please select a target table"),
  mode: z.enum(["TRANSFER", "MERGE"]),
});

export const bookingSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerPhone: z.string().regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
  guestCount: z.number().min(1, "At least 1 guest required"),
  bookingDate: z.string().min(1, "Date is required"),
  bookingTime: z.string().min(1, "Time is required"),
  specialRequests: z.string().optional(),
});
