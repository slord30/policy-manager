import type { Metadata } from 'next';
import ClientManager from './ClientManager';
import { requireBrokerId } from '@/lib/broker';
import { sql } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Clients | PolicyManager',
  description: 'View and add clients for your insurance brokerage.',
};

type ClientListItem = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  policy_count: number;
};

export default async function ClientsPage() {
  const brokerId = await requireBrokerId();
  const clients = (await sql`
    SELECT c.id, c.full_name, c.email, c.phone,
           (SELECT COUNT(*)::int
            FROM public.policies p
            WHERE p.client_id = c.id AND p.broker_id = c.broker_id) AS policy_count
    FROM public.clients c
    WHERE c.broker_id = ${brokerId}
    ORDER BY c.full_name ASC
  `) as ClientListItem[];

  return <ClientManager clients={clients} />;
}
