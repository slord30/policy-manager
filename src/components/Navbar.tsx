// src/components/Navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  // State to track whether the mobile hamburger menu drawer is open or closed
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'DASHBOARD', href: '/dashboard' },
    { name: 'CLIENTS', href: '/clients' },
    { name: 'POLICIES', href: '/policies' },
    { name: 'CARRIERS', href: '/carriers' },
    { name: 'RENEWALS', href: '/renewals' },
  ];

  return (
    <div className="relative">
      {/* Hamburger Icon Button - ONLY displays on small screens (md:hidden) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none p-1 cursor-pointer"
        aria-label="Toggle navigation menu"
      >
        <span
          className={`h-0.5 w-6 bg-text-main transition-all duration-300 ease-in-out ${
            isOpen ? 'rotate-45 translate-y-2' : ''
          }`}
        />
        <span
          className={`h-0.5 w-6 bg-text-main transition-all duration-300 ease-in-out ${
            isOpen ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <span
          className={`h-0.5 w-6 bg-text-main transition-all duration-300 ease-in-out ${
            isOpen ? '-rotate-45 -translate-y-2' : ''
          }`}
        />
      </button>

      {/* Desktop Menu Grid - Displays normally on large screens, completely hidden on mobile (hidden md:flex) */}
      <div className="hidden md:flex items-center space-x-6">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
          
          return (
            <Link 
              key={link.href}
              href={link.href} 
              className={`text-xs uppercase tracking-wider font-semibold pb-1 transition-colors ${
                isActive 
                  ? 'border-b-2 border-primary text-text-main' 
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* Mobile Dropdown Menu Drawer - Floating absolute popup box running on small devices */}
      {isOpen && (
        <div className="absolute right-0 top-10 w-48 bg-surface border border-border rounded-lg shadow-xl py-2 z-50 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)} // Closes the hamburger toggle block automatically upon routing click
                  className={`text-xs uppercase tracking-wider font-semibold px-4 py-2.5 transition-colors ${
                    isActive 
                      ? 'bg-slate-900/50 text-primary border-l-4 border-primary' 
                      : 'text-text-muted hover:text-text-main hover:bg-slate-900/20'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
