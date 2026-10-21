// Just enough of the Chrome DevTools Protocol to drive headless Chrome from a test. No dependencies.

import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function launch({ debugPort = 9333, width = 375, height = 812, shots = tmpdir() } = {}) {
  const chrome = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  const proc = spawn(
    chrome,
    [
      '--headless=new',
      `--remote-debugging-port=${debugPort}`,
      `--user-data-dir=${mkdtempSync(join(tmpdir(), 'lantern-chrome-'))}`,
      '--no-first-run',
      '--no-default-browser-check',
      `--window-size=${width},${height}`,
      'about:blank',
    ],
    { stdio: 'ignore' },
  );

  let page;
  for (let i = 0; i < 50 && !page; i++) {
    await sleep(200);
    try {
      const list = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json();
      page = list.find((t) => t.type === 'page');
    } catch {}
  }
  if (!page) throw new Error('Chrome DevTools did not come up');

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r, { once: true }));
  let nextId = 1;
  const pending = new Map();
  ws.addEventListener('message', (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
    }
  });
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = nextId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  const js = async (expression) => {
    const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };
  const shot = async (name) => {
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(join(shots, `${name}.png`), Buffer.from(data, 'base64'));
  };

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 2, mobile: true });

  return {
    send,
    js,
    shot,
    goto: (url) => send('Page.navigate', { url }),
    // A normal reload, like reopening the app. A hard reload (ignoreCache) can skip the service worker.
    reload: () => send('Page.reload', {}),
    click: (selector) => js(`document.querySelector(${JSON.stringify(selector)}).click()`),
    text: (selector) => js(`(document.querySelector(${JSON.stringify(selector)}) || {}).innerText || ''`),
    view: () => js(`document.getElementById('app').dataset.view`),
    close() {
      ws.close();
      proc.kill();
    },
  };
}

export function checker() {
  let failures = 0;
  const check = (name, cond, detail = '') => {
    console.log(`${cond ? 'ok  ' : 'FAIL'} ${name}${detail ? ` — ${String(detail).replace(/\s+/g, ' ').slice(0, 110)}` : ''}`);
    if (!cond) failures++;
  };
  check.failures = () => failures;
  return check;
}
