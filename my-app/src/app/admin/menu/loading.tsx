// RESPONSIBILITY: Skeleton loading state for Admin Menu
"use client";

import React from "react";
import { Loader2 } from "lucide-react";

export default function AdminMenuLoading() {
  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6 motion-safe:animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-skeleton-base"></div>
          <div className="space-y-2">
            <div className="h-6 w-48 bg-skeleton-base rounded-md"></div>
            <div className="h-4 w-64 bg-skeleton-base rounded-md"></div>
          </div>
        </div>
        <div className="w-32 h-10 bg-skeleton-base rounded-md"></div>
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-skeleton-base rounded-xl border border-border"></div>
        ))}
      </div>
      
      <div className="w-full h-96 bg-skeleton-base rounded-xl border border-border mt-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-skeleton-highlight motion-safe:animate-spin" />
      </div>
    </div>
  );
}
