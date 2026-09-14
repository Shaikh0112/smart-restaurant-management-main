// RESPONSIBILITY: Error boundary for Admin Audit
"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function AdminAuditError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("AdminAudit Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-6 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-16 h-16 rounded-2xl bg-danger/10 flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-danger" />
      </div>
      <h2 className="text-2xl font-bold text-text-primary mb-2">Failed to Load Audit</h2>
      <p className="text-text-secondary max-w-md mb-8">
        We encountered an unexpected error while loading this section. Please try again or contact support if the issue persists.
      </p>
      <button
        onClick={reset}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary-hover transition-colors"
      >
        <RefreshCcw size={18} />
        Try Again
      </button>
    </div>
  );
}
