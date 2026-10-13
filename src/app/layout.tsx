// src/app/layout.tsx - Root layout for the PolicyManager CRM application

import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { auth } from '@/auth';
import QuickActionsAside from '@/components/QuickActionsAside';

export const metadata: Metadata = {
  title: 'PolicyManager CRM',
  description: 'Centralized client portfolio management for independent insurance brokers.',
};

// CRITICAL RESPONSIVE FIX: Explicitly instruct mobile browsers to respect device screen widths
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className="h-full">
      {/* Added overflow-x-hidden to prevent horizontal screen-shifting on touch devices */}
      <body className="min-h-screen flex flex-col antialiased bg-background text-text-main overflow-x-hidden">
        <Header />

        {/* LAYOUT FIX: Balanced padding from px-6 down to px-4 on mobile screens so it doesn't clip boundaries */}
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-8 sm:py-8 md:flex-row lg:px-12">
          {session?.user && <QuickActionsAside />}
          <div className="min-w-0 flex-1">{children}</div>
        </div>

        <Footer />
      </body>
    </html>
  );
}
