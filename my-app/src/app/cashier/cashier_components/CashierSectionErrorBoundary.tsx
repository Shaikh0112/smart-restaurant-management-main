// RESPONSIBILITY: CashierSectionErrorBoundary module logic and UI.
"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: React.ReactNode;
  sectionName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class CashierSectionErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error in Cashier Section ${this.props.sectionName || ''}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-6 text-center border border-danger/20 bg-danger/5 rounded-xl h-full min-h-[200px]">
          <AlertTriangle className="h-8 w-8 text-danger mb-3" />
          <h3 className="text-sm font-bold text-text-primary mb-1">
            {this.props.sectionName ? `Failed to load ${this.props.sectionName}` : "Component Error"}
          </h3>
          <p className="text-xs text-text-secondary mb-4 max-w-[250px]">
            {this.state.error?.message || "An unexpected error occurred in this section."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-lg text-xs font-medium hover:bg-border motion-safe:transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
