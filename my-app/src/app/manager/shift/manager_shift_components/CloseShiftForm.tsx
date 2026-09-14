// @ts-nocheck
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import type { ManagerShiftCloseFormValues } from "@/app/manager/manager_types/ManagerTypes";

const closeSchema = z.object({
  closingCash: z.number().min(0, "Closing cash must be ≥ 0"),
});

export function CloseShiftForm({
  onClose,
  isSubmitting,
}: {
  onClose: (cash: number) => void;
  isSubmitting: boolean;
}) {
  const [confirmed, setConfirmed] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const { register, handleSubmit, formState: { errors } } =
    useForm<ManagerShiftCloseFormValues>({ resolver: zodResolver(closeSchema), defaultValues: { closingCash: 0 } });

  function onSubmit(values: ManagerShiftCloseFormValues) {
    onClose(values.closingCash);
  }

  if (!confirmed) {
    return (
      <button
        onClick={() => setConfirmed(true)}
        className="rounded-xl border border-danger px-5 py-2.5 text-[13px] font-semibold text-danger hover:bg-danger-bg transition-colors"
      >
        Close Shift
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 rounded-xl border border-danger bg-danger-bg p-5 max-w-sm">
      <p className="text-[14px] font-semibold text-danger">Confirm Close Shift</p>
      <div className="flex flex-col gap-1">
        <label className="text-[12px] font-semibold text-text-secondary">Closing Cash Counted (₹)</label>
        <input
          {...register("closingCash", { valueAsNumber: true })}
          type="number"
          min={0}
          placeholder="0"
          className="rounded-lg border border-border bg-input px-3 py-2 text-[13px] text-text-primary placeholder:text-text-disabled focus:border-border-focus focus:outline-none"
        />
        {errors.closingCash && (
          <p className="text-[11px] text-danger">{errors.closingCash.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[12px] font-semibold text-text-secondary">Type "CLOSE" to confirm</label>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="CLOSE"
          className="rounded-lg border border-border bg-input px-3 py-2 text-[13px] text-text-primary placeholder:text-text-disabled focus:border-border-focus focus:outline-none"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => { setConfirmed(false); setConfirmText(""); }}
          className="flex-1 rounded-xl border border-border py-2.5 text-[13px] font-semibold text-text-secondary hover:bg-card transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || confirmText !== "CLOSE"}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-danger py-2.5 text-[13px] font-semibold text-white disabled:opacity-60 transition-colors"
        >
          {isSubmitting && <Loader2 size={14} className="animate-spin" />}
          Confirm Close
        </button>
      </div>
    </form>
  );
}
