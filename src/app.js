import * as L from './logic.js';
import { LANGS, REGION, makeT, fmtDuration, fmtTime, fmtWhen, fmtDate, dayName } from './i18n.js';
import * as db from './store.js';
import * as net from './sync.js';
import { SOURCE_URL } from './config.js';
import { lantern, iconOut, iconBack, iconPhone } from './icons.js';

const $app = document.getElementById('app');
const $live = document.getElementById('live');
const $toast = document.getElementById('toast');

const S = {
  lang: 'en',
  deviceId: null,
  area: null, // { code, pin, place }
  solo: false,
  cuts: [],
  status: null, // last answer from the server, see net.areaStatus
  queued: 0,
  netOk: true,
  view: 'home',
  invite: null,
  snoozeUntil: 0,
  notice: null,
  lastBack: null,
  mcbOpen: false,
  installPrompt: null,
  lastCheckin: 0,
};

let t = makeT(S.lang);
let sending = null;
let syncing = null;

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const T = (key, vars) => esc(t(key, vars));
const dur = (ms) => fmtDuration(ms, S.lang);
const time = (ms) => fmtTime(ms, S.lang);
const openCut = () => S.cuts.find((c) => c.end == null && !c.unknown) || null;
const neighbourLayer = () => net.configured && S.area;

function uid() {
  const b = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
}

function announce(text) {
  $live.textContent = '';
  setTimeout(() => ($live.textContent = text), 50);
}

let toastTimer = null;
function toast(text) {
  $toast.textContent = text;
  $toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ($toast.hidden = true), 5000);
}

function buzz() {
  if (navigator.vibrate) navigator.vibrate(40);
}

// A report only goes in the queue when there is somewhere to send it.
const queued = (op) => (neighbourLayer() ? { ...op, area: S.area.code } : null);

// ---------- views ----------

function chip() {
  const offline = !navigator.onLine || (neighbourLayer() && !S.netOk);
  if (!offline) return '';
  const text = S.queued ? t('pending_chip', { n: S.queued }) : t('offline_chip');
  return `<p class="chip">${esc(text)}</p>`;
}

function nav(current) {
  const items = [
    ['log', 'nav_log'],
    ['neighbours', 'nav_neighbours'],
    ['settings', 'nav_settings'],
  ];
  return `<nav class="nav">${items
    .map(([v, k]) =>
      v === current ? '' : `<button class="link" data-act="go" data-view="${v}">${T(k)}</button>`,
    )
    .join('')}</nav>`;
}

function backButton() {
  return `<button class="btn" data-act="go" data-view="home">${T('nav_back')}</button>`;
}

// English by default; every other language is one tap away on the first screen and in Settings.
function langRow() {
  return `<div class="langs" role="group" aria-label="Language">${LANGS.map(
    (l) =>
      `<button class="btn" lang="${l.code}" data-act="lang" data-lang="${l.code}" aria-pressed="${S.lang === l.code}">${esc(l.name)}</button>`,
  ).join('')}</div>`;
}

function viewArea() {
  const a = S.area || {};
  return `
    ${langRow()}
    <header class="top"><h1 tabindex="-1" class="title">${T('setup_area_title')}</h1></header>
    <p>${T('setup_area_why')}</p>
    <p class="muted">${T('setup_privacy')}</p>
    <form id="area-form" class="stack" novalidate>
      <label>${T('pincode')}
        <input name="pin" inputmode="numeric" autocomplete="postal-code" maxlength="6" pattern="[0-9]{6}" value="${esc(a.pin || '')}" required>
      </label>
      <label>${T('place')}
        <input name="place" autocomplete="off" maxlength="60" value="${esc(a.place || '')}" required>
      </label>
      <p class="muted">${T('place_hint')}</p>
      <p id="area-error" class="error" role="alert"></p>
      <button class="btn primary" type="submit">${T('continue')}</button>
      <button class="btn" type="button" data-act="solo">${T('solo')}</button>
    </form>`;
}

