// src/app/layout.tsx - Root layout for the PolicyManager CRM application

import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header'; // Swapped Navbar wrapper out for Header
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'PolicyManager CRM',
  description: 'Centralized client portfolio management for independent insurance brokers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased bg-background text-text-main">
        {/* Render your unified header layout shell */}
        <Header />
        
        <div className="flex-1">
          {children}
        </div>
        
        <Footer />
      </body>
    </html>
  );
}
