// The neighbour layer. Everything here is optional: if it fails, the app carries on.
// Talks to Supabase through a handful of database functions — never to the tables directly.

import { SUPABASE_URL, SUPABASE_KEY } from './config.js';
import { secondsAgo } from './logic.js';
import { queueAll, queueDelete } from './store.js';

export const configured = Boolean(SUPABASE_URL && SUPABASE_KEY);

async function rpc(fn, args, timeoutMs = 8000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  const headers = { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' };
  // Legacy anon keys are JWTs and go in Authorization too; new publishable keys must not.
  if (SUPABASE_KEY.startsWith('eyJ')) headers.Authorization = `Bearer ${SUPABASE_KEY}`;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(args),
      signal: ctrl.signal,
      cache: 'no-store',
    });
    if (!res.ok) {
      const err = new Error(`${fn}: HTTP ${res.status}`);
      err.status = res.status;
      throw err;
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } finally {
    clearTimeout(timer);
  }
}

// Times leave the phone as "seconds ago", and the server subtracts them from its own clock.
function send(op, device) {
  const ago = secondsAgo(op.at, Date.now());
  switch (op.op) {
    case 'out':
      return rpc('lantern_report_out', { p_device: device, p_area: op.area, p_seconds_ago: ago });
    case 'back':
      return rpc('lantern_report_back', { p_device: device, p_seconds_ago: ago, p_unknown: Boolean(op.unknown) });
    case 'called':
      return rpc('lantern_called', { p_device: device, p_seconds_ago: ago });
    case 'cancel':
      return rpc('lantern_cancel', { p_device: device });
    default:
      return Promise.resolve();
  }
}

// A request the server rejects as malformed will never succeed; anything else is retried later.
const permanent = (status) => status === 400 || status === 409 || status === 422;

// Sends queued reports in order. Stops at the first network failure and keeps the rest.
export async function flush(device, onSending = () => {}) {
  const ops = await queueAll();
  for (const op of ops) {
    onSending(op.seq);
    try {
      await send(op, device);
    } catch (err) {
      if (!permanent(err.status)) throw err;
      console.warn('Dropping report the server refused', op, err);
    }
    await queueDelete(op.seq);
  }
  onSending(null);
  return ops.length;
}

export const checkin = (device, area) => rpc('lantern_checkin', { p_device: device, p_area: area });

export async function areaStatus(device, area) {
  const r = await rpc('lantern_area_status', { p_device: device, p_area: area });
  const ms = (iso) => (iso ? Date.parse(iso) : null);
  return {
    area,
    users: r.users,
    out: r.out,
    meOut: r.me_out,
    meKnown: r.me_known,
    backRecent: r.back_recent,
    calledAt: ms(r.called_at),
    history: (r.history || []).map(([s, e]) => ({ start: ms(s), end: ms(e) })),
    fetchedAt: Date.now(),
  };
}

export const forget = (device) => rpc('lantern_forget', { p_device: device });
