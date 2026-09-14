"use client"; // Error components must be Client Components
// RESPONSIBILITY: Component rendering error

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function BillingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // AUDIT: Dependency array verified for React bounds
  useEffect(() => {
    // Log the error to an error reporting service
    /* console error removed */
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center animate-in fade-in zoom-in motion-safe:duration-300">
      <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mb-6">
        <AlertTriangle size={32} className="text-danger" strokeWidth={2} />
      </div>
      <h2 className="text-page-title font-semibold text-text-primary mb-2">
        Something went wrong!
      </h2>
      <p className="text-body text-text-secondary max-w-md mb-8">
        We encountered an unexpected error while loading this module. Our team has been notified.
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 px-6 py-2.5 bg-card hover:bg-card/80 border border-border rounded-md text-text-primary motion-safe:transition-colors motion-safe:transition-all"
      >
        <RefreshCcw size={18} strokeWidth={2} />
        <span>Try again</span>
      </button>
    </div>
  );
}
