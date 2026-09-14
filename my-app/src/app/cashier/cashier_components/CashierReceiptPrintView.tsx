// RESPONSIBILITY: Thermal style receipt preview for Cashier POS.

import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { CashierTaxRow } from "./CashierTaxRow";
import { CashierReceiptItemRow } from "./CashierReceiptItemRow";

const RECEIPT_DIVIDER = "â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€";

export function CashierReceiptPrintView({
  tenant,
  tableNumber,
  customerName,
  customerPhone,
  cartItems,
  taxBreakdown,
  qrCanvasRef,
}: any) {
  const now = formatDateTime(Date.now());

  return (
    <div
      id="cashier-receipt-content"
      className="flex flex-col gap-1 px-5 py-4 font-mono overflow-y-auto max-h-[50vh] bg-card"
    >
      <div className="flex flex-col items-center gap-0.5 text-center">
        <p className="text-sm font-bold text-text-primary">{tenant.name}</p>
        <p className="text-xs text-text-secondary">{tenant.address}</p>
        <p className="text-xs text-text-secondary">{tenant.gstin}</p>
      </div>

      <p className="my-1 text-center text-xs text-text-secondary">{RECEIPT_DIVIDER}</p>

      <div className="flex justify-between text-xs text-text-secondary">
        <span>Table: {tableNumber}</span>
        <span>{now}</span>
      </div>

      {(customerPhone || customerName) && (
        <p className="text-xs font-bold text-text-primary">
          Customer: {customerName || "Guest"} {customerPhone ? `(${customerPhone.replace(/.(?=.{4})/g, '*')})` : ""}
        </p>
      )}

      <p className="my-1 text-center text-xs text-text-secondary">{RECEIPT_DIVIDER}</p>

      <div className="flex flex-col gap-1">
        {cartItems.map((item: any) => (
          <CashierReceiptItemRow
            key={`${item.itemId}-${item.notes}`}
            name={item.name}
            qty={item.qty}
            totalPrice={item.totalPrice}
          />
        ))}
      </div>

      <p className="my-1 text-center text-xs text-text-secondary">{RECEIPT_DIVIDER}</p>

      <div className="flex flex-col gap-0.5">
        <CashierTaxRow label="Subtotal" value={taxBreakdown.subtotal} />
        <CashierTaxRow label="CGST (2.5%)" value={taxBreakdown.cgst} />
        <CashierTaxRow label="SGST (2.5%)" value={taxBreakdown.sgst} />
        <CashierTaxRow label="Service (5%)" value={taxBreakdown.serviceCharge} />
        <CashierTaxRow label="Liquor VAT" value={taxBreakdown.vat} />
        {taxBreakdown.packagingCharge > 0 && (
          <CashierTaxRow label="Parcel Fee" value={taxBreakdown.packagingCharge} />
        )}
        {taxBreakdown.customTip > 0 && (
          <CashierTaxRow label="Staff Tip" value={taxBreakdown.customTip} />
        )}
        {taxBreakdown.discount > 0 && (
          <div className="flex justify-between text-xs text-success">
            <span>Discount</span>
            <span>-{formatCurrency(taxBreakdown.discount)}</span>
          </div>
        )}
        {taxBreakdown.loyaltyRedeemed > 0 && (
          <div className="flex justify-between text-xs text-success">
            <span>Loyalty Redeemed</span>
            <span>-{formatCurrency(taxBreakdown.loyaltyRedeemed)}</span>
          </div>
        )}
        <CashierTaxRow label="Round Off" value={taxBreakdown.roundOff} />
      </div>

      <p className="my-1 text-center text-xs text-text-secondary">{RECEIPT_DIVIDER}</p>

      <div className="flex justify-between">
        <span className="text-base font-bold text-text-primary">TOTAL</span>
        <span className="text-base font-bold text-text-primary">
          {formatCurrency(taxBreakdown.totalAmount)}
        </span>
      </div>

      <p className="my-1 text-center text-xs text-text-secondary">{RECEIPT_DIVIDER}</p>

      <div className="flex flex-col items-center gap-1 my-1 py-1 bg-page/50 rounded-lg border border-border/50">
        <p className="text-xs font-bold uppercase tracking-wider text-text-primary">
          Scan to Pay via UPI / GPay / PhonePe
        </p>
        <div className="rounded-lg border border-border p-1.5 bg-white shadow-xs">
          <canvas ref={qrCanvasRef} className="h-28 w-28 block" />
        </div>
        <p className="text-[0.5rem] font-mono text-text-secondary">UPI ID: {tenant.merchantUpi}</p>
      </div>

      <p className="my-1 text-center text-xs text-text-secondary">{RECEIPT_DIVIDER}</p>

      <p className="text-center text-xs font-bold text-text-primary">
        Thank you for dining with us!  Visit Again!
      </p>
    </div>
  );
}
