import React from 'react';
import { Camera, Plus, Trash2 } from 'lucide-react';
import type {  AppTenantSpecialItem  } from "@/types/appTypes";

interface FeaturedItemsProps {
  featuredItems: AppTenantSpecialItem[];
  addFeaturedItem: () => void;
  removeFeaturedItem: (index: number) => void;
  updateFeaturedItem: (index: number, field: keyof AppTenantSpecialItem, value: string) => void;
}

export function FeaturedItems({
  featuredItems,
  addFeaturedItem,
  removeFeaturedItem,
  updateFeaturedItem
}: FeaturedItemsProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Camera size={20} className="text-primary" /> Featured Items
        </h2>
        <button 
          onClick={addFeaturedItem}
          className="flex items-center gap-1 text-xs font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors"
        >
          <Plus size={14} /> Add Item
        </button>
      </div>
      
      <p className="text-xs text-text-secondary mb-4">Highlight your signature dishes with images and descriptions to entice customers.</p>
      
      {featuredItems.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-border rounded-xl text-text-muted text-sm font-medium">
          No featured items added yet. Click "Add Item" to start.
        </div>
      ) : (
        <div className="space-y-4">
          {featuredItems.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-4 p-4 border border-border rounded-xl bg-surface/50 relative group">
              <button 
                onClick={() => removeFeaturedItem(index)}
                className="absolute top-3 right-3 text-text-muted hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
              
              <div className="w-full sm:w-1/3 flex-shrink-0">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1 block">Image URL</label>
                <input 
                  type="text"
                  value={item.imageUrl}
                  onChange={(e) => updateFeaturedItem(index, 'imageUrl', e.target.value)}
                  className="w-full bg-input border border-border rounded-lg p-2 text-xs text-text-primary focus:outline-none focus:border-primary"
                  placeholder="https://..."
                />
                {item.imageUrl && (
                  <div className="mt-2 h-20 rounded-lg overflow-hidden border border-border">
                    <img src={item.imageUrl} alt="preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                  </div>
                )}
              </div>
              
              <div className="w-full sm:w-2/3 space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1 block">Item Name</label>
                  <input 
                    type="text"
                    value={item.name}
                    onChange={(e) => updateFeaturedItem(index, 'name', e.target.value)}
                    className="w-full bg-input border border-border rounded-lg p-2 text-xs text-text-primary focus:outline-none focus:border-primary font-bold"
                    placeholder="e.g. Royal Chicken Biryani"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1 block">Short Description</label>
                  <input 
                    type="text"
                    value={item.description || ""}
                    onChange={(e) => updateFeaturedItem(index, 'description', e.target.value)}
                    className="w-full bg-input border border-border rounded-lg p-2 text-xs text-text-primary focus:outline-none focus:border-primary"
                    placeholder="Aromatic basmati rice cooked with tender chicken..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
