// @ts-nocheck
﻿"use client";

// RESPONSIBILITY: Typed Error Boundary component for Waiter module (Rule 9)
import React, { Component, ReactNode } from "react";

interface WaiterErrorBoundaryProps {
  children: ReactNode;
}

interface WaiterErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class WaiterErrorBoundary extends Component<WaiterErrorBoundaryProps, WaiterErrorBoundaryState> {
  constructor(props: WaiterErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): WaiterErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("WaiterErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="p-6 m-4 bg-danger/10 border border-danger/30 rounded-xl text-center">
          <h2 className="text-lg font-bold text-danger mb-2">Waiter Module Error</h2>
          <p className="text-sm text-text-secondary mb-4">{this.state.error?.message || "An unexpected error occurred in Waiter module."}</p>
          <button
            onClick={this.handleReset}
            className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger transition active:scale-95"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
