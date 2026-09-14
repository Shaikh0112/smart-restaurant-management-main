// @ts-nocheck
const PAGE_TITLE    = "Shift Management & Z-Report"                    as const;
const PAGE_SUBTITLE = "Open/close shifts, track cash, view Z-Report"  as const;

export function ShiftPageHeader() {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-[22px] font-bold text-text-primary">{PAGE_TITLE}</h1>
      <p className="text-sm text-text-secondary">{PAGE_SUBTITLE}</p>
    </div>
  );
}
