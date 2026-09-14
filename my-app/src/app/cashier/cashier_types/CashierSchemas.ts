// RESPONSIBILITY: CashierSchemas module logic and UI.
import { z } from "zod";

export const CashierCheckoutPayloadSchema = z.object({
  orderId: z.string().min(1, "Order ID required"),
  tableNumber: z.string().min(1, "Table Number required"),
  taxBreakdown: z.object({
    subtotal: z.number().min(0),
    cgst: z.number().min(0),
    sgst: z.number().min(0),
    serviceCharge: z.number().min(0),
    vat: z.number().min(0),
    discount: z.number().min(0),
    loyaltyRedeemed: z.number().min(0),
    customTip: z.number().min(0),
    packagingCharge: z.number().min(0),
    roundingAdjustment: z.number(),
    roundOff: z.number(),
    totalAmount: z.number().min(0),
  }),
  cartItems: z.array(z.any()).min(1, "Cart cannot be empty"),
  paymentMode: z.enum(["SINGLE", "SPLIT_BILL", "SPLIT_PAYMENT"]),
  singleMethod: z.enum(["CASH", "UPI", "CARD"]),
  splitValues: z.object({
    cash: z.number().min(0),
    upi: z.number().min(0),
    card: z.number().min(0),
  }),
  customerPhone: z.string(),
  loyaltyEarned: z.number().min(0),
  redeemAmount: z.number().min(0),
});

export type CashierCheckoutPayloadType = z.infer<typeof CashierCheckoutPayloadSchema>;

export const CashierZReportPayloadSchema = z.object({
  shiftId: z.string(),
  cashierId: z.string(),
  openingBalance: z.number().min(0),
  closingBalance: z.number().min(0),
  cashCollected: z.number().min(0),
  upiCollected: z.number().min(0),
  cardCollected: z.number().min(0),
  totalNetSales: z.number().min(0),
  discrepancy: z.number(),
  notes: z.string().optional(),
});

export type CashierZReportPayloadType = z.infer<typeof CashierZReportPayloadSchema>;
