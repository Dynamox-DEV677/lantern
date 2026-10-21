// End-to-end test of the neighbour layer: the app in headless Chrome, talking to
// scripts/mock-supabase.mjs (the real migration in PGlite), with fake neighbours.
// Builds dist/ in test mode, then rebuilds it normally when done.
// Usage: node scripts/qa-neighbours.mjs [screenshotDir]

import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch, checker, sleep } from './cdp.mjs';

const shots = process.argv[2] || mkdtempSync(join(tmpdir(), 'lantern-qa-'));
mkdirSync(shots, { recursive: true });
const here = (f) => fileURLToPath(new URL(f, import.meta.url));
const MOCK = 54329;
const PORT = 4221;
const API = `http://localhost:${MOCK}`;
const AREA = '411038-test-lane';

const build = (env) => {
  const r = spawnSync(process.execPath, [here('./build.mjs')], { env: { ...process.env, ...env }, encoding: 'utf8' });
  if (r.status) throw new Error(r.stderr);
};
build({ LANTERN_SUPABASE_URL: API, LANTERN_SUPABASE_KEY: 'local-test-key', LANTERN_ALLOW_LOCAL: '1' });

const mock = spawn(process.execPath, [here('./mock-supabase.mjs'), String(MOCK)], { stdio: 'ignore' });
const server = spawn(process.execPath, [here('./serve.mjs'), String(PORT)], { stdio: 'ignore' });
for (let i = 0; i < 50; i++) {
  await sleep(200);
  if (await fetch(`${API}/_admin`, { method: 'POST', body: '{"sql":"select 1"}' }).then((r) => r.ok, () => false)) break;
}

