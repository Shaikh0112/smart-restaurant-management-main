import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface ManagerEmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  actionButton?: React.ReactNode;
}

export function ManagerEmptyState({
  title,
  description,
  icon: Icon,
  actionButton,
}: ManagerEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 border border-gray-200 rounded-lg">
      <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-gray-100 text-gray-500">
        <Icon size={24} />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mb-4 text-sm text-gray-500 max-w-sm">{description}</p>
      {actionButton && <div>{actionButton}</div>}
    </div>
  );
}
