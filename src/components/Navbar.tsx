// src/components/Navbar.tsx

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full bg-surface border-b border-border px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo Identity — Wrapped with Link for Home Routing */}
        <Link 
          href="/" 
          className="flex items-center space-x-2 group hover:opacity-90 transition-opacity"
        >
          <span className="text-xl font-bold text-primary tracking-tight">
            PolicyManager
          </span>
        </Link>

        {/* Global Navigation Tabs */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-xs uppercase tracking-wider font-semibold border-b-2 border-primary pb-1 text-text-main">
            Dashboard
          </Link>
          <Link href="/clients" className="text-xs uppercase tracking-wider font-semibold text-text-muted hover:text-text-main transition-colors pb-1">
            Clients
          </Link>
          <Link href="/policies" className="text-xs uppercase tracking-wider font-semibold text-text-muted hover:text-text-main transition-colors pb-1">
            Policies
          </Link>
          <Link href="/renewals" className="text-xs uppercase tracking-wider font-semibold text-text-muted hover:text-text-main transition-colors pb-1">
            Renewals
          </Link>
        </div>

        {/* Action Button */}
        <div>
          <button className="bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded-md text-sm font-medium transition-all shadow-xs cursor-pointer">
            Add New Policy
          </button>
        </div>
      </div>
    </nav>
  );
}
