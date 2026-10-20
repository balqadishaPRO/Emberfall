import pg from 'pg';
import {readFile} from 'node:fs/promises';

export function connectDatabase(url) {
  // The URL controls TLS. Neon supplies sslmode=require; never disable verification.
  const pool = new pg.Pool({connectionString:url, max:3, idleTimeoutMillis:10000,
    connectionTimeoutMillis:15000, statement_timeout:10000});
  pool.on('error', () => console.error('An idle database connection failed.'));
  return pool;
}
export async function migrate(db) {
  await db.query(await readFile(new URL('./schema.sql', import.meta.url), 'utf8'));
}