function viewJoin() {
  const i = S.invite;
  return `
    ${langRow()}
    <header class="top">${lantern(true)}<h1 tabindex="-1" class="title">${T('join_title')}</h1></header>
    <p class="big-text">${esc(i.place)} · ${esc(i.pin)}</p>
    <p class="muted">${T('setup_privacy')}</p>
    <div class="stack">
      <button class="btn primary" data-act="join">${T('join_yes')}</button>
      <button class="btn" data-act="go" data-view="area">${T('join_other')}</button>
    </div>`;
}

function viewAsk() {
  const c = openCut();
  return `
    <header class="top">${lantern(false)}<h1 tabindex="-1" class="title">${T('ask_title')}</h1></header>
    <p>${T('ask_body', { time: fmtWhen(c.start, S.lang) })}</p>
    <div class="stack">
      <button class="btn" data-act="back-now">${T('ask_now')}</button>
      <button class="btn" data-act="back-hour">${T('ask_hour')}</button>
      <button class="btn" data-act="back-unsure">${T('ask_unsure')}</button>
      <button class="btn" data-act="still-out">${T('ask_still')}</button>
    </div>`;
}

function lastCutLine() {
  const done = S.cuts.filter((c) => c.end != null || c.unknown).sort((a, b) => b.start - a.start)[0];
  if (!done) return t('on_none');
  const when = fmtWhen(done.start, S.lang);
  return L.hasKnownDuration(done) ? t('on_last', { when, dur: dur(done.end - done.start) }) : t('on_last_unknown', { when });
}

function viewOn() {
  return `
    ${chip()}
    <header class="top">${lantern(true)}
      <h1 tabindex="-1" class="status">${T('on_status')}</h1>
      ${S.lastBack ? `<p class="since">${T('back_done', { dur: dur(S.lastBack.dur) })}</p>` : ''}
      <p class="muted">${esc(lastCutLine())}</p>
    </header>
    ${S.notice ? `<p class="note">${esc(S.notice)}</p>` : ''}
    <div class="bigwrap">
      <button class="big" data-act="out" aria-label="${T('btn_out_aria')}">${iconOut()}</button>
      <p class="biglabel" aria-hidden="true">${T('btn_out')}</p>
    </div>
    ${!S.area ? `<div class="card"><p>${T('no_area')}</p><button class="btn" data-act="go" data-view="area">${T('add_area')}</button></div>` : ''}
    ${S.installPrompt ? `<button class="btn" data-act="install">${T('install')}</button>` : ''}
    ${nav('home')}`;
}

function viewOut() {
  const c = openCut();
  const canUndo = Date.now() - c.start < L.UNDO_MS;
  return `
    <div id="chip">${chip()}</div>
    <header class="top">${lantern(false)}
      <h1 tabindex="-1" class="status">${T('out_status')}</h1>
      <p class="since" id="since">${esc(sinceText(c))}</p>
      <p class="muted">${T('out_started', { time: time(c.start) })}</p>
    </header>
    ${canUndo ? `<button class="link" id="undo" data-act="undo">${T('undo')}</button>` : ''}
    <section id="verdict" class="card">${verdictHtml(c)}</section>
    <section id="estimate">${estimateHtml(c)}</section>
    <section id="report" class="card">${reportHtml(c)}</section>
    ${nav('home')}
    <div class="dock-space"></div>
    <div class="dock">
      <button class="back" data-act="back-now" aria-label="${T('btn_back_aria')}">${iconBack()}<span aria-hidden="true">${T('btn_back')}</span></button>
    </div>`;
}

function sinceText(c) {
  const ms = Date.now() - c.start;
  return ms < 60e3 ? t('just_now') : t('out_since', { dur: dur(ms) });
}

function mcbHtml() {
  return `
    <div class="mcb">
      <p>${T('mcb_1')}</p>
      <div class="warn"><span class="warn-mark" aria-hidden="true">⚠</span><p><strong>${T('mcb_warn')}</strong></p></div>
      <p>${T('mcb_rccb')}</p>
      <p>${T('mcb_last')}</p>
    </div>`;
}

