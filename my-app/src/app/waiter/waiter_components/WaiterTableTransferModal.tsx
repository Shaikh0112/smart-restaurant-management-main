// RESPONSIBILITY: Renders the Table Transfer/Merge modal with strict Zod validation.
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tableTransferSchema } from "../waiter_schemas/waiter.schema";
import * as z from "zod";
import { X, ArrowRightLeft, Merge } from "lucide-react";
import type { AppTable } from "@/types/appTypes";

type TransferFormValues = z.infer<typeof tableTransferSchema>;

export function WaiterTableTransferModal({
  isOpen,
  sourceTable,
  tables,
  onTransferConfirm,
  onClose,
}: {
  isOpen: boolean;
  sourceTable: AppTable | null;
  tables: AppTable[];
  onTransferConfirm: (sourceId: string, targetId: string, mode: "TRANSFER" | "MERGE") => void;
  onClose: () => void;
}) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm<TransferFormValues>({
    resolver: zodResolver(tableTransferSchema),
    defaultValues: { mode: "TRANSFER" }
  });

  const mode = watch("mode");

  if (!isOpen || !sourceTable) return null;

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: TransferFormValues) => {
    onTransferConfirm(sourceTable.id, data.targetTableId, data.mode);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-xl bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-bold text-text-primary">Table Operations</h2>
          <button onClick={handleClose} className="rounded-md p-1.5 hover:bg-surface-hover active:scale-95">
            <X size={18} className="text-text-secondary" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-secondary">Source Table</label>
            <div className="rounded-md border border-border bg-surface px-3 py-2 text-sm font-bold text-text-primary opacity-75">
              Table {sourceTable.tableNumber}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-secondary">Operation Mode</label>
            <div className="flex gap-2 rounded-lg border border-border bg-page p-1">
              <label className={["flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md py-2 text-xs font-bold transition-all", mode === "TRANSFER" ? "bg-primary text-white shadow-sm" : "text-text-secondary hover:bg-surface-hover"].join(" ")}>
                <input type="radio" value="TRANSFER" {...register("mode")} className="sr-only" />
                <ArrowRightLeft size={16} /> Transfer
              </label>
              <label className={["flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md py-2 text-xs font-bold transition-all", mode === "MERGE" ? "bg-primary text-white shadow-sm" : "text-text-secondary hover:bg-surface-hover"].join(" ")}>
                <input type="radio" value="MERGE" {...register("mode")} className="sr-only" />
                <Merge size={16} /> Merge
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-text-secondary">Target Table</label>
            <select
              {...register("targetTableId")}
              aria-invalid={!!errors.targetTableId}
              className="rounded-md border border-border bg-input px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
            >
              <option value="">Select target table...</option>
              {tables.filter(t => t.id !== sourceTable.id).map((t) => (
                <option key={t.id} value={t.id}>
                  Table {t.tableNumber} ({t.status})
                </option>
              ))}
            </select>
            {errors.targetTableId && <span className="text-xs text-danger">{errors.targetTableId.message}</span>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={handleClose} className="rounded-lg px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface-hover transition-colors active:scale-95">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-hover transition-colors disabled:opacity-50 active:scale-95">
              Confirm {mode === "TRANSFER" ? "Transfer" : "Merge"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
