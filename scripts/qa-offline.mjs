// The aeroplane-mode test, in headless Chrome: load once, kill the server, reload,
// and use the app with nothing to talk to. Run after `node scripts/build.mjs`.
// Usage: node scripts/qa-offline.mjs [screenshotDir]

import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch, checker, sleep } from './cdp.mjs';

const shots = process.argv[2] || mkdtempSync(join(tmpdir(), 'lantern-qa-'));
mkdirSync(shots, { recursive: true });
const PORT = 4220;
const origin = `http://localhost:${PORT}/`;

const server = spawn(process.execPath, [fileURLToPath(new URL('./serve.mjs', import.meta.url)), String(PORT)], { stdio: 'ignore' });
const b = await launch({ shots });
const check = checker();

try {
  // 1. First visit, online: the service worker installs and caches everything.
  await b.goto(origin);
  await sleep(1500);
  check('service worker active after first visit', await b.js(`navigator.serviceWorker.ready.then(r => !!r.active)`));
  const cached = await b.js(`caches.keys().then(async k => (await (await caches.open(k[0])).keys()).length)`);
  check('whole app precached', cached >= 10, `${cached} files`);

  // 2. Aeroplane mode: the server is gone.
  server.kill();
  await sleep(500);
  check('server really is down', await fetch(origin).then(() => false, () => true));

  await b.reload();
  await sleep(1500);
  check('app opens with no network', (await b.view()) === 'lang', await b.text('h1'));
  await b.shot('1-offline-language');

  await b.click('[data-lang=en]');
  await sleep(300);
  await b.click('[data-act=solo]');
  await sleep(300);
  check('power-on screen offline', (await b.view()) === 'on', await b.text('h1'));
  await b.shot('2-offline-power-on');

  await b.click('[data-act=out]');
  await sleep(500);
  check('one tap logs a cut offline', (await b.view()) === 'out', await b.text('h1'));
  const verdict = await b.text('#verdict');
  check('says it does not know, rather than guessing', /Not enough neighbours/.test(verdict), verdict);
  const target = await b.js(`Math.round(document.querySelector('.back').getBoundingClientRect().height)`);
  check("Power's back button at least 64px tall", target >= 64, `${target}px`);
  await b.shot('3-offline-power-out');

  // 3. Close the app and reopen: the cut survived (IndexedDB), still offline.
  await b.reload();
  await sleep(1500);
  check('open cut survives a reload', (await b.view()) === 'out');

  await b.click('.back');
  await sleep(500);
  check("Power's back returns to the power-on screen", (await b.view()) === 'on');
  await b.click('[data-view=log]');
  await sleep(300);
  const log = await b.js(`document.querySelectorAll('.log li').length`);
  check('the cut is in My log', log === 1, `${log} entries`);
  await b.shot('4-offline-log');

  const smallest = await b.js(
    `Math.min(...[...document.querySelectorAll('body *')].filter(e => e.innerText && e.offsetParent).map(e => parseFloat(getComputedStyle(e).fontSize)))`,
  );
  check('nothing under 18px', smallest >= 18, `${smallest}px`);
} finally {
  b.close();
  server.kill();
}

console.log(`Screenshots: ${shots}`);
process.exitCode = check.failures() ? 1 : 0;
