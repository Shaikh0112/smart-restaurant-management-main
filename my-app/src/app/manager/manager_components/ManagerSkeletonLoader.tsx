import React from 'react';
import { Loader2 } from 'lucide-react';

export default function ManagerSkeletonLoader() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-muted-foreground w-full h-full min-h-[200px]">
      <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
      <p className="text-sm font-medium">Loading data...</p>
    </div>
  );
}
