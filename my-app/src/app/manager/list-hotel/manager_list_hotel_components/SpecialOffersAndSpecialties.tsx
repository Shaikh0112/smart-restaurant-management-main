import React from 'react';
import { Tag, Star } from 'lucide-react';

interface SpecialOffersAndSpecialtiesProps {
  offersInput: string;
  setOffersInput: (val: string) => void;
  specialtiesInput: string;
  setSpecialtiesInput: (val: string) => void;
}

export function SpecialOffersAndSpecialties({
  offersInput,
  setOffersInput,
  specialtiesInput,
  setSpecialtiesInput
}: SpecialOffersAndSpecialtiesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-2">
          <Tag size={20} className="text-rose-500" /> Special Offers
        </h2>
        <p className="text-xs text-text-secondary mb-3">Comma separated offers.</p>
        <textarea 
          value={offersInput}
          onChange={(e) => setOffersInput(e.target.value)}
          className="w-full bg-input border border-border rounded-xl p-3 text-sm text-text-primary min-h-[80px] focus:outline-none focus:border-primary"
          placeholder="20% off on weekends, Free dessert with thali"
        />
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-2">
          <Star size={20} className="text-amber-500" /> Signature Specialties
        </h2>
        <p className="text-xs text-text-secondary mb-3">Comma separated dishes.</p>
        <textarea 
          value={specialtiesInput}
          onChange={(e) => setSpecialtiesInput(e.target.value)}
          className="w-full bg-input border border-border rounded-xl p-3 text-sm text-text-primary min-h-[80px] focus:outline-none focus:border-primary"
          placeholder="Hyderabadi Dum Biryani, Filter Coffee"
        />
      </div>
    </div>
  );
}
