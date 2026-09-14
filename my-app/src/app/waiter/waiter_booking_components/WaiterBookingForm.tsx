// RESPONSIBILITY: Booking form using React Hook Form and Zod.
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MapPin, Info } from "lucide-react";
import { useCreateReservationMutation } from "@/app/waiter/waiter_hooks/useWaiterMutations";
import { WaiterPaymentModal } from "./WaiterPaymentModal";
import { showToast } from "@/lib/toastService";

const bookingSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerPhone: z.string().regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
  guestCount: z.number().min(1, "At least 1 guest required"),
  bookingDate: z.string().min(1, "Date is required"),
  bookingTime: z.string().min(1, "Time is required"),
  specialRequests: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export function WaiterBookingForm() {
  const router = useRouter();
  const createReservationMutation = useCreateReservationMutation();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const ADVANCE_RATE = 200; // Mocked fetched rate

  const { register, handleSubmit, watch, formState: { errors, isDirty } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { guestCount: 1 }
  });

  const guestCount = watch("guestCount") || 1;
  const advanceAmount = guestCount * ADVANCE_RATE;

  // Unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const [formData, setFormData] = useState<BookingFormValues | null>(null);

  function onSubmit(data: BookingFormValues) {
    setFormData(data);
    setIsPaymentOpen(true);
  }

  function handlePaymentSuccess(transactionId: string) {
    setIsPaymentOpen(false);
    
    if (formData) {
      createReservationMutation.mutate({
        ...formData,
        transactionId,
        paymentStatus: "PAID",
        advancePaid: advanceAmount
      }, {
        onSuccess: () => {
          showToast({ type: "success", title: "Reservation Confirmed", message: "Booking has been secured." });
          router.push("/waiter/reservations");
        }
      });
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Brand Header */}
      <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-surface">
          {/* Mock image placeholder until real tenant logo */}
          <div className="h-full w-full bg-primary/20 flex items-center justify-center font-bold text-primary">LOGO</div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-text-primary">Restaurant Booking</h1>
          <p className="flex items-center gap-1 text-sm text-text-secondary">
            <MapPin size={14} /> Main Branch
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-bold text-text-primary border-b border-border pb-3">Guest Details</h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary">Customer Name</label>
            <input 
              {...register("customerName")}
              className="rounded-md border border-border bg-input px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none" 
              placeholder="Enter name"
            />
            {errors.customerName && <span className="text-xs text-danger">{errors.customerName.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary">Phone Number</label>
            <input 
              {...register("customerPhone")}
              className="rounded-md border border-border bg-input px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none" 
              placeholder="10 digit number"
              maxLength={10}
            />
            {errors.customerPhone && <span className="text-xs text-danger">{errors.customerPhone.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary">Guest Count</label>
            <input 
              type="number"
              min="1"
              onKeyDown={(e) => ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()}
              {...register("guestCount", { valueAsNumber: true })}
              className="rounded-md border border-border bg-input px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none" 
            />
            {errors.guestCount && <span className="text-xs text-danger">{errors.guestCount.message}</span>}
          </div>
        </div>

        <h2 className="text-lg font-bold text-text-primary border-b border-border pb-3 mt-4">Schedule</h2>
        
        <div className="grid gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-secondary">Date</label>
            <input 
              type="date"
              {...register("bookingDate")}
              className="rounded-md border border-border bg-input px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none w-full md:w-1/2" 
            />
            {errors.bookingDate && <span className="text-xs text-danger">{errors.bookingDate.message}</span>}
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold text-text-secondary">Time Slot</label>
            <input type="hidden" {...register("bookingTime")} />
            
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-disabled">Lunch</span>
              <div className="flex flex-wrap gap-2">
                {["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00"].map((time) => {
                  const isSelected = watch("bookingTime") === time;
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => register("bookingTime").onChange({ target: { name: "bookingTime", value: time }})}
                      className={[
                        "rounded-md border px-4 py-2 text-sm font-semibold transition-all active:scale-95",
                        isSelected 
                          ? "border-primary bg-primary text-white shadow-sm" 
                          : "border-border bg-page text-text-secondary hover:border-primary/50 hover:text-text-primary"
                      ].join(" ")}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-disabled">Dinner</span>
              <div className="flex flex-wrap gap-2">
                {["18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"].map((time) => {
                  const isSelected = watch("bookingTime") === time;
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => register("bookingTime").onChange({ target: { name: "bookingTime", value: time }})}
                      className={[
                        "rounded-md border px-4 py-2 text-sm font-semibold transition-all active:scale-95",
                        isSelected 
                          ? "border-primary bg-primary text-white shadow-sm" 
                          : "border-border bg-page text-text-secondary hover:border-primary/50 hover:text-text-primary"
                      ].join(" ")}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
            {errors.bookingTime && <span className="text-xs text-danger">{errors.bookingTime.message}</span>}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-lg bg-surface p-4 border border-border">
          <div className="flex items-start gap-3">
            <Info size={18} className="text-info shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-text-primary">Advance Payment Required</span>
              <span className="text-xs text-text-secondary">₹{ADVANCE_RATE} per person is required to secure this booking.</span>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="font-semibold text-text-secondary">Total Advance Amount</span>
            <span className="text-xl font-bold text-primary">₹{advanceAmount}</span>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={createReservationMutation.isPending}
          className="mt-4 w-full rounded-lg bg-primary py-3 text-sm font-bold text-white transition-colors hover:bg-primary-hover disabled:opacity-50 active:scale-95"
        >
          Proceed to Pay ₹{advanceAmount}
        </button>
      </form>

      <WaiterPaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        amount={advanceAmount}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
