"use client";
import React from 'react';
import SuperAdminErrorBoundary from "@/app/super-admin/SuperAdminErrorBoundary";
export default function UsersError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <SuperAdminErrorBoundary error={error} reset={reset} />;
}