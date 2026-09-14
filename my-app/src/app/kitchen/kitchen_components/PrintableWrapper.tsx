"use client";

import { useRef } from "react";
import { Printer } from "lucide-react";

interface PrintableWrapperProps {
  children: React.ReactNode;
  printTitle?: string;
  onClose?: () => void;
}

export function PrintableWrapper({ children, printTitle = "Document", onClose }: PrintableWrapperProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!contentRef.current) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${printTitle}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; color: #000; }
            * { box-sizing: border-box; }
            @media print {
              .no-print { display: none !important; }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          ${contentRef.current.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    // Use timeout to allow styles to load before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className="flex w-full flex-col">
      <div className="no-print flex items-center justify-between border-b border-border/60 pb-4 mb-4">
        <h2 className="text-lg font-bold text-text-primary">{printTitle}</h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-text-secondary hover:bg-page transition-colors"
          >
            <Printer size={14} />
            Print
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-primary-hover"
            >
              Close
            </button>
          )}
        </div>
      </div>
      <div ref={contentRef} className="print-content text-text-primary">
        {children}
      </div>
    </div>
  );
}
