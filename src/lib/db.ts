import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error(
    'CRITICAL DATABASE ERROR: The connection string environment variable is missing. ' +
    'Please verify that your local root folder contains a valid .env.local file ' +
    'and that you have successfully executed: npx vercel env pull .env.local'
  );
}

const globalForNeon = globalThis as unknown as {
  neonSql: ReturnType<typeof neon> | undefined;
};

export const sql = globalForNeon.neonSql ?? neon(connectionString);

if (process.env.NODE_ENV !== 'production') {
  globalForNeon.neonSql = sql;
}
