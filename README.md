# Lantern

**A power-cut log for one street.** Nobody needs an app to know the power is out. When the lights go, Lantern answers the three things people genuinely don't know:

1. **Is it just my flat, or the whole area?** Those need opposite actions: check your own MCB board, or don't bother and wait.
2. **How long do cuts here usually last?** Worked out from what past cuts on this street actually did.
3. **Has anyone told MSEDCL yet?** So five neighbours don't all call, and it's never the case that nobody does.

Built for Neighborhood Hacks (16–24 Oct 2026). Marathi first, then Hindi, then English.

> **AI disclosure:** the code in this repo was written with **Claude Code**, Anthropic's AI coding assistant, working from my brief. The design decisions, the neighbour interviews and the testing on real phones are mine.

---

## An app about power cuts has to work when the power is cut

During a cut the Wi-Fi router is dead, mobile data is weak, and the phone can't be recharged. So:

- **Fully offline.** A service worker caches the whole app on the first visit. After that it opens and works in aeroplane mode, and `scripts/qa-offline.mjs` checks this by killing the server and reloading.
- **Tiny.** It's plain JavaScript with no framework and no downloaded font: about 165 KB, and most of that is the app icons.
- **Local first.** Every tap goes to IndexedDB at once. Reports wait in a queue and are sent when there's a connection. Nothing ever waits on the network.
- **Dark.** It uses a pure black background, which is easier on the eyes in a dark room and on an OLED battery.
- **One tap.** One huge button, for someone in the dark, using one hand, irritated.

## How it decides "just you" or "the area": three states, never two

The obvious design has two answers, *everyone's out* and *just you*. That is dangerous. On day one I'm the only user, so a real area-wide blackout would confidently tell my first neighbour to go poke at their MCB board in the dark.

| Phones using Lantern in your area (seen in the last 14 days) | Lantern says |
|---|---|
| **Fewer than 3** (`MIN_NEIGHBOURS` in [`src/logic.js`](src/logic.js)) | "Not enough neighbours using Lantern yet to tell. Look out of a window." Plus an invite button. |
| **3 or more, others are out too** | "7 of 9 nearby are out — it's the area. Nothing to fix inside your home." |
| **3 or more, only you** | "You **may** be the only one out." Then the MCB steps, with the warning. |

The "may be only you" screen says **MCB**, not "fuse", and it warns: *if it trips again straight away, stop, don't keep resetting it.* It adds that a tripped **RCCB/ELCB** means an earth-leakage fault. "I don't know yet" is a feature, not a gap: a wrong answer stated confidently is worse than no answer.

## Closing reports, or the data rots by day two

Someone taps **Power just went**, and then the power returns while they're asleep. Their report would never close.

- If this phone has had a report open for **more than 3 hours**, the app asks on open: *"Is the power back? When?"* The answers are just now, about an hour ago, I'm not sure, or still out.
- **"I'm not sure"** marks the cut `unknown_duration`. It still counts towards "how many were out", but it is left out of every average.
- Anything left open for **12 hours** is closed as unknown, both on the phone and on the server.
- A restore time is never guessed silently.

**Averages only ever use reports with a real start and a real end.**

When many phones report the same cut, it counts as one cut. Reports that start within 15 minutes of each other are merged, so the cuts everyone noticed don't outweigh the ones only one flat saw.

## Clocks

All times come from the server's `now()`. A phone with a wrong clock would otherwise skew every average.

A report queued offline doesn't send a clock time, though. It sends *how many seconds ago* the tap happened, measured on the phone, and the server subtracts that from its own clock. Both ends of that measurement come from the same phone clock, so a wrong clock cancels out.

## Works with one user

The neighbour layer only lights up when others join; it isn't the foundation. With nobody else, Lantern still keeps:

- **My log:** every cut, with how long it lasted;
- **My pattern:** the longest and shortest cut, the usual time of day, and the worst day of the week.

## Privacy

There's no account, no name, no phone number and no GPS. Your area is a pincode plus a building or lane name that you type yourself.

The server stores:
- a random number for each phone;
- that area;
- the times you tap;
- the day you last opened the app (the day only, not the time).

Neighbours only ever see **counts**, never which home tapped. The app says plainly that this data does show when someone is home and awake, and **Settings → Delete all my data** removes every row for that phone from the phone and the server.

## Security, honestly

There are no accounts, so there is no real identity to check. A random device id generated on the phone works as a *bearer secret*.

- Both tables have Row Level Security **on with no policies**, and the public key has **no table privileges at all**, so nobody can read or list the tables directly, not even with the key that ships in the app.
- Everything goes through a few `SECURITY DEFINER` database functions in [`supabase/migrations/0001_lantern.sql`](supabase/migrations/0001_lantern.sql). They return counts and times, never device ids.
- A phone can only close, cancel or delete **its own** report.

**What this doesn't stop:** anyone can invent device ids and send fake reports for an area. For a street of neighbours that's an acceptable risk; at a bigger scale I'd use Supabase anonymous sign-ins (a real user id with no login screen) plus rate limits.

## Run it

```bash
node scripts/build.mjs        # src/ → dist/ (no dependencies)
node scripts/serve.mjs        # http://localhost:4210
```

Without Supabase settings it runs in solo mode. To turn the neighbour layer on:

1. Run [`supabase/migrations/0001_lantern.sql`](supabase/migrations/0001_lantern.sql) once in your Supabase project's SQL editor.
2. Set `LANTERN_SUPABASE_URL` and `LANTERN_SUPABASE_KEY` (the anon or publishable key; the build refuses a secret key). Put them in Vercel's environment variables, or in `.env.local` for a local build. They are never committed.

## Tests

```bash
npm install                   # dev only: PGlite, an in-process Postgres for the SQL tests
npm test                      # the rules (24 checks) and the database functions as `anon` (12 checks)
node scripts/qa-offline.mjs     # aeroplane mode in headless Chrome
node scripts/qa-neighbours.mjs  # all three states end to end, against the real SQL in PGlite
```

## Files

| | |
|---|---|
| `src/logic.js` | Every rule and threshold, as named constants. Pure functions. |
| `src/i18n.js` | Every word on screen in Marathi, Hindi and English, and the electricity board's name and number. |
| `src/app.js` | The screens. |
| `src/store.js` | IndexedDB. |
| `src/sync.js` | The send queue and the database calls. |
| `src/sw.js` | Offline cache. |
| `supabase/migrations/0001_lantern.sql` | Tables, locks and functions. |
| `supabase/stats.sql` | Numbers for the write-up: households, cuts, shortest, longest, single-flat cuts. |

The Marathi and Hindi are first drafts and need a native speaker to read them.

MIT licence.
