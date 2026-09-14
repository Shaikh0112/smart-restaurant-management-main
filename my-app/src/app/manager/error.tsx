"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { ManagerEmptyState } from "./manager_components/ManagerEmptyState";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Module Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center p-6 text-center">
      <ManagerEmptyState
        title="Something went wrong!"
        description="An unexpected error occurred while loading this module. Please try again or contact support if the issue persists."
        icon={AlertCircle}
        actionButton={
          <button
            onClick={() => reset()}
            className="flex items-center space-x-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        }
      />
    </div>
  );
}
