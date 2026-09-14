import React from "react";
import { Grid3x3 } from "lucide-react";
import type { AppTable } from "@/types/appTypes";

interface ManagerTableQuickCreatorProps {
  tableForm: {
    tableNumber: string;
    section: AppTable["section"];
  };
  setTableForm: React.Dispatch<React.SetStateAction<{
    tableNumber: string;
    section: AppTable["section"];
  }>>;
  handleCreateTable: (e: React.FormEvent) => void;
  tables: AppTable[];
}

export function ManagerTableQuickCreator({
  tableForm,
  setTableForm,
  handleCreateTable,
  tables,
}: ManagerTableQuickCreatorProps) {
  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleCreateTable} className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-4">
        <h3 className="font-black text-sm text-text-primary flex items-center gap-2">
          <Grid3x3 size={18} className="text-amber-500" />
          <span>Create New Dining Table</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-text-secondary block mb-1">Table Number</label>
            <input
              type="text"
              required
              value={tableForm.tableNumber}
              onChange={(e) => setTableForm({ ...tableForm, tableNumber: e.target.value })}
              placeholder="e.g. T-05"
              className="w-full rounded-xl border border-border bg-input p-2.5 text-xs text-text-primary"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-text-secondary block mb-1">Floor Section</label>
            <select
              value={tableForm.section}
              onChange={(e) => setTableForm({ ...tableForm, section: e.target.value as any })}
              className="w-full rounded-xl border border-border bg-input p-2.5 text-xs text-text-primary"
            >
              <option value="Dining">Dining</option>
              <option value="AC">AC</option>
              <option value="Outdoor">Outdoor</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="self-end rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-extrabold text-black shadow-md hover:bg-amber-400"
        >
          Add Dining Table
        </button>
      </form>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h4 className="font-bold text-xs text-text-primary mb-3">Configured Dining Tables ({tables.length})</h4>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {tables.map((t) => (
            <div key={t.id} className="p-3 rounded-xl border border-border bg-surface text-center">
              <p className="font-black text-sm text-text-primary">{t.tableNumber}</p>
              <p className="text-[10px] text-text-muted mt-0.5">{t.section}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
