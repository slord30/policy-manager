import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
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
        {/* Render your unified bar layout */}
        <Navbar />
        
        <div className="flex-1">
          {children}
        </div>
        
        <Footer />
      </body>
    </html>
  );
}
