// src/components/Header.tsx
import Link from 'next/link';
import Navbar from './Navbar';

export default function Header() {
  return (
    <header className="w-full bg-surface border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <Link 
          href="/" 
          className="flex items-center space-x-2 group hover:opacity-90 transition-opacity"
        >
          <span className="text-xl font-bold text-primary tracking-widest uppercase">
            POLICYMANAGER
          </span>
        </Link>

        <Navbar />

        {/* Action Button */}
        <div>
          <button className="bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded-md text-sm font-medium transition-all shadow-xs cursor-pointer uppercase tracking-wider">
            Add New Policy
          </button>
        </div>
      </div>
    </header>
  );
}
