import React from "react";
import { Building2, X, ArrowRight } from "lucide-react";

interface ManagerHotelOnboardingModalProps {
  isCreateHotelOpen: boolean;
  setIsCreateHotelOpen: (open: boolean) => void;
  hotelForm: {
    restaurantName: string;
    tagline: string;
    city: string;
    address: string;
    landmark: string;
    pincode: string;
    cuisineTypes: string;
    costForTwo: number;
    fssaiNumber: string;
    gstinNumber: string;
    upiVpa: string;
    logoUrl: string;
    bannerUrl: string;
  };
  setHotelForm: React.Dispatch<React.SetStateAction<any>>;
  handleCreateHotel: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export function ManagerHotelOnboardingModal({
  isCreateHotelOpen,
  setIsCreateHotelOpen,
  hotelForm,
  setHotelForm,
  handleCreateHotel,
  isSubmitting,
}: ManagerHotelOnboardingModalProps) {
  if (!isCreateHotelOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-background/60 backdrop-blur-md border border-border/50 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
          <div className="flex items-center gap-2 text-primary font-black text-lg">
            <Building2 size={22} />
            <span>Create Your Restaurant Profile</span>
          </div>
          <button
            onClick={() => setIsCreateHotelOpen(false)}
            className="text-text-muted hover:text-text-primary"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleCreateHotel} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-text-secondary block mb-1">Restaurant Name *</label>
              <input
                type="text"
                required
                value={hotelForm.restaurantName}
                onChange={(e) => setHotelForm({ ...hotelForm, restaurantName: e.target.value })}
                placeholder="e.g. Royal Spice Bistro"
                className="w-full rounded-xl border border-border bg-input p-2.5 text-xs text-text-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-text-secondary block mb-1">Tagline</label>
              <input
                type="text"
                value={hotelForm.tagline}
                onChange={(e) => setHotelForm({ ...hotelForm, tagline: e.target.value })}
                placeholder="Authentic Fine Dining"
                className="w-full rounded-xl border border-border bg-input p-2.5 text-xs text-text-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-text-secondary block mb-1">City *</label>
              <select
                value={hotelForm.city}
                onChange={(e) => setHotelForm({ ...hotelForm, city: e.target.value })}
                className="w-full rounded-xl border border-border bg-input p-2.5 text-xs text-text-primary"
              >
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Pune">Pune</option>
                <option value="Goa">Goa</option>
                <option value="Jaipur">Jaipur</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-text-secondary block mb-1">Cuisines Offered</label>
              <input
                type="text"
                value={hotelForm.cuisineTypes}
                onChange={(e) => setHotelForm({ ...hotelForm, cuisineTypes: e.target.value })}
                placeholder="North Indian, Chinese, Biryani"
                className="w-full rounded-xl border border-border bg-input p-2.5 text-xs text-text-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-text-secondary block mb-1">FSSAI License Number</label>
              <input
                type="text"
                value={hotelForm.fssaiNumber}
                onChange={(e) => setHotelForm({ ...hotelForm, fssaiNumber: e.target.value })}
                placeholder="11223344556677"
                className="w-full rounded-xl border border-border bg-input p-2.5 text-xs text-text-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-text-secondary block mb-1">GSTIN Number</label>
              <input
                type="text"
                value={hotelForm.gstinNumber}
                onChange={(e) => setHotelForm({ ...hotelForm, gstinNumber: e.target.value })}
                placeholder="29AAAAA0000A1Z5"
                className="w-full rounded-xl border border-border bg-input p-2.5 text-xs text-text-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-text-secondary block mb-1">Full Physical Address *</label>
            <textarea
              required
              rows={2}
              value={hotelForm.address}
              onChange={(e) => setHotelForm({ ...hotelForm, address: e.target.value })}
              placeholder="100 Feet Road, Indiranagar, Bengaluru"
              className="w-full rounded-xl border border-border bg-input p-2.5 text-xs text-text-primary"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 font-black text-xs text-white shadow-xl hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Submitting to Super Admin…</span>
            ) : (
              <>
                <span>Submit Restaurant Profile for Super Admin Approval</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
