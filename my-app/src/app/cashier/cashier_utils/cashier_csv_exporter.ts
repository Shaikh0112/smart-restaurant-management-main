// RESPONSIBILITY: cashier_csv_exporter module logic and UI.
import { formatDate } from "@/lib/formatters";
import type { AppSalesRecord } from "@/types/appTypes";

const CSV_HEADERS = "Date,Table,Payment Method,Subtotal,CGST,SGST,Service Charge,VAT,Discount,Total\n" as const;

/**
 * Generates a CSV string from filtered sales records and triggers a browser download.
 *
 * @param records - Period-filtered sales records to export
 */
export function buildAndDownloadCsv(records: AppSalesRecord[]): void {
  if (typeof window === "undefined") return;

  const rows = records.map((r) =>
    [
      formatDate(r.timestamp),
      r.tableNumber,
      r.paymentMethod,
      r.subtotal,
      r.cgst,
      r.sgst,
      r.serviceCharge,
      r.vat,
      r.discount,
      r.totalAmount,
    ].join(",")
  );

  const csvContent = CSV_HEADERS + rows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href     = url;
  link.download = `sales-report-${Date.now()}.csv`;
  link.click();

  URL.revokeObjectURL(url);
}
