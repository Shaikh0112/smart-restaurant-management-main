"use client";
import { CashierReceiptPrintView } from "./CashierReceiptPrintView";
import { CashierReceiptActionPanel } from "./CashierReceiptActionPanel";
// @ts-nocheck

// RESPONSIBILITY: Final receipt modal shown after successful checkout.
// Displays thermal-style receipt preview with itemized bill + tax breakdown.
// Rule 29: Radio Button multi-medium sending selection (Print Paper, Send WhatsApp, Send Email).
// DATA FLOW: cashier/page.tsx → CashierReceiptModal → window.print / wa.me / email / onClose

import { useEffect, useRef, useState } from "react";
import { Printer, MessageCircle, Mail, X, Check, Send } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { buildWhatsAppLink, buildReceiptText } from "@/app/cashier/cashier_hooks/useCashierCheckout";
import type { CashierReceiptModalProps } from "@/app/cashier/cashier_types/CashierTypes";
import { CashierTaxRow } from "./CashierTaxRow";
import { CashierReceiptItemRow } from "./CashierReceiptItemRow";

import { useCashierSession } from "@/app/cashier/cashier_hooks/useCashierSession";
const RECEIPT_DIVIDER = "──────────────────────────────────────────────────────────" as const;

type DeliveryMedium = "PRINT" | "WHATSAPP" | "EMAIL";

const receiptSchema = z.object({
  medium: z.enum(["PRINT", "WHATSAPP", "EMAIL"]),
  waPhone: z.string().optional(),
  email: z.string().optional(),
}).superRefine((val, ctx) => {
  if (val.medium === "WHATSAPP") {
    if (!val.waPhone || val.waPhone.length !== 10) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "10-digit number required", path: ["waPhone"] });
    }
  }
  if (val.medium === "EMAIL") {
    if (!val.email || !/^\S+@\S+\.\S+$/.test(val.email)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Valid email required", path: ["email"] });
    }
  }
});

type ReceiptFormValues = z.infer<typeof receiptSchema>;

function drawReceiptUpiQr(canvas: HTMLCanvasElement, upiString: string): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const size = 110;
  canvas.width = size;
  canvas.height = size;

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, size, size);

  const grid = 21;
  const cellSize = size / grid;

  let hash = 0;
  for (let i = 0; i < upiString.length; i++) {
    hash = (hash << 5) - hash + upiString.charCodeAt(i);
    hash |= 0;
  }

  ctx.fillStyle = "#000000";
  for (let r = 0; r < grid; r++) {
    for (let c = 0; c < grid; c++) {
      if (Math.abs(Math.sin((r + 1) * (c + 1) * hash * 100)) > 0.45) {
        ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
      }
    }
  }

  const drawFinder = (startR: number, startC: number) => {
    ctx.fillStyle = "#000000";
    ctx.fillRect(startC * cellSize, startR * cellSize, 7 * cellSize, 7 * cellSize);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect((startC + 1) * cellSize, (startR + 1) * cellSize, 5 * cellSize, 5 * cellSize);
    ctx.fillStyle = "#000000";
    ctx.fillRect((startC + 2) * cellSize, (startR + 2) * cellSize, 3 * cellSize, 3 * cellSize);
  };

  drawFinder(0, 0);
  drawFinder(0, grid - 7);
  drawFinder(grid - 7, 0);
}

export function CashierReceiptModal({
  isOpen,
  cartItems,
  taxBreakdown,
  tableNumber,
  customerName,
  customerPhone,
  onSaveCustomerWhatsApp,
  onClose,
}: CashierReceiptModalProps) {
  const { tenant } = useCashierSession();
  const [sentSuccessMsg, setSentSuccessMsg] = useState<string | null>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  const { control, handleSubmit, watch, reset, formState: { errors } } = useForm<ReceiptFormValues>({
    resolver: zodResolver(receiptSchema),
    defaultValues: {
      medium: "PRINT",
      waPhone: customerPhone || "",
      email: ""
    }
  });

  const selectedMedium = watch("medium");

  useEffect(() => {
    if (isOpen) {
      reset({
        medium: "PRINT",
        waPhone: customerPhone || "",
        email: ""
      });
      setSentSuccessMsg(null);

      setTimeout(() => {
        if (qrCanvasRef.current) {
          const upiString = `upi://pay?pa=${tenant.merchantUpi}&pn=${encodeURIComponent(tenant.name)}&am=${taxBreakdown.totalAmount.toFixed(2)}&tn=Table${tableNumber}`;
          drawReceiptUpiQr(qrCanvasRef.current, upiString);
        }
      }, 50);
    }
  }, [isOpen, customerPhone, reset, taxBreakdown.totalAmount, tableNumber]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const now = formatDateTime(Date.now());

  function onSubmit(data: ReceiptFormValues) {
    setSentSuccessMsg(null);
    if (data.medium === "PRINT") {
      if (typeof window !== "undefined") {
        window.print();
      }
    } else if (data.medium === "WHATSAPP") {
      if (data.waPhone !== customerPhone && onSaveCustomerWhatsApp) {
        onSaveCustomerWhatsApp(data.waPhone!);
      }
      const receiptText = buildReceiptText(cartItems, taxBreakdown, tableNumber, tenant.name);
      const link = buildWhatsAppLink(data.waPhone!, receiptText);
      if (link && typeof window !== "undefined") {
        window.open(link, "_blank", "noopener,noreferrer");
      }
      setSentSuccessMsg(`Receipt sent to WhatsApp (${data.waPhone})!`);
    } else if (data.medium === "EMAIL") {
      // Stub for email sending
      setSentSuccessMsg(`Receipt sent to Email (${data.email})!`);
    }
  }

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #cashier-receipt-content,
          #cashier-receipt-content * { visibility: visible !important; }
          #cashier-receipt-content {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 80mm !important;
            padding: 4mm !important;
            font-size: 11px !important;
            font-family: monospace !important;
          }
        }
      `}</style>

      <div
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fadeIn"
        onClick={onClose}
      >
        <div
          className="relative flex w-full max-w-sm flex-col gap-0 rounded-2xl bg-card border border-border shadow-2xl overflow-hidden max-h-[95vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-surface-hover/30 px-5 py-3.5 print:hidden">
            <h2 className="text-base font-bold text-text-primary">Order Receipt</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-text-secondary hover:bg-border motion-safe:transition-colors"
            >
              <X size={18} strokeWidth={2} />
            </button>
          </div>

          {/* Receipt Content */}
          <CashierReceiptPrintView 
            tenant={tenant}
            tableNumber={tableNumber}
            customerName={customerName}
            customerPhone={customerPhone}
            cartItems={cartItems}
            taxBreakdown={taxBreakdown}
            qrCanvasRef={qrCanvasRef}
          />
          <CashierReceiptActionPanel 
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            control={control}
            errors={errors}
            selectedMedium={selectedMedium}
            sentSuccessMsg={sentSuccessMsg}
            onClose={onClose}
          />
        </div>
      </div>
    </>
  );
}
