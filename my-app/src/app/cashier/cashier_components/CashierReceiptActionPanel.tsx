"use client";
import { Printer, MessageCircle, Mail, Send, Check } from "lucide-react";
import { Controller } from "react-hook-form";

export function CashierReceiptActionPanel({
  handleSubmit,
  onSubmit,
  control,
  errors,
  selectedMedium,
  sentSuccessMsg,
  onClose,
}: any) {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 border-t border-border bg-page px-5 py-4 print:hidden">
      
      <div className="flex gap-2 p-1 bg-input rounded-xl mb-1">
        <Controller
          name="medium"
          control={control}
          render={({ field }) => (
            <>
              <label className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg cursor-pointer motion-safe:transition-all ${field.value === "PRINT" ? "bg-primary text-white shadow-sm" : "text-text-secondary hover:bg-surface-hover"}`}>
                <input type="radio" value="PRINT" className="hidden" checked={field.value === "PRINT"} onChange={() => field.onChange("PRINT")} />
                <Printer size={18} strokeWidth={2} />
                <span className="text-xs font-bold">Print</span>
              </label>
              <label className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg cursor-pointer motion-safe:transition-all ${field.value === "WHATSAPP" ? "bg-emerald-600 text-white shadow-sm" : "text-text-secondary hover:bg-surface-hover"}`}>
                <input type="radio" value="WHATSAPP" className="hidden" checked={field.value === "WHATSAPP"} onChange={() => field.onChange("WHATSAPP")} />
                <MessageCircle size={18} strokeWidth={2} />
                <span className="text-xs font-bold">WhatsApp</span>
              </label>
              <label className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg cursor-pointer motion-safe:transition-all ${field.value === "EMAIL" ? "bg-blue-600 text-white shadow-sm" : "text-text-secondary hover:bg-surface-hover"}`}>
                <input type="radio" value="EMAIL" className="hidden" checked={field.value === "EMAIL"} onChange={() => field.onChange("EMAIL")} />
                <Mail size={18} strokeWidth={2} />
                <span className="text-xs font-bold">Email</span>
              </label>
            </>
          )}
        />
      </div>

      {selectedMedium === "WHATSAPP" && (
        <div className="flex flex-col gap-1">
          <Controller
            name="waPhone"
            control={control}
            render={({ field }) => (
              <input
                type="tel"
                maxLength={10}
                {...field}
                onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 10-digit number"
                className={`w-full rounded-xl border ${errors.waPhone ? 'border-destructive' : 'border-border'} bg-input px-3.5 py-2.5 text-xs font-bold text-text-primary focus:border-emerald-500 focus:outline-none`}
              />
            )}
          />
          {errors.waPhone && <span className="text-xs text-destructive">{errors.waPhone.message}</span>}
        </div>
      )}

      {selectedMedium === "EMAIL" && (
        <div className="flex flex-col gap-1">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <input
                type="email"
                {...field}
                placeholder="Enter email address"
                className={`w-full rounded-xl border ${errors.email ? 'border-destructive' : 'border-border'} bg-input px-3.5 py-2.5 text-xs font-bold text-text-primary focus:border-blue-500 focus:outline-none`}
              />
            )}
          />
          {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
        </div>
      )}

      {sentSuccessMsg && (
        <div className="flex items-center gap-1.5 rounded-lg bg-emerald-500/15 p-2 text-xs font-bold text-emerald-500">
          <Check size={18} strokeWidth={2} />
          <span>{sentSuccessMsg}</span>
        </div>
      )}

      <button
        type="submit"
        className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow-md motion-safe:transition-all active:scale-98 ${
          selectedMedium === 'PRINT' ? 'bg-primary hover:bg-primary-hover' :
          selectedMedium === 'WHATSAPP' ? 'bg-emerald-600 hover:bg-emerald-500' :
          'bg-blue-600 hover:bg-blue-500'
        }`}
      >
        {selectedMedium === "PRINT" ? <Printer size={18} strokeWidth={2} /> : <Send size={18} strokeWidth={2} />}
        <span>
          {selectedMedium === "PRINT" ? "Print Thermal Paper Receipt" : 
           selectedMedium === "WHATSAPP" ? "Send to WhatsApp" : "Send to Email"}
        </span>
      </button>

      <button
        type="button"
        onClick={onClose}
        className="w-full rounded-xl border border-border py-2 text-xs font-bold text-text-secondary hover:bg-surface-hover hover:text-text-primary motion-safe:transition-colors"
      >
        Complete & Close Checkout
      </button>
    </form>
  );
}
