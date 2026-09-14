// RESPONSIBILITY: Renders the Table QR code modal securely.
"use client";

import { useState } from "react";
import { X, Download, Copy, Check } from "lucide-react";
import { showToast } from "@/lib/toastService";

export function WaiterTableQrModal({ table, isOpen, onClose }: { table: any; isOpen: boolean; onClose: () => void; }) {
  const [copied, setCopied] = useState(false);
  
  if (!isOpen || !table) return null;

  // Uses the backend generated QR URL (mocked here, but in reality it's fetched via API)
  const qrUrl = `http://localhost:3000/menu?table=${table.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    showToast({ type: "success", title: "Copied!", message: "QR Link copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm rounded-xl bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-bold text-text-primary">Table {table.tableNumber} QR</h2>
          <button onClick={onClose} className="rounded-md p-1.5 hover:bg-surface-hover active:scale-95">
            <X size={18} className="text-text-secondary" />
          </button>
        </div>
        
        <div className="flex flex-col items-center justify-center gap-6 p-6">
          <div className="h-48 w-48 bg-white p-2 rounded-lg flex items-center justify-center border border-border">
            <div className="text-center font-bold text-gray-400">Backend QR Image</div>
          </div>
          
          <div className="flex w-full flex-col gap-2">
            <div className="flex items-center justify-between rounded-md border border-border bg-input p-2 text-xs">
              <span className="truncate text-text-secondary">{qrUrl}</span>
              <button onClick={handleCopy} className="ml-2 rounded p-1 hover:bg-surface-hover text-primary active:scale-95">
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
