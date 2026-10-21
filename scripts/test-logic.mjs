// node scripts/test-logic.mjs — the rules that decide what Lantern says.

import assert from 'node:assert/strict';
import * as L from '../src/logic.js';
import { makeT, fmtDuration, LANGS, REGION, STRINGS } from '../src/i18n.js';

let passed = 0;
function test(name, fn) {
  try {
    fn();
    passed++;
  } catch (err) {
    console.error(`FAIL ${name}\n`, err);
    process.exitCode = 1;
  }
}

const H = 3600e3;
const M = 60e3;

// --- three states, never two ---
test('one user: unknown, never "only you"', () => {
  assert.equal(L.neighbourVerdict({ users: 1, out: 1, meOut: true }).kind, 'unknown');
});
test('two users both out: still unknown (below threshold)', () => {
  assert.equal(L.neighbourVerdict({ users: 2, out: 2, meOut: true }).kind, 'unknown');
});
test('no status at all: unknown', () => {
  assert.equal(L.neighbourVerdict(null).kind, 'unknown');
});
test('9 users, 7 out: the area, most', () => {
  const v = L.neighbourVerdict({ users: 9, out: 7, meOut: true });
  assert.deepEqual([v.kind, v.out, v.users, v.most], ['area', 7, 9, true]);
});
test('9 users, 3 out: not just you, but not most', () => {
  const v = L.neighbourVerdict({ users: 9, out: 3, meOut: true });
  assert.deepEqual([v.kind, v.most], ['area', false]);
});
test('3 users, only me out: may be only you', () => {
  const v = L.neighbourVerdict({ users: 3, out: 1, meOut: true, backRecent: 0 });
  assert.deepEqual([v.kind, v.others], ['maybe-only-you', 2]);
});
test('threshold is exactly MIN_NEIGHBOURS', () => {
  assert.equal(L.MIN_NEIGHBOURS, 3);
  assert.equal(L.neighbourVerdict({ users: L.MIN_NEIGHBOURS, out: 1, meOut: true }).kind, 'maybe-only-you');
  assert.equal(L.neighbourVerdict({ users: L.MIN_NEIGHBOURS - 1, out: 1, meOut: true }).kind, 'unknown');
});

// --- closing reports ---
const now = Date.UTC(2026, 9, 21, 15, 0);
test('open 2h: nothing to ask', () => {
  assert.equal(L.openReportAction({ start: now - 2 * H, end: null }, now), 'none');
});
test('open 3h+: ask', () => {
  assert.equal(L.openReportAction({ start: now - 3 * H - M, end: null }, now), 'ask');
});
test('open 3h+ but snoozed: do not ask yet', () => {
  assert.equal(L.openReportAction({ start: now - 4 * H, end: null }, now, now + M), 'none');
});
test('open 12h+: auto-close as unknown', () => {
  assert.equal(L.openReportAction({ start: now - 12 * H - M, end: null }, now), 'auto-close');
});
test('closed or unknown reports are left alone', () => {
  assert.equal(L.openReportAction({ start: now - 20 * H, end: now - 19 * H }, now), 'none');
  assert.equal(L.openReportAction({ start: now - 20 * H, end: null, unknown: true }, now), 'none');
});

// --- averages only use real starts and real ends ---
test('unknown durations never reach an estimate', () => {
  const rows = [
    { start: now - 50 * H, end: now - 49 * H },
    { start: now - 40 * H, end: now - 39 * H },
    { start: now - 30 * H, end: null, unknown: true },
    { start: now - 20 * H, end: null },
  ];
  assert.equal(L.estimate(rows, now), null, 'two known cuts are not enough');
  rows.push({ start: now - 10 * H, end: now - 9 * H });
  assert.equal(L.estimate(rows, now).n, 3);
  assert.equal(L.estimate(rows, now).typical, H);
});
test('many phones reporting one cut count as one cut', () => {
  const s = now - 10 * H;
  const cuts = L.clusterCuts([
    { start: s, end: s + 60 * M },
    { start: s + 2 * M, end: s + 62 * M },
    { start: s + 5 * M, end: s + 70 * M },
    { start: s + 5 * H, end: s + 5 * H + 9 * M },
  ]);
  assert.equal(cuts.length, 2);
  assert.equal(cuts[0].reports, 3);
  assert.equal(cuts[0].duration, 60 * M);
  assert.equal(cuts[1].duration, 9 * M);
});
test('estimate prefers same time of day and day type', () => {
  const evening = (d, mins) => {
    const s = new Date(2026, 9, d, 19, 0).getTime();
    return { start: s, end: s + mins * M };
  };
  const morning = (d, mins) => {
    const s = new Date(2026, 9, d, 8, 0).getTime();
    return { start: s, end: s + mins * M };
  };
  // 12–16 Oct 2026 are Mon–Fri.
  const rows = [evening(12, 120), evening(13, 130), evening(14, 110), morning(15, 10), morning(16, 12)];
  const e = L.estimate(rows, new Date(2026, 9, 20, 19, 30).getTime());
  assert.equal(e.bucket, 'weekday_evening');
  assert.equal(e.typical, 120 * M);
});
test('estimates are rounded, not falsely precise', () => {
  assert.equal(L.roundForEstimate(117 * M), 120 * M);
  assert.equal(L.roundForEstimate(23 * M), 25 * M);
  assert.equal(L.roundForEstimate(1 * M), 5 * M);
});

