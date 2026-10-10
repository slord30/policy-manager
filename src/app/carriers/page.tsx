import type { Metadata } from 'next';
import CarrierManager from './CarrierManager';
import { requireBrokerId } from '@/lib/broker';
import { sql } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Carriers | PolicyManager',
  description: 'Manage the shared insurance carrier list.',
};

type CarrierRow = { id: string; name: string; policy_count: number };

export default async function CarriersPage() {
  await requireBrokerId();
  const carriers = await sql`
    SELECT c.id, c.name, COUNT(p.id)::int AS policy_count
    FROM public.carriers c
    LEFT JOIN public.policies p ON p.carrier_id = c.id
    GROUP BY c.id, c.name
    ORDER BY c.name
  ` as CarrierRow[];
  return <CarrierManager carriers={carriers} />;
}
