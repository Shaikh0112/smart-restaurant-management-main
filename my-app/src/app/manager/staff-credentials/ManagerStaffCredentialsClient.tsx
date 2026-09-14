// @ts-nocheck
"use client";

import React, { useState } from "react";
import { Users, Eye, EyeOff } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/localStorageSeeder";
import type { AppUser, UserRole } from "@/types/appTypes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const staffSchema = z.object({
  name: z.string().min(1, "Staff Name is required"),
  role: z.enum(["CASHIER", "WAITER", "KITCHEN", "MANAGER"]),
  phone: z.string().min(1, "Phone Number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type StaffFormData = z.infer<typeof staffSchema>;

export default function ManagerStaffCredentialsClient() {
  const [users, setUsers] = useLocalStorage<AppUser[]>(STORAGE_KEYS.USERS, []);
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: "",
      role: "CASHIER",
      phone: "",
      password: "",
    },
  });

  const onSubmit = (data: StaffFormData) => {
    const newUser: AppUser = {
      id: `usr_${Date.now()}`,
      username: data.phone,
      passwordHash: data.password,
      role: data.role,
      name: data.name,
      phone: data.phone,
      createdByAdmin: true,
      createdAt: Date.now(),
      isActive: true,
    };

    setUsers([...users, newUser]);
    reset();
  };

  return (
    <div className="min-h-screen bg-page p-4 sm:p-6 lg:p-8 text-text-primary">
      <div className="mx-auto max-w-4xl flex flex-col gap-6">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
              <Users size={24} />
            </div>
            <div>
              <h1 className="font-black text-2xl text-text-primary">
                Staff Credentials Manager
              </h1>
              <p className="text-xs text-text-secondary">
                Generate and manage secure login access for your restaurant staff
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-4 shadow-sm">
            <h3 className="font-black text-sm text-text-primary flex items-center gap-2">
              <Users size={18} className="text-primary" />
              <span>Create New Staff Account Login</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-bold text-text-secondary block mb-1">Staff Name</label>
                <input
                  type="text"
                  {...register("name")}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full rounded-xl border border-border bg-input p-2.5 text-xs text-text-primary focus:border-primary focus:outline-none"
                />
                {errors.name && <p className="mt-1 text-[10px] text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <label className="text-[11px] font-bold text-text-secondary block mb-1">Role</label>
                <select
                  {...register("role")}
                  className="w-full rounded-xl border border-border bg-input p-2.5 text-xs text-text-primary focus:border-primary focus:outline-none"
                >
                  <option value="CASHIER">CASHIER</option>
                  <option value="WAITER">WAITER</option>
                  <option value="KITCHEN">KITCHEN</option>
                </select>
                {errors.role && <p className="mt-1 text-[10px] text-red-500">{errors.role.message}</p>}
              </div>

              <div>
                <label className="text-[11px] font-bold text-text-secondary block mb-1">Phone Number (Login ID)</label>
                <input
                  type="tel"
                  {...register("phone")}
                  placeholder="9876543210"
                  className="w-full rounded-xl border border-border bg-input p-2.5 text-xs text-text-primary focus:border-primary focus:outline-none"
                />
                {errors.phone && <p className="mt-1 text-[10px] text-red-500">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="text-[11px] font-bold text-text-secondary block mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-border bg-input p-2.5 pr-10 text-xs text-text-primary focus:border-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-[10px] text-red-500">{errors.password.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              className="self-end rounded-xl bg-primary px-5 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-primary/90 transition-colors"
            >
              Add Staff Member
            </button>
          </form>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h4 className="font-bold text-xs text-text-primary mb-4">Active Staff Accounts ({users.length})</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {users.map((u) => (
                <div key={u.id} className="p-3 rounded-xl border border-border bg-surface flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Users size={14} />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-text-primary">{u.name}</p>
                      <p className="text-[10px] text-text-muted">{u.phone}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-primary/10 border border-primary/30 px-2 py-0.5 text-[10px] font-black text-primary">
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
