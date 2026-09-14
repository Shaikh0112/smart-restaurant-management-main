import React from "react";
import { Utensils } from "lucide-react";
import type { AppMenuItem } from "@/types/appTypes";

interface ManagerMenuQuickCreatorProps {
  menuForm: {
    name: string;
    price: number;
    category: string;
    station: AppMenuItem["station"];
  };
  setMenuForm: React.Dispatch<React.SetStateAction<{
    name: string;
    price: number;
    category: string;
    station: AppMenuItem["station"];
  }>>;
  handleCreateMenuItem: (e: React.FormEvent) => void;
  menuItems: AppMenuItem[];
}

export function ManagerMenuQuickCreator({
  menuForm,
  setMenuForm,
  handleCreateMenuItem,
  menuItems,
}: ManagerMenuQuickCreatorProps) {
  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleCreateMenuItem} className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-4">
        <h3 className="font-black text-sm text-text-primary flex items-center gap-2">
          <Utensils size={18} className="text-emerald-500" />
          <span>Create New Menu Dish Item</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-[11px] font-bold text-text-secondary block mb-1">Dish Name</label>
            <input
              type="text"
              required
              value={menuForm.name}
              onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
              placeholder="e.g. Paneer Butter Masala"
              className="w-full rounded-xl border border-border bg-input p-2.5 text-xs text-text-primary"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-text-secondary block mb-1">Price (₹)</label>
            <input
              type="number"
              required
              value={menuForm.price}
              onChange={(e) => setMenuForm({ ...menuForm, price: Number(e.target.value) })}
              placeholder="240"
              className="w-full rounded-xl border border-border bg-input p-2.5 text-xs text-text-primary"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-text-secondary block mb-1">Category</label>
            <input
              type="text"
              value={menuForm.category}
              onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
              placeholder="Main Course"
              className="w-full rounded-xl border border-border bg-input p-2.5 text-xs text-text-primary"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-text-secondary block mb-1">Kitchen Station</label>
            <select
              value={menuForm.station}
              onChange={(e) => setMenuForm({ ...menuForm, station: e.target.value as any })}
              className="w-full rounded-xl border border-border bg-input p-2.5 text-xs text-text-primary"
            >
              <option value="Kitchen">Kitchen</option>
              <option value="Bar">Bar</option>
              <option value="Bakery">Bakery</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="self-end rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-emerald-600"
        >
          Add Menu Dish
        </button>
      </form>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h4 className="font-bold text-xs text-text-primary mb-3">Menu Master Items ({menuItems.length})</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {menuItems.map((m) => (
            <div key={m.id} className="p-3 rounded-xl border border-border bg-surface flex flex-col justify-between">
              <p className="font-bold text-xs text-text-primary">{m.name}</p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50 text-[11px]">
                <span className="text-text-muted">{m.category}</span>
                <span className="font-black text-emerald-500">₹{m.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
