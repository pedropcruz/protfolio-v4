import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from '../db/schema';

let _db: ReturnType<typeof drizzle> | null = null;
let _pool: pg.Pool | null = null;

export function useDB() {
  if (_db) return _db;

  const config = useRuntimeConfig();
  const isLocal = config.databaseUrl.includes('localhost') || config.databaseUrl.includes('127.0.0.1');
  _pool = new pg.Pool({ connectionString: config.databaseUrl, ssl: isLocal ? false : { rejectUnauthorized: false } });
  _db = drizzle(_pool, { schema });

  return _db;
}
