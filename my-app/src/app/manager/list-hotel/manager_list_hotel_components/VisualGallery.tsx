import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface VisualGalleryProps {
  galleryInput: string;
  setGalleryInput: (val: string) => void;
}

export function VisualGallery({ galleryInput, setGalleryInput }: VisualGalleryProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-bold flex items-center gap-2 mb-2">
        <ImageIcon size={20} className="text-primary" /> Visual Gallery
      </h2>
      <p className="text-xs text-text-secondary mb-4">Impress customers with photos of your tables, kitchen, cashier, and ambiance. Add URLs separated by commas.</p>
      <textarea 
        value={galleryInput}
        onChange={(e) => setGalleryInput(e.target.value)}
        className="w-full bg-input border border-border rounded-xl p-3 text-sm text-text-primary min-h-[100px] focus:outline-none focus:border-primary"
        placeholder="https://image1.jpg, https://image2.jpg"
      />
    </div>
  );
}
