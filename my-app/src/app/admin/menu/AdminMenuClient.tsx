"use client";
// RESPONSIBILITY: Client-side orchestrator for AdminMenu.
// DATA FLOW: Hooks -> Client Component -> Presentation Components


import React, { useState, useEffect } from "react";
import { AdminMenuTable } from "@/app/admin/menu/admin_menu_components/AdminMenuTable";
import { AdminMenuFormModal } from "@/app/admin/menu/admin_menu_components/AdminMenuFormModal";
import { useAdminMenu } from "../admin_hooks/useAdminMenu";
import { Plus } from "lucide-react";
import type { AppMenuItem } from "@/types/appTypes";
import type { AdminMenuFormValues } from "@/app/admin/admin_types/AdminTypes";

export function AdminMenuClient() {
  const { menuItems, inventoryItems, addMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability, saveRecipe } = useAdminMenu();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<AppMenuItem | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleOpenAdd = () => {
    setEditItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AppMenuItem) => {
    setEditItem(item);
    setIsModalOpen(true);
  };

  const handleSave = (values: AdminMenuFormValues) => {
    if (editItem) {
      updateMenuItem(editItem.id, values);
    } else {
      addMenuItem(values);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="w-full h-full animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Menu Management</h1>
          <p className="text-sm text-text-secondary">Manage your restaurant menu items and variants.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary-hover transition-colors"
        >
          <Plus size={16} />
          <span>Add Menu Item</span>
        </button>
      </div>

      <AdminMenuTable 
        menuItems={menuItems} 
        onEdit={handleOpenEdit} 
        onDelete={(id) => deleteMenuItem(id)} 
        onToggleAvailability={toggleAvailability} 
      />

      <AdminMenuFormModal
        isOpen={isModalOpen}
        editItem={editItem}
        inventoryItems={inventoryItems}
        onSave={handleSave}
        onSaveRecipe={(itemId, recipe) => saveRecipe(itemId, recipe)}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
