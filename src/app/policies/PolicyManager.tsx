'use client';

import Link from 'next/link';
import { useActionState, useMemo, useState } from 'react';
import { createPolicy, type PolicyActionState } from './actions';

const initialPolicyActionState: PolicyActionState = { message: '' };

type PolicyListItem = {
  id: string;
  client_id: string;
  policy_number: string;
  client_name: string;
  carrier_name: string;
  line_of_business: string | null;
  premium: string;
  effective_date: string | null;
  expiration_date: string;
  status: string;
};

type ClientOption = { id: string; name: string; email: string | null };
type CarrierOption = { id: string; name: string };

function formatDate(value: string | null): string {
  if (!value) return '—';
  const [year, month, day] = value.slice(0, 10).split('-');
  return month && day && year ? `${month}/${day}/${year}` : value;
}

function formatPremium(value: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(value));
}

export default function PolicyManager({
  policies,
  clients,
  carriers,
}: {
  policies: PolicyListItem[];
  clients: ClientOption[];
  carriers: CarrierOption[];
}) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const filteredPolicies = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return policies.filter((policy) => {
      const matchesText = !normalized || [policy.policy_number, policy.client_name, policy.carrier_name, policy.line_of_business]
        .some((value) => value?.toLowerCase().includes(normalized));
      return matchesText && (statusFilter === 'ALL' || policy.status === statusFilter);
    });
  }, [policies, query, statusFilter]);
  const [state, formAction, pending] = useActionState(
    createPolicy,
    initialPolicyActionState,
  );

  return (
    <main className="mx-auto max-w-6xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Policy Management</h1>

      <section id="new-policy" className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Add New Policy</h2>
        {clients.length === 0 && (
          <p className="mb-4 text-sm text-amber-700">Add a client before creating a policy.</p>
        )}
        {carriers.length === 0 && (
          <p className="mb-4 text-sm text-amber-700">No carriers are available yet. <Link className="underline" href="/carriers">Add a carrier</Link> before creating a policy.</p>
        )}
        {carriers.length > 0 && <p className="mb-4 text-sm text-gray-600">Need another carrier? <Link className="underline" href="/carriers">Manage carriers</Link>.</p>}

        <form action={formAction} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="policy_number" className="block text-sm font-medium">Policy Number</label>
            <input id="policy_number" name="policy_number" required maxLength={100} className="mt-1 block w-full rounded-md border p-2" placeholder="e.g. POL-2026-002" />
            {state.errors?.policy_number && <p className="mt-1 text-sm text-red-600">{state.errors.policy_number[0]}</p>}
          </div>

          <div>
            <label htmlFor="client_id" className="block text-sm font-medium">Client</label>
            <select id="client_id" name="client_id" required defaultValue="" className="mt-1 block w-full rounded-md border p-2">
              <option value="" disabled>Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>{client.name}{client.email ? ` (${client.email})` : ''}</option>
              ))}
            </select>
            {state.errors?.client_id && <p className="mt-1 text-sm text-red-600">{state.errors.client_id[0]}</p>}
          </div>

          <div>
            <label htmlFor="carrier_id" className="block text-sm font-medium">Insurance Carrier</label>
            <select id="carrier_id" name="carrier_id" required defaultValue="" className="mt-1 block w-full rounded-md border p-2">
              <option value="" disabled>Select a carrier</option>
              {carriers.map((carrier) => <option key={carrier.id} value={carrier.id}>{carrier.name}</option>)}
            </select>
            {state.errors?.carrier_id && <p className="mt-1 text-sm text-red-600">{state.errors.carrier_id[0]}</p>}
          </div>

          <div>
            <label htmlFor="line_of_business" className="block text-sm font-medium">Line of Business</label>
            <input id="line_of_business" name="line_of_business" required maxLength={100} className="mt-1 block w-full rounded-md border p-2" placeholder="e.g. Auto, Home, Life" />
            {state.errors?.line_of_business && <p className="mt-1 text-sm text-red-600">{state.errors.line_of_business[0]}</p>}
          </div>

          <div>
            <label htmlFor="premium" className="block text-sm font-medium">Premium (USD)</label>
            <input id="premium" name="premium" type="number" min="0" max="9999999999.99" step="0.01" required className="mt-1 block w-full rounded-md border p-2" placeholder="0.00" />
            {state.errors?.premium && <p className="mt-1 text-sm text-red-600">{state.errors.premium[0]}</p>}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium">Status</label>
            <select id="status" name="status" defaultValue="ACTIVE" className="mt-1 block w-full rounded-md border p-2">
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="EXPIRED">Expired</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label htmlFor="effective_date" className="block text-sm font-medium">Effective Date</label>
            <input id="effective_date" name="effective_date" type="date" required className="mt-1 block w-full rounded-md border p-2" />
            {state.errors?.effective_date && <p className="mt-1 text-sm text-red-600">{state.errors.effective_date[0]}</p>}
          </div>

          <div>
            <label htmlFor="expiration_date" className="block text-sm font-medium">Expiration Date</label>
            <input id="expiration_date" name="expiration_date" type="date" required className="mt-1 block w-full rounded-md border p-2" />
            {state.errors?.expiration_date && <p className="mt-1 text-sm text-red-600">{state.errors.expiration_date[0]}</p>}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="notes" className="block text-sm font-medium">Notes</label>
            <textarea id="notes" name="notes" maxLength={5000} rows={3} className="mt-1 block w-full rounded-md border p-2" />
            {state.errors?.notes && <p className="mt-1 text-sm text-red-600">{state.errors.notes[0]}</p>}
          </div>

          <div className="md:col-span-2 flex items-center justify-between">
            <p className="text-sm text-gray-600" aria-live="polite">{state.message}</p>
            <button type="submit" disabled={pending || clients.length === 0 || carriers.length === 0} className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60">
              {pending ? 'Saving…' : 'Save Policy'}
            </button>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-lg bg-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-gray-50 p-4">
          <h2 className="text-xl font-semibold">Policies</h2>
          <div className="flex flex-wrap gap-2">
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search policies" placeholder="Search policy, client, carrier" className="rounded-md border p-2" />
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter policies by status" className="rounded-md border p-2">
              <option value="ALL">All statuses</option><option value="ACTIVE">Active</option><option value="PENDING">Pending</option><option value="EXPIRED">Expired</option><option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
        {policies.length === 0 ? (
          <p className="p-6 text-gray-600">No policies yet. Add a policy above to get started.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Policy No.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Carrier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Line of Business</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Premium</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Term</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredPolicies.map((policy) => (
                  <tr key={policy.id} className="text-sm">
                    <td className="whitespace-nowrap px-6 py-4 font-medium"><Link className="underline" href={`/policies/${policy.id}`}>{policy.policy_number}</Link></td>
                    <td className="whitespace-nowrap px-6 py-4"><Link className="underline" href={`/client/${policy.client_id}`}>{policy.client_name}</Link></td>
                    <td className="whitespace-nowrap px-6 py-4">{policy.carrier_name}</td>
                    <td className="whitespace-nowrap px-6 py-4">{policy.line_of_business || '—'}</td>
                    <td className="whitespace-nowrap px-6 py-4">{formatPremium(policy.premium)}</td>
                    <td className="whitespace-nowrap px-6 py-4">{formatDate(policy.effective_date)} – {formatDate(policy.expiration_date)}</td>
                    <td className="whitespace-nowrap px-6 py-4">{policy.status.replaceAll('_', ' ')}</td>
                  </tr>
                ))}
                {filteredPolicies.length === 0 && <tr><td colSpan={7} className="p-6 text-gray-600">No policies match those filters.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