// Status is only evidence about this cut if it was fetched after this cut began.
function verdictInput(c) {
  const st = S.status;
  if (!st || !S.area || st.area !== S.area.code || st.fetchedAt < c.start) return null;
  return {
    users: st.users + (st.meKnown ? 0 : 1),
    out: st.out + (st.meOut ? 0 : 1),
    meOut: true,
    backRecent: st.backRecent,
  };
}

function verdictHtml(c) {
  const mcbLink = `<button class="link" data-act="mcb" aria-expanded="${S.mcbOpen}">${T('verdict_mcb_link')}</button>${S.mcbOpen ? mcbHtml() : ''}`;
  if (!S.area) {
    return `<h2>${T('verdict_unknown')}</h2><p>${T('verdict_unknown_do')}</p>${mcbLink}
      <p>${T('no_area')}</p><button class="btn" data-act="go" data-view="area">${T('add_area')}</button>`;
  }
  const input = verdictInput(c);
  if (!input) {
    const waiting = net.configured && navigator.onLine && S.netOk;
    return `<h2>${T(waiting ? 'checking' : net.configured ? 'offline_status' : 'verdict_unknown')}</h2>
      <p>${T('verdict_unknown_do')}</p>${mcbLink}`;
  }
  const stale = Date.now() - S.status.fetchedAt > 3 * 60e3;
  const checked = stale ? `<p class="muted">${T('checked_at', { time: time(S.status.fetchedAt) })}</p>` : '';
  const v = L.neighbourVerdict(input);
  if (v.kind === 'unknown') {
    return `<h2>${T('verdict_unknown')}</h2><p>${T('verdict_unknown_do')}</p>
      <p class="muted">${T('verdict_need', { n: v.users })}</p>
      <button class="btn" data-act="go" data-view="neighbours">${T('nb_invite')}</button>
      ${mcbLink}${checked}`;
  }
  if (v.kind === 'area') {
    return `<h2>${T(v.most ? 'verdict_area_most' : 'verdict_area_some', { out: v.out, users: v.users })}</h2>
      <p>${T('verdict_area_do')}</p>${checked}`;
  }
  return `<h2>${T('verdict_only')}</h2>
    ${mcbHtml()}
    <p class="muted">${T('verdict_only_sub', { others: v.others })}</p>
    ${v.backRecent ? `<p>${T('verdict_back_others', { n: v.backRecent })}</p>` : ''}${checked}`;
}

// Past cuts: the area's when we have them, plus this phone's own. Clustering merges duplicates.
function historyRows() {
  const own = S.cuts.filter(L.hasKnownDuration);
  const area = S.status && S.area && S.status.area === S.area.code ? S.status.history : [];
  return [...area, ...own];
}

function estimateHtml(c) {
  const e = L.estimate(historyRows(), c.start);
  if (!e) return `<p class="muted">${T('est_none')}</p>`;
  const typical = dur(L.roundForEstimate(e.typical));
  const line = e.bucket ? t('est_bucket', { bucket: t(`b_${e.bucket}`), dur: typical }) : t('est_all', { dur: typical });
  const longer = Date.now() - c.start > e.typical ? `<p>${T('est_longer')}</p>` : '';
  return `<p class="estimate">${esc(line)}</p><p class="muted">${T('est_n', { n: e.n })}</p>${longer}`;
}

function reportHtml(c) {
  const call = `<a class="btn" href="tel:${esc(REGION.phone)}" aria-label="${T('report_call_aria')}">${iconPhone()}<span>${T('report_call')}</span></a>`;
  const mark = c.called ? '' : `<button class="btn" data-act="called">${T('report_called_btn')}</button>`;
  const line = `<p class="muted">${T('report_line')}</p>`;
  if (!neighbourLayer()) {
    return `<h2>${T('report_solo')}</h2>${line}<div class="row">${call}</div>`;
  }
  let said;
  if (c.called) said = t('report_me', { time: time(c.called) });
  else if (S.status && S.status.calledAt && S.status.fetchedAt >= c.start) said = t('report_done', { time: time(S.status.calledAt) });
  else said = t('report_none');
  return `<h2>${T('report_title')}</h2>${line}<p>${esc(said)}</p><div class="row">${call}${mark}</div>`;
}

