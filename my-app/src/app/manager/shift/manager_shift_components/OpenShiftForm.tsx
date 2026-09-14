// @ts-nocheck
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import type { ManagerShiftOpenFormValues } from "@/app/manager/manager_types/ManagerTypes";

const openSchema = z.object({
  openingCash: z.number().min(0, "Opening cash must be ≥ 0"),
});

export function OpenShiftForm({
  onOpen,
  isSubmitting,
}: {
  onOpen: (cash: number) => void;
  isSubmitting: boolean;
}) {
  const { register, handleSubmit, formState: { errors } } =
    useForm<ManagerShiftOpenFormValues>({ resolver: zodResolver(openSchema), defaultValues: { openingCash: 0 } });

  function onSubmit(values: ManagerShiftOpenFormValues) {
    onOpen(values.openingCash);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 max-w-sm">
      <p className="text-[14px] font-semibold text-text-primary">Open New Shift</p>
      <div className="flex flex-col gap-1">
        <label className="text-[12px] font-semibold text-text-secondary">Opening Cash (₹)</label>
        <input
          {...register("openingCash", { valueAsNumber: true })}
          type="number"
          min={0}
          placeholder="5000"
          className="rounded-lg border border-border bg-input px-3 py-2 text-[13px] text-text-primary placeholder:text-text-disabled focus:border-border-focus focus:outline-none"
        />
        {errors.openingCash && (
          <p className="text-[11px] text-danger">{errors.openingCash.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-[13px] font-semibold text-white hover:bg-primary-hover disabled:opacity-60 transition-colors"
      >
        {isSubmitting && <Loader2 size={14} className="animate-spin" />}
        Open Shift
      </button>
    </form>
  );
}
