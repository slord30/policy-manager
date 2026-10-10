import type { Metadata } from 'next';
import PolicyManager from './PolicyManager';
import { requireBrokerId } from '@/lib/broker';
import { sql } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Policies | PolicyManager',
  description: 'View and create insurance policies for your clients.',
};

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

type SelectOption = { id: string; name: string };
type ClientOption = SelectOption & { email: string | null };

export default async function PoliciesPage() {
  const brokerId = await requireBrokerId();
  const [policies, clients, carriers] = await Promise.all([
    sql`
      SELECT p.id, p.client_id, p.policy_number, c.full_name AS client_name,
             car.name AS carrier_name, p.line_of_business, p.premium::text AS premium,
             p.effective_date::text AS effective_date,
             p.expiration_date::text AS expiration_date, p.status
      FROM public.policies p
      JOIN public.clients c ON c.id = p.client_id AND c.broker_id = p.broker_id
      JOIN public.carriers car ON car.id = p.carrier_id
      WHERE p.broker_id = ${brokerId}
      ORDER BY p.expiration_date ASC, p.policy_number ASC
    `,
    sql`
      SELECT id, full_name AS name, email
      FROM public.clients
      WHERE broker_id = ${brokerId}
      ORDER BY full_name ASC
    `,
    sql`
      SELECT id, name
      FROM public.carriers
      ORDER BY name ASC
    `,
  ]);

  return (
    <PolicyManager
      policies={policies as PolicyListItem[]}
      clients={clients as ClientOption[]}
      carriers={carriers as SelectOption[]}
    />
  );
}
