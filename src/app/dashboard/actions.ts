// src/app/dashboard/actions.ts
'use server';

import { sql } from '@/lib/db';

export async function getDashboardMetrics() {
  try {
    const clientsResult =
      (await sql`SELECT COUNT(*)::int AS count FROM app.clients`) as Array<{
        count: number;
      }>;
    const totalClients = clientsResult[0]?.count ?? 0;

    const policiesResult =
      (await sql`SELECT COUNT(*)::int AS count FROM app.policies WHERE status = 'ACTIVE'`) as Array<{
        count: number;
      }>;
    const activePolicies = policiesResult[0]?.count ?? 0;

    const expirationResult = (await sql`
      SELECT COUNT(*)::int AS count FROM app.policies 
      WHERE expiration_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
    `) as Array<{ count: number }>;
    const expiring30Days = expirationResult[0]?.count ?? 0;

    const premiumResult =
      (await sql`SELECT SUM(premium)::float AS sum FROM app.policies`) as Array<{
        sum: number;
      }>;
    const totalPremium = premiumResult[0]?.sum ?? 0;

    // Average independent broker commission calculation (15%)
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
  } catch (error) {
    console.error(
      'Database fetch failed, falling back to empty metrics:',
      error
    );
    return {
      totalClients: 0,
      activePolicies: 0,
      expiring30Days: 0,
      estimatedCommissions: '\$0',
    };
  }
}

export async function getUpcomingRenewals() {
  try {
    // FIX: Joined your new app.carriers table using carrier_id
    const rows = await sql`
      SELECT p.id, c.name as client, car.name as carrier, p.policy_number as "policyNum", 
             TO_CHAR(p.expiration_date, 'Mon DD, YYYY') as date, 
             TO_CHAR(p.premium, '$9,999,999') as premium
      FROM app.policies p
      JOIN app.clients c ON p.client_id = c.id
      JOIN app.carriers car ON p.carrier_id = car.id
      WHERE p.expiration_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
      ORDER BY p.expiration_date ASC
      LIMIT 5
    `;
    return rows;
  } catch (error) {
    console.error("Dashboard renewals fetch failed:", error);
    return [];
  }
}
