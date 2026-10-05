// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: 'DASHBOARD', href: '/' },
    { name: 'CLIENTS', href: '/clients' },
    { name: 'POLICIES', href: '/policies' },
    { name: 'RENEWALS', href: '/renewals' },
  ];

  return (
    <div className="flex items-center space-x-6">
      {links.map((link) => {
        // Checks if the current path matches the link item
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
  );
}
