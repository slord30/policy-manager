import { sql } from '@/lib/db';
import type { BrokerAccount } from '@/types';

export async function getUserByEmail(
  email: string,
): Promise<BrokerAccount | null> {
  const result = await sql`
    SELECT id, email, password_hash, created_at, updated_at
    FROM public.broker_account
    WHERE lower(btrim(email)) = lower(btrim(${email}))
    LIMIT 1
  `;

  return result[0] as BrokerAccount | undefined ?? null;
}
