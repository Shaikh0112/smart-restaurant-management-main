"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // In real app, log to monitoring service here instead of console
  }, [error]);

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-danger/20 bg-danger/5 p-12 text-center">
        <AlertTriangle size={18} className="text-danger" />
        <h2 className="text-xl font-bold text-text-primary">Failed to load booking module</h2>
        <p className="text-sm text-text-secondary">{error.message || "An unexpected error occurred."}</p>
        <button onClick={reset} className="mt-4 rounded-lg bg-danger px-6 py-2 text-sm font-bold text-white hover:bg-danger/90 active:scale-95">
          Try Again
        </button>
      </div>
    </div>
  );
}
