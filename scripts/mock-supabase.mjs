// A stand-in for Supabase's /rest/v1/rpc API, backed by PGlite running the real migration.
// For local testing only: lets the neighbour states be exercised with no Supabase project.
// Usage: node scripts/mock-supabase.mjs [port]   (default 54329)
//   POST /rest/v1/rpc/<lantern_fn>  { p_device, ... }   → runs as `anon`, like Supabase
//   POST /_admin                    { sql }             → runs as superuser (test setup only)

import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';

const port = Number(process.argv[2] || 54329);
const db = new PGlite();
await db.exec(`
  create role anon nologin;
  create role authenticated nologin;
  grant usage on schema public to anon, authenticated;
  alter default privileges in schema public grant all on tables to anon, authenticated;
  alter default privileges in schema public grant execute on functions to anon, authenticated;
`);
await db.exec(readFileSync(new URL('../supabase/migrations/0001_lantern.sql', import.meta.url), 'utf8'));

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'apikey, authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

async function body(req) {
  let s = '';
  for await (const chunk of req) s += chunk;
  return s ? JSON.parse(s) : {};
}

createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return res.writeHead(204, cors).end();
  const send = (code, data) => {
    res.writeHead(code, { ...cors, 'Content-Type': 'application/json' });
    res.end(data === undefined ? '' : JSON.stringify(data));
  };
  try {
    const args = await body(req);
    if (req.url === '/_admin') {
      const r = await db.query(args.sql);
      return send(200, r.rows);
    }
    const m = /^\/rest\/v1\/rpc\/(lantern_[a-z_]+)$/.exec(req.url);
    if (!m || req.method !== 'POST') return send(404, { message: 'not found' });
    const names = Object.keys(args).filter((k) => /^p_[a-z_]+$/.test(k));
    const call = `select public.${m[1]}(${names.map((k, i) => `${k} => $${i + 1}`).join(', ')}) as r`;
    const rows = await db.transaction(async (tx) => {
      await tx.exec('set local role anon');
      return (await tx.query(call, names.map((k) => args[k]))).rows;
    });
    send(200, rows[0].r);
  } catch (err) {
    const status = /permission denied/.test(err.message) ? 401 : 400;
    send(status, { message: err.message });
  }
}).listen(port, () => console.log(`mock Supabase on http://localhost:${port}`));
