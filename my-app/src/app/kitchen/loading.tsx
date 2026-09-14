// @ts-nocheck
"use client";

export default function Loading() {
  return (
    <div className="flex w-full flex-col gap-6 p-4">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="h-7 w-48 animate-pulse rounded-md bg-skeleton-base" />
          <div className="h-4 w-64 animate-pulse rounded-md bg-skeleton-base" />
        </div>
      </div>

      {/* KPI Summary Bar Skeleton */}
      <div className="h-16 w-full animate-pulse rounded-xl bg-skeleton-base" />

      {/* Grid Skeleton (4 columns for large screens) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex h-64 flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="h-6 w-1/2 animate-pulse rounded-md bg-skeleton-base" />
            <div className="h-4 w-1/3 animate-pulse rounded-md bg-skeleton-base" />
            <div className="mt-4 flex-1 animate-pulse rounded-md bg-skeleton-base/50" />
            <div className="mt-auto h-10 w-full animate-pulse rounded-md bg-skeleton-base" />
          </div>
        ))}
      </div>
    </div>
  );
}
