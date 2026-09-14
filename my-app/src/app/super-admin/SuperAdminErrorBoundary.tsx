"use client";

import React from 'react';
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SuperAdminErrorBoundary({ error, reset }: Props) {
  return (
    <div className="flex h-full min-h-[400px] w-full flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card p-8 text-center shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">
        <AlertTriangle className="h-8 w-8 text-danger" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-text-primary">Something went wrong</h2>
        <p className="max-w-md text-body text-text-secondary">
          A component in the Super Admin dashboard crashed. The engineering team has been notified.
        </p>
        {error && (
          <pre className="mt-4 max-w-lg overflow-auto rounded-lg bg-page p-4 text-table-header text-danger text-left font-mono">
            {error.message}
          </pre>
        )}
      </div>
      <button
        onClick={() => reset()}
        className="mt-4 flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-body font-semibold text-white transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-page focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page"
      >
        <RefreshCcw size={16} />
        Try Again
      </button>
    </div>
  );
}
