// @ts-nocheck
import { AlertTriangle } from "lucide-react";

const USAGE_DANGER_PCT   = 80       as const;
const USAGE_WARNING_PCT  = 60       as const;

export function StorageBar({ usedKb, limitKb, usagePercent }: {
  usedKb: number; limitKb: number; usagePercent: number;
}) {
  const barColor =
    usagePercent >= USAGE_DANGER_PCT  ? "bg-danger"  :
    usagePercent >= USAGE_WARNING_PCT ? "bg-warning" :
    "bg-success";

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold text-text-primary">Storage Usage</p>
        <span className={`text-[12px] font-semibold ${
          usagePercent >= USAGE_DANGER_PCT ? "text-danger" :
          usagePercent >= USAGE_WARNING_PCT ? "text-warning" : "text-success"
        }`}>
          {usedKb} KB / {limitKb} KB ({usagePercent}%)
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-border">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${usagePercent}%` }}
        />
      </div>
      {usagePercent >= USAGE_DANGER_PCT && (
        <div className="flex items-center gap-2 text-[12px] text-danger">
          <AlertTriangle size={13} />
          <span>Storage nearing limit — export backup immediately</span>
        </div>
      )}
    </div>
  );
}
