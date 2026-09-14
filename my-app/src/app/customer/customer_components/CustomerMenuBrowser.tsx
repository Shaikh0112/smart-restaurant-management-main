// @ts-nocheck
"use client";

import React, { useMemo } from "react";
import { ThemeToggle } from "@/components/Theme/ThemeToggle";
import { Search, ShoppingCart, UtensilsCrossed, X, Receipt } from "lucide-react";
import type { CustomerMenuBrowserProps } from "@/app/customer/customer_types/CustomerTypes";
import { useCustomerMenuFilter } from "@/app/customer/customer_hooks/useCustomerMenuFilter";
import { CustomerMenuCategoryTabs } from "@/app/customer/customer_components/CustomerMenuCategoryTabs";
import { CustomerMenuItemList } from "@/app/customer/customer_components/CustomerMenuItemList";
import { ChevronRight } from "lucide-react";

export function CustomerMenuBrowser({
  menuItems,
  cart,
  activeOrder,
  onAddToCart,
  onOpenCart,
  onViewRunningOrder,
  onUpdateQty,
  isLoadingMenu,
}: CustomerMenuBrowserProps) {
  const {
    search,
    setSearch,
    dietaryFilter,
    setDietaryFilter,
    selectedCategory,
    setSelectedCategory,
    currentPage,
    setCurrentPage,
    categoriesList,
    filteredItems,
    paginatedItems,
    totalPages,
    resetFilters,
  } = useCustomerMenuFilter(menuItems);

  // Cart Quantities Map
  const cartQtyMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of cart) {
      map.set(item.itemId, (map.get(item.itemId) || 0) + item.qty);
    }
    return map;
  }, [cart]);

  const cartQtyTotal = useMemo(() => cart.reduce((sum, c) => sum + c.qty, 0), [cart]);
  const cartSubtotal = useMemo(() => cart.reduce((sum, c) => sum + (c.unitPrice * c.qty), 0), [cart]);

  return (
    <div className="flex flex-col min-h-screen pb-32">
      {/* Top Header & Restaurant Branding Bar */}
      <div className="sticky top-0 z-20 flex flex-col gap-3 border-b border-border bg-header/90 p-4 backdrop-blur-md shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/30">
              <UtensilsCrossed size={18} />
            </div>
            <div>
              <h1 className="font-extrabold text-base text-text-primary tracking-tight">
                Royal Spice Bistro 
              </h1>
              <p className="text-xs text-text-secondary flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-full bg-success animate-ping" />
                Live Self-Order Menu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {cartQtyTotal > 0 && (
              <button
                onClick={onOpenCart}
                className="relative flex items-center gap-1.5 rounded-xl bg-success px-3.5 h-9 text-xs font-extrabold text-white shadow-md hover:bg-success-hover active:scale-95 transition-all"
              >
                <ShoppingCart size={18} />
                <span>Cart</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-success-hover text-[11px] font-black">
                  {cartQtyTotal}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Active Running Order Notification Bar */}
        {activeOrder && (
          <div className="flex items-center justify-between gap-2 rounded-xl border border-warning/40 bg-warning/10 p-2.5 shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2 text-xs">
              <span className="flex h-2 w-2 rounded-full bg-warning animate-ping" />
              <div>
                <p className="font-extrabold text-text-primary">Active Dining Order</p>
                <p className="text-[10px] text-text-secondary">Dishes prep status live on KDS</p>
              </div>
            </div>
            {onViewRunningOrder && (
              <button
                onClick={onViewRunningOrder}
                className="flex items-center gap-1 rounded-lg bg-warning px-3 py-1 text-xs font-extrabold text-black shadow-xs hover:bg-warning-hover active:scale-95 transition-all"
              >
                <Receipt size={18} />
                <span>Track Order</span>
              </button>
            )}
          </div>
        )}

        {/* Search Input Box */}
        <div className="relative mt-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search favorite dishes, starters, drinks…"
            className="w-full rounded-2xl border border-border/80 bg-input/80 py-2.5 pl-10 pr-9 text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:border-success focus:outline-none transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <CustomerMenuCategoryTabs
          categoriesList={categoriesList}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          dietaryFilter={dietaryFilter}
          setDietaryFilter={setDietaryFilter}
        />
      </div>

      <CustomerMenuItemList
        selectedCategory={selectedCategory}
        filteredItems={filteredItems}
        paginatedItems={paginatedItems}
        cartQtyMap={cartQtyMap}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        onAddToCart={onAddToCart}
        onUpdateQty={onUpdateQty}
        resetFilters={resetFilters}
        isLoading={isLoadingMenu}
      />

      {/* Sticky Floating Bottom Order Bar */}
      {cartQtyTotal > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 animate-in slide-in-from-bottom-5">
          <button
            type="button"
            onClick={onOpenCart}
            className="flex w-full items-center justify-between rounded-2xl bg-success px-5 py-3.5 text-white shadow-xl hover:bg-success-hover active:scale-98 transition-all ring-4 ring-success/20"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 font-black text-sm text-white">
                {cartQtyTotal}
              </div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-sm">View Cart Summary</span>
                <span className="text-xs text-white/90 font-medium">
                  Total: <strong className="font-black">₹{cartSubtotal}</strong> + Taxes
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 font-extrabold text-xs bg-white/20 px-3 py-1.5 rounded-xl">
              <span>Checkout</span>
              <ChevronRight size={18} />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