function viewLog() {
  const p = L.pattern(S.cuts);
  const list = [...S.cuts].sort((a, b) => b.start - a.start);
  let summary = `<p>${T('log_empty')}</p>`;
  if (p) {
    summary = `<ul class="facts">
      <li>${T('log_count', { n: p.count })}</li>
      ${p.knownCount ? `<li>${T('log_total', { dur: dur(p.totalMs) })}</li>` : ''}
      ${p.longest ? `<li>${T('log_longest', { dur: dur(p.longest.duration), date: fmtDate(p.longest.start, S.lang) })}</li>` : ''}
      ${p.shortest && p.knownCount > 1 ? `<li>${T('log_shortest', { dur: dur(p.shortest.duration) })}</li>` : ''}
      ${p.commonPart ? `<li>${T('log_common_time', { part: t(`part_${p.commonPart}`) })}</li>` : ''}
      ${p.worstDay ? `<li>${T('log_worst_day', { day: dayName(p.worstDay.day, S.lang), n: p.worstDay.n })}</li>` : ''}
    </ul><p class="muted">${T('log_only_known')}</p>`;
  }
  let area = '';
  if (S.area && S.status && S.status.area === S.area.code) {
    const cuts = L.clusterCuts(S.status.history);
    const ds = cuts.map((c) => c.duration);
    area = `<section class="card"><h2>${T('log_area_title')} · ${esc(S.area.place)}</h2>
      <p>${
        cuts.length
          ? T('log_area_line', { n: cuts.length, min: dur(Math.min(...ds)), max: dur(Math.max(...ds)) })
          : T('log_area_none')
      }</p></section>`;
  }
  const rows = list
    .map((c) => {
      const len = c.end == null && !c.unknown ? t('log_open') : L.hasKnownDuration(c) ? dur(c.end - c.start) : t('log_unknown');
      return `<li><span>${esc(fmtDate(c.start, S.lang))} · ${esc(time(c.start))}</span><strong>${esc(len)}</strong></li>`;
    })
    .join('');
  return `
    <header class="top"><h1 tabindex="-1" class="title">${T('log_title')}</h1></header>
    ${summary}${area}
    ${rows ? `<ol class="log">${rows}</ol>` : ''}
    ${backButton()}`;
}

function inviteUrl() {
  const u = new URL(location.origin + location.pathname);
  u.searchParams.set('a', S.area.code);
  u.searchParams.set('n', S.area.place);
  return u.toString();
}

function viewNeighbours() {
  let body;
  if (!S.area) {
    body = `<p>${T('nb_solo')}</p><button class="btn primary" data-act="go" data-view="area">${T('add_area')}</button>`;
  } else {
    const st = S.status && S.status.area === S.area.code ? S.status : null;
    const count = st
      ? `<p class="big-text">${T('nb_count', { n: st.users + (st.meKnown ? 0 : 1), place: S.area.place })}</p>`
      : `<p>${T('nb_offline')}</p>`;
    body = `${count}<p>${T('nb_rule')}</p>
      <button class="btn primary" data-act="share">${T('nb_invite')}</button>
      <p class="muted">${T('nb_link')}</p>
      <p class="url" id="invite-url">${esc(inviteUrl())}</p>`;
  }
  return `
    <header class="top"><h1 tabindex="-1" class="title">${T('nb_title')}</h1></header>
    ${body}
    ${backButton()}`;
}

