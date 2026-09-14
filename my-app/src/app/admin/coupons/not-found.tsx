// RESPONSIBILITY: 404 fallback for Admin Coupons
"use client";

import React from "react";
import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function AdminCouponsNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
        <FileQuestion className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-text-primary mb-2">Record Not Found</h2>
      <p className="text-text-secondary max-w-md mb-8">
        The requested item could not be found. It may have been deleted or you may have followed a broken link.
      </p>
      <Link
        href="/admin"
        className="flex items-center gap-2 px-6 py-3 bg-card border border-border text-text-primary font-medium rounded-lg hover:bg-primary/5 transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>
    </div>
  );
}
