'use client';

import Link from 'next/link';
import { useActionState, useMemo, useState } from 'react';
import { createClient, type ClientActionState } from './actions';

const initialClientActionState: ClientActionState = { message: '' };

type ClientListItem = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  policy_count: number;
};

export default function ClientManager({
  clients,
}: {
  clients: ClientListItem[];
}) {
  const [query, setQuery] = useState('');
  const filteredClients = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return clients;
    return clients.filter((client) => [client.full_name, client.email, client.phone]
      .some((value) => value?.toLowerCase().includes(normalized)));
  }, [clients, query]);
  const [state, formAction, pending] = useActionState(
    createClient,
    initialClientActionState,
  );

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Client Management</h1>

      <section className="mb-10 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-700">Add New Client</h2>
        <form action={formAction} className="grid grid-cols-1 items-end gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="full_name" className="mb-1 block text-sm font-medium text-gray-700">Client Name</label>
            <input id="full_name" name="full_name" required maxLength={150} className="w-full rounded-md border border-gray-300 p-2" placeholder="e.g., Alice Johnson" />
            {state.errors?.full_name && <p className="mt-1 text-sm text-red-600">{state.errors.full_name[0]}</p>}
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
            <input id="email" name="email" type="email" maxLength={255} className="w-full rounded-md border border-gray-300 p-2" placeholder="e.g., alice@example.com" />
            {state.errors?.email && <p className="mt-1 text-sm text-red-600">{state.errors.email[0]}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">Phone Number</label>
            <input id="phone" name="phone" maxLength={50} className="w-full rounded-md border border-gray-300 p-2" placeholder="e.g., +1 555-0199" />
            {state.errors?.phone && <p className="mt-1 text-sm text-red-600">{state.errors.phone[0]}</p>}
          </div>
          <div>
            <label htmlFor="address" className="mb-1 block text-sm font-medium text-gray-700">Address</label>
            <input id="address" name="address" maxLength={1000} className="w-full rounded-md border border-gray-300 p-2" />
            {state.errors?.address && <p className="mt-1 text-sm text-red-600">{state.errors.address[0]}</p>}
          </div>
          <div className="md:col-span-2">
            <label htmlFor="notes" className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
            <textarea id="notes" name="notes" maxLength={5000} rows={3} className="w-full rounded-md border border-gray-300 p-2" />
            {state.errors?.notes && <p className="mt-1 text-sm text-red-600">{state.errors.notes[0]}</p>}
          </div>
          <div className="md:col-span-2 flex items-center justify-between">
            <p className="text-sm text-gray-600" aria-live="polite">{state.message}</p>
            <button type="submit" disabled={pending} className="rounded-md bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60">
              {pending ? 'Saving…' : 'Save Client'}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-gray-700">Client List</h2>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search clients" placeholder="Search name, email, or phone" className="rounded-md border border-gray-300 p-2" />
        </div>
        {clients.length === 0 ? (
          <p className="text-gray-500">No clients yet. Add a client above to get started.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-100 text-sm text-gray-600">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Policies</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id} className="border-b border-gray-100 text-sm text-gray-800 hover:bg-gray-50">
                    <td className="p-3 font-medium"><Link className="underline" href={`/client/${client.id}`}>{client.full_name}</Link></td>
                    <td className="p-3">{client.email || '—'}</td>
                    <td className="p-3">{client.phone || '—'}</td>
                    <td className="p-3">{client.policy_count}</td>
                  </tr>
                ))}
                {filteredClients.length === 0 && <tr><td colSpan={4} className="p-4 text-gray-600">No clients match that search.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