function viewSettings() {
  return `
    <header class="top"><h1 tabindex="-1" class="title">${T('set_title')}</h1></header>
    <section class="card">
      <h2>${T('set_lang')}</h2>
      <div class="stack">${LANGS.map(
        (l) =>
          `<button class="btn" lang="${l.code}" data-act="lang" data-lang="${l.code}" aria-pressed="${S.lang === l.code}">${esc(l.name)}</button>`,
      ).join('')}</div>
    </section>
    <section class="card">
      <p>${S.area ? T('set_area_now', { place: S.area.place, pin: S.area.pin }) : T('set_area_none')}</p>
      <button class="btn" data-act="go" data-view="area">${T(S.area ? 'set_area' : 'add_area')}</button>
    </section>
    ${S.installPrompt ? `<button class="btn" data-act="install">${T('install')}</button>` : ''}
    <section class="card">
      <h2>${T('privacy_title')}</h2>
      <p>${T('privacy_1')}</p><p>${T('privacy_2')}</p><p>${T('privacy_3')}</p><p>${T('privacy_4')}</p>
      <button class="btn" data-act="delete">${T('delete_btn')}</button>
    </section>
    <p class="muted">${T('about')}</p>
    <p><a class="link" href="${esc(SOURCE_URL)}" rel="noopener">${T('source')}</a></p>
    ${backButton()}`;
}

const VIEWS = {
  area: viewArea,
  join: viewJoin,
  ask: viewAsk,
  log: viewLog,
  neighbours: viewNeighbours,
  settings: viewSettings,
  home: () => (openCut() ? viewOut() : viewOn()),
};

