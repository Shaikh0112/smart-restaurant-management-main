// RESPONSIBILITY: Reusable Empty State component for tables and lists
// DATA FLOW: Parent -> EmptyState -> Action Handler

import React from "react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="h-16 w-16 rounded-full bg-border/30 flex items-center justify-center mb-4">
        <Icon size={32} className="text-text-disabled" strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-small text-text-secondary max-w-sm mb-6">{description}</p>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-md bg-card border border-border text-small font-medium text-text-primary hover:bg-border motion-safe:transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
