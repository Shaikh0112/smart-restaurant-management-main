"use client";
// RESPONSIBILITY: Component rendering AnalyticsClient

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ChevronRight, BarChart2, TrendingUp, Download, Activity, Calendar } from "lucide-react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30D");

  const revenueSeries = [{ name: "Revenue", data: [45, 25, 20, 10] }];
  const revenueOptions = {
    chart: { type: "bar" as const, toolbar: { show: false }, background: "transparent" },
    plotOptions: { bar: { horizontal: true, borderRadius: 4, colors: { ranges: [{ from: 0, to: 100, color: '#FACC15' }] } } },
    xaxis: { categories: ["Mumbai", "Delhi", "Bangalore", "Other"], labels: { style: { colors: "#a3a3a3" } } },
    yaxis: { labels: { style: { colors: "#f5f5f5" } } },
    grid: { borderColor: "#262626" },
    theme: { mode: "dark" as const }
  };

  const userSeries = [{ name: "Users", data: [12, 18, 15, 24] }];
  const userOptions = {
    chart: { type: "area" as const, toolbar: { show: false }, background: "transparent" },
    stroke: { curve: "smooth" as const, width: 2, colors: ["#22c55e"] },
    fill: { type: "gradient" as const, gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0, stops: [0, 100], colorStops: [{ offset: 0, color: "#22c55e", opacity: 0.4 }, { offset: 100, color: "#22c55e", opacity: 0 }] } },
    xaxis: { categories: ["W1", "W2", "W3", "W4"], labels: { style: { colors: "#a3a3a3" } } },
    yaxis: { labels: { style: { colors: "#f5f5f5" } } },
    grid: { borderColor: "#262626" },
    theme: { mode: "dark" as const }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto">
      {/* Page Title & Breadcrumbs */}
      <div>
        <div className="flex items-center gap-2 text-table-header text-text-secondary mb-1">
          <Link href="/super-admin/dashboard" className="hover:text-text-primary motion-safe:transition-colors">Dashboard</Link>
          <ChevronRight size={12} strokeWidth={2} />
          <span className="text-text-primary font-medium">Analytics</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-page-title font-bold text-text-primary">Advanced Analytics</h1>
            <p className="text-table-header text-text-secondary">Platform-wide data visualization and reports.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-input border border-border rounded-md p-1">
              {["7D", "30D", "90D", "1Y"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 text-kpi-valueage-titles font-medium rounded-sm motion-safe:transition-colors ${
                    timeRange === range
                      ? "bg-primary text-white shadow-sm"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-body font-medium text-text-primary hover:bg-border/50 hover:shadow-sm motion-safe:transition-all motion-safe:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page">
              <Download size={16} strokeWidth={2} />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Revenue by City (ApexCharts) */}
        <div className="bg-card border border-border rounded-lg p-6 flex flex-col justify-between hover:shadow-lg motion-safe:transition-all motion-safe:duration-200">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <div className="flex items-center gap-2">
              <BarChart2 size={20} className="text-text-primary" strokeWidth={2} />
              <h2 className="font-semibold text-base text-text-primary">
                Revenue by Region
              </h2>
            </div>
            <Activity size={16} className="text-text-secondary" strokeWidth={2} />
          </div>
          
          <div className="mt-2 w-full h-[300px]">
             {/* @ts-ignore - ApexCharts dynamic import types can be finicky */}
            <Chart options={revenueOptions} series={revenueSeries} type="bar" height="100%" />
          </div>
        </div>

        {/* Chart 2: Recent User Growth (ApexCharts) */}
        <div className="bg-card border border-border rounded-lg p-6 flex flex-col justify-between hover:shadow-lg motion-safe:transition-all motion-safe:duration-200">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-success" strokeWidth={2} />
              <h2 className="font-semibold text-base text-text-primary">
                User Acquisition ({timeRange})
              </h2>
            </div>
            <Calendar size={16} className="text-text-secondary" strokeWidth={2} />
          </div>

          <div className="mt-4 w-full h-[300px]">
             {/* @ts-ignore */}
             <Chart options={userOptions} series={userSeries} type="area" height="100%" />
          </div>
        </div>
      </div>
    </div>
  );
}
