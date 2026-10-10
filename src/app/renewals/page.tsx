import type { Metadata } from 'next';
import Link from 'next/link';
import { requireBrokerId } from '@/lib/broker';
import { sql } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Upcoming Renewals | PolicyManager',
  description: 'Review policies expiring in the next 30 days.',
};

type Renewal = {
  id: string;
  client_id: string;
  client_name: string;
  carrier_name: string;
  policy_number: string;
  expiration_date: string;
  premium: string;
  status: string;
};

function formatDate(value: string): string {
  const [year, month, day] = value.slice(0, 10).split('-');
  return month && day && year ? `${month}/${day}/${year}` : value;
}

export default async function RenewalsPage() {
  const brokerId = await requireBrokerId();
  const renewals = (await sql`
    SELECT p.id, p.client_id, c.full_name AS client_name,
           car.name AS carrier_name, p.policy_number,
           p.expiration_date::text AS expiration_date,
           p.premium::text AS premium, p.status
    FROM public.policies p
    JOIN public.clients c ON c.id = p.client_id AND c.broker_id = p.broker_id
    JOIN public.carriers car ON car.id = p.carrier_id
    WHERE p.broker_id = ${brokerId}
      AND p.status IN ('ACTIVE', 'PENDING')
      AND p.expiration_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
    ORDER BY p.expiration_date ASC
  `) as Renewal[];

  return (
    <main className="mx-auto max-w-6xl p-8">
      <h1 className="mb-2 text-3xl font-bold">Upcoming Renewals</h1>
      <p className="mb-6 text-gray-600">Active and pending policies expiring within the next 30 days.</p>

      {renewals.length === 0 ? (
        <section className="rounded-lg border bg-white p-8 text-center text-gray-600">
          No active or pending policies are expiring in the next 30 days.
        </section>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Expiration</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Policy</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Carrier</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Premium</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {renewals.map((renewal) => (
                <tr key={renewal.id} className="text-sm">
                  <td className="whitespace-nowrap px-6 py-4">{formatDate(renewal.expiration_date)}</td>
                  <td className="whitespace-nowrap px-6 py-4"><Link className="underline" href={`/client/${renewal.client_id}`}>{renewal.client_name}</Link></td>
                  <td className="whitespace-nowrap px-6 py-4"><Link className="underline" href={`/policies/${renewal.id}`}>{renewal.policy_number}</Link></td>
                  <td className="whitespace-nowrap px-6 py-4">{renewal.carrier_name}</td>
                  <td className="whitespace-nowrap px-6 py-4">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(renewal.premium))}</td>
                  <td className="whitespace-nowrap px-6 py-4">{renewal.status.replaceAll('_', ' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
