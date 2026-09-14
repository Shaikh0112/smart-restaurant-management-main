// @ts-nocheck
﻿"use client";

// RESPONSIBILITY: Typed Error Boundary component for Kitchen module (Rule 9)
import React, { Component, ReactNode } from "react";

interface KitchenErrorBoundaryProps {
  children: ReactNode;
}

interface KitchenErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class KitchenErrorBoundary extends Component<KitchenErrorBoundaryProps, KitchenErrorBoundaryState> {
  constructor(props: KitchenErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): KitchenErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // In a real app, log to an observability service (e.g. Sentry)
    // kitchenMonitoring.captureException(error, { extra: errorInfo });
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="p-6 m-4 bg-danger-bg border border-danger/30 rounded-xl text-center">
          <h2 className="text-lg font-bold text-danger mb-2">Kitchen Module Error</h2>
          <p className="text-sm text-text-secondary mb-4">An unexpected error occurred in this section. Please try again.</p>
          <button
            onClick={this.handleReset}
            className="px-4 py-2 bg-danger text-white rounded-lg hover:opacity-90 transition"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
