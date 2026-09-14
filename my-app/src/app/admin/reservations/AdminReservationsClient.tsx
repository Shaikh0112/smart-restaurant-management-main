"use client";
// RESPONSIBILITY: Client-side orchestrator for AdminReservations.
// DATA FLOW: Hooks -> Client Component -> Presentation Components


import React from "react";
import { CalendarClock } from "lucide-react";

export function AdminReservationsClient() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary-bg border border-primary/20">
          <CalendarClock className="text-primary" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Reservations</h1>
          <p className="text-sm text-text-secondary mt-1">Manage reservations and view related analytics.</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-border bg-card">
        <CalendarClock size={48} className="text-border mb-4" />
        <h2 className="text-lg font-semibold text-text-secondary">Module Under Construction</h2>
        <p className="text-sm text-text-disabled mt-2 max-w-md text-center">
          This feature is currently being integrated into the new architecture. 
          Check back soon.
        </p>
      </div>
    </div>
  );
}
