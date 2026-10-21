// node scripts/test-supabase.mjs — checks the REAL Supabase project, using only the public key
// the app ships with: the tables are locked, the functions work, and test rows are removed after.
// Reads LANTERN_SUPABASE_URL / LANTERN_SUPABASE_KEY from the environment or .env.local.

import { existsSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const envFile = fileURLToPath(new URL('../.env.local', import.meta.url));
if (existsSync(envFile)) process.loadEnvFile(envFile);
const URL_ = process.env.LANTERN_SUPABASE_URL;
const KEY = process.env.LANTERN_SUPABASE_KEY;
if (!URL_ || !KEY) throw new Error('Set LANTERN_SUPABASE_URL and LANTERN_SUPABASE_KEY');

const headers = { apikey: KEY, 'Content-Type': 'application/json' };
if (KEY.startsWith('eyJ')) headers.Authorization = `Bearer ${KEY}`;
const call = (path, init = {}) => fetch(`${URL_}/rest/v1/${path}`, { headers, ...init });
const rpc = async (fn, args) => {
  const r = await call(`rpc/${fn}`, { method: 'POST', body: JSON.stringify(args) });
  const text = await r.text();
  if (!r.ok) throw new Error(`${fn}: ${r.status} ${text}`);
  return text ? JSON.parse(text) : null;
};

let failures = 0;
const check = (name, cond, detail = '') => {
  console.log(`${cond ? 'ok  ' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
  if (!cond) failures++;
};

const hex = () => randomBytes(16).toString('hex');
const [A, B, C] = [hex(), hex(), hex()];
const AREA = `999999-lantern-selftest-${randomBytes(3).toString('hex')}`;

try {
  for (const table of ['lantern_outages', 'lantern_devices']) {
    const r = await call(`${table}?select=*`);
    check(`public key cannot read ${table}`, !r.ok, `HTTP ${r.status}`);
  }
  const ins = await call('lantern_outages', { method: 'POST', body: JSON.stringify({ area_code: AREA, device_id: A }) });
  check('public key cannot insert rows directly', !ins.ok, `HTTP ${ins.status}`);
  const internal = await call('rpc/lantern_close_stale', { method: 'POST', body: '{}' });
  check('public key cannot call internal functions', !internal.ok, `HTTP ${internal.status}`);

  for (const d of [A, B, C]) await rpc('lantern_checkin', { p_device: d, p_area: AREA });
  await rpc('lantern_report_out', { p_device: A, p_area: AREA, p_seconds_ago: 0 });
  let s = await rpc('lantern_area_status', { p_device: B, p_area: AREA });
  check('three phones, one out', s.users === 3 && s.out === 1 && !s.me_out, JSON.stringify({ users: s.users, out: s.out }));
  check('status never contains a device id', ![A, B, C].some((d) => JSON.stringify(s).includes(d)));

  await rpc('lantern_report_back', { p_device: B, p_seconds_ago: 0, p_unknown: false });
  s = await rpc('lantern_area_status', { p_device: C, p_area: AREA });
  check("one phone cannot close another's report", s.out === 1);

  await rpc('lantern_report_back', { p_device: A, p_seconds_ago: 0, p_unknown: false });
  s = await rpc('lantern_area_status', { p_device: C, p_area: AREA });
  check('closing works, and the cut reaches history', s.out === 0 && s.history.length === 1 && s.back_recent === 1);
} finally {
  for (const d of [A, B, C]) await rpc('lantern_forget', { p_device: d }).catch(() => {});
  const s = await rpc('lantern_area_status', { p_device: A, p_area: AREA }).catch(() => null);
  check('test rows deleted', s && s.users === 0 && s.history.length === 0);
}

process.exitCode = failures ? 1 : 0;
