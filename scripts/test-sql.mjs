// node scripts/test-sql.mjs — runs supabase/migrations/0001_lantern.sql in an in-process
// Postgres (PGlite) set up like Supabase, then checks the locks and the functions as `anon`.
// Needs `npm install` once (dev dependency only; the app itself has none).

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';

const migration = readFileSync(new URL('../supabase/migrations/0001_lantern.sql', import.meta.url), 'utf8');
const db = new PGlite();

// What Supabase does to every new project: anon can use the schema, and by default gets
// rights on new tables and functions. The migration has to take those back.
await db.exec(`
  create role anon nologin;
  create role authenticated nologin;
  grant usage on schema public to anon, authenticated;
  alter default privileges in schema public grant all on tables to anon, authenticated;
  alter default privileges in schema public grant execute on functions to anon, authenticated;
`);
await db.exec(migration);
await db.exec(migration); // must be safe to run twice

const asAnon = (sql, params = []) =>
  db.transaction(async (tx) => {
    await tx.exec('set local role anon');
    return (await tx.query(sql, params)).rows;
  });
const refused = async (sql, params) => {
  await assert.rejects(asAnon(sql, params), /permission denied/);
};
const rpc = async (fn, ...args) => {
  const ph = args.map((_, i) => `$${i + 1}`).join(', ');
  const rows = await asAnon(`select public.${fn}(${ph}) as r`, args);
  return rows[0].r;
};
const status = (device, area = AREA) => rpc('lantern_area_status', device, area);

const dev = (c) => c.repeat(32);
const [A, B, C, D, E] = ['a', 'b', 'c', 'd', 'e'].map(dev);
const AREA = '411038-shanti-nagar';
let passed = 0;
const ok = (name) => {
  passed++;
  console.log(`ok  ${name}`);
};

// --- locks ---
await refused('select * from public.lantern_outages');
await refused('select * from public.lantern_devices');
await refused(`insert into public.lantern_outages (area_code, device_id) values ('${AREA}', '${A}')`);
await refused(`update public.lantern_outages set came_back_at = now()`);
await refused('select public.lantern_close_stale()');
ok('anon cannot read, write or update tables, or call internal functions');

// --- neighbours ---
for (const d of [A, B, C]) await rpc('lantern_checkin', d, AREA);
let s = await status(A);
assert.equal(s.users, 3);
assert.equal(s.me_known, true);
assert.equal(s.out, 0);
ok('three phones checked in');

await rpc('lantern_report_out', A, AREA, 0);
await rpc('lantern_report_out', A, AREA, 4); // the same tap, retried after a lost reply
s = await status(B);
assert.equal(s.out, 1);
assert.equal(s.me_out, false);
assert.equal((await status(A)).me_out, true);
ok('a report counts once, even when retried');

await rpc('lantern_report_back', B, 0, false);
assert.equal((await status(C)).out, 1);
ok("one phone cannot close another phone's report");

await rpc('lantern_report_out', B, AREA, 30);
assert.equal((await status(C)).out, 2);
await rpc('lantern_called', A, 0);
assert.ok((await status(C)).called_at, 'a neighbour sees that someone called');
ok('second phone out; "I\'ve called" is visible to neighbours');

await rpc('lantern_report_back', A, 0, false);
s = await status(B);
assert.equal(s.out, 1);
assert.equal(s.back_recent, 1);
assert.equal(s.history.length, 1);
ok('power back: counted in back_recent and history');

await rpc('lantern_report_back', B, 0, true);
s = await status(C);
assert.equal(s.out, 0);
assert.equal(s.history.length, 1, "I'm not sure never reaches the history");
ok("\"I'm not sure\" closes without a time and stays out of averages");

// --- clocks: the server's now(), "seconds ago" clamped to 12 hours ---
const at = await rpc('lantern_report_out', C, AREA, 10_000_000);
const age = (Date.now() - new Date(at).getTime()) / 3600e3;
assert.ok(age > 11.9 && age < 12.1, `clamped to 12h, got ${age}h`);
await rpc('lantern_cancel', C);
assert.equal((await status(A)).out, 0);
ok('seconds_ago is clamped; undo removes the open report');

// --- stale reports ---
await db.exec(`insert into public.lantern_devices (device_id, area_code) values ('${D}', '${AREA}'), ('${E}', '${AREA}')`);
await db.exec(`insert into public.lantern_outages (area_code, device_id, went_out_at) values ('${AREA}', '${D}', now() - interval '13 hours')`);
await db.exec(`insert into public.lantern_outages (area_code, device_id, went_out_at) values ('${AREA}', '${E}', now() - interval '7 hours')`);
s = await status(A);
const d = (await db.query(`select unknown_duration, came_back_at from public.lantern_outages where device_id = '${D}'`)).rows[0];
assert.deepEqual([d.unknown_duration, d.came_back_at], [true, null]);
assert.equal(s.out, 0, "a 7-hour-old open report from someone else isn't counted");
assert.equal((await status(E)).out, 1, 'but it still counts for its own phone');
ok('12h auto-close as unknown; stale open reports not counted for neighbours');

// --- one open report per phone ---
await rpc('lantern_report_out', A, AREA, 0);
await assert.rejects(
  db.exec(`insert into public.lantern_outages (area_code, device_id) values ('${AREA}', '${A}')`),
  /lantern_one_open_per_device/,
);
await rpc('lantern_report_out', A, AREA, 600); // a new tap 10 min earlier than the open one
const open = (await db.query(`select count(*)::int n from public.lantern_outages where device_id = '${A}' and came_back_at is null and not unknown_duration`)).rows[0].n;
assert.equal(open, 1);
ok('never two open reports for one phone');

// --- bad input ---
await assert.rejects(rpc('lantern_report_out', 'not-a-device', AREA, 0), /check constraint/);
await assert.rejects(rpc('lantern_checkin', A, 'shanti'), /check constraint/);
ok('malformed device ids and areas are refused');

// --- forget ---
await rpc('lantern_forget', A);
const left = (await db.query(`select (select count(*) from public.lantern_outages where device_id = '${A}')::int o, (select count(*) from public.lantern_devices where device_id = '${A}')::int d`)).rows[0];
assert.deepEqual(left, { o: 0, d: 0 });
ok('"Delete all my data" removes every row for that phone');

console.log(`${passed} passed`);