// --- solo pattern ---
test('pattern works for one user', () => {
  const at = (d, h, mins) => {
    const s = new Date(2026, 9, d, h, 0).getTime();
    return { start: s, end: mins == null ? null : s + mins * M, unknown: mins == null };
  };
  const p = L.pattern([at(13, 19, 130), at(14, 20, 9), at(20, 19, 45), at(21, 3, null)]);
  assert.equal(p.count, 4);
  assert.equal(p.knownCount, 3);
  assert.equal(p.longest.duration, 130 * M);
  assert.equal(p.shortest.duration, 9 * M);
  assert.equal(p.commonPart, 'evening');
  assert.equal(p.worstDay.day, 2); // 13 and 20 Oct 2026 are Tuesdays
});
test('pattern of nothing is null', () => {
  assert.equal(L.pattern([]), null);
});

// --- area codes, clocks ---
test('area codes normalise spacing and case, keep Tamil and Devanagari', () => {
  assert.equal(L.areaCode('600041', '  Gandhi   Nagar '), '600041-gandhi-nagar');
  assert.equal(L.areaCode('600041', 'காந்தி நகர்'), '600041-காந்தி-நகர்');
  assert.equal(L.areaCode('600041', 'गांधी नगर'), '600041-गांधी-नगर');
  assert.equal(L.areaCode('600041', 'Bldg #4, 2nd Street'), '600041-bldg-4-2nd-street');
});
test('pincodes', () => {
  assert.ok(L.validPin('600041'));
  assert.ok(!L.validPin('060041'));
  assert.ok(!L.validPin('60004'));
});
test('seconds ago is clamped and never negative', () => {
  assert.equal(L.secondsAgo(now - 90e3, now), 90);
  assert.equal(L.secondsAgo(now + 5000, now), 0);
  assert.equal(L.secondsAgo(now - 48 * H, now), 12 * 3600);
});

// --- words ---
test('English is the default language', () => {
  assert.equal(LANGS[0].code, 'en');
  assert.deepEqual(LANGS.map((l) => l.code), ['en', 'ta', 'hi']);
});
test('every language has the MCB warning and names the board and number', () => {
  for (const lang of ['en', 'ta', 'hi']) {
    const t = makeT(lang);
    assert.match(t('mcb_1'), /MCB/);
    assert.match(t('mcb_rccb'), /RCCB\/ELCB/);
    assert.match(t('mcb_last'), /94987 94987/);
    assert.doesNotMatch(t('mcb_1') + t('mcb_warn'), /fuse|फ्यूज|ஃபியூஸ்/i);
  }
  assert.equal(REGION.phone, '9498794987');
});
test('every English string exists in Tamil and Hindi, with the same blanks', () => {
  const blanks = (s) => (s.match(/\{\w+\}/g) || []).filter((b) => b !== '{utility}' && b !== '{phone}').sort();
  for (const lang of ['ta', 'hi']) {
    for (const [key, text] of Object.entries(STRINGS.en)) {
      assert.ok(STRINGS[lang][key], `${lang}.${key} is missing`);
      assert.deepEqual(blanks(STRINGS[lang][key]), blanks(text), `${lang}.${key} has different blanks`);
    }
  }
});
test('durations read naturally', () => {
  assert.equal(fmtDuration(74 * M, 'en'), '1h 14m');
  assert.equal(fmtDuration(9 * M, 'en'), '9 min');
  assert.equal(fmtDuration(120 * M, 'ta'), '2 மணி நேரம்');
  assert.equal(fmtDuration(74 * M, 'ta'), '1 மணி 14 நிமி.');
  assert.equal(fmtDuration(60 * M, 'hi'), '1 घंटा');
});

console.log(`${passed} passed${process.exitCode ? ', some FAILED' : ''}`);
