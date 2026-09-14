import React from 'react';
export default function PaymentsLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="h-8 w-64 bg-border/50 animate-pulse rounded-md" />
      <div className="h-[400px] w-full bg-border/50 animate-pulse rounded-xl" />
    </div>
  );
}