const post = async (path, body) => {
  const r = await fetch(`${API}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const text = await r.text();
  if (!r.ok) throw new Error(`${path}: ${text}`);
  return text ? JSON.parse(text) : null;
};
const admin = (sql) => post('/_admin', { sql });
const rpc = (fn, args) => post(`/rest/v1/rpc/${fn}`, args);
const B = 'b'.repeat(32);
const C = 'c'.repeat(32);

const b = await launch({ shots, debugPort: 9334 });
const check = checker();
const idb = (body) =>
  b.js(`new Promise((ok, no) => { const q = indexedDB.open('lantern'); q.onerror = no; q.onsuccess = () => { const db = q.result; ${body} } })`);
const myId = () => idb(`const g = db.transaction('kv').objectStore('kv').get('deviceId'); g.onsuccess = () => ok(g.result);`);
const shiftOpenCut = (hours) =>
  idb(`const tx = db.transaction('cuts', 'readwrite'); const s = tx.objectStore('cuts'); const g = s.getAll();
       g.onsuccess = () => { const c = g.result.find(c => c.end == null && !c.unknown); c.start -= ${hours * 3600e3}; s.put(c); };
       tx.oncomplete = () => ok(true);`);
const refresh = async () => {
  await b.js(`document.dispatchEvent(new Event('visibilitychange'))`);
  await sleep(1200);
};

try {
  // Join through an invite link, like a neighbour would.
  await b.goto(`http://localhost:${PORT}/?a=${AREA}&n=Test%20Lane`);
  await sleep(1200);
  await b.click('[data-lang=en]');
  await sleep(300);
  check('invite link offers to join the area', (await b.view()) === 'join', await b.text('main'));
  await b.click('[data-act=join]');
  await sleep(1200);
  const me = await myId();

  // Two neighbours with the app, power on. Four past weekly cuts at this same hour.
  for (const d of [B, C]) await rpc('lantern_checkin', { p_device: d, p_area: AREA });
  for (const [k, mins] of [[1, 100], [2, 110], [3, 120], [4, 130]]) {
    await admin(`insert into public.lantern_outages (area_code, device_id, went_out_at, came_back_at)
      values ('${AREA}', '${B}', now() - interval '${k * 7} days', now() - interval '${k * 7} days' + interval '${mins} minutes')`);
  }

  // State 3: only me out, with 3 phones in the area.
  await b.click('[data-act=out]');
  await sleep(1500);
  let v = await b.text('#verdict');
  check('3 phones, only me out → "may be the only one"', /You may be the only one out/.test(v), v);
  check('MCB step, not "fuse"', /Check your MCB board/.test(v) && !/fuse/i.test(v));
  check("don't-keep-resetting warning shown", /Don't keep resetting it/.test(v) && /RCCB\/ELCB/.test(v));
  const est = await b.text('#estimate');
  check('estimate from past cuts at this time', /usually last about 2h/.test(est) && /4 past cuts/.test(est), est);
  await b.shot('5-only-you');

  // State 2: the neighbours' power goes too.
  await rpc('lantern_report_out', { p_device: B, p_area: AREA, p_seconds_ago: 20 });
  await rpc('lantern_report_out', { p_device: C, p_area: AREA, p_seconds_ago: 10 });
  await refresh();
  v = await b.text('#verdict');
  check('3 of 3 out → "it\'s the area"', /3 of 3 nearby are out — it's the area/.test(v), v);
  check('area cut → nothing to fix at home', /Nothing to fix inside your home/.test(v));

  await rpc('lantern_called', { p_device: C, p_seconds_ago: 0 });
  await refresh();
  let rep = await b.text('#report');
  check('sees that a neighbour already called', /A neighbour called MSEDCL at/.test(rep), rep);
  await b.shot('6-area');
  await b.click('[data-act=called]');
  await sleep(800);
  rep = await b.text('#report');
  check('"I\'ve called" is remembered', /You called MSEDCL at/.test(rep), rep);

  // Neighbours' power comes back while mine doesn't.
  await rpc('lantern_report_back', { p_device: B, p_seconds_ago: 0, p_unknown: false });
  await rpc('lantern_report_back', { p_device: C, p_seconds_ago: 0, p_unknown: false });
  await refresh();
  v = await b.text('#verdict');
  check('neighbours back, me still out → may be only me, and says they are back', /only one out/.test(v) && /2 nearby say their power is back/.test(v), v);

  // An old open report: "Is the power back? When?"
  await shiftOpenCut(4);
  await admin(`update public.lantern_outages set went_out_at = went_out_at - interval '4 hours' where device_id = '${me}' and came_back_at is null`);
  await b.reload();
  await sleep(1500);
  check('report open > 3h → asks if the power is back', (await b.view()) === 'ask', await b.text('main'));
  await b.shot('7-ask');
  await b.click('[data-act=back-hour]');
  await sleep(1500);
  check('"about an hour ago" closes it at 3h', /Power's back after 3h/.test(await b.text('main')), await b.text('.since'));
  const row = (await admin(`select extract(epoch from came_back_at - went_out_at)::int s from public.lantern_outages where device_id = '${me}' order by went_out_at desc limit 1`))[0];
  check('server stored ~3h from its own clock', Math.abs(row.s - 3 * 3600) < 120, `${row.s}s`);

  // Left open over 12 hours: closed as unknown, never guessed.
  await b.click('[data-act=out]');
  await sleep(1200);
  await shiftOpenCut(13);
  await b.reload();
  await sleep(2000);
  check('report open > 12h → closed without a time', /closed without a time/.test(await b.text('main')));
  const unk = (await admin(`select unknown_duration u, came_back_at from public.lantern_outages where device_id = '${me}' order by went_out_at desc limit 1`))[0];
  check('server marks it unknown, with no restore time', unk.u === true && unk.came_back_at === null);

  // Undo an accidental tap.
  await b.click('[data-act=out]');
  await sleep(1200);
  await b.click('[data-act=undo]');
  await sleep(1500);
  const open = (await admin(`select count(*)::int n from public.lantern_outages where device_id = '${me}' and came_back_at is null and not unknown_duration`))[0].n;
  check('undo removes the report on the server too', (await b.view()) === 'on' && open === 0, `${open} open`);

  // Neighbours screen + invite.
  await b.click('[data-view=neighbours]');
  await sleep(1200);
  const nb = await b.text('main');
  check('neighbours screen counts phones', /3 phones in Test Lane use Lantern/.test(nb), nb);
  check('invite link carries the area', (await b.text('#invite-url')).includes(`a=${AREA}`));
  await b.shot('8-neighbours');

  // Marathi.
  await b.click('[data-view=home]');
  await sleep(300);
  await b.click('[data-view=settings]');
  await sleep(300);
  await b.click('[data-lang=mr]');
  await sleep(300);
  await b.click('[data-view=home]');
  await sleep(300);
  await b.click('[data-act=out]');
  await sleep(1500);
  v = await b.text('#verdict');
  check('Marathi: may be only you + MCB', /कदाचित फक्त तुमचीच वीज गेली आहे/.test(v) && /MCB/.test(v), v);
  await b.shot('9-marathi-only-you');
  await b.click('.back');
  await sleep(1000);

  // Delete everything.
  await b.js(`window.confirm = () => true`);
  await b.click('[data-view=settings]');
  await sleep(300);
  await b.click('[data-act=delete]');
  await sleep(2000);
  const left = (await admin(`select (select count(*) from public.lantern_outages where device_id = '${me}')::int o, (select count(*) from public.lantern_devices where device_id = '${me}')::int d`))[0];
  check('delete removes every server row for this phone', left.o === 0 && left.d === 0, JSON.stringify(left));
  check('and starts the app fresh', (await b.view()) === 'lang');
} finally {
  b.close();
  mock.kill();
  server.kill();
  build({ LANTERN_SUPABASE_URL: '', LANTERN_SUPABASE_KEY: '', LANTERN_ALLOW_LOCAL: '' });
}

console.log(`Screenshots: ${shots}`);
process.exitCode = check.failures() ? 1 : 0;
