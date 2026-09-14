"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyableIdProps {
  id: string;
  label?: string;
  sliceLength?: number;
}

export function CopyableId({ id, label = "ID", sliceLength = 6 }: CopyableIdProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const displayId = sliceLength ? id.slice(-sliceLength).toUpperCase() : id;

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2 py-1 text-[11px] font-mono text-text-secondary hover:bg-page hover:text-text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      title="Copy to clipboard"
    >
      <span>{label}: #{displayId}</span>
      {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
    </button>
  );
}
