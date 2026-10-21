// Pure rules. No DOM, no storage, no network — so they can be tested in Node.

// Fewer phones than this in the area, and Lantern says it can't tell yet.
// With one user, a real area-wide cut would otherwise look like "only you".
export const MIN_NEIGHBOURS = 3;
// More than this share of nearby phones out, and it's "the area" rather than "part of it".
export const AREA_MAJORITY = 0.5;
// An open report older than this asks "Is the power back? When?" on open.
export const ASK_AFTER_MS = 3 * 3600e3;
// An open report older than this is closed as unknown. A restore time is never guessed.
export const AUTO_CLOSE_MS = 12 * 3600e3;
// "Still out" pushes the question back by this much.
export const SNOOZE_MS = 3600e3;
// Reports from different phones that start within this of each other are the same cut.
export const SAME_CUT_MS = 15 * 60e3;
// A guess at how long a cut lasts needs at least this many past cuts.
export const MIN_CUTS_FOR_ESTIMATE = 3;
// An accidental "Power just went" can be undone for this long.
export const UNDO_MS = 2 * 60e3;

// status: { users, out, meOut, backRecent } from the server, users and out including this phone.
export function neighbourVerdict(status) {
  if (!status || status.users < MIN_NEIGHBOURS) {
    return { kind: 'unknown', users: status ? status.users : 0 };
  }
  const out = Math.max(status.out, status.meOut ? 1 : 0);
  const othersOut = out - (status.meOut ? 1 : 0);
  if (othersOut >= 1) {
    return { kind: 'area', out, users: status.users, most: out / status.users > AREA_MAJORITY };
  }
  return { kind: 'maybe-only-you', users: status.users, others: status.users - 1, backRecent: status.backRecent || 0 };
}

// What to do about this phone's open report when the app opens.
export function openReportAction(cut, now, snoozeUntil = 0) {
  if (!cut || cut.end != null || cut.unknown) return 'none';
  const age = now - cut.start;
  if (age > AUTO_CLOSE_MS) return 'auto-close';
  if (age > ASK_AFTER_MS && now >= snoozeUntil) return 'ask';
  return 'none';
}

// Only cuts with a real start and a real end ever reach an average.
export function hasKnownDuration(c) {
  return c.end != null && !c.unknown && c.end >= c.start;
}

export function median(xs) {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const mid = s.length >> 1;
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

// Many phones reporting one cut should count as one cut, not as many.
// rows: [{ start, end }] in ms, known durations only.
export function clusterCuts(rows) {
  const sorted = rows.filter(hasKnownDuration).sort((a, b) => a.start - b.start);
  const cuts = [];
  for (const r of sorted) {
    const last = cuts[cuts.length - 1];
    if (last && r.start - last.start <= SAME_CUT_MS) last.durations.push(r.end - r.start);
    else cuts.push({ start: r.start, durations: [r.end - r.start] });
  }
  return cuts.map((c) => ({ start: c.start, duration: median(c.durations), reports: c.durations.length }));
}

export function partOfDay(date) {
  const h = date.getHours();
  if (h >= 5 && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 22) return 'evening';
  return 'night';
}

export function dayType(date) {
  const d = date.getDay();
  return d === 0 || d === 6 ? 'weekend' : 'weekday';
}

// How long cuts like this one usually last. Never a promise, always with its sample size.
export function estimate(rows, startedAt) {
  const cuts = clusterCuts(rows);
  if (cuts.length < MIN_CUTS_FOR_ESTIMATE) return null;
  const when = new Date(startedAt);
  const part = partOfDay(when);
  const type = dayType(when);
  const same = cuts.filter((c) => {
    const d = new Date(c.start);
    return partOfDay(d) === part && dayType(d) === type;
  });
  if (same.length >= MIN_CUTS_FOR_ESTIMATE) {
    return { typical: median(same.map((c) => c.duration)), n: same.length, bucket: `${type}_${part}` };
  }
  return { typical: median(cuts.map((c) => c.duration)), n: cuts.length, bucket: null };
}

// "about 2h" — round so it doesn't look more precise than it is.
export function roundForEstimate(ms) {
  const min = ms / 60e3;
  const step = min < 60 ? 5 : 10;
  return Math.max(step, Math.round(min / step) * step) * 60e3;
}

// The solo pattern: works with nobody else using the app.
export function pattern(cuts) {
  const known = cuts.filter(hasKnownDuration).map((c) => ({ ...c, duration: c.end - c.start }));
  const all = cuts.filter((c) => c.start);
  if (!all.length) return null;
  const byPart = {};
  const byDay = {};
  for (const c of all) {
    const d = new Date(c.start);
    const p = partOfDay(d);
    byPart[p] = (byPart[p] || 0) + 1;
    const day = d.getDay();
    byDay[day] = byDay[day] || { n: 0, ms: 0 };
    byDay[day].n += 1;
  }
  for (const c of known) byDay[new Date(c.start).getDay()].ms += c.duration;
  const topPart = Object.entries(byPart).sort((a, b) => b[1] - a[1])[0];
  const worst = Object.entries(byDay).sort((a, b) => b[1].n - a[1].n || b[1].ms - a[1].ms)[0];
  const longest = known.reduce((a, c) => (!a || c.duration > a.duration ? c : a), null);
  const shortest = known.reduce((a, c) => (!a || c.duration < a.duration ? c : a), null);
  return {
    count: all.length,
    knownCount: known.length,
    totalMs: known.reduce((s, c) => s + c.duration, 0),
    longest,
    shortest,
    commonPart: topPart && topPart[1] >= 2 ? topPart[0] : null,
    worstDay: worst && worst[1].n >= 2 ? { day: Number(worst[0]), n: worst[1].n } : null,
  };
}

// Pincode + building/lane, normalised so "Shanti  Nagar" and "shanti nagar" match.
export function areaCode(pin, place) {
  const slug = place
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return `${pin}-${slug}`;
}

export function validPin(pin) {
  return /^[1-9][0-9]{5}$/.test(pin);
}

// Seconds between a tap and now, measured on this phone. A wrong phone clock
// cancels out, because both times come from the same clock; the server then
// subtracts this from its own now().
export function secondsAgo(at, now) {
  return Math.max(0, Math.min(Math.round((now - at) / 1000), AUTO_CLOSE_MS / 1000));
}
