import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireBrokerId } from '@/lib/broker';
import { sql } from '@/lib/db';
import { isUuid } from '@/lib/ids';
import ClientEditor from './ClientEditor';

export const metadata: Metadata = {
  title: 'Client Details | PolicyManager',
  description: 'Review a client’s contact information and insurance policies.',
};

type ClientRecord = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
};

type ClientPolicy = {
  id: string;
  policy_number: string;
  carrier: string;
  line_of_business: string | null;
  effective_date: string | null;
  expiration_date: string;
  status: string;
};

function formatDate(value: string | null): string {
  if (!value) return 'Not provided';

  const [year, month, day] = value.slice(0, 10).split('-');
  return month && day && year ? `${month}/${day}/${year}` : value;
}

function displayValue(value: string | null): string {
  return value?.trim() || 'Not provided';
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, brokerId] = await Promise.all([params, requireBrokerId()]);
  if (!isUuid(id)) notFound();

  // The selected columns are explicitly represented by ClientRecord.
  const clients = (await sql`
    SELECT id, full_name, email, phone, address, notes
    FROM public.clients
    WHERE id = ${id} AND broker_id = ${brokerId}
    LIMIT 1
  `) as ClientRecord[];
  const client = clients[0];

  if (!client) notFound();

  // Include broker_id in the join so a policy can never cross broker ownership.
  const policies = (await sql`
    SELECT p.id, p.policy_number, car.name AS carrier,
           p.line_of_business, p.effective_date::text AS effective_date,
           p.expiration_date::text AS expiration_date, p.status
    FROM public.policies p
    JOIN public.carriers car ON car.id = p.carrier_id
    WHERE p.client_id = ${client.id} AND p.broker_id = ${brokerId}
    ORDER BY p.expiration_date DESC
  `) as ClientPolicy[];

  const activePolicies = policies.filter((policy) => policy.status === 'ACTIVE');
  const historicalPolicies = policies.filter((policy) => policy.status !== 'ACTIVE');

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Client Details</h1>
        <p className="mt-2 text-gray-600">{client.full_name}</p>
      </div>

      <section className="mb-10 rounded-lg border p-6">
        <h2 className="mb-6 text-2xl font-semibold">Client Information</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div><h3 className="font-medium">Full Name</h3><p>{client.full_name}</p></div>
          <div><h3 className="font-medium">Email</h3><p>{displayValue(client.email)}</p></div>
          <div><h3 className="font-medium">Phone</h3><p>{displayValue(client.phone)}</p></div>
          <div><h3 className="font-medium">Address</h3><p>{displayValue(client.address)}</p></div>
          <div className="md:col-span-2"><h3 className="font-medium">Notes</h3><p>{displayValue(client.notes)}</p></div>
        </div>
      </section>

      <ClientEditor client={client} />

      <section>
        <h2 className="mb-6 text-2xl font-semibold">Insurance Policies</h2>
        <PolicyGroup title="Active Policies" policies={activePolicies} />
        <PolicyGroup title="Other Policies" policies={historicalPolicies} />
      </section>
    </main>
  );
}

function PolicyGroup({
  title,
  policies,
}: {
  title: string;
  policies: ClientPolicy[];
}) {
  return (
    <div className="mb-8">
      <h3 className="mb-4 text-xl font-semibold">{title}</h3>
      {policies.length === 0 ? (
        <p>No policies to display.</p>
      ) : (
        <div className="space-y-4">
          {policies.map((policy) => (
            <div key={policy.id} className="rounded-lg border p-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <h4 className="font-medium">Policy Number</h4>
                  <Link className="underline" href={`/policies/${policy.id}`}>
                    {policy.policy_number}
                  </Link>
                </div>
                <div><h4 className="font-medium">Carrier</h4><p>{policy.carrier}</p></div>
                <div><h4 className="font-medium">Line of Business</h4><p>{displayValue(policy.line_of_business)}</p></div>
                <div><h4 className="font-medium">Effective Date</h4><p>{formatDate(policy.effective_date)}</p></div>
                <div><h4 className="font-medium">Expiration Date</h4><p>{formatDate(policy.expiration_date)}</p></div>
                <div><h4 className="font-medium">Status</h4><p>{policy.status.replaceAll('_', ' ')}</p></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
