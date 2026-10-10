// src/lib/db.ts - Database connection setup using Neon Serverless
import {
  neon,
  type NeonQueryFunction,
} from '@neondatabase/serverless';

const connectionString =
  process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error(
    'CRITICAL DATABASE ERROR: The connection string environment variable is missing. ' +
      'Please verify that your local root folder contains a valid .env.local file ' +
      'and that you have successfully executed: npx vercel env pull .env.local',
  );
}

type NeonSql = NeonQueryFunction<false, false>;

const globalForNeon = globalThis as unknown as {
  neonSql: NeonSql | undefined;
};

export const sql: NeonSql =
  globalForNeon.neonSql ?? neon<false, false>(connectionString);

if (process.env.NODE_ENV !== 'production') {
  globalForNeon.neonSql = sql;
}