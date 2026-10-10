// src/app/dashboard/actions.ts
'use server';

import { sql } from '@/lib/db';
import { requireBrokerId } from '@/lib/broker';

export async function getDashboardMetrics() {
  const brokerId = await requireBrokerId();
  const clientsResult =
    (await sql`SELECT COUNT(*)::int AS count FROM public.clients WHERE broker_id = ${brokerId}`) as Array<{
      count: number;
    }>;
  const totalClients = clientsResult[0]?.count ?? 0;

  const policiesResult =
    (await sql`SELECT COUNT(*)::int AS count FROM public.policies WHERE broker_id = ${brokerId} AND status = 'ACTIVE'`) as Array<{
      count: number;
    }>;
  const activePolicies = policiesResult[0]?.count ?? 0;

  const expirationResult = (await sql`
    SELECT COUNT(*)::int AS count FROM public.policies
    WHERE broker_id = ${brokerId}
      AND expiration_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
  `) as Array<{ count: number }>;
  const expiring30Days = expirationResult[0]?.count ?? 0;

  const premiumResult =
    (await sql`SELECT COALESCE(SUM(premium), 0)::float AS sum FROM public.policies WHERE broker_id = ${brokerId}`) as Array<{
      sum: number;
    }>;
  const totalPremium = premiumResult[0]?.sum ?? 0;

  const estimatedCommissions = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(totalPremium * 0.15);

  return {
    totalClients,
    activePolicies,
    expiring30Days,
    estimatedCommissions,
  };
}

export async function getUpcomingRenewals() {
  const brokerId = await requireBrokerId();
  return sql`
    SELECT p.id, c.full_name AS client, car.name AS carrier,
           p.policy_number AS "policyNum",
           TO_CHAR(p.expiration_date, 'Mon DD, YYYY') AS date,
           TO_CHAR(p.premium, '$9,999,999') AS premium
    FROM public.policies p
    JOIN public.clients c ON p.client_id = c.id AND p.broker_id = c.broker_id
    JOIN public.carriers car ON p.carrier_id = car.id
    WHERE p.broker_id = ${brokerId}
      AND p.expiration_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
    ORDER BY p.expiration_date ASC
    LIMIT 5
  `;
}
