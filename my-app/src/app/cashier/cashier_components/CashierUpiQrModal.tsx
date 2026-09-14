// @ts-nocheck
﻿"use client";

// RESPONSIBILITY: Renders the UPI QR code modal for the Cashier POS.
// Generates a QR code client-side using HTML Canvas (no external library).
// QR encodes a UPI deep link: upi://pay?pa=restaurant@upi&am=AMOUNT&tn=TableXX
// "Payment Received" button confirms payment and closes modal.
// DATA FLOW: cashier/page.tsx → CashierUpiQrModal → onConfirm → checkout flow

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";

import { useCashierSession } from "@/app/cashier/cashier_hooks/useCashierSession";
import { cashierApiClient } from "../cashier_api/cashier_api_client";

// ─── Pure Helpers ─────────────────────────────────────────────────────────────

/**
 * Builds the UPI deep link string for QR encoding.
 */
function buildUpiLink(amount: number, tableNumber: string, upiId: string, merchantName: string): string {
  const params = new URLSearchParams({
    pa:  upiId,
    pn:  merchantName,
    am:  amount.toFixed(2),
    tn:  `Table ${tableNumber}`,
    cu:  "INR",
  });
  return `upi://pay?${params.toString()}`;
}



// ─── Component ────────────────────────────────────────────────────────────────

/**
 * UPI QR modal — z-40 overlay.
 * Draws QR on canvas on open. Escape key + backdrop click close modal.
 * "Payment Received" calls onConfirm to proceed with checkout.
 */
export function CashierUpiQrModal({
  isOpen,
  amount,
  tableNumber,
  onConfirm,
  onClose,
}: CashierUpiQrModalProps) {
  const { tenant } = useCashierSession();
  const merchantUpiId = tenant.merchantUpi;
  const merchantName = tenant.name;
  const [isVerifying, setIsVerifying] = useState(false);

  const handleConfirm = async () => {
    setIsVerifying(true);
    try {
      const res = await cashierApiClient.post('/payment/verify-upi', { amount, tableNumber });
      if (res.success) {
        onConfirm();
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // Escape key closes modal
  // Deps: isOpen, onClose — listener only active when modal is open
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const upiLink = buildUpiLink(amount, tableNumber, merchantUpiId, merchantName);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="UPI payment QR code"
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl border border-border bg-card p-7 shadow-2xl shadow-black/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-text-primary">Scan & Pay</h2>
            <p className="mt-0.5 text-xs text-text-secondary">
              Table {tableNumber} — UPI Payment
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close UPI QR modal"
            className="rounded-md p-1 text-text-secondary motion-safe:transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* QR Canvas */}
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-lg border border-border bg-white p-3">
            <QRCodeSVG
              value={upiLink}
              size={18} strokeWidth={2}
              aria-label={`UPI QR code for ${formatCurrency(amount)}`}
            />
          </div>

          {/* Amount */}
          <div className="text-center">
            <p className="text-2xl font-bold text-text-primary">
              {formatCurrency(amount)}
            </p>
            <p className="text-xs text-text-secondary">{merchantUpiId}</p>
          </div>

          {/* UPI link (copyable) */}
          <p className="max-w-full truncate rounded-md bg-page px-3 py-1.5 text-xs text-text-disabled">
            {upiLink}
          </p>
        </div>

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          disabled={isVerifying}
          className={[
            "mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-success px-5 py-3",
            "text-sm font-semibold text-white",
            "motion-safe:transition-colors duration-150 hover:opacity-90 active:scale-95",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success focus-visible:ring-offset-2 focus-visible:ring-offset-page",
          ].join(" ")}
        >
          <CheckCircle size={18} strokeWidth={2} />
          {isVerifying ? "Verifying..." : "Payment Received"}
        </button>
      </div>
    </div>
  );
}
