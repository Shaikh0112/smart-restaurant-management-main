// RESPONSIBILITY: Presentation component for StaffAddModal.
// DATA FLOW: Props -> Component -> UI

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { UserRole } from "@/types/appTypes";
import { RefreshCw, Key, AlertCircle, CheckCircle2 } from "lucide-react";
import { SearchableDropdown } from "@/components/ui/SearchableDropdown";

interface StaffAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (staffData: {
    staffName: string;
    staffPhone: string;
    staffRole: UserRole;
    username: string;
    passwordHash: string;
  }) => { success: boolean; error?: string };
}

const staffSchema = z.object({
  staffName: z.string().min(2, "Name must be at least 2 characters"),
  staffRole: z.enum(["CASHIER", "WAITER", "KITCHEN"]),
  staffPhone: z.string().optional(),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type StaffFormValues = z.infer<typeof staffSchema>;

const ROLE_OPTIONS = [
  { value: "CASHIER", label: "CASHIER (POS Billing Terminal Access)" },
  { value: "WAITER", label: "WAITER (Floor Captain App Access)" },
  { value: "KITCHEN", label: "KITCHEN (KDS Terminal Access)" },
];

export function StaffAddModal({ isOpen, onClose, onAdd }: StaffAddModalProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      staffName: "",
      staffRole: "CASHIER",
      staffPhone: "",
      username: "",
      password: "",
    },
  });

  const staffName = watch("staffName");
  const staffRole = watch("staffRole");

  const generateRandomPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let pass = "";
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setValue("password", pass, { shouldValidate: true, shouldDirty: true });
  };

  useEffect(() => {
    if (isOpen) {
      generateRandomPassword();
    } else {
      reset();
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [isOpen, reset]);

  // Auto-generate username when name or role changes
  useEffect(() => {
    if (staffName && staffName.trim()) {
      const cleanName = staffName.trim().toLowerCase().replace(/\s+/g, "");
      const suggestedUsername = `${staffRole.toLowerCase()}_${cleanName}`;
      setValue("username", suggestedUsername, { shouldValidate: true });
    }
  }, [staffName, staffRole, setValue]);

  const onSubmit = (data: StaffFormValues) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    const result = onAdd({ 
      staffName: data.staffName, 
      staffPhone: data.staffPhone || "", 
      staffRole: data.staffRole, 
      username: data.username, 
      passwordHash: data.password 
    });

    if (!result.success) {
      setErrorMsg(result.error || "Failed to create staff.");
    } else {
      setSuccessMsg(`Credentials generated successfully for ${data.staffName.trim()}!`);
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-text-primary">Generate Staff Credentials</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          >
            ---
          </button>
        </div>

        {errorMsg && (
          <div className="mb-3 flex items-center gap-2 rounded bg-danger-bg/20 p-2.5 text-xs text-danger">
            <AlertCircle size={14} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-3 flex items-center gap-2 rounded bg-success-bg/20 p-2.5 text-xs text-success">
            <CheckCircle2 size={14} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-xs">
          <div>
            <label className="mb-1 block font-semibold text-text-secondary uppercase">
              Staff Full Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              {...register("staffName")}
              placeholder="e.g. Ramesh Verma"
              className="w-full rounded-md border border-border bg-input px-3 py-2 text-text-primary focus:border-border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            {errors.staffName && <p className="mt-1 text-xs text-danger">{errors.staffName.message}</p>}
          </div>

          <div>
            <label className="mb-1 block font-semibold text-text-secondary uppercase">
              Assigned Staff Role <span className="text-danger">*</span>
            </label>
            <Controller
              name="staffRole"
              control={control}
              render={({ field }) => (
                <SearchableDropdown
                  options={ROLE_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select Role"
                />
              )}
            />
            {errors.staffRole && <p className="mt-1 text-xs text-danger">{errors.staffRole.message}</p>}
          </div>

          <div>
            <label className="mb-1 block font-semibold text-text-secondary uppercase">Phone Number</label>
            <input
              type="tel"
              {...register("staffPhone")}
              placeholder="e.g. 9876543210"
              className="w-full rounded-md border border-border bg-input px-3 py-2 text-text-primary focus:border-border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold text-text-secondary uppercase">
              System ID / Username <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              {...register("username")}
              placeholder="e.g. cashier_ramesh"
              className="w-full rounded-md border border-border bg-input px-3 py-2 font-mono font-semibold text-primary focus:border-border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            {errors.username && <p className="mt-1 text-xs text-danger">{errors.username.message}</p>}
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="font-semibold text-text-secondary uppercase">
                System Password <span className="text-danger">*</span>
              </label>
              <button
                type="button"
                onClick={generateRandomPassword}
                className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
              >
                <RefreshCw size={12} />
                Regenerate
              </button>
            </div>
            <div className="relative">
              <Key size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled" />
              <input
                type="text"
                {...register("password")}
                className="w-full rounded-md border border-border bg-input py-2 pl-8 pr-3 font-mono text-xs font-bold text-text-primary focus:border-border-focus focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
            {errors.password && <p className="mt-1 text-xs text-danger">{errors.password.message}</p>}
          </div>

          <div className="mt-4 flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-border px-3 py-1.5 font-medium text-text-secondary hover:bg-primary/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-1.5 font-semibold text-white shadow-sm hover:bg-primary-hover"
            >
              Save Credentials
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
