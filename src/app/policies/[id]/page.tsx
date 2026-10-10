import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DetailField from '@/components/DetailField';
import { requireBrokerId } from '@/lib/broker';
import { sql } from '@/lib/db';
import { isUuid } from '@/lib/ids';
import PolicyEditor from './PolicyEditor';

export const metadata: Metadata = {
  title: 'Policy Details | PolicyManager',
  description: 'Review policy coverage, carrier, client, and payment details.',
};

type PolicyRecord = {
  id: string;
  client_id: string;
  carrier_id: string;
  policy_number: string;
  client: string;
  carrier: string;
  line_of_business: string | null;
  effective_date: string | null;
  expiration_date: string;
  premium: string | number;
  status: string;
  notes: string | null;
};

function formatDate(value: string | null): string {
  if (!value) return 'Not provided';

  const [year, month, day] = value.slice(0, 10).split('-');
  return month && day && year ? `${month}/${day}/${year}` : value;
}

function displayValue(value: string | null): string {
  return value?.trim() || 'Not provided';
}

export default async function PolicyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, brokerId] = await Promise.all([params, requireBrokerId()]);
  if (!isUuid(id)) notFound();

  // The selected columns are explicitly represented by PolicyRecord.
  const rows = (await sql`
    SELECT p.id, p.client_id, p.carrier_id, p.policy_number, c.full_name AS client, car.name AS carrier,
           p.line_of_business, p.effective_date::text AS effective_date,
           p.expiration_date::text AS expiration_date, p.premium, p.status, p.notes
    FROM public.policies p
    JOIN public.clients c ON c.id = p.client_id AND c.broker_id = p.broker_id
    JOIN public.carriers car ON car.id = p.carrier_id
    WHERE p.id = ${id} AND p.broker_id = ${brokerId}
    LIMIT 1
  `) as PolicyRecord[];
  const policy = rows[0];

  if (!policy) notFound();

  const [clients, carriers] = await Promise.all([
    sql`SELECT id, full_name AS name FROM public.clients WHERE broker_id = ${brokerId} ORDER BY full_name`,
    sql`SELECT id, name FROM public.carriers ORDER BY name`,
  ]);

  const premium = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(policy.premium));
  const status = policy.status.replaceAll('_', ' ');

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Policy Details</h1>
        <p className="mt-2 text-gray-600">Policy #{policy.policy_number}</p>
      </div>

      <section className="mb-8 rounded-lg border p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{policy.carrier}</h2>
            <p className="text-gray-600">{displayValue(policy.line_of_business)}</p>
          </div>
          <div className="rounded-full border px-4 py-2">{status}</div>
        </div>
      </section>

      <section className="mb-8 rounded-lg border p-6">
        <h2 className="mb-6 text-2xl font-semibold">Policy Information</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <DetailField label="Client" value={policy.client} />
          <DetailField label="Carrier" value={policy.carrier} />
          <DetailField label="Policy Number" value={policy.policy_number} />
          <DetailField label="Line of Business" value={displayValue(policy.line_of_business)} />
        </div>
      </section>

      <section className="mb-8 rounded-lg border p-6">
        <h2 className="mb-6 text-2xl font-semibold">Coverage Dates</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <DetailField label="Effective Date" value={formatDate(policy.effective_date)} />
          <DetailField label="Expiration Date" value={formatDate(policy.expiration_date)} />
        </div>
      </section>

      <section className="mb-8 rounded-lg border p-6">
        <h2 className="mb-6 text-2xl font-semibold">Premium</h2>
        <DetailField label="Premium" value={premium} />
      </section>

      <section className="rounded-lg border p-6">
        <h2 className="mb-6 text-2xl font-semibold">Policy Notes</h2>
        <DetailField label="Notes" value={displayValue(policy.notes)} />
      </section>

      <PolicyEditor policy={policy} clients={clients as { id: string; name: string }[]} carriers={carriers as { id: string; name: string }[]} />
    </main>
  );
}
