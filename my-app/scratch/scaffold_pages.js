const fs = require('fs');
const path = require('path');

const ADMIN_DIR = path.join(__dirname, 'src/app/admin');

const pagesToCreate = [
  { folder: 'reservations', title: 'Reservations', icon: 'CalendarClock' },
  { folder: 'menu', title: 'Menu Management', icon: 'Utensils' },
  { folder: 'inventory', title: 'Inventory Management', icon: 'Package' },
  { folder: 'coupons', title: 'Coupons & Offers', icon: 'Ticket' },
  { folder: 'shift', title: 'Shift Management', icon: 'Clock' },
  { folder: 'qr', title: 'QR Generators', icon: 'QrCode' },
  { folder: 'list-hotel', title: 'Hotel Listings', icon: 'Building' }
];

pagesToCreate.forEach(({ folder, title, icon }) => {
  const folderPath = path.join(ADMIN_DIR, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const pagePath = path.join(folderPath, 'page.tsx');
  if (!fs.existsSync(pagePath)) {
    const content = `"use client";

import React from "react";
import { ${icon} } from "lucide-react";

export default function Admin${title.replace(/\s+/g, '').replace(/&/g, '')}Page() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary-bg border border-primary/20">
          <${icon} className="text-primary" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">${title}</h1>
          <p className="text-sm text-text-secondary mt-1">Manage ${title.toLowerCase()} and view related analytics.</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-border bg-card">
        <${icon} size={48} className="text-border mb-4" />
        <h2 className="text-lg font-semibold text-text-secondary">Module Under Construction</h2>
        <p className="text-sm text-text-disabled mt-2 max-w-md text-center">
          This feature is currently being integrated into the new architecture. 
          Check back soon.
        </p>
      </div>
    </div>
  );
}
`;
    fs.writeFileSync(pagePath, content, 'utf8');
    console.log(`Created ${pagePath}`);
  }
});
