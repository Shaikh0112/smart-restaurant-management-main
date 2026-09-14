// RESPONSIBILITY: CashierPrintableWrapper module logic and UI.
import React, { useState } from "react";
import { Printer, Copy, CheckCircle2 } from "lucide-react";

export interface CashierPrintableWrapperProps {
  children: React.ReactNode;
  onPrint: () => void;
  onClose?: () => void;
  copyId?: string;
  onCopyId?: () => void;
}

export function CashierPrintableWrapper({
  children,
  onPrint,
  onClose,
  copyId,
  onCopyId,
}: CashierPrintableWrapperProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (copyId) {
      navigator.clipboard.writeText(copyId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (onCopyId) onCopyId();
    }
  };

  return (
    <div className="flex h-auto max-h-[90vh] w-full max-w-sm flex-col overflow-hidden rounded-3xl border border-border bg-surface text-text-primary shadow-2xl animate-in zoom-in-95 duration-200">
      {/* Printable Area */}
      {children}

      {/* Action Footer (hidden in print) */}
      <div className="flex items-center justify-between gap-3 border-t border-border p-4 bg-page/50 print:hidden">
        {copyId ? (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary motion-safe:transition-colors"
          >
            {copied ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className={copied ? "text-emerald-500" : ""}>
              {copied ? "Copied!" : `ID: ${copyId}`}
            </span>
          </button>
        ) : (
          <div /> // Spacer
        )}
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-surface-hover"
            >
              Close
            </button>
          )}
          <button
            onClick={onPrint}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary-hover active:scale-95 motion-safe:transition-all"
          >
            <Printer className="h-4 w-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
}
