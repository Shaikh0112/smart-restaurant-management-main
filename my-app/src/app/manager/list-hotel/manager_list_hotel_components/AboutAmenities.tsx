import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface AboutAmenitiesProps {
  descriptionInput: string;
  setDescriptionInput: (val: string) => void;
  amenitiesInput: string;
  setAmenitiesInput: (val: string) => void;
}

export function AboutAmenities({
  descriptionInput,
  setDescriptionInput,
  amenitiesInput,
  setAmenitiesInput
}: AboutAmenitiesProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-bold flex items-center gap-2 mb-2">
        <ShieldCheck size={20} className="text-success" /> About & Amenities
      </h2>
      <div className="space-y-4 mt-4">
        <div>
          <label className="text-xs font-semibold text-text-secondary block mb-1">Rich Description</label>
          <textarea 
            value={descriptionInput}
            onChange={(e) => setDescriptionInput(e.target.value)}
            className="w-full bg-input border border-border rounded-xl p-3 text-sm text-text-primary min-h-[120px] focus:outline-none focus:border-primary"
            placeholder="Welcome to our wonderful restaurant... Tell your story!"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-text-secondary block mb-1">Amenities (Comma separated)</label>
          <input 
            type="text"
            value={amenitiesInput}
            onChange={(e) => setAmenitiesInput(e.target.value)}
            className="w-full bg-input border border-border rounded-xl p-3 text-sm text-text-primary focus:outline-none focus:border-primary"
            placeholder="e.g. Valet Parking, Free WiFi"
          />
        </div>
      </div>
    </div>
  );
}
