"use client";
import React from 'react';
import SuperAdminErrorBoundary from "@/app/super-admin/SuperAdminErrorBoundary";
export default function SubscriptionsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <SuperAdminErrorBoundary error={error} reset={reset} />;
}