import { neon } from '@neondatabase/serverless';
import type { BrokerAccount } from '@/types';

const sql = neon(process.env.POSTGRES_URL!);

export async function getUserByEmail(
  email: string,
): Promise<BrokerAccount | null> {
  const result = await sql`
    SELECT id, email, password_hash, created_at, updated_at
    FROM broker_accounts
    WHERE email = ${email}
    LIMIT 1
  `;

  return result[0] as BrokerAccount | undefined ?? null;
}