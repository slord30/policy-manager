'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Updates the browser URL immediately when the user types or chooses a filter
  function handleFilterChange(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key); // Clears the filter if "All" is selected
    }

    // Smoothly updates the data list on the page without a harsh hard-reload
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="w-full bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
      {/* Search Input Section */}
      <div>
        <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase mb-2">
          Search Records
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search clients, carriers, or policy numbers..."
            defaultValue={searchParams.get('q') ?? ''}
            onChange={(e) => handleFilterChange('q', e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-md text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          {isPending && (
            <div className="absolute right-3 top-3 text-xs text-slate-400 animate-pulse">
              Filtering...
            </div>
          )}
        </div>
      </div>

      {/* Filter Filters Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {/* Carrier Select Dropdown */}
        <div>
          <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase mb-2">
            Insurance Carrier
          </label>
          <select
            defaultValue={searchParams.get('carrier') ?? ''}
            onChange={(e) => handleFilterChange('carrier', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          >
            <option value="">ALL CARRIERS</option>
            <option value="progressive">PROGRESSIVE</option>
            <option value="geico">GEICO</option>
            <option value="allstate">ALLSTATE</option>
            <option value="state-farm">STATE FARM</option>
          </select>
        </div>

        {/* Policy Status Filter */}
        <div>
          <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase mb-2">
            Coverage Status
          </label>
          <select
            defaultValue={searchParams.get('status') ?? ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          >
            <option value="">ALL STATUSES</option>
            <option value="active">ACTIVE</option>
            <option value="pending-renewal">PENDING RENEWAL</option>
            <option value="expired">EXPIRED</option>
            <option value="canceled">CANCELED</option>
          </select>
        </div>

        {/* Line of Business Filter */}
        <div>
          <label className="block text-xs font-bold tracking-wider text-slate-500 uppercase mb-2">
            Line of Business
          </label>
          <select
            defaultValue={searchParams.get('lob') ?? ''}
            onChange={(e) => handleFilterChange('lob', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          >
            <option value="">ALL LINES</option>
            <option value="auto">AUTO</option>
            <option value="home">HOME</option>
            <option value="commercial">COMMERCIAL</option>
            <option value="life">LIFE</option>
          </select>
        </div>
      </div>
    </div>
  );
}
