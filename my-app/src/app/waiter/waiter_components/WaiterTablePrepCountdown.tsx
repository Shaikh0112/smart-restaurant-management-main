// RESPONSIBILITY: Displays the preparation countdown timer.
"use client";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

export function WaiterTablePrepCountdown({
  startTime,
  estimatedDurationMs,
}: {
  startTime: number;
  estimatedDurationMs: number;
}) {
  const [remaining, setRemaining] = useState(
    Math.max(0, startTime + estimatedDurationMs - Date.now())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const left = Math.max(0, startTime + estimatedDurationMs - Date.now());
      setRemaining(left);
      if (left <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, estimatedDurationMs]);

  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  const isOverdue = remaining === 0;

  return (
    <div className={[`flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-bold border`, isOverdue ? "border-danger/30 bg-danger/10 text-danger" : "border-warning/30 bg-warning/10 text-warning"].join(" ")}>
      <Clock size={14} className={isOverdue ? "animate-pulse" : ""} />
      <span>{isOverdue ? "Overdue" : `${mins}m ${secs}s`}</span>
    </div>
  );
}
