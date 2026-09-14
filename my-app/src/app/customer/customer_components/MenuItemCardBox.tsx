import React from "react";
import { Star, Clock, Plus, Minus } from "lucide-react";
import type { AppMenuItem } from "@/types/appTypes";
import { isNonVeg } from "@/app/customer/customer_hooks/useCustomerMenuFilter";

interface MenuItemCardBoxProps {
  item: AppMenuItem;
  cartQty: number;
  onAdd: (itemId: string) => void;
  onUpdateQty?: (itemId: string, delta: number) => void;
}

export function MenuItemCardBox({
  item,
  cartQty,
  onAdd,
  onUpdateQty,
}: MenuItemCardBoxProps) {
  const isNonVegItem = isNonVeg(item);

  return (
    <div
      className={`group relative flex flex-col justify-between gap-3 rounded-2xl border p-3.5 sm:p-4 transition-all duration-200 ${
        cartQty > 0
          ? "border-success/50 bg-success/5 shadow-md ring-1 ring-success/30"
          : "border-border/80 bg-card hover:border-success/40 hover:shadow-md"
      }`}
    >
      {/* Top Header Badge: FSSAI Symbol + Special Tag */}
      <div className="flex items-center justify-between gap-1.5">
        <div
          className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-xs border-2 ${
            isNonVegItem ? "border-danger bg-danger/5" : "border-success bg-success/5"
          }`}
          title={isNonVegItem ? "Non-Vegetarian" : "Vegetarian"}
        >
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              isNonVegItem ? "bg-danger" : "bg-success"
            }`}
          />
        </div>

        {item.isSpecial && (
          <span className="flex items-center gap-1 rounded-full bg-warning/15 border border-warning/30 px-2 py-0.5 text-[10px] font-extrabold text-warning">
            <Star size={18} className="fill-warning" />
            Special
          </span>
        )}
      </div>

      {/* Dish Name & Metadata */}
      <div className="flex flex-col gap-1 my-0.5">
        <h3 className="font-extrabold text-sm sm:text-base text-text-primary leading-snug line-clamp-2 min-h-[2.5rem]">
          {item.name}
        </h3>

        <div className="flex items-center justify-between gap-1 text-[11px] text-text-muted mt-0.5">
          <span className="font-semibold text-text-secondary truncate">{item.category}</span>
          <span className="flex items-center gap-0.5 shrink-0">
            <Clock size={18} /> 15-20m
          </span>
        </div>

        {item.variants && item.variants.length > 0 && (
          <p className="text-[10px] text-text-muted/80 line-clamp-1 mt-0.5 font-medium">
            {item.variants.map((v) => `${v.name} ₹${v.price}`).join(" · ")}
          </p>
        )}
      </div>

      {/* Bottom Price & Full Width Stepper Button */}
      <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] text-text-muted font-medium">Price</span>
          <span className="font-black text-base sm:text-lg text-text-primary">
            ₹{item.price}
          </span>
        </div>

        {!item.isAvailable ? (
          <span className="w-full text-center rounded-xl border border-border bg-page py-2 text-xs font-bold text-text-disabled">
            Out of Stock
          </span>
        ) : cartQty === 0 ? (
          <button
            type="button"
            onClick={() => onAdd(item.id)}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-success/40 bg-success/10 py-2 text-xs font-extrabold text-success hover:bg-success hover:text-white active:scale-95 transition-all shadow-xs"
          >
            <Plus size={18} />
            <span>ADD</span>
          </button>
        ) : (
          <div className="w-full flex items-center justify-between rounded-xl border border-success/50 bg-success/15 p-1 shadow-xs">
            <button
              type="button"
              onClick={() => (onUpdateQty ? onUpdateQty(item.id, -1) : null)}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface text-success hover:bg-success hover:text-white active:scale-90 transition-all font-bold"
              aria-label="Decrease quantity"
            >
              <Minus size={18} />
            </button>
            <span className="font-black text-sm text-text-primary px-2">
              {cartQty}
            </span>
            <button
              type="button"
              onClick={() => onAdd(item.id)}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-success text-white hover:bg-success-hover active:scale-90 transition-all font-bold"
              aria-label="Increase quantity"
            >
              <Plus size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
