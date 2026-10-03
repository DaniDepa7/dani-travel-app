import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Sostituito any[] con unknown[] per rendere felice ESLint
export const query = (text: string, params?: unknown[]) =>
  pool.query(text, params);