function render({ focus = true } = {}) {
  document.documentElement.lang = S.lang;
  if (S.view === 'ask' && !openCut()) S.view = 'home';
  $app.innerHTML = VIEWS[S.view]();
  $app.dataset.view = S.view === 'home' ? (openCut() ? 'out' : 'on') : S.view;
  if (focus) {
    const h = $app.querySelector('h1');
    if (h) h.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}

// Background updates touch only their own parts, so focus and scroll stay put.
function refreshParts() {
  const c = openCut();
  if (S.view !== 'home' || !c) {
    if (S.view === 'neighbours' || S.view === 'log') render({ focus: false });
    return;
  }
  const set = (id, html) => {
    const el = document.getElementById(id);
    if (el && el.innerHTML !== html) el.innerHTML = html;
  };
  const since = document.getElementById('since');
  if (since) since.textContent = sinceText(c);
  set('chip', chip());
  set('estimate', estimateHtml(c));
  set('report', reportHtml(c));
  const before = document.getElementById('verdict')?.innerHTML;
  set('verdict', verdictHtml(c));
  const h2 = document.querySelector('#verdict h2');
  if (h2 && before !== document.getElementById('verdict').innerHTML) announce(h2.textContent);
  const undo = document.getElementById('undo');
  if (undo && Date.now() - c.start >= L.UNDO_MS) undo.remove();
}

// ---------- actions ----------

async function powerOut() {
  if (openCut()) return; // one open report per phone, so a stuck button can't spam
  const cut = { id: uid(), start: Date.now(), end: null, unknown: false, called: null };
  await db.saveCut(cut, queued({ op: 'out', cutId: cut.id, at: cut.start }));
  S.cuts.push(cut);
  S.lastBack = null;
  S.notice = null;
  S.mcbOpen = false;
  buzz();
  render();
  announce(`${t('out_status')}. ${t('out_started', { time: time(cut.start) })}`);
  sync();
}

// mode: 'now' | 'hour' | 'unknown'. "I'm not sure" never becomes a guessed time.
async function powerBack(mode) {
  const cut = openCut();
  if (!cut) return;
  const now = Date.now();
  const next = { ...cut };
  if (mode === 'unknown') next.unknown = true;
  else next.end = mode === 'hour' ? Math.max(cut.start, now - 3600e3) : now;
  await db.saveCut(next, queued({ op: 'back', cutId: cut.id, at: next.end ?? now, unknown: mode === 'unknown' }));
  Object.assign(cut, next);
  S.lastBack = mode === 'unknown' ? null : { dur: next.end - next.start };
  S.view = 'home';
  buzz();
  render();
  announce(S.lastBack ? t('back_done', { dur: dur(S.lastBack.dur) }) : t('on_status'));
  sync();
}

async function undo() {
  const cut = openCut();
  if (!cut || Date.now() - cut.start > L.UNDO_MS) return;
  // If the report hasn't left the phone, drop it; if it has (or is leaving now), cancel it.
  const pending = (await db.queueAll()).find((o) => o.cutId === cut.id && o.op === 'out');
  const unsent = pending && pending.seq !== sending;
  await db.removeCut(cut.id, unsent ? pending.seq : null, unsent ? null : queued({ op: 'cancel', cutId: cut.id, at: Date.now() }));
  S.cuts = S.cuts.filter((c) => c !== cut);
  render();
  toast(t('undone'));
  sync();
}

async function called() {
  const cut = openCut();
  if (!cut || cut.called) return;
  const next = { ...cut, called: Date.now() };
  await db.saveCut(next, queued({ op: 'called', cutId: cut.id, at: next.called }));
  Object.assign(cut, next);
  refreshParts();
  sync();
}

async function setLang(code) {
  S.lang = code;
  t = makeT(code);
  await db.kvSet('lang', code);
  render();
}

async function setArea(area) {
  S.area = area;
  S.solo = !area;
  S.status = null;
  S.lastCheckin = 0;
  S.invite = null;
  await db.kvSet('area', area);
  await db.kvSet('solo', S.solo);
  S.view = 'home';
  render();
  sync();
}

async function submitArea(form) {
  const pin = form.pin.value.replace(/\s/g, '');
  const place = form.place.value.trim().replace(/\s+/g, ' ');
  const err = document.getElementById('area-error');
  if (!L.validPin(pin)) {
    err.textContent = t('pin_invalid');
    form.pin.focus();
    return;
  }
  if (!place || L.areaCode(pin, place).length <= 7) {
    err.textContent = t('place_required');
    form.place.focus();
    return;
  }
  await setArea({ code: L.areaCode(pin, place), pin, place });
}

async function share() {
  const url = inviteUrl();
  const text = t('nb_invite_text', { place: S.area.place });
  try {
    if (navigator.share) {
      await navigator.share({ title: 'Lantern', text, url });
      return;
    }
    await navigator.clipboard.writeText(`${text} ${url}`);
    toast(t('nb_copied'));
  } catch {
    // Share sheet dismissed, or clipboard blocked: the link is on screen to copy by hand.
  }
}

async function deleteAll() {
  if (!confirm(t('delete_confirm'))) return;
  if (neighbourLayer()) {
    try {
      await net.forget(S.deviceId);
    } catch {
      toast(t('offline_status'));
      return;
    }
  }
  await db.clearAll();
  location.replace(location.pathname);
}

const ACTIONS = {
  out: powerOut,
  'back-now': () => powerBack('now'),
  'back-hour': () => powerBack('hour'),
  'back-unsure': () => powerBack('unknown'),
  'still-out': async () => {
    S.snoozeUntil = Date.now() + L.SNOOZE_MS;
    await db.kvSet('snoozeUntil', S.snoozeUntil);
    S.view = 'home';
    render();
  },
  undo,
  called,
  lang: (el) => setLang(el.dataset.lang),
  go: (el) => {
    S.view = el.dataset.view;
    render();
    if (S.view === 'neighbours' || S.view === 'log') sync();
  },
  solo: () => setArea(null),
  join: () => setArea({ code: S.invite.code, pin: S.invite.pin, place: S.invite.place }),
  mcb: () => {
    S.mcbOpen = !S.mcbOpen;
    refreshParts();
  },
  share,
  delete: deleteAll,
  install: async () => {
    const p = S.installPrompt;
    S.installPrompt = null;
    render({ focus: false });
    if (p) await p.prompt();
  },
};

$app.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el || el.disabled) return;
  const fn = ACTIONS[el.dataset.act];
  if (fn) fn(el);
});

