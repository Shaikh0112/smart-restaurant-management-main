// RESPONSIBILITY: Component rendering loading
export default function ApiLoading() {
  return (
    <div className="w-full motion-safe:animate-pulse motion-safe:animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="h-8 w-48 bg-skeleton-base rounded-md mb-2"></div>
          <div className="h-4 w-64 bg-skeleton-base rounded-md"></div>
        </div>
        <div className="h-10 w-32 bg-skeleton-base rounded-md"></div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-skeleton-base rounded-lg border border-border p-6">
            <div className="h-4 w-24 bg-skeleton-highlight rounded mb-4"></div>
            <div className="h-8 w-16 bg-skeleton-highlight rounded mb-2"></div>
            <div className="h-3 w-32 bg-skeleton-highlight rounded"></div>
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-10 w-64 bg-skeleton-base rounded-md"></div>
          <div className="h-10 w-24 bg-skeleton-base rounded-md"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 w-full bg-skeleton-base rounded-md"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
