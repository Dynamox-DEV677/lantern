// Renders src/icons/lantern.svg to the PNG sizes the manifest needs, with headless Chrome.
// Usage: node scripts/make-icons.mjs   (set CHROME=<path> if Chrome lives elsewhere)

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const chrome = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const icons = fileURLToPath(new URL('../src/icons/', import.meta.url));
const svg = readFileSync(join(icons, 'lantern.svg'), 'utf8');
// Maskable icons get cropped to a circle, so the lantern shrinks into the safe zone.
const maskable = svg.replace('scale(4.6)', 'scale(3.5)');

const jobs = [
  ['icon-192.png', 192, svg],
  ['icon-512.png', 512, svg],
  ['apple-touch-icon.png', 180, svg],
  ['maskable-512.png', 512, maskable],
];

const tmp = mkdtempSync(join(tmpdir(), 'lantern-icons-'));
for (const [name, size, source] of jobs) {
  const page = join(tmp, `${name}.html`);
  const sized = source.replace('<svg ', `<svg width="${size}" height="${size}" `);
  writeFileSync(page, `<!doctype html><html><body style="margin:0;background:#000;overflow:hidden">${sized}</body></html>`);
  execFileSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    `--user-data-dir=${join(tmp, 'profile')}`,
    `--window-size=${size},${size}`,
    `--screenshot=${join(icons, name)}`,
    pathToFileURL(page).href,
  ]);
  console.log(`icons/${name} (${size}px)`);
}