$app.addEventListener('submit', (e) => {
  if (e.target.id !== 'area-form') return;
  e.preventDefault();
  submitArea(e.target);
});

// ---------- sync ----------

async function refreshStatus() {
  if (Date.now() - S.lastCheckin > 3600e3) {
    await net.checkin(S.deviceId, S.area.code);
    S.lastCheckin = Date.now();
  }
  S.status = await net.areaStatus(S.deviceId, S.area.code);
  await db.kvSet('status', S.status);
}

function sync() {
  if (syncing) return syncing;
  syncing = (async () => {
    try {
      if (neighbourLayer() && navigator.onLine) {
        await net.flush(S.deviceId, (seq) => (sending = seq));
        await refreshStatus();
        S.netOk = true;
      }
    } catch (err) {
      S.netOk = false;
      console.warn('Sync failed; will retry', err);
    } finally {
      sending = null;
      S.queued = (await db.queueAll()).length;
      syncing = null;
      refreshParts();
    }
  })();
  return syncing;
}

// ---------- closing old reports ----------

async function checkOpenReport() {
  const cut = openCut();
  const action = L.openReportAction(cut, Date.now(), S.snoozeUntil);
  if (action === 'auto-close') {
    const next = { ...cut, unknown: true, autoClosed: true };
    await db.saveCut(next, queued({ op: 'back', cutId: cut.id, at: Date.now(), unknown: true }));
    Object.assign(cut, next);
    S.notice = t('auto_closed');
    return true;
  }
  if (action === 'ask' && S.view === 'home') {
    S.view = 'ask';
    return true;
  }
  return false;
}

// ---------- start ----------

function readInvite() {
  const q = new URLSearchParams(location.search);
  const code = q.get('a');
  if (!code) return null;
  history.replaceState(null, '', location.pathname);
  const m = /^([1-9][0-9]{5})-([\p{L}\p{M}\p{N}-]{1,60})$/u.exec(code);
  if (!m) return null;
  const place = (q.get('n') || m[2].replace(/-/g, ' ')).trim().slice(0, 60);
  return { code, pin: m[1], place };
}

async function start() {
  try {
    const saved = await db.kvGet('lang');
    if (LANGS.some((l) => l.code === saved)) S.lang = saved;
    S.deviceId = await db.kvGet('deviceId');
    if (!S.deviceId) {
      S.deviceId = uid();
      await db.kvSet('deviceId', S.deviceId);
    }
    S.area = (await db.kvGet('area')) || null;
    S.solo = Boolean(await db.kvGet('solo'));
    S.snoozeUntil = (await db.kvGet('snoozeUntil')) || 0;
    S.status = (await db.kvGet('status')) || null;
    S.cuts = (await db.cutsAll()) || [];
    S.queued = (await db.queueAll()).length;
  } catch (err) {
    // No storage (some private modes): still usable for this visit.
    console.warn('Storage unavailable', err);
    S.deviceId = S.deviceId || uid();
  }
  t = makeT(S.lang);

  const invite = readInvite();
  if (invite && (!S.area || S.area.code !== invite.code)) S.invite = invite;

  if (S.invite) S.view = 'join';
  else if (!S.area && !S.solo) S.view = 'area';
  else S.view = 'home';

  await checkOpenReport();
  render();
  sync();

  setInterval(() => {
    if (document.hidden) return;
    refreshParts();
  }, 30e3);
  setInterval(() => {
    if (!document.hidden && openCut()) sync();
  }, 60e3);
  document.addEventListener('visibilitychange', async () => {
    if (document.hidden) return;
    if (await checkOpenReport()) render();
    else refreshParts();
    sync();
  });
  addEventListener('online', () => sync());
  addEventListener('offline', () => refreshParts());
}

addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  S.installPrompt = e;
  if (S.view === 'home' && !openCut()) render({ focus: false });
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch((err) => console.warn('No offline cache', err));
}

start();
