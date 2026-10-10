import Link from 'next/link';
import { auth } from '@/auth';
import Navbar from './Navbar';
import SignOutButton from './SignOutButton';

export default async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold uppercase tracking-widest text-primary">
            POLICYMANAGER
          </span>
        </Link>

        <Navbar />

        {session?.user && <SignOutButton />}
      </div>
    </header>
  );
}