import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { auth } from '@/auth';
import QuickActionsAside from '@/components/QuickActionsAside';

export const metadata: Metadata = {
  title: 'PolicyManager CRM',
  description: 'Centralized client portfolio management for independent insurance brokers.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased bg-background text-text-main">
        <Header />

        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-6 py-8 sm:px-8 md:flex-row lg:px-12">
          {session?.user && <QuickActionsAside />}
          <div className="min-w-0 flex-1">{children}</div>
        </div>

        <Footer />
      </body>
    </html>
  );
}