// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header'; 
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
        {/* Unified header wrapper containing your logo and navbar layout */}
        <Header />
        
        {/* ADDED: Structural wrapper with maximum layout width and fluid responsive padding */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-12 py-8">
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}
