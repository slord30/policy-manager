// src/components/Header.tsx
import Link from 'next/link';
import { auth } from '@/auth';
import Navbar from './Navbar';
import SignOutButton from './SignOutButton';

export default async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface">
      {/* RESPONSIVE FIX: Changed px-6 to px-4 on mobile and added flex-wrap & gap-4 */}
      <div className="mx-auto flex max-w-7xl items-center justify-between flex-wrap gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center space-x-2">
          {/* Scaled text from text-xl down to text-lg on tight screens so it never clips */}
          <span className="text-lg sm:text-xl font-bold uppercase tracking-widest text-primary whitespace-nowrap">
            POLICYMANAGER
          </span>
        </Link>

        {/* This wrapper element naturally moves into position using your responsive hamburger code */}
        <div className="flex items-center space-x-4">
          <Navbar />
          {session?.user && <SignOutButton />}
        </div>
      </div>
    </header>
  );
}
