// @ts-nocheck
// RESPONSIBILITY: Root layout — Server Component only.
// Wraps app in ThemeProvider and AppShell.
// No "use client" — data fetching and metadata only.
// DATA FLOW: layout.tsx → AppShellThemeProvider → AppShell → page content

import type { Metadata } from "next";
import "./globals.css";
import { AppShellThemeProvider } from "@/components/AppShell/AppShellThemeProvider";
import { AppShell } from "@/components/AppShell/AppShell";
import NextTopLoader from "nextjs-toploader";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/QueryProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Smart POS 360",
  description: "Smart Restaurant Management & POS System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={{ colorScheme: "dark" }}
    >
      <body className={`${inter.variable} font-sans min-h-screen bg-page text-text-primary antialiased`} suppressHydrationWarning>
        <NextTopLoader color="var(--primary)" showSpinner={false} />
        <QueryProvider>
          <AppShellThemeProvider>
            <AppShell>{children}</AppShell>
          </AppShellThemeProvider>
        </QueryProvider>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
