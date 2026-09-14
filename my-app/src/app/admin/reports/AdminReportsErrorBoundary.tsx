"use client";

// RESPONSIBILITY: Typed Error Boundary component for AdminReports module (Rule 9)
import React, { Component, type ReactNode } from "react";

interface AdminReportsErrorBoundaryProps {
  children: ReactNode;
}

interface AdminReportsErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class AdminReportsErrorBoundary extends Component<AdminReportsErrorBoundaryProps, AdminReportsErrorBoundaryState> {
  constructor(props: AdminReportsErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): AdminReportsErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("AdminReportsErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="p-6 m-4 bg-danger-bg border border-danger rounded-xl text-center">
          <h2 className="text-lg font-bold text-danger mb-2">AdminReports Module Error</h2>
          <p className="text-sm text-text-secondary mb-4">{this.state.error?.message || "An unexpected error occurred in AdminReports module."}</p>
          <button
            onClick={this.handleReset}
            className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger transition"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
