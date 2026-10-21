// Copies src/ to dist/, writes config.js from environment variables, and gives the
// service worker a content hash and the full file list. No dependencies.
//
// Env (Vercel project settings, or .env.local for a local build):
//   LANTERN_SUPABASE_URL   https://<ref>.supabase.co
//   LANTERN_SUPABASE_KEY   the project's anon / publishable key (public by design; RLS does the protecting)

import { cpSync, rmSync, readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const src = join(root, 'src');
const dist = join(root, 'dist');

const envFile = join(root, '.env.local');
if (existsSync(envFile)) process.loadEnvFile(envFile);

const url = (process.env.LANTERN_SUPABASE_URL || '').trim().replace(/\/+$/, '');
const key = (process.env.LANTERN_SUPABASE_KEY || '').trim();
// LANTERN_ALLOW_LOCAL=1 lets tests point at scripts/mock-supabase.mjs.
const local = process.env.LANTERN_ALLOW_LOCAL === '1' && /^http:\/\/localhost:\d+$/.test(url);
if (url && !local && !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url)) {
  console.error(`LANTERN_SUPABASE_URL doesn't look like https://<ref>.supabase.co: ${url}`);
  process.exit(1);
}
if (key.startsWith('sb_secret_') || key.includes('service_role')) {
  console.error('LANTERN_SUPABASE_KEY must be the public anon/publishable key, never a secret key.');
  process.exit(1);
}

rmSync(dist, { recursive: true, force: true });
cpSync(src, dist, { recursive: true });

const config = readFileSync(join(src, 'config.js'), 'utf8')
  .replace("SUPABASE_URL = ''", `SUPABASE_URL = ${JSON.stringify(url)}`)
  .replace("SUPABASE_KEY = ''", `SUPABASE_KEY = ${JSON.stringify(key)}`);
writeFileSync(join(dist, 'config.js'), config);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const files = walk(dist)
  .map((p) => relative(dist, p).split(sep).join('/'))
  .filter((f) => f !== 'sw.js')
  .sort();

const hash = createHash('sha256');
for (const f of files) hash.update(f).update(readFileSync(join(dist, f)));
const version = hash.digest('hex').slice(0, 12);

const swPath = join(dist, 'sw.js');
const sw = readFileSync(swPath, 'utf8')
  .replace(/const VERSION = '[^']*';/, `const VERSION = '${version}';`)
  .replace(/const SHELL = \[[^\]]*\];/, `const SHELL = ${JSON.stringify(['./', ...files])};`);
writeFileSync(swPath, sw);

const bytes = walk(dist).reduce((n, p) => n + statSync(p).size, 0);
console.log(`dist/ built: ${files.length + 1} files, ${(bytes / 1024).toFixed(1)} KB, cache ${version}`);
console.log(url ? `Neighbour layer ON (${url})` : 'Neighbour layer OFF (no LANTERN_SUPABASE_URL): solo mode only');
if (bytes > 250 * 1024) console.warn('Warning: over the 250 KB budget.');
