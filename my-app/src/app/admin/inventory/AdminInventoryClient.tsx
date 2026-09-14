"use client";
// RESPONSIBILITY: Client-side orchestrator for AdminInventory.
// DATA FLOW: Hooks -> Client Component -> Presentation Components


import React, { useState, useEffect } from "react";
import { AdminInventoryTable } from "@/app/admin/inventory/admin_inventory_components/AdminInventoryTable";
import { AdminAddInventoryModal } from "@/app/admin/inventory/admin_inventory_components/AdminAddInventoryModal";
import { useAdminInventory } from "../admin_hooks/useAdminInventory";
import { Plus } from "lucide-react";
import type { AppInventoryItem } from "@/types/appTypes";

export function AdminInventoryClient() {
  const { inventoryItems, updateStock, deleteInventoryItem, updateExpiryDate, addInventoryItem } = useAdminInventory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleOpenAdd = () => setIsModalOpen(true);

  const handleSave = (values: Omit<AppInventoryItem, "id">) => {
    addInventoryItem(values);
  };

  if (!isMounted) return null;
  
  return (
    <div className="w-full h-full animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Inventory Management</h1>
          <p className="text-sm text-text-secondary">Manage your raw materials, stock levels, and expiry dates.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition-colors"
        >
          <Plus size={16} />
          <span>Add Stock Item</span>
        </button>
      </div>

      <AdminInventoryTable 
        inventoryItems={inventoryItems} 
        onUpdateStock={updateStock} 
        onDelete={deleteInventoryItem} 
        onUpdateExpiry={updateExpiryDate} 
      />

      <AdminAddInventoryModal
        isOpen={isModalOpen}
        onAdd={handleSave}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